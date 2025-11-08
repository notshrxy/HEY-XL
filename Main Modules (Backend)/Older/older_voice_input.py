# module_voice_input.py
import speech_recognition as sr
from typing import Optional, Dict, Callable
import time

_speak_fn: Callable[[str], None] = print


def list_input_devices() -> list:
    """Return list of input device names from SpeechRecognition."""
    try:
        return sr.Microphone.list_microphone_names() or []
    except Exception:
        return []


def prompt_for_device_choice() -> Optional[dict]:
    """Ask user which input device to use; Enter for auto-select."""
    devices = list_input_devices()
    if not devices:
        print("⚠️ No input devices found.")
        return None
    print("\n🎤 Available audio input devices:")
    for idx, name in enumerate(devices):
        print(f"   [{idx}] {name}")
    choice = input("Which input microphone would you like to use? Press Enter for auto-select: ").strip()
    if choice == "":
        return {"sr_index": None, "name": None}
    if choice.isdigit():
        i = int(choice)
        if 0 <= i < len(devices):
            return {"sr_index": i, "name": devices[i]}
    print("⚠️ Invalid choice. Falling back to auto-select.")
    return {"sr_index": None, "name": None}


def get_default_device_index() -> Optional[int]:
    """Find the most suitable microphone index automatically."""
    devices = list_input_devices()
    if not devices:
        print("⚠️ No input devices found. Check microphone connection.")
        return None
    
    # Try to find a good microphone
    for idx, name in enumerate(devices):
        lower_name = name.lower()
        if ("microphone" in lower_name and 
            "array" not in lower_name and
            "output" not in lower_name):
            print(f"✅ Auto-selected device: {name} (index {idx})")
            return idx
    
    # Fallback to first device
    print(f"ℹ️ Using default device: {devices[0]} (index 0)")
    return 0


def set_speak_function(fn: Callable[[str], None]):
    """Register external speak() from main.py."""
    global _speak_fn
    _speak_fn = fn


def speak(text: str):
    """Wrapper to send text to TTS or print."""
    _speak_fn(text)


def get_voice_input(device: Optional[int] = None) -> Optional[Dict[str, Optional[str]]]:
    """
    Simple, basic voice input function that should actually work.
    """
    try:
        # Create recognizer with basic settings
        recognizer = sr.Recognizer()
        
        # Get device
        device_index = device if device is not None else get_default_device_index()
        if device_index is None:
            print("❌ No microphone device available")
            return {"raw": None, "cleaned": None}
        
        # Use microphone
        with sr.Microphone(device_index=device_index) as source:
            print("Recording, Speak now:")
            
            # Listen for audio with basic settings
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=5)
            
            print("Processing...")
            
            # Try to recognize
            try:
                text = recognizer.recognize_google(audio, language='en-US')
                print(f"You said: {text}")
                return {"raw": text, "cleaned": text.lower().strip()}
            except sr.UnknownValueError:
                print("Could not understand audio")
                return {"raw": None, "cleaned": None}
            except sr.RequestError as e:
                print(f"Could not request results: {e}")
                return {"raw": None, "cleaned": None}
                
    except sr.WaitTimeoutError:
        print("Timeout - no speech detected")
        return {"raw": None, "cleaned": None}
    except Exception as e:
        print(f"Error: {e}")
        return {"raw": None, "cleaned": None}


if __name__ == "__main__":
    print(f"Default microphone device index: {get_default_device_index()}")