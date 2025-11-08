#!/usr/bin/env python3
"""
Test script to verify server starts without Unicode errors
"""
import subprocess
import sys
import os
import time

def test_server_startup():
    """Test if the server can start without Unicode encoding errors."""
    try:
        print("Testing server startup...")
        
        # Get the server path
        server_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend", "server.py")
        
        if not os.path.exists(server_path):
            print("ERROR: Server file not found at:", server_path)
            return False
        
        print("Starting server process...")
        
        # Start server process
        process = subprocess.Popen(
            [sys.executable, server_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        
        # Wait a moment for startup
        time.sleep(2)
        
        # Check if process is still running
        if process.poll() is None:
            print("SUCCESS: Server started without Unicode errors!")
            print("Server is running in background...")
            
            # Terminate the test process
            process.terminate()
            process.wait(timeout=5)
            print("Test server stopped.")
            return True
        else:
            stdout, stderr = process.communicate()
            print("ERROR: Server failed to start")
            print("STDOUT:", stdout)
            print("STDERR:", stderr)
            return False
            
    except Exception as e:
        print(f"ERROR: Test failed: {e}")
        return False

if __name__ == "__main__":
    if test_server_startup():
        print("\n✅ Server startup test PASSED!")
        print("You can now run main.py without Unicode errors.")
    else:
        print("\n❌ Server startup test FAILED!")
        print("There may still be Unicode encoding issues.")
