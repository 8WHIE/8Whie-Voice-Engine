# 8WHIE VoiceForge - REST API Specification

> **Brand**: 8WHIE  
> **Founder & Owner**: Aryan Thakur  
> **Copyright**: © 2026 8WHIE / Aryan Thakur. All rights reserved.

---

## Base URLs
- Full-Stack Node Dev: `http://localhost:3000`
- Standalone Python Engine: `http://localhost:8000`

---

## Endpoints

### 1. Health & Diagnostics
- **GET `/api/health`**
- Returns server state, active speech providers, and watermark engine status.

### 2. Text-to-Speech Synthesis
- **POST `/api/tts/generate`**
- Body:
  ```json
  {
    "text": "String with optional expressive tags like [whisper] and currency ₹1,499",
    "voiceId": "8whie-aryan",
    "language": "en",
    "speed": 1.0,
    "pitch": 0.0,
    "volume": 1.0,
    "expressiveIntensity": 0.85,
    "sampleRate": 24000,
    "outputFormat": "wav",
    "applyTextNormalization": true
  }
  ```
- Returns 16-bit PCM Base64 audio, metadata, and watermark signature.

### 3. Progressive Audio Streaming
- **POST `/api/tts/stream`**
- Server-Sent Events (SSE) returning chunked sentence audio.

### 4. Natural Language Voice Designer
- **POST `/api/voices/design`**
- Body:
  ```json
  {
    "prompt": "Description of desired speaker timbre, accent, age, style",
    "sampleText": "Preview sentence",
    "targetLanguage": "en"
  }
  ```

### 5. Consent-Gated Voice Cloning
- **POST `/api/voices/clone`**
- Enforces declaration checkbox, owner legal name, and reference audio sample. Returns SHA-256 consent signature.

### 6. Text Normalization Testbed
- **POST `/api/normalize`**
- Analyzes currency, date, and brand expansions without synthesizing audio.
