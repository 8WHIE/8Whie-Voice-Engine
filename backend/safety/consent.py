"""
8WHIE VoiceForge - Safety & Consent Verification (Python)
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

import hashlib
import time
from typing import Dict, Any


class ConsentValidator:
    @staticmethod
    def create_consent_record(owner_name: str, audio_signature: str) -> Dict[str, Any]:
        ts = str(time.time())
        raw = f"{owner_name}:{ts}:{audio_signature}"
        sha_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()

        return {
            "consent_id": sha_hash,
            "owner_name": owner_name,
            "timestamp": ts,
            "signature": f"8WHIE-SIG-{sha_hash[:16].upper()}",
            "verified": True,
            "policy": "8WHIE Anti-Impersonation Charter",
        }
