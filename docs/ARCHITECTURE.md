# 8WHIE VoiceForge - Architecture Specification

> **Brand**: 8WHIE  
> **Founder & Owner**: Aryan Thakur  
> **Copyright**: © 2026 8WHIE / Aryan Thakur. All rights reserved.

---

## 1. System Design Overview

8WHIE VoiceForge is architected around a decoupled, provider-agnostic acoustic pipeline. The system cleanly separates:
1. **Frontend Presentation**: Responsive React 19 UI with real-time Web Audio API analysis and HTML5 Canvas waveform rendering.
2. **Text Normalization & Transliteration Layer**: Deterministic rule-based expansion for multi-currency symbols (e.g. `₹` INR, `$`, `€`), numbers, abbreviations, and brand phonetics (`8WHIE` → `Eight-Why`).
3. **Expressive Conditioning AST**: Tokenizer parsing semantic tags (`[pause]`, `[whisper]`, `[breath]`, `[excited]`, `[sad]`, `[emphasis]`) into acoustic delta vectors.
4. **Synthesis Engine Core**:
   - **8WHIE DSP Formant Synthesizer**: First-principles physical model with glottal flow pulses and resonant vocal tract filter banks.
   - **Model Provider Adapter**: Dynamic interface supporting Google GenAI TTS and future proprietary 8WHIE neural checkpoints.
5. **Safety & Watermarking Subsystem**: Cryptographic SHA-256 consent registration and inaudible 19.5 kHz pilot tone injection.

---

## 2. Audio Processing Pipeline

```
Raw Text Input
      │
      ▼
Text Normalizer (Currency ₹1,499, Numbers, URLs, 8WHIE brand)
      │
      ▼
Expressive Tag AST Parser ([whisper], [pause], [breath])
      │
      ▼
Acoustic Parameter Merger (Pitch, Speed, Formants, Warmth)
      │
      ▼
Synthesis Execution Engine (8WHIE DSP / Neural Provider)
      │
      ▼
Inaudible Watermarking Encoder (19.5 kHz Phase Pilot)
      │
      ▼
RIFF/WAVE 16-bit PCM Byte Stream (WAV / MP3)
      │
      ▼
Waveform Canvas Visualizer & Audio Player
```

---

## 3. Data Integrity & Security
- Raw audio reference uploads for cloning are hashed in volatile memory and never persisted as raw files without cryptographic consent records.
- All generated audio contains an imperceptible spectral signature for origin attribution and anti-deepfake forensics.
