# backend_controller.py
"""
Backend Controller API for managing main.py process
Provides endpoints for frontend to control the backend
"""
from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import os
import sys
import signal
import psutil
import time
import tempfile
import shutil
from pathlib import Path
import requests
import threading

app = Flask(__name__)
CORS(app)

# Global variables (minimal controller)
main_process = None

def ensure_preview_server(port: int = 8000) -> bool:
    """Ensure the live preview server (backend/server.py) is running."""
    # First check if it's already running
    try:
        r = requests.get(f"http://127.0.0.1:{port}/api/session/status", timeout=2)
        if r.ok:
            return True
    except Exception:
        pass

    # Try to start it
    try:
        cwd = os.path.dirname(os.path.abspath(__file__))
        server_path = os.path.join(cwd, "backend", "server.py")
        if not os.path.exists(server_path):
            print("backend/server.py not found at:", server_path)
            return False

        python_exe = sys.executable
        subprocess.Popen(
            [python_exe, server_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=cwd,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )

        # Wait until it responds or timeout
        for _ in range(30):  # ~9s
            try:
                time.sleep(0.3)
                r = requests.get(f"http://127.0.0.1:{port}/api/session/status", timeout=2)
                if r.ok:
                    return True
            except Exception:
                continue
        return False
    except Exception as e:
        print(f"Error starting preview server: {e}")
        return False

@app.route('/api/backend/status', methods=['GET'])
def get_backend_status():
    """Minimal status response used during reset"""
    running = bool(main_process and main_process.poll() is None)
    return jsonify({"running": running})

@app.route('/api/backend/start', methods=['POST'])
def start_backend():
    """Start the main.py backend process"""
    global main_process
    
    # Check if already running
    if main_process and main_process.poll() is None:
        return jsonify({"success": True, "message": "Backend already running", "status": backend_status})
    
    try:
        # Get main.py path
        cwd = os.path.dirname(os.path.abspath(__file__))
        main_path = os.path.join(cwd, "main.py")
        
        if not os.path.exists(main_path):
            return jsonify({"success": False, "error": "main.py not found"}), 404
        
        # Start main.py in background
        python_exe = sys.executable
        main_process = subprocess.Popen(
            [python_exe, main_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=cwd,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        
        return jsonify({
            "success": True,
            "message": "Backend started successfully",
            "status": {"running": True}
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/backend/stop', methods=['POST'])
def stop_backend():
    """Stop the main.py backend process"""
    global main_process
    
    if main_process and main_process.poll() is None:
        try:
            main_process.terminate()
            main_process.wait(timeout=5)
        except:
            try:
                main_process.kill()
            except:
                pass
    
    return jsonify({"success": True, "message": "Backend stopped"})

# Removed advanced endpoints during reset

@app.route('/api/backend/upload-file', methods=['POST'])
def upload_file():
    return jsonify({"success": False, "error": "upload disabled (demo reset)"}), 400

if __name__ == "__main__":
    print("Starting Backend Controller API...")
    print("Controller will be available at: http://127.0.0.1:8001")
    app.run(host='127.0.0.1', port=8001, debug=False)
