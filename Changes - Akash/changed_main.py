import warnings #To skip certain "version might go out of date" warnings
# Suppress pkg_resources deprecation warnings
warnings.filterwarnings("ignore")


#Integration of 'TAMIL' Language support made by AKASH-GHB


from openpyxl import Workbook
import pyttsx3  # For Voice feedbacks (reverted from GTTS)
import subprocess
import webbrowser
import requests
import time
import os
import sys
import atexit
import signal
import psutil

'''Importing modules for handling excel files'''
from module_excel_handler import ExcelHandler, ask_for_excel_file, create_new_excel_file

'''Importing modules for handling, parsing, NLP Transcripting User-Commands'''
# Use simple voice input to avoid Whisper download issues
from module_voice_input_simple import get_voice_input, prompt_for_device_choice, get_default_device_index
from module_speaker_id import ensure_known_speaker
from module_parse_command import parse_command  # Command Parsing module    
from module_parse_command import set_speak_function

# Whisper disabled to avoid download issues
WHISPER_AVAILABLE = False
get_voice_input_whisper = None

# -------------------------
# Initialize TTS engine with slower, more natural voice
# Initialize TTS engine with slower, more natural voice
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Slower speech

# Attempt to select a more natural female voice
voices = engine.getProperty('voices')
selected = False
for v in voices:
    if 'female' in v.name.lower():
        engine.setProperty('voice', v.id)
        selected = True
        break

# If no female voice found, just pick the first available voice
if not selected and len(voices) > 0:
    engine.setProperty('voice', voices[0].id)

'''Speak function'''
def speak(text: str):
    engine.say(text)
    engine.runAndWait()

set_speak_function(speak)

# Global variable to track server process
server_process = None

# Ask yes/no prompt with full text displayed
def ask_yes_no(prompt_text: str) -> bool:
    print(prompt_text + " (y/n): ", end="")
    yn = input().strip().lower()
    return yn == "y"

# -------------------------
# Server cleanup functions
# -------------------------
def cleanup_server():
    """Clean up the server process when main.py exits."""
    global server_process
    if server_process and server_process.poll() is None:
        print("🛑 Shutting down Live Preview Server...")
        try:
            # Try graceful shutdown first
            server_process.terminate()
            server_process.wait(timeout=5)
        except:
            # Force kill if graceful shutdown fails
            try:
                server_process.kill()
            except:
                pass
        print("✅ Live Preview Server stopped")

def signal_handler(signum, frame):
    """Handle shutdown signals."""
    print("\n🛑 Shutting down application...")
    cleanup_server()
    sys.exit(0)

# Register cleanup functions
atexit.register(cleanup_server)
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# -------------------------

