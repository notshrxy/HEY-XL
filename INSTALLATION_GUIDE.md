# Excel Voice Automation - Installation Guide

## Prerequisites
- Python 3.8 or higher
- Microphone (for voice input)
- Speakers/Headphones (for voice feedback)

## Quick Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Download spaCy language model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Run the application:**
   ```bash
   python main.py
   ```

## Detailed Installation Steps

### Step 1: Install Python Dependencies

The `requirements.txt` file contains all necessary libraries:

```bash
pip install -r requirements.txt
```

**Key libraries explained:**
- `openpyxl`: Excel file manipulation (.xlsx, .xlsm, .xltx, .xltm)
- `pyttsx3`: Text-to-speech for voice feedback
- `SpeechRecognition`: Voice input recognition
- `resemblyzer`: Speaker identification and voice embeddings
- `spacy`: Natural language processing for command parsing
- `fuzzywuzzy`: Fuzzy string matching for names/subjects
- `sounddevice` & `soundfile`: Audio recording and processing

### Step 2: Install spaCy Language Model

spaCy requires a language model for natural language processing:

```bash
python -m spacy download en_core_web_sm
```

**Alternative models (if needed):**
- `en_core_web_md`: Medium model (more accurate, larger)
- `en_core_web_lg`: Large model (most accurate, largest)

### Step 3: Verify Installation

Run the test script to verify everything works:

```bash
python test_integration.py
```

### Step 4: First Run

1. **Run the main application:**
   ```bash
   python main.py
   ```

2. **Follow the setup prompts:**
   - Allow microphone access when prompted
   - Enroll your voice when asked
   - Select or create an Excel file
   - Start giving voice commands!

## Troubleshooting

### Common Issues

**1. Microphone not detected:**
- Check microphone permissions in Windows settings
- Try running as administrator
- Test with: `python -c "import speech_recognition as sr; print(sr.Microphone.list_microphone_names())"`

**2. spaCy model not found:**
```bash
python -m spacy download en_core_web_sm
```

**3. Audio device errors:**
- Install audio drivers
- Check if microphone is working in other applications
- Try different audio device in Windows sound settings

**4. Excel file access issues:**
- Ensure Excel files are not open in Excel
- Check file permissions
- Try running as administrator

**5. Voice recognition not working:**
- Check internet connection (uses Google Speech API)
- Speak clearly and at normal volume
- Reduce background noise

### Performance Optimization

**For better voice recognition:**
- Use a good quality microphone
- Speak in a quiet environment
- Use clear, distinct pronunciation

**For better speaker identification:**
- Enroll multiple voice samples
- Speak naturally during enrollment
- Use consistent voice tone

## System Requirements

**Minimum:**
- Python 3.8+
- 4GB RAM
- 1GB free disk space
- Microphone
- Internet connection (for speech recognition)

**Recommended:**
- Python 3.9+
- 8GB RAM
- 2GB free disk space
- High-quality microphone
- Stable internet connection

## File Structure

After installation, your project should have:
```
Excel Automation/
├── main.py                    # Main application entry point
├── module_excel_handler.py    # Excel file operations
├── module_parse_command.py    # Command parsing and NLP
├── module_speaker_id.py       # Speaker identification
├── module_voice_input.py      # Voice input processing
├── requirements.txt           # Python dependencies
├── test_integration.py        # Test script
├── data/                      # Voice profiles and audio samples
│   ├── audio_samples/
│   ├── embeddings/
│   └── voice_profiles.json
└── ExcelVoiceApp/             # Created automatically
    └── (your Excel files)
```

## Next Steps

1. **Test the system** with the integration test
2. **Enroll your voice** for speaker identification
3. **Create or select an Excel file** to work with
4. **Try voice commands** like:
   - "Add 95 for Priya in DSA"
   - "Update 87 for John in Math"
   - "Get Alice's Physics score"

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Run the test script to identify problems
3. Check the console output for error messages
4. Ensure all dependencies are properly installed
