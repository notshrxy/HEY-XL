# module_speaker_id.py
# Standalone speaker identification with local profile storage.
# Uses Resemblyzer (offline) for robust, simple embeddings.

import os
import json
import time
import Levenshtein
from pathlib import Path
from typing import Dict, Tuple, Optional, List

import numpy as np
import sounddevice as sd
import soundfile as sf
from resemblyzer import VoiceEncoder, preprocess_wav

# ----------------------------
# Config & paths
# ----------------------------
DATA_DIR = Path("data")
AUDIO_DIR = DATA_DIR / "audio_samples"
EMB_DIR = DATA_DIR / "embeddings"
PROFILE_JSON = DATA_DIR / "voice_profiles.json"

SAMPLE_RATE = 16000     # Record at 16kHz (matches encoder expectations well)
CHANNELS = 1
DEFAULT_DURATION = 3.0  # seconds per enrollment sample
DEFAULT_THRESHOLD = 0.65  # cosine similarity threshold (0..1). Lowered for better recognition.

# ----------------------------
# Ensure directories exist
# ----------------------------
def _ensure_dirs():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    EMB_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

# ----------------------------
# Storage helpers
# ----------------------------
def load_profiles() -> Dict:
    _ensure_dirs()
    if PROFILE_JSON.exists():
        with open(PROFILE_JSON, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"version": 1, "sample_rate": SAMPLE_RATE, "users": {}}

def save_profiles(db: Dict) -> None:
    _ensure_dirs()
    with open(PROFILE_JSON, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

def list_users() -> List[str]:
    return sorted(load_profiles().get("users", {}).keys())

def remove_user(name: str) -> bool:
    db = load_profiles()
    if name in db["users"]:
        del db["users"][name]
        save_profiles(db)
        # Optional: also remove audio/embedding files
        for d in [AUDIO_DIR / name, EMB_DIR / name]:
            if d.exists():
                for p in d.glob("*"):
                    p.unlink(missing_ok=True)
                d.rmdir()
        return True
    return False

def reset_profiles() -> None:
    save_profiles({"version": 1, "sample_rate": SAMPLE_RATE, "users": {}})
    # Optionally wipe files:
    for root in [AUDIO_DIR, EMB_DIR]:
        if root.exists():
            for sub in root.glob("*"):
                if sub.is_dir():
                    for p in sub.glob("*"):
                        p.unlink(missing_ok=True)
                    sub.rmdir()

# ----------------------------
# Audio I/O
# ----------------------------
def _resolve_input_device(device: Optional[int] = None, name_hint: Optional[str] = None) -> Optional[int]:
    """Resolve a valid sounddevice input device index, optionally by name hint."""
    devices = sd.query_devices()
    # Prefer name hint if provided and channels > 0
    if name_hint:
        for i, d in enumerate(devices):
            if d['max_input_channels'] > 0 and name_hint.lower() in d['name'].lower():
                return i
    # If explicit device provided and has input channels, accept it
    if device is not None:
        try:
            d = devices[device]
            if d['max_input_channels'] > 0:
                return device
        except Exception:
            pass
    # Fallback: first input-capable device
    for i, d in enumerate(devices):
        if d['max_input_channels'] > 0:
            return i
    return None


def record_wav(path: Path, duration: float = DEFAULT_DURATION, samplerate: int = SAMPLE_RATE,
               device: Optional[int] = None, silence_threshold: float = 0.01, name_hint: Optional[str] = None) -> bool:
    """
    Record microphone audio to WAV.
    Returns True if audio above threshold was captured, False otherwise.
    """

    # Auto-pick input device if not provided
    resolved = _resolve_input_device(device=device, name_hint=name_hint)
    if resolved is None:
        print("❌ No valid input devices found. Check microphone connection.")
        return False
    device = resolved
    devices = sd.query_devices()
    print(f"🎤 Using input device: {devices[device]['name']} (index={device})")
    print()  # Empty line for spacing

    print(f"🎙️ Recording {duration:.1f}s… (device={device})")
    try:
        audio = sd.rec(int(duration * samplerate), samplerate=samplerate,
                       channels=CHANNELS, dtype="float32", device=device)
        sd.wait()
    except Exception as e:
        # Fallback: try default input device if chosen device is invalid
        try:
            print(f"⚠️ Device error ({e}). Falling back to default input device.")
            audio = sd.rec(int(duration * samplerate), samplerate=samplerate,
                           channels=CHANNELS, dtype="float32")
            sd.wait()
        except Exception as e2:
            print(f"❌ Recording failed: {e2}")
            return False

    # Check for silence
    max_amp = np.max(np.abs(audio))
    if max_amp < silence_threshold:
        print("⚠️ Silence detected. Recording not saved.")
        return False

    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(path), audio, samplerate)
    print(f"✅ Saved: {path}")
    return True
