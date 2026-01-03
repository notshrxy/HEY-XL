# Voice Excel Wizard - Deployment Guide

This guide explains how to deploy the Voice Excel Wizard project.

> [!IMPORTANT]
> **Architectural Note:** This application uses **server-side voice processing** (`sounddevice`, `pyttsx3`).
> *   **Local Deployment:** Works fully (Voice & Text).
> *   **Cloud Deployment:** **Voice features will NOT work** because cloud servers (like Render/Heroku) do not have physical microphones or speakers.
> *   **Companion App Model:** Deploy Frontend to Cloud, Users run Backend locally. **(Recommended)**
> *   **Login:** Login using a random mail address but make sure the domain is - @sathyabama.ac.in (This project was tailored to be used in Sathyabama University, Chennai)

---

## Deployment Strategy: "Companion App" (Recommended)

This is the best approach for this project.
1.  **Frontend:** Deployed online (e.g., Vercel) for easy access.
2.  **Backend:** Runs locally on the **user's computer** to access their microphone and Excel files.

### 1. Deploy Frontend (For You)
1.  Push your `Frontend` folder to GitHub.
2.  Import the repo into **Vercel**.
3.  Ensure `src/components/Demo.tsx` points to localhost: (Server-Side voice processing)
    ```typescript
    const LIVE_PREVIEW_BASE = "http://127.0.0.1:8000";
    ```
4.  Deploy. You now have a public URL (e.g., `heyxl.vercel.app`).

---

## 🚀 How to Use Voice Excel Wizard

This application consists of a web interface and a local voice engine. To use it, you must run the voice engine on your computer.

### Step 1: Get the Voice Engine
1.  Download the **Backend Code** (or clone this repository/download the zip).
2.  Ensure you have **Python 3.8+** installed.

### Step 2: Setup (One Time)
Open your terminal/command prompt in the backend folder and run:
```bash
pip install -r requirements.txt
```

### Step 3: Run the App
1.  **Start the Voice Engine:**
    Run this command in your terminal:
    ```bash
    python backend/server.py
    ```
    *Keep this terminal window open.*

2.  **Open the Interface:**
    Go to **[INSERT YOUR VERCEL URL HERE]** in your browser.

3.  **Start Working:**
    *   Click "Start" on the website.
    *   It will connect to your local voice engine automatically.
    *   Upload an Excel file and start speaking!

> **Troubleshooting:**
> *   **Connection Failed?** Ensure the terminal is running and shows "Running on http://127.0.0.1:8000".
> *   **Browser Warning?** If the browser blocks the connection (Mixed Content), look for a shield icon in the address bar and click "Allow insecure content" or "Load unsafe scripts" (this is safe because it's connecting to your own computer).

***

## Alternative: Full Local Deployment (Dev Mode)

If you are a developer modifying the code:

### 1. Backend
```bash
cd "Main Modules (Backend)/Current"
pip install -r requirements.txt
python backend/server.py
```
or, Install the zip file.

### 2. Frontend
```bash
cd "HEY-XL - Frontend"
npm install
npm run dev
```
Open `http://localhost:5173`.

---

## Alternative: Pure Cloud (Text Only)

If you deploy **both** Frontend (Vercel) and Backend (Render), **Voice will NOT work**.
Only text commands and file uploads will function.

1.  **Backend (Render):** Deploy `Main Modules (Backend)/Current`.
2.  **Frontend (Vercel):** Update `Demo.tsx` to point to the Render URL.
