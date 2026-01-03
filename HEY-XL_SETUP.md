# HEY-XL : Smart Voice Based Excel Editor🧙‍♂️📊

Welcome to **HEY-XL**, an intelligent assistant that lets you control your Excel spreadsheets using natural voice commands!

## ⚠️ Important: How This App Works (The "Hybrid" Approach)

You might be wondering: **"Why do I need to run a local server? Why isn't this 100% online?"**

We want to be transparent about this. To provide the best possible voice experience (low latency, high-quality speech recognition, and direct control of your local Excel files), this application needs direct access to your computer's **microphone** and **file system**.

Browsers and cloud servers have strict security limitations that prevent a website from directly "talking" to your local Excel files or processing raw audio with our powerful Python engine in real-time.

Plus, Servers do not have a 'Mic' or 'Speaker' to process audio. This thus requires that I format the entire codebase so your browser can access the local 'Mic' and 'Speaker' of your computer (which I didn't, I built the project on modules that work with your local machine, which is, a big blunder for production.)

PS - Sorry for the hassle but I promise, this works better than average!

**So, we use a Hybrid Approach:**
1.  **The Interface (Frontend):** Lives online (like this website), giving you a beautiful, easy-to-use dashboard.
2.  **The Engine (Backend):** Runs on your computer, handling the heavy lifting of voice processing and Excel automation.

**We apologize for the extra step!** 🙇‍♂️ We know running a script locally isn't as convenient as a pure web app, but it's currently the only way to give you this level of control and privacy over your data.

---

## 🚀 How to Use Voice Excel Wizard

Follow these simple steps to get started.

### Step 1: Download the Voice Engine
You need the backend code to power the voice commands.
1.  **Download [HEY-XL Voice Engine.zip]**
2.  **Unzip** the folder to a location on your computer (e.g., Desktop or Downloads).

### Step 2: Install Requirements (One Time Setup)
We need a few Python libraries to make the magic happen.
1.  Open your **Terminal** (Mac/Linux) or **Command Prompt** (Windows).
2.  Navigate to the unzipped folder: (Depends on where you decide to extract/unzip)
    ```bash
    cd path/to/HEY-XL Voice Engine
    ```
3.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You need Python 3.8 or newer installed)*

### Step 3: Run the Engine
Whenever you want to use the app, just start the engine:
1.  Run this command in your terminal:
    ```bash
    python backend/server.py
    ```
2.  You should see a message saying: `Running on http://127.0.0.1:8000`
3.  **Keep this terminal window OPEN** while you use the app.

### Step 4: Start Speaking!
1.  Login using a random mail address but make sure the domain is - @sathyabama.ac.in (This project was tailored to be used in Sathyabama University, Chennai)
2.  Go to our web interface: **https://heyxl.vercel.app/**
3.  Click **"Start"** to connect to your local engine.
4.  Upload an Excel file and try a command like:
    > *"Add 95 for Priya in Mathematics"*
    > *"Mark John as Present"*

---

### Troubleshooting
*   **Connection Failed?** Make sure the black terminal window is still open and running the server.
*   **Browser Warning?** If your browser blocks the connection (Mixed Content error), please allow "Insecure Content" for this site. This is safe because the "insecure" connection is just talking to your own computer (localhost).