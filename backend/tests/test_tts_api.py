"""
8WHIE VoiceForge - API Tests
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["owner"] == "Aryan Thakur"
    assert data["platform"] == "8WHIE VoiceForge"


def test_tts_generation_endpoint():
    payload = {
        "text": "8WHIE produces synthetic speech for ₹1,499.",
        "voice_id": "8whie-aryan",
        "language": "en",
        "speed": 1.0,
        "sample_rate": 24000,
    }
    res = client.post("/api/tts/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "audio_base64" in data
    assert data["duration_seconds"] > 0
    assert "Eight-Why" in data["text_normalized"]


def test_voice_cloning_consent_rejection():
    # Attempting to clone without acknowledging declaration must fail with 403
    payload = {
        "owner_name": "Unauthorized User",
        "declaration_accepted": False,
        "audio_base64": "dummy",
    }
    res = client.post("/api/voices/clone", json=payload)
    assert res.status_code == 403
