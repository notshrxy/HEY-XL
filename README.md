# 🤖 HEY-XL – Voice-Driven Excel Automation

HEY-XL is a **voice-activated Excel automation assistant** that allows users to perform spreadsheet operations using natural speech commands.  
From adding marks to updating records, HEY-XL simplifies data entry and manipulation through intelligent voice interaction.<br>
Built with college faculty workflows in mind, the project aims to reduce **manual effort**, **human error**, and **cognitive load** during repetitive data entry tasks.

This repository currently represents the **MVP (Minimum Viable Product)**, with future expansions planned.

---

## 🚀 Project Overview

Designed primarily for educational and workspace productivity, HEY-XL combines **speech recognition**, **natural language processing (NLP)**, and **Excel automation** to execute user commands in real-time.

Users can say commands like:
> “Add 85 for Priya in DSA”  
> “Update Rahul’s attendance to 92 percent”

HEY-XL processes the voice input, interprets intent, and updates Excel sheets instantly — making manual typing a thing of the past.

---

## Demonstration

Complete MVP Demo

https://github.com/user-attachments/assets/55d29bc6-7b55-4dfd-a37b-f7758f6118ae

Editing Excel File using Tamil Language

https://github.com/user-attachments/assets/b68a1c1a-5465-4969-919c-6c10081c7985

---

## HEY-XL UI/UX

Figma Design (Home Page)

![Image](https://github.com/user-attachments/assets/fc2b38cc-f92f-4b20-b248-86e3d44ec071)

Live Preview Server

![Image](https://github.com/user-attachments/assets/c463abb4-c225-45ac-9da5-58c7485cf614)

Figma Design (Main Excel Orchestra)

![Image](https://github.com/user-attachments/assets/32b7ff89-dc97-49ee-bfa8-e7cf30e7c66a)


---

# Console Outputs

Succesful Startup of Server and Frontend Service

https://github.com/user-attachments/assets/1ed1e294-d425-485b-80cb-2dcb61e3882d

Making Modifications to Excel Voice using Textual Input (Failsafe)

https://github.com/user-attachments/assets/175fee63-1c01-4c4b-8006-8302f6893ad0

Proper Console Output Log after Successful Iteration

![Image](https://github.com/user-attachments/assets/33f8d15f-b4d9-459c-be05-179a7e07d41a)

## 🧠 Problem Statement
Manual Excel data entry is:
- Time-consuming
- Error-prone
- Mentally taxing for repetitive workflows  

HEY-XL attempts to address this by enabling **hands-free Excel modification** through structured voice commands.

---

## ⚙️ Tech Stack

### 🧠 Backend
- **Python**
- **Flask API**
- **SpeechRecognition / OpenAI Whisper**
- **pyttsx3 (Text-to-Speech)**
- **pandas, openpyxl** for Excel handling
- **Resemblyzer** for speaker analysis
- **spaCy / FuzzyWuzzy** for NLP and command parsing

### 💻 Frontend
- **HTML / CSS / JavaScript**
- **Responsive Interface** for recording and preview
- Real-time connection to Flask API

---

## 🧩 Key Features

🎤 Voice-driven Excel data entry  
🧩  NLP-powered command understanding  
📄  Real-time confirmation via Text-to-Speech  
✅ Flask-based backend communication  
🗣️ Speaker-aware command processing  
🌐 Cross-language support (English + Tamil tested)  

---

## ☁️ Hybrid Serverless Architecture

HEY-XL follows a **hybrid serverless architecture** to balance accessibility, performance, and local file security.

### 🌐 Frontend (Serverless)
- The frontend is deployed on **Vercel**, making it globally accessible.
- Handles:
  - User authentication (Google & GitHub OAuth via Firebase)
  - UI interactions
  - Voice input capture
  - API request orchestration
- Being serverless, it benefits from:
  - Zero-maintenance hosting
  - Fast global delivery
  - Automatic scaling

### 🖥️ Backend (Local Execution)
- The backend is designed to **run locally on the user’s machine** whenever HEY-XL is required.
- This is intentional, as:
  - Excel files remain **local and private**
  - Direct file system access is required for reliable Excel manipulation
- The backend:
  - Runs a Flask-based API
  - Processes voice commands
  - Parses commands using regex-based logic
  - Updates Excel files in real time

### 🔁 How It Works Together
1. User accesses HEY-XL via the Vercel-hosted frontend.
2. Voice input is captured through the browser.
3. Requests are sent to the locally running backend.
4. Backend processes the command and updates the Excel file.
5. Results are reflected back in the frontend UI.

This hybrid approach allows HEY-XL to combine the **convenience of serverless deployment** with the **control and security of local execution**, making it especially suitable for academic and institutional workflows.

> This architecture also keeps the system flexible, allowing future transitions to fully cloud-based or containerized deployments if needed.

---

## 🗣️ Supported Voice Command Format
HEY-XL currently supports **fixed-pattern commands** for reliable parsing.

**Example:**
**Parsed as:**
- Action → `Add`
- Value → `95`
- Name → `Shreyas`
- Subject → `DSA`

These components are processed by dedicated backend modules to update the Excel sheet accordingly.

---

## 🔮 Future Upgrades

- Integration with Google Sheets  
- AI-powered contextual command chaining  

---

## 👥 Our Team

Developed by **Shreyas S** and **Akash P**.  

---

## 📜 License

MIT License

Copyright (c) 2025 Shreyas S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
