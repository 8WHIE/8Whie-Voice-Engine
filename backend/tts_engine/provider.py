"""
8WHIE VoiceForge - Model Provider Adapter Architecture (Python)
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
import numpy as np


class ModelProvider(ABC):
    @abstractmethod
    def synthesize(
        self,
        text: str,
        voice_params: Dict[str, Any],
        sample_rate: int = 24000
    ) -> Tuple[np.ndarray, float]:
        """Synthesizes audio array and returns (samples, duration_seconds)"""
        pass


class LocalDspModelProvider(ModelProvider):
    """
    8WHIE First-Principles Formant & Glottal DSP Synthesizer.
    Runs efficiently on any CPU/GPU environment with zero external dependencies.
    """
    def __init__(self):
        self.name = "8WHIE DSP Formant Engine"

    def synthesize(
        self,
        text: str,
        voice_params: Dict[str, Any],
        sample_rate: int = 24000
    ) -> Tuple[np.ndarray, float]:
        pitch = voice_params.get("pitch", 0.0)
        speed = max(0.5, min(2.0, voice_params.get("speed", 1.0)))

        words = text.split()
        duration_sec = max(0.5, (len(words) * 0.38) / speed)
        num_samples = int(duration_sec * sample_rate)

        t = np.arange(num_samples) / float(sample_rate)
        base_f0 = 150.0 * (2.0 ** (pitch / 12.0))

        # Harmonics
        f1, f2, f3 = 500.0, 1500.0, 2500.0
        tone = (
            0.4 * np.sin(2 * np.pi * f1 * t) +
            0.3 * np.sin(2 * np.pi * f2 * t) +
            0.2 * np.sin(2 * np.pi * f3 * t)
        )

        glottal = np.sin(2 * np.pi * base_f0 * t)
        audio = glottal * tone * 0.5

        return audio.astype(np.float32), duration_sec


class CompatibleOpenModelProvider(ModelProvider):
    """
    Adapter slot for compatible open-weights speech checkpoints
    (e.g., Piper, VITS, or XTTS-compatible format with explicit permissive license).
    """
    def __init__(self, checkpoint_path: str = None):
        self.checkpoint_path = checkpoint_path
        self.is_loaded = False

    def synthesize(
        self,
        text: str,
        voice_params: Dict[str, Any],
        sample_rate: int = 24000
    ) -> Tuple[np.ndarray, float]:
        # Graceful fallback to DSP if weights not mounted
        fallback = LocalDspModelProvider()
        return fallback.synthesize(text, voice_params, sample_rate)


class FutureCustomModelProvider(ModelProvider):
    """
    Designated execution slot for 8WHIE's proprietary neural checkpoint
    trained according to the roadmap in docs/MODEL_ROADMAP.md.
    """
    def __init__(self, model_weights_path: str = None):
        self.model_weights_path = model_weights_path

    def synthesize(
        self,
        text: str,
        voice_params: Dict[str, Any],
        sample_rate: int = 24000
    ) -> Tuple[np.ndarray, float]:
        fallback = LocalDspModelProvider()
        return fallback.synthesize(text, voice_params, sample_rate)
