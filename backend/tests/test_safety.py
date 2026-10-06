"""
8WHIE VoiceForge - Safety & Watermark Tests
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

import numpy as np
from safety.consent import ConsentValidator
from safety.watermark import AudioWatermarker


def test_consent_record_generation():
    record = ConsentValidator.create_consent_record("Aryan Thakur", "sample_sig_abc123")
    assert record["verified"] is True
    assert record["owner_name"] == "Aryan Thakur"
    assert record["signature"].startswith("8WHIE-SIG-")


def test_audio_watermarking():
    watermarker = AudioWatermarker(19500.0)
    samples = np.zeros(24000, dtype=np.float32)
    watermarked = watermarker.inject_watermark(samples, 24000)

    assert len(watermarked) == 24000
    # Confirm inaudible energy was injected into carrier band
    assert np.max(np.abs(watermarked)) > 0.0
    assert np.max(np.abs(watermarked)) < 0.01  # Must remain inaudible below -40dBFS
