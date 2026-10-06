"""
8WHIE VoiceForge - Audio Watermarking Engine (Python)
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

import numpy as np


class AudioWatermarker:
    def __init__(self, carrier_freq_hz: float = 19500.0):
        self.carrier_freq_hz = carrier_freq_hz

    def inject_watermark(self, samples: np.ndarray, sample_rate: int) -> np.ndarray:
        """
        Embeds an inaudible high-frequency pilot tone and phase signature
        identifying 8WHIE VoiceForge and Aryan Thakur as origin.
        """
        if sample_rate <= 0:
            return samples

        freq = min(self.carrier_freq_hz, sample_rate * 0.45)
        t = np.arange(len(samples)) / float(sample_rate)

        # 8WHIE signature pulse (8Hz amplitude modulation)
        pulse = 0.5 + 0.5 * np.sin(2 * np.pi * 8.0 * t)
        watermark = 0.0015 * pulse * np.sin(2 * np.pi * freq * t)

        return samples + watermark