'''Function that calls ask_for_excel_file and ExcelHandler functions from module_excel_handler'''
def main():
    #For speaker recognition, if unrecognized, enroll speaker after recording voice.
    # Prompt user for preferred microphone first; fallback to auto-select
    choice = prompt_for_device_choice()  # {"device_index": int|None, "name": str|None}
    device_index = choice["device_index"] if choice else None
    device_name_hint = choice["name"] if choice else None
    if device_index is None:
        device_index = get_default_device_index()

    user_name, score = ensure_known_speaker(
        duration=3.0,
        threshold=0.65,
        auto_enroll=True,  # enrolls new users if unknown
        confirm_fn=ask_yes_no,
        speak_fn=speak,
        device=device_index,
        device_name_hint=device_name_hint
    )
    
    if user_name != "Unknown":
        speak(f"Hello {user_name}, welcome back!")
    else:
        speak("We couldn't enroll or recognize a voice. The app cannot proceed without voice identification.")
        speak("Shutting down…")
        return
    
    print()  # Empty line for spacing
    print("Please select the Excel file you want to work with…")
    speak("Please select the Excel file you want to work with.")
    excel = None
    file_path = ask_for_excel_file()

    if not file_path:  # user cancelled selection
        if ask_yes_no("No file selected. Do you want to create a new Excel file?"):
            new_path = create_new_excel_file()
            if new_path:
                excel = ExcelHandler(new_path)   # ✅ load the new file
            else:
                speak("No file was created. Exiting.")
                return
        else:
            speak("We need at least one Excel file. Exiting program.")
            return
    else:
        excel = ExcelHandler(file_path)  # ✅ existing file

    print()  # Empty line for spacing
    # Optionally start preview server and open live preview
    session_id = ensure_preview_session(file_path)

    # Step 3: If multiple sheets exist, ask user which one
    excel.ws = excel.choose_sheet()

    print()  # Empty line for spacing
    # Step 4: Enter command loop
    while True:
        command_text = None
        max_attempts = 3
        
        # Simple voice input attempts
        for attempt in range(max_attempts):
            print(f"🎙️ Listening for your command... (Attempt {attempt + 1}/{max_attempts})")
            speak(f"Listening for your command... Attempt {attempt + 1}")
            
            # Use simple voice input (no Whisper download required)
            voice_data = get_voice_input(device=device_index)
            command_text = voice_data["cleaned"] if voice_data else None
            
            # If simple input fails, try Whisper as fallback (only if available)
            if not command_text and WHISPER_AVAILABLE:
                print("🔄 Trying Whisper fallback...")
                voice_data = get_voice_input_whisper(device=device_index)
                command_text = voice_data["cleaned"] if voice_data else None
            
            if command_text:
                # Simple confirmation
                confirm = input(f"Execute command '{command_text}'? (y/n): ").lower().strip()
                if confirm in ['y', 'yes']:
                    print()  # Empty line for spacing
                    break  # Command confirmed, proceed
                else:
                    speak("Please repeat your command.")
                    command_text = None  # Reset for next attempt
                    continue
            else:
                if attempt < max_attempts - 1:
                    speak("I couldn't understand. Please try again.")
                    time.sleep(1)  # Brief pause between attempts
        
        # If all voice attempts failed, fallback to text input
        if not command_text:
            speak("Voice recognition failed. Please type your command.")
            command_text = input("Type a command (or 'exit' to quit): ").lower().strip()

        if command_text == "exit":
            speak("Exiting program. Goodbye!")
            cleanup_server()  # Clean up server before exiting
            break

        # Execute the confirmed command
        if command_text:
            try:
                parse_command(command_text, excel)
            except Exception as e:
                print(f"❌ Error executing command: {e}")
                speak("There was an error processing your command. Please try again.")
    
        # Save changes after each command, with safety
        try:
            excel.wb.save(excel.filename)
            print("✅ Excel file saved successfully")
            print()  # Empty line for spacing
        except PermissionError:
            speak("⚠️ Excel file is locked by another program. Please close Excel and press Enter.")
            input("Press Enter after closing Excel...")
            try:
                excel.wb.save(excel.filename)
                print("✅ Excel file saved successfully after retry")
            except Exception as e:
                print(f"❌ Failed to save after retry: {e}")
                speak("Could not save the file. Please check if the file is still open.")
        except Exception as e:
            print(f"❌ Unexpected error saving file: {e}")
            speak("There was an error saving the file. Please try again.")

        # Push updated file to live preview session
        if session_id:
            try:
                upload_to_preview_session(session_id, excel.filename)
            except Exception as e:
                print(f"⚠️ Preview refresh failed: {e}")

        # Ask if user wants to run another command
        print()  # Empty line for spacing
        speak("Would you like to run another command?")
        print("Would you like to run another command?")
        
        # Get voice response for continuation
        continue_command = False
        max_confirmation_attempts = 3
        
        for attempt in range(max_confirmation_attempts):
            print(f"🎙️ Listening for your response... (Attempt {attempt + 1}/{max_confirmation_attempts})")
            speak(f"Please say yes or no. Attempt {attempt + 1}")
            
            # Use simple voice input for yes/no response (no Whisper download required)
            voice_data = get_voice_input(device=device_index)
            response_text = voice_data["cleaned"] if voice_data else None
            
            # If simple input fails, try Whisper as fallback (only if available)
            if not response_text and WHISPER_AVAILABLE:
                print("🔄 Trying Whisper fallback...")
                voice_data = get_voice_input_whisper(device=device_index)
                response_text = voice_data["cleaned"] if voice_data else None
            
            if response_text:
                # Check for positive responses
                if any(word in response_text for word in ["yes", "yeah", "yep", "sure", "ok", "okay", "continue", "more", "another"]):
                    print("✅ Continuing with another command...")
                    speak("Great! Let's continue.")
                    continue_command = True
                    break
                # Check for negative responses
                elif any(word in response_text for word in ["no", "nope", "stop", "exit", "quit", "done", "finish", "end"]):
                    print()  # Empty line for spacing
                    print("✅ Ending session...")
                    speak("Thank you for using the Excel automation system. Goodbye!")
                    cleanup_server()  # Clean up server before exiting
                    return  # Exit the main function
                # Check if user said a command instead of yes/no
                elif any(word in response_text for word in ["add", "update", "remove", "delete", "subtract", "insert", "create", "set", "get", "collect"]):
                    print("✅ I heard a command! Processing it now...")
                    speak("I heard a command! Let me process that for you.")
                    # Process the command directly
                    try:
                        parse_command(response_text, excel)
                    except Exception as e:
                        print(f"❌ Error executing command: {e}")
                        speak("There was an error processing your command. Please try again.")
                    
                    # Save changes after command
                    try:
                        excel.wb.save(excel.filename)
                        print("✅ Excel file saved successfully")
                        print()  # Empty line for spacing
                    except PermissionError:
                        speak("⚠️ Excel file is locked by another program. Please close Excel and press Enter.")
                        input("Press Enter after closing Excel...")
                        try:
                            excel.wb.save(excel.filename)
                            print("✅ Excel file saved successfully after retry")
                        except Exception as e:
                            print(f"❌ Failed to save after retry: {e}")
                            speak("Could not save the file. Please check if the file is still open.")
                    except Exception as e:
                        print(f"❌ Unexpected error saving file: {e}")
                        speak("There was an error saving the file. Please try again.")
                    
                    # Push updated file to live preview session
                    if session_id:
                        try:
                            upload_to_preview_session(session_id, excel.filename)
                        except Exception as e:
                            print(f"⚠️ Preview refresh failed: {e}")
                    
                    # Ask again for continuation
                    continue
                else:
                    if attempt < max_confirmation_attempts - 1:
                        speak("I didn't understand. Please say yes, no, or give me a command.")
                        time.sleep(1)
            else:
                if attempt < max_confirmation_attempts - 1:
                    speak("I couldn't hear your response. Please try again.")
                    time.sleep(1)
        
        # If all voice attempts failed, fallback to text input
        if not continue_command:
            text_response = input("Voice recognition failed. Would you like to run another command? (y/n): ").lower().strip()
            if text_response in ['y', 'yes']:
                continue_command = True
            else:
                print()  # Empty line for spacing
                speak("Thank you for using the Excel automation system. Goodbye!")
                cleanup_server()  # Clean up server before exiting
                return  # Exit the main function
        
        # If user doesn't want to continue, break the loop
        if not continue_command:
            break


