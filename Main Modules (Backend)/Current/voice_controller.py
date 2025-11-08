import os
import traceback
from typing import Optional, Dict, Any

from flask import Flask, jsonify
from flask_cors import CORS

from module_voice_input_simple import get_voice_input, get_default_device_index, prompt_for_device_choice
from module_speaker_id import ensure_known_speaker
from module_parse_command import parse_command, set_speak_function
from module_excel_handler import ExcelHandler, ask_for_excel_file


app = Flask(__name__)
CORS(app)


# Global state maintained for the session
excel_instance: Optional[ExcelHandler] = None
sheet_selected: bool = False
device_index: Optional[int] = None


def speak(text: str):
    print(text)


set_speak_function(speak)


def ensure_excel_loaded() -> ExcelHandler:
    global excel_instance, sheet_selected
    if excel_instance is None:
        file_path = ask_for_excel_file()
        if not file_path:
            raise RuntimeError("No Excel file selected")
        excel_instance = ExcelHandler(file_path)
        # Allow user to choose sheet if multiple
        excel_instance.ws = excel_instance.choose_sheet()
        sheet_selected = True
    elif not sheet_selected:
        excel_instance.ws = excel_instance.choose_sheet()
        sheet_selected = True
    return excel_instance


def ensure_microphone_device() -> Optional[int]:
    global device_index
    if device_index is not None:
        return device_index
    # Try interactive prompt; if cancelled, fallback to auto-select
    try:
        choice = prompt_for_device_choice()
        device_index_local = choice["device_index"] if choice else None
        if device_index_local is None:
            device_index_local = get_default_device_index()
        device_index = device_index_local
    except Exception:
        device_index = get_default_device_index()
    return device_index


@app.route("/api/voice/command", methods=["POST"])
def api_voice_command():
    """
    Run a single voice-command cycle:
    - Identify/enroll speaker
    - Capture and transcribe voice
    - Parse command
    - Execute Excel operation
    Returns structured JSON with each stage status.
    """
    result: Dict[str, Any] = {
        "status": "error",
        "steps": {
            "microphone": False,
            "speaker_identified": False,
            "listened": False,
            "parsed": False,
            "executed": False,
            "saved": False
        }
    }
    try:
        # Ensure Excel file and sheet
        excel = ensure_excel_loaded()

        # Ensure microphone device
        dev = ensure_microphone_device()
        result["steps"]["microphone"] = dev is not None

        # Identify or enroll speaker
        user_name, score = ensure_known_speaker(
            duration=3.0,
            threshold=0.65,
            auto_enroll=True,
            speak_fn=speak,
            device=dev
        )
        result["speaker"] = {"name": user_name, "score": score, "recognized": user_name != "Unknown"}
        result["steps"]["speaker_identified"] = user_name != "Unknown"
        if user_name == "Unknown":
            result["message"] = "Voice not recognized or enrollment declined."
            return jsonify(result), 200

        # Listen for command
        speak("I'm listening. Please say your command.")
        vi = get_voice_input(device=dev)
        transcript = vi["cleaned"] if vi else None
        result["transcript"] = transcript
        result["steps"]["listened"] = transcript is not None
        if not transcript:
            result["message"] = "No speech detected or transcription failed."
            return jsonify(result), 200

        # Parse + Execute
        parsed = parse_command(transcript, excel)
        result["parsed"] = parsed
        result["steps"]["parsed"] = parsed is not None

        # Save after execution
        try:
            excel.wb.save(excel.filename)
            result["steps"]["saved"] = True
        except Exception as e:
            result["save_error"] = str(e)

        result["status"] = "ok"
        result["steps"]["executed"] = True
        result["message"] = "Command processed successfully"
        return jsonify(result), 200

    except Exception as e:
        result["error"] = str(e)
        result["trace"] = traceback.format_exc()
        return jsonify(result), 500


def run(host: str = "127.0.0.1", port: int = 5001):
    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    run()


