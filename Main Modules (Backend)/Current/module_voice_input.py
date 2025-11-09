# module_voice_input.py
# Whisper disabled entirely. This module now provides recording helpers only,
# and any transcription should be done by callers (e.g., via SpeechRecognition).
🧭 NaviBot – Smart Campus Navigation System
© 2025 Shreyas | Student of Sathyabama Institute of Science and Technology

import sounddevice as sd
import soundfile as sf
import numpy as np
from typing import Optional, Dict, Callable
import time
import tempfile
import os

_speak_fn: Callable[[str], None] = print

# Load Whisper model with better error handling and fallback
whisper_model = None
model_loaded = True  # prevent any attempts to load

def load_whisper_model(model_size="tiny"):
    """Whisper disabled: always return False without loading."""
    return False

# Do not load any Whisper model on import


def list_input_devices() -> list:
    """Return list of input device names from sounddevice."""
    try:
        devices = sd.query_devices()
        input_devices = []
        for i, device in enumerate(devices):
            if device['max_input_channels'] > 0:
                input_devices.append(device['name'])
        return input_devices
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


def record_audio(duration: float = 5.0, device_index: Optional[int] = None, sample_rate: int = 16000) -> Optional[np.ndarray]:
    """Record audio using sounddevice."""
    try:
        print("Recording, Speak now:")
        
        # Record audio
        audio_data = sd.rec(
            int(duration * sample_rate), 
            samplerate=sample_rate, 
            channels=1, 
            dtype=np.float32,
            device=device_index
        )
        
        # Wait for recording to complete
        sd.wait()
        
        print("✅ Audio captured successfully")
        return audio_data.flatten()
        
    except Exception as e:
        print(f"❌ Error recording audio: {e}")
        return None


def transcribe_with_whisper(audio_data: np.ndarray, sample_rate: int = 16000) -> Optional[str]:
    """Whisper disabled: route to fallback recognition immediately."""
    return fallback_transcribe(audio_data, sample_rate)


def fallback_transcribe(audio_data: np.ndarray, sample_rate: int = 16000) -> Optional[str]:
    """Fallback transcription method when Whisper fails."""
    try:
        # Try to use SpeechRecognition as fallback
        import speech_recognition as sr
        
        recognizer = sr.Recognizer()
        
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            sf.write(temp_file.name, audio_data, sample_rate)
            
            # Load audio file
            with sr.AudioFile(temp_file.name) as source:
                audio = recognizer.record(source)
            
            # Clean up temporary file
            os.unlink(temp_file.name)
            
            # Try to recognize
            try:
                text = recognizer.recognize_google(audio, language='en-US')
                print(f"📝 You said (fallback): {text}")
                return text
            except sr.UnknownValueError:
                print("❌ Fallback recognition failed - audio unclear")
                return None
            except sr.RequestError as e:
                print(f"❌ Fallback recognition failed - API error: {e}")
                return None
                
    except ImportError:
        print("❌ SpeechRecognition not available for fallback")
        return None
    except Exception as e:
        print(f"❌ Fallback transcription failed: {e}")
        return None


def get_voice_input(device: Optional[int] = None, duration: float = 5.0) -> Optional[Dict[str, Optional[str]]]:
    """
    Simple, basic voice input function using Whisper.
    """
    try:
        # Get device
        device_index = device if device is not None else get_default_device_index()
        if device_index is None:
            print("❌ No microphone device available")
            return {"raw": None, "cleaned": None}
        
        # Record audio
        audio_data = record_audio(duration=duration, device_index=device_index)
        if audio_data is None:
            return {"raw": None, "cleaned": None}
        
        # Transcribe with Whisper
        text = transcribe_with_whisper(audio_data)
        if text:
            return {"raw": text, "cleaned": text.lower().strip()}
        else:
            return {"raw": None, "cleaned": None}
            
    except Exception as e:
        print(f"❌ Error in voice input: {e}")
        return {"raw": None, "cleaned": None}


def get_voice_input_with_timeout(device: Optional[int] = None, timeout: float = 10.0) -> Optional[Dict[str, Optional[str]]]:
    """
    Voice input with timeout functionality.
    """
    try:
        # Get device
        device_index = device if device is not None else get_default_device_index()
        if device_index is None:
            print("❌ No microphone device available")
            return {"raw": None, "cleaned": None}
        
        print("Recording, Speak now:")
        
        # Record audio with timeout
        start_time = time.time()
        audio_data = sd.rec(
            int(timeout * 16000), 
            samplerate=16000, 
            channels=1, 
            dtype=np.float32,
            device=device_index
        )
        
        # Wait for recording or timeout
        sd.wait()
        
        # Check if we got any audio
        if np.max(np.abs(audio_data)) < 0.01:  # Very quiet threshold
            print("⏱️ Timeout - no speech detected")
            return {"raw": None, "cleaned": None}
        
        print("✅ Audio captured successfully")
        
        # Transcribe with Whisper
        text = transcribe_with_whisper(audio_data.flatten())
        if text:
            return {"raw": text, "cleaned": text.lower().strip()}
        else:
            return {"raw": None, "cleaned": None}
            
    except Exception as e:
        print(f"❌ Error in voice input: {e}")
        return {"raw": None, "cleaned": None}


if __name__ == "__main__":
    print(f"Default microphone device index: {get_default_device_index()}")
    print("Testing Whisper voice input...")
    
    # Test the voice input
    result = get_voice_input()
    if result and result["cleaned"]:
        print(f"✅ Test successful: '{result['cleaned']}'")
    else:
        print("❌ Test failed")
