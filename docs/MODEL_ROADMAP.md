# 8WHIE VoiceForge - Custom Neural Model Training Roadmap

> **Brand**: 8WHIE  
> **Founder & Owner**: Aryan Thakur  
> **Copyright**: © 2026 8WHIE / Aryan Thakur. All rights reserved.

---

## 1. Objective
Establish an independent, ethically trained neural speech synthesis checkpoint owned by 8WHIE without relying on closed APIs or copying code/weights from existing projects.

---

## 2. Training Phases

### Phase 1: Dataset Preparation & Licensing
- Select strictly permissive datasets (CC-0, Public Domain, or MIT-compatible speech corpora).
- Recommended sources:
  - LibriTTS-R (Clean English subset)
  - Common Voice (CC-0 vetted slices)
  - IndicTTS / OpenSLR Indic corpora (Hindi, Tamil, Bengali with open licensing)
- Audio preprocessing:
  - Downsampling to 24 kHz or 48 kHz uncompressed PCM.
  - Spectral denoising and loudness normalization (-23 LUFS).
  - Removing audio segments with SNR < 30 dB.

### Phase 2: Phoneme & Token Processing
- Apply 8WHIE TextNormalizer to clean numbers, currency signs, and acronyms.
- Convert Devanagari and Latin text into unified International Phonetic Alphabet (IPA) tokens.
- Add emotion conditioning tokens corresponding to 8WHIE's expressive tags (`[whisper]`, `[breath]`, `[excited]`).

### Phase 3: Acoustic Modeling
- Model architecture: Conditional Flow Matching or Diffusion Transformer with Rotary Position Embeddings (RoPE).
- Inputs: Phoneme token sequences + Speaker Latent Embedding (32-dim).
- Targets: 80-band Mel-spectrograms.
- Optimization: AdamW with Cosine Annealing learning rate schedule.

### Phase 4: High-Fidelity Vocoder
- Multi-period adversarial vocoder (BigVGAN or HiFi-GAN derivative).
- Produces crisp 16-bit 48 kHz waveform audio.

### Phase 5: Checkpoint Packaging & Integration
- Export checkpoint to ONNX / TorchScript format.
- Mount checkpoint inside `backend/models/8whie_v1.pt`.
- Activate via `FutureCustomModelProvider` in `backend/tts_engine/provider.py`.