# -------------------------
# Live preview helpers
# -------------------------
def ensure_preview_server(port: int = 8000):
    global server_process
    
    # First check if server is already running
    try:
        response = requests.get(f"http://127.0.0.1:{port}/api/session/status", timeout=2)
        if response.status_code == 200:
            print("✅ Live preview server already running")
            return True
    except Exception:
        pass
    
    # Try to start the server
    try:
        cwd = os.path.dirname(os.path.abspath(__file__))
        server_path = os.path.join(cwd, "backend", "server.py")
        if not os.path.exists(server_path):
            print("❌ Backend server.py not found at:", server_path)
            return False
            
        print("🚀 Starting live preview server...")
        # Find the correct Python executable (from the same environment)
        python_exe = sys.executable  # Use the same Python that's running main.py
        
        # Start server in background with proper error handling
        server_process = subprocess.Popen(
            [python_exe, server_path], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            cwd=cwd,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )
        
        # Wait for server to start with longer timeout
        for i in range(30):  # 9 seconds total
            try:
                time.sleep(0.3)
                response = requests.get(f"http://127.0.0.1:{port}/api/session/status", timeout=2)
                if response.status_code == 200:
                    print("✅ Live preview server started successfully")
                    return True
            except Exception:
                continue
                
        # Check if process is still running
        if server_process.poll() is None:
            print("✅ Live preview server process started (may need more time)")
            return True
        else:
            stdout, stderr = server_process.communicate()
            print(f"❌ Server process failed. Error: {stderr.decode() if stderr else 'Unknown'}")
            server_process = None
            return False
        
    except Exception as e:
        print(f"❌ Error starting preview server: {e}")
        server_process = None
        return False


def ensure_preview_session(file_path: str) -> str:
    ok = ensure_preview_server()
    if not ok:
        print("⚠️ Live preview server unavailable. Continuing without preview.")
        return ""
    try:
        r = requests.post("http://127.0.0.1:8000/api/session/start", timeout=5)
        r.raise_for_status()
        session_id = r.json().get("sessionId", "")
        if session_id:
            upload_to_preview_session(session_id, file_path)
            webbrowser.open(f"http://127.0.0.1:8000/api/session/preview?sessionId={session_id}")
        return session_id
    except Exception as e:
        print(f"⚠️ Could not start preview session: {e}")
        return ""


def upload_to_preview_session(session_id: str, file_path: str):
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f.read(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    r = requests.post(f"http://127.0.0.1:8000/api/session/upload", params={"sessionId": session_id}, files=files, timeout=10)
    r.raise_for_status()

if __name__ == "__main__":
    main()
# -------------------------

