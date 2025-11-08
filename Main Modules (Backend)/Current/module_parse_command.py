import re
# import spacy  # disabled per request: using regex-only parsing since spacy is throwing garbage STT
from fuzzywuzzy import fuzz
from typing import Optional, Dict
import module_excel_handler as excel_handler

# # Load spaCy once (disabled)
# nlp = spacy.load("en_core_web_sm")

# Default speak function (fallback to print if not injected from main)
_speak_fn = print

def set_speak_function(fn):
    """Register external speak() from main.py."""
    global _speak_fn
    _speak_fn = fn

def speak(text: str):
    """Wrapper for parser feedback (voice + text)."""
    _speak_fn(text)


def parse_with_regex(command: str) -> dict:
    """Regex parsing (structured)."""
    cmd = command.lower().strip()
    result = {}

    actions = r"(add|subtract|remove|delete|update|insert|create|rename|set)"
    action_match = re.search(rf"\b{actions}\b", cmd)
    if action_match:
        result["action"] = action_match.group(1)

    value_match = re.search(r"\b(\d+)\b", cmd)
    if value_match:
        result["value"] = int(value_match.group(1))

    # Try multiple patterns for name extraction
    name_match = re.search(r"\bfor\s+(\w+)\b", cmd)
    if not name_match:
        # Look for capitalized words that could be names
        name_match = re.search(r"\b([A-Z][a-z]+)\b", command)
    if not name_match:
        # Look for any word that could be a name (more flexible)
        name_match = re.search(r"\b([a-zA-Z]+)\s+(?:science|math|english|history|physics|chemistry|biology|social|art|music|pe|physical|education|maths)\b", cmd)
    if not name_match:
        # Look for name before subject in direct format: "action name subject value"
        name_match = re.search(r"\b(?:add|update|remove|delete|subtract|insert|create|set)\s+([a-zA-Z]+)\s+(?:science|math|english|history|physics|chemistry|biology|social|art|music|pe|physical|education|maths)\b", cmd)
    if name_match:
        result["name"] = name_match.group(1)

    # Try multiple patterns for subject extraction
    subject_match = re.search(r"\bin\s+(\w+)\b", cmd)
    if not subject_match:
        # Look for common subject words directly
        subject_match = re.search(r"\b(science|math|maths|english|history|physics|chemistry|biology|social|art|music|pe|physical|education)\b", cmd)
    if not subject_match:
        # Look for subject in direct format: "action name subject value"
        subject_match = re.search(r"\b(?:add|update|remove|delete|subtract|insert|create|set)\s+[a-zA-Z]+\s+(science|math|maths|english|history|physics|chemistry|biology|social|art|music|pe|physical|education)\b", cmd)
    if subject_match:
        result["subject"] = subject_match.group(1)

    workbook_match = re.search(r"\bworkbook\s+([A-Za-z0-9_]+)\b", cmd)
    worksheet_match = re.search(r"\bworksheet\s+([A-Za-z0-9_]+)\b", cmd)

    if workbook_match:
        result["workbook"] = workbook_match.group(1)
    if worksheet_match:
        result["worksheet"] = worksheet_match.group(1)

    if "action" in result and result["action"] == "create":
        row_match = re.search(r"\brow\s+(\d+)\b", cmd)
        col_match = re.search(r"\bcolumn\s+([A-Za-z0-9_]+)\b", cmd)
        if row_match:
            result["row"] = int(row_match.group(1))
        if col_match:
            result["column"] = col_match.group(1).capitalize()

    return result if result else None


def parse_with_spacy(command: str) -> dict:
    """spaCy parsing disabled; keeping function for reference."""
    # doc = nlp(command)
    # result = {}
    # for token in doc:
    #     if token.like_num:
    #         result["value"] = int(token.text)
    #     if token.lemma_.lower() in ["add", "update", "remove", "delete", "create", "rename", "insert", "set"]:
    #         result["action"] = token.lemma_.lower()
    # for ent in doc.ents:
    #     if ent.label_ == "PERSON":
    #         result["name"] = ent.text
    #     elif ent.label_ in ["ORG", "WORK_OF_ART", "PRODUCT"]:
    #         result["subject"] = ent.text
    # return result if result else None
    return None


