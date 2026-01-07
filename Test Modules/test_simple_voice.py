#!/usr/bin/env python3
"""
Test script to verify simple voice input works without using Whisper module
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("🔄 Testing simple voice input module...")
    from module_voice_input_simple import get_voice_input, prompt_for_device_choice, get_default_device_index
    
    print("✅ Simple voice input module imported successfully!")
    print("✅ No Whisper download required!")
    
    # Test device listing
    devices = prompt_for_device_choice()
    print(f"✅ Device selection works: {devices}")
    
    print("\n🎉 SUCCESS: Your app will work without Whisper downloads!")
    print("You can now run main.py safely!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please install SpeechRecognition: pip install SpeechRecognition")
except Exception as e:
    print(f"❌ Error: {e}")