# ----------------------------
# Embeddings
# ----------------------------
_encoder_singleton: Optional[VoiceEncoder] = None

def _get_encoder() -> VoiceEncoder:
    global _encoder_singleton
    if _encoder_singleton is None:
        _encoder_singleton = VoiceEncoder()  # will use CPU; if you have GPU, it’ll use it automatically if available
    return _encoder_singleton

def embed_wav_file(wav_path: Path) -> np.ndarray:
    """
    Convert a wav file to a speaker embedding vector (np.ndarray, shape ~(256,)).
    """
    wav = preprocess_wav(wav_path)  # loads & normalizes to 16kHz internally
    encoder = _get_encoder()
    emb = encoder.embed_utterance(wav)  # shape (256,)
    return emb.astype(np.float32)

def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    a = a / (np.linalg.norm(a) + 1e-10)
    b = b / (np.linalg.norm(b) + 1e-10)
    return float(np.dot(a, b))

def average_embeddings(embs: List[np.ndarray]) -> np.ndarray:
    return np.mean(np.stack(embs, axis=0), axis=0)

# ----------------------------
# Enrollment & Identification
# ----------------------------
def enroll_user(name: str, samples: int = 1, duration: float = DEFAULT_DURATION, device: Optional[int] = None) -> None:
    """
    Enroll a new user (or update an existing one) by recording `samples` clips, computing embeddings,
    averaging them, and saving to profiles.
    Stops after 3 consecutive silent attempts per sample.
    """
    name = name.strip()
    assert name, "Name must not be empty."
    print(f"📝 Enrolling '{name}' with {samples} sample(s)…")

    audio_dir = AUDIO_DIR / name
    emb_dir = EMB_DIR / name
    audio_dir.mkdir(parents=True, exist_ok=True)
    emb_dir.mkdir(parents=True, exist_ok=True)

    embeddings = []
    i = 0  # counter for attempts
    consecutive_silent = 0
    max_silent_attempts = 3  # stop after 3 silent tries per requested sample

    while len(embeddings) < samples:
        i += 1
        ts = time.strftime("%Y%m%d-%H%M%S")
        wav_path = audio_dir / f"{ts}-{i}.wav"
        
        # Record audio and check if non-silent
        success = record_wav(wav_path, duration=duration, device=device)
        if not success:
            consecutive_silent += 1
            print(f"⚠️ Sample {i} skipped due to silence. (Attempt {consecutive_silent}/{max_silent_attempts})")
            if consecutive_silent >= max_silent_attempts:
                print("❌ Maximum silent attempts reached. Enrollment aborted.")
                return
            continue
        consecutive_silent = 0  # reset on valid sample

        # Create embedding for valid audio
        emb = embed_wav_file(wav_path)
        embeddings.append(emb)
        np.save(emb_dir / f"{ts}-{i}.npy", emb)

    # Compute average embedding
    avg_emb = average_embeddings(embeddings)

    # Save profile
    db = load_profiles()
    db["users"][name] = {
        "embedding": avg_emb.tolist(),
        "samples": samples,
        "updated_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    save_profiles(db)
    print(f"✅ Enrollment complete for '{name}'. Profiles updated at {PROFILE_JSON}")

def _fuzzy_match_name(spoken_name: str, known_names: list, threshold: float = 0.65) -> Optional[str]:
    """
    Returns the best matching name from known_names if similarity >= threshold, else None.
    """
    spoken_name = spoken_name.strip().lower()
    best_name, best_score = None, 0.0
    for name in known_names:
        score = Levenshtein.ratio(spoken_name, name.lower())
        if score > best_score:
            best_name, best_score = name, score
    if best_score >= threshold:
        return best_name
    return None

def identify_current_speaker(duration: float = DEFAULT_DURATION, device: Optional[int] = None,
                             threshold: float = DEFAULT_THRESHOLD, name_hint: Optional[str] = None) -> Tuple[str, float]:
    """
    Record a short clip, embed it, compare to saved profiles, and return (best_name, similarity).
    If no match above threshold, returns ("Unknown", best_similarity).
    """
    ts = time.strftime("%Y%m%d-%H%M%S")
    wav_path = AUDIO_DIR / f"whoami-{ts}.wav"
    
    # Record audio
    success = record_wav(wav_path, duration=duration, device=device, name_hint=name_hint)
    if not success:
        print("⚠️ No valid audio captured. Returning Unknown.")
        return "Unknown", 0.0  # Exit gracefully if silent
    
    # Proceed only if recording succeeded
    query_emb = embed_wav_file(wav_path)

    db = load_profiles()
    users = db.get("users", {})
    if not users:
        print("⚠️ No profiles found. Please enroll a user first.")
        return "Unknown", 0.0

    best_name, best_sim = "Unknown", 0.0
    for name, meta in users.items():
        ref = np.array(meta["embedding"], dtype=np.float32)
        sim = cosine_sim(query_emb, ref)
        print(f"   • similarity({name}) = {sim:.3f}")
        if sim > best_sim:
            best_name, best_sim = name, sim

    if best_sim >= threshold:
        print(f"✅ Recognized as '{best_name}' (similarity={best_sim:.3f} ≥ {threshold})")
        return best_name, best_sim

    print(f"❌ No match above threshold ({best_sim:.3f} < {threshold}).")
    return "Unknown", best_sim

# ----------------------------
# Optional CLI
# ----------------------------
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Speaker ID (Resemblyzer) with local profile storage.")
    sub = parser.add_subparsers(dest="cmd")

    p_enroll = sub.add_parser("enroll", help="Enroll or update a user")
    p_enroll.add_argument("name", type=str, help="User name")
    p_enroll.add_argument("--samples", type=int, default=3, help="Number of audio samples to average")
    p_enroll.add_argument("--duration", type=float, default=DEFAULT_DURATION, help="Seconds per sample")
    p_enroll.add_argument("--device", type=int, default=None, help="sounddevice index (None=default)")

    p_who = sub.add_parser("whoami", help="Identify current speaker")
    p_who.add_argument("--duration", type=float, default=DEFAULT_DURATION)
    p_who.add_argument("--device", type=int, default=None)
    p_who.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD)

    sub.add_parser("list", help="List enrolled users")

    p_remove = sub.add_parser("remove", help="Remove a user")
    p_remove.add_argument("name", type=str)

    sub.add_parser("reset", help="Delete all profiles")

    args = parser.parse_args()
    _ensure_dirs()

    if args.cmd == "enroll":
        enroll_user(args.name, samples=args.samples, duration=args.duration, device=args.device)
    elif args.cmd == "whoami":
        identify_current_speaker(duration=args.duration, device=args.device, threshold=args.threshold)
    elif args.cmd == "list":
        users = list_users()
        print("👥 Users:", users if users else "(none)")
    elif args.cmd == "remove":
        ok = remove_user(args.name)
        print("✅ Removed." if ok else "⚠️ Not found.")
    elif args.cmd == "reset":
        reset_profiles()
        print("✅ All profiles cleared.")
    else:
        parser.print_help()