def merge_results(regex_res: dict, spacy_res: dict) -> dict:
    """Hybrid merge: prefer regex for structure, spaCy for natural text, fuzzy resolve conflicts."""
    if not regex_res and not spacy_res:
        return None
    if regex_res and not spacy_res:
        return regex_res
    if spacy_res and not regex_res:
        return spacy_res

    merged = {}

    # Action: prefer regex
    if "action" in regex_res:
        merged["action"] = regex_res["action"]
    elif "action" in spacy_res:
        merged["action"] = spacy_res["action"]

    # Value: prefer regex
    if "value" in regex_res:
        merged["value"] = regex_res["value"]
    elif "value" in spacy_res:
        merged["value"] = spacy_res["value"]

    # Name: prefer spaCy (better entity recognition)
    if "name" in spacy_res:
        merged["name"] = spacy_res["name"].capitalize()
    elif "name" in regex_res:
        merged["name"] = regex_res["name"].capitalize()

    # Subject: resolve with fuzzy match if different
    sub_regex = regex_res.get("subject")
    sub_spacy = spacy_res.get("subject")
    if sub_regex and sub_spacy:
        if fuzz.ratio(sub_regex.lower(), sub_spacy.lower()) > 80:
            merged["subject"] = sub_spacy.upper()
        else:
            merged["subject"] = sub_spacy.upper()  # fallback to spaCy
    elif sub_spacy:
        merged["subject"] = sub_spacy.upper()
    elif sub_regex:
        merged["subject"] = sub_regex.upper()

    # Extra: Workbook/Worksheet (regex only)
    for key in ["workbook", "worksheet", "row", "column"]:
        if key in regex_res:
            merged[key] = regex_res[key]

    return merged

