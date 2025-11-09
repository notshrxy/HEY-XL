# module_voice_input_simple.py
# Alternative voice input module using only SpeechRecognition (no Whisper)

#INPUT MODULE WITHOUT WHISPER AND SPACY INSTALLATION/USAGE
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


def get_critical_devices(devices: list) -> list:
    """Filter and prioritize the most critical input devices (limit to 5)."""
    critical_devices = []
    
    # Priority keywords for better devices
    priority_keywords = [
        "external", "headset", "usb", "bluetooth", "wireless", 
        "webcam", "camera", "logitech", "blue", "jabra"
    ]
    
    # First pass: Find devices with priority keywords
    for device in devices:
        device_lower = device.lower()
        for keyword in priority_keywords:
            if keyword in device_lower and "output" not in device_lower:
                critical_devices.append(device)
                break
        if len(critical_devices) >= 5:
            break
    
    # Second pass: Add remaining microphone devices if we don't have 5 yet
    for device in devices:
        if len(critical_devices) >= 5:
            break
        device_lower = device.lower()
        if ("microphone" in device_lower and 
            "array" not in device_lower and
            "output" not in device_lower and
            device not in critical_devices):
            critical_devices.append(device)
    
    # Third pass: Add any remaining input devices if we still don't have 5
    for device in devices:
        if len(critical_devices) >= 5:
            break
        device_lower = device.lower()
        if ("input" in device_lower and 
            "output" not in device_lower and
            device not in critical_devices):
            critical_devices.append(device)
    
    # If still less than 5, add the first few remaining devices
    for device in devices:
        if len(critical_devices) >= 5:
            break
        if device not in critical_devices:
            critical_devices.append(device)
    
    return critical_devices[:5]  # Ensure we only return max 5 devices


def prompt_for_device_choice() -> Optional[dict]:
    """Ask user which input device to use; Enter for auto-select."""
    devices = list_input_devices()
    if not devices:
        print("⚠️ No input devices found.")
        return None
    
    # Get the 5 most critical devices
    critical_devices = get_critical_devices(devices)
    
    print("\n🎤 Available audio input devices (showing top 5):")
    for idx, name in enumerate(critical_devices):
        print(f"   [{idx}] {name}")
    
    print(f"\nTotal devices found: {len(devices)}")
    print("Press Enter for auto-select, or choose a number above.")
    
    choice = input("Which input microphone would you like to use? ").strip()
    
    if choice == "":
        print("✅ Auto-selecting best available device...")
        print()  # Empty line for spacing
        return {"device_index": None, "name": None}
    
    if choice.isdigit():
        i = int(choice)
        if 0 <= i < len(critical_devices):
            selected_device = critical_devices[i]
            # Find the original index in the full device list
            original_index = devices.index(selected_device)
            print(f"✅ Selected: {selected_device}")
            return {"device_index": original_index, "name": selected_device}
    
    print("⚠️ Invalid choice. Falling back to auto-select.")
    return {"device_index": None, "name": None}


def get_default_device_index() -> Optional[int]:
    """Find the most suitable microphone index automatically."""
    devices = list_input_devices()
    if not devices:
        print("⚠️ No input devices found. Check microphone connection.")
        return None
    
    # Get critical devices and use the first one as default
    critical_devices = get_critical_devices(devices)
    if critical_devices:
        # Find the original index of the first critical device
        original_index = devices.index(critical_devices[0])
        print(f"✅ Auto-selected device: {critical_devices[0]} (index {original_index})")
        return original_index
    
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
    Simple voice input function using SpeechRecognition (no Whisper).
    """
    try:
        # Create recognizer with improved settings for longer speech
        recognizer = sr.Recognizer()
        recognizer.energy_threshold = 300  # Lower threshold for better sensitivity
        recognizer.dynamic_energy_threshold = True  # Adjust automatically
        
        # Get device
        device_index = device if device is not None else get_default_device_index()
        if device_index is None:
            print("❌ No microphone device available")
            return {"raw": None, "cleaned": None}
        
        # Use microphone
        with sr.Microphone(device_index=device_index) as source:
            print("Recording, Speak now:")
            
            # Adjust for ambient noise for better recognition
            recognizer.adjust_for_ambient_noise(source, duration=1)
            
            # Listen for audio with longer phrase time limit
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=10)
            
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
    print("Testing simple voice input...")
    
    # Test the voice input
    result = get_voice_input()
    if result and result["cleaned"]:
        print(f"✅ Test successful: '{result['cleaned']}'")
    else:
        print("❌ Test failed")
