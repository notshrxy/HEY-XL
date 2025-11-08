# HEY-XL Bridge API (FastAPI)

## Run locally
cd backend
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell
pip install -r requirements.txt
python server.py

The API runs at http://127.0.0.1:8000

## Endpoints
- POST /api/session/start → { sessionId, say }
- POST /api/session/upload?sessionId=... (multipart file)
- GET /api/session/preview?sessionId=... → HTML preview
- POST /api/session/run → starts pipeline (simulated; hook main.py here)
- GET /api/session/status?sessionId=... → { status, logs }

## Frontend origin
Update ALLOWED_ORIGINS in server.py if your dev URL differs from http://localhost:5173.

## Hooking your pipeline
Replace the simulated run in /api/session/run with a subprocess call to your main.py that accepts --file <path> and prints progress. Append stdout lines to SESSIONS[sessionId]["logs"].