def parse_command(command: str, excel_instance = None):
    """Main hybrid parser: runs Regex + spaCy in parallel, merges results, and executes Excel ops."""
    print(f"🔍 Parsing command: '{command}'")
    
    regex_res = parse_with_regex(command)
    # spacy_res = parse_with_spacy(command)  # disabled
    spacy_res = None
    
    print(f"📝 Regex result: {regex_res}")
    # print(f"🧠 SpaCy result: {spacy_res}")

    # merged = merge_results(regex_res, spacy_res)  # use regex-only
    merged = regex_res
    print(f"🔄 Merged result: {merged}")

    if not merged:
        speak("❌ I couldn't parse your request. Try rephrasing or give it in a shorter format.")
        return None

    # 🚀 Action dispatcher
    action = merged.get("action")
    name = merged.get("name")
    subject = merged.get("subject")
    value = merged.get("value")
    
    print(f"🎯 Extracted - Action: {action}, Name: {name}, Subject: {subject}, Value: {value}")

    if not excel_instance:  # If no worksheet passed, just return parsed intent
        return merged

    if action == "add":
        try:
            # First validate subject exists
            if not subject:
                speak("❌ No subject specified. Please specify a subject like 'Math', 'Science', etc.")
                return merged
                
            subject_valid, subject_msg = excel_instance.validate_subject(subject)
            if not subject_valid:
                speak(f"❌ {subject_msg}")
                return merged
            
            # Try to add student if they don't exist
            excel_instance.add_student_if_not_exists(name)
            
            # Use cell-specific update
            result = excel_instance.update_cell_value(name, subject, value)
            speak(result)
        except Exception as e:
            print(f"❌ Error in add operation: {e}")
            speak(f"Error adding {value} for {name} in {subject}: {str(e)}")

    elif action in ["update", "change"]:
        # First validate subject exists
        subject_valid, subject_msg = excel_instance.validate_subject(subject)
        if not subject_valid:
            speak(f"❌ {subject_msg}")
            return merged
        
        # Use cell-specific update
        result = excel_instance.update_cell_value(name, subject, value)
        speak(result)

    elif action in ["delete", "remove"]:
        # First validate subject exists
        subject_valid, subject_msg = excel_instance.validate_subject(subject)
        if not subject_valid:
            speak(f"❌ {subject_msg}")
            return merged
        
        # Use cell-specific update to clear the value
        result = excel_instance.update_cell_value(name, subject, "")
        speak(f"🗑️ Cleared {name}'s {subject} value")

    elif action in ["get", "collect"]:
        if subject:
            # First validate subject exists
            subject_valid, subject_msg = excel_instance.validate_subject(subject)
            if not subject_valid:
                speak(f"❌ {subject_msg}")
                return merged
            
            # Get specific cell value
            student_row = excel_instance.find_student_row(name)
            if not student_row:
                speak(f"❌ Student '{name}' not found")
                return merged
            
            subject_col = excel_instance.find_subject_column(subject)
            if not subject_col:
                speak(f"❌ Subject '{subject}' not found")
                return merged
            
            cell_value = excel_instance.ws[f"{subject_col}{student_row}"].value
            speak(f"📊 {name}'s {subject}: {cell_value if cell_value else 'No value'}")
        else:
            speak(excel_instance.get_all_scores(name))

    elif action == "subtract":
        # First validate subject exists
        if not subject:
            speak("❌ No subject specified. Please specify a subject like 'Math', 'Science', etc.")
            return merged
            
        subject_valid, subject_msg = excel_instance.validate_subject(subject)
        if not subject_valid:
            speak(f"❌ {subject_msg}")
            return merged
        
        # Get current value and subtract
        student_row = excel_instance.find_student_row(name)
        if not student_row:
            speak(f"❌ Student '{name}' not found")
            return merged
        
        subject_col = excel_instance.find_subject_column(subject)
        if not subject_col:
            speak(f"❌ Subject '{subject}' not found")
            return merged
        
        current_value = excel_instance.ws[f"{subject_col}{student_row}"].value
        if current_value is None:
            current_value = 0
        else:
            try:
                current_value = float(current_value)
            except:
                current_value = 0
        
        new_value = current_value - value
        result = excel_instance.update_cell_value(name, subject, new_value)
        speak(f"➖ Subtracted {value} from {name}'s {subject}. New value: {new_value}")

    elif action in ["insert", "create"]:
        # First validate subject exists
        if not subject:
            speak("❌ No subject specified. Please specify a subject like 'Math', 'Science', etc.")
            return merged
            
        subject_valid, subject_msg = excel_instance.validate_subject(subject)
        if not subject_valid:
            speak(f"❌ {subject_msg}")
            return merged
        
        # Try to add student if they don't exist
        excel_instance.add_student_if_not_exists(name)
        
        # Use cell-specific update
        result = excel_instance.update_cell_value(name, subject, value)
        speak(f"➕ Inserted {value} for {name} in {subject}")

    elif action == "rename":
        if not name:
            speak("❌ No student name specified for renaming.")
            return merged
        
        # This would require additional functionality in ExcelHandler
        speak("⚠️ Rename functionality not yet implemented. Please use Excel directly.")

    elif action == "set":
        # First validate subject exists
        if not subject:
            speak("❌ No subject specified. Please specify a subject like 'Math', 'Science', etc.")
            return merged
            
        subject_valid, subject_msg = excel_instance.validate_subject(subject)
        if not subject_valid:
            speak(f"❌ {subject_msg}")
            return merged
        
        # Try to add student if they don't exist
        excel_instance.add_student_if_not_exists(name)
        
        # Use cell-specific update
        result = excel_instance.update_cell_value(name, subject, value)
        speak(f"🔧 Set {name}'s {subject} to {value}")

    else:
        speak("⚠️ Action recognized but not yet supported.")

    return merged