# === Add to module_speaker_id.py ===

def _load_user_embedding(name: str) -> Optional[np.ndarray]:
    db = load_profiles()
    meta = db.get("users", {}).get(name)
    if not meta:
        return None
    return np.array(meta["embedding"], dtype=np.float32)

def _save_user_embedding(name: str, emb: np.ndarray, samples_inc: int = 1) -> None:
    db = load_profiles()
    if "users" not in db:
        db["users"] = {}
    rec = db["users"].get(name, {"samples": 0})
    rec["embedding"] = emb.astype(np.float32).tolist()
    rec["samples"] = int(rec.get("samples", 0)) + samples_inc
    rec["updated_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
    db["users"][name] = rec
    save_profiles(db)

def ema_update(old_emb: np.ndarray, new_emb: np.ndarray, alpha: float = 0.2) -> np.ndarray:
    """Exponential moving average for gentle adaptation over time."""
    return (1.0 - alpha) * old_emb + alpha * new_emb

def auto_refresh_profile(name: str, new_emb: np.ndarray, alpha: float = 0.2) -> None:
    """Refresh a known user's embedding slightly with the new sample."""
    old = _load_user_embedding(name)
    if old is None:
        return
    updated = ema_update(old, new_emb, alpha=alpha)
    _save_user_embedding(name, updated, samples_inc=0)

def ensure_known_speaker(
    duration: float = DEFAULT_DURATION,
    threshold: float = DEFAULT_THRESHOLD,
    auto_enroll: bool = True,
    confirm_fn=None,        # function that asks user Y/N and returns True/False
    speak_fn=print,         # printing function
    max_silence_attempts: int = 3,
    device: Optional[int] = None,
    device_name_hint: Optional[str] = None,
) -> Tuple[str, float]:
    """
    Records a short clip and tries to identify the speaker.
    If recognized: optionally refresh profile and return name.
    If unknown or silent: optionally ask permission to enroll, then enroll.
    Stops trying after `max_silence_attempts` silent recordings.
    """
    silence_count = 0

    while True:
        # Try identifying speaker
        name, score = identify_current_speaker(duration=duration, device=device, threshold=threshold, name_hint=device_name_hint)

        if name != "Unknown":
            speak_fn(f"Recognized as {name} (score {score:.2f}).")

            # No extra post-identification recording; honor single-recording rule

            return name, score

        # Unknown speaker or silent recording
        silence_count += 1

        if silence_count >= max_silence_attempts:
            speak_fn("No valid audio detected multiple times.")
            return "Unknown", 0.0

        # Ask user for enrollment
        if not auto_enroll:
            return "Unknown", score

        # Full prompt printed before asking Y/N
        prompt_text = (
            "I don't recognize your voice.\n"
            "Would you like to enroll your voice now?"
        )

        if confirm_fn is None:
            speak_fn(prompt_text)
            yn = input().strip().lower()
            ok = yn in ["y", "yes", "yeah", "sure", "ok", "okay"]
        else:
            ok = bool(confirm_fn(prompt_text))

        if not ok:
            speak_fn("Okay, continuing without enrolling.")
            return "Unknown", score

        # Ask for user name
        user_name = input("Please type your name as you'd like to be addressed: ").strip()

        # Check if user already exists
        existing_users = list_users()
        fuzzy_existing = _fuzzy_match_name(user_name, existing_users, threshold=0.8)
        if fuzzy_existing:
            speak_fn(f"⚠️ User '{fuzzy_existing}' already exists. Let me verify your voice...")
            # Try to verify voice against existing user
            verify_name, verify_score = identify_current_speaker(
                duration=duration, 
                device=device, 
                threshold=threshold,
                name_hint=fuzzy_existing
            )
            if verify_name == fuzzy_existing and verify_score >= threshold:
                speak_fn(f"✅ Voice verified! Welcome back, {fuzzy_existing}!")
                return fuzzy_existing, verify_score
            else:
                speak_fn(f"❌ Voice doesn't match {fuzzy_existing}. Please use a different name.")
                # Ask for a new name
                while True:
                    new_name = input("Please enter a different name: ").strip()
                    if new_name and new_name.lower() != fuzzy_existing.lower():
                        user_name = new_name
                        break
                    speak_fn("Please enter a different name.")

        # Enroll user with up to 3 valid samples
        enroll_user(user_name, samples=1, duration=duration, device=device)
        speak_fn(f"Enrollment complete. Welcome, {user_name}!")
        return user_name, 0.0