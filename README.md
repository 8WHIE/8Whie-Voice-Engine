# 8WHIE VoiceForge

> **AI Speech • Voice Design • Multilingual Text-to-Speech (TTS)**  
> **Brand**: 8WHIE  
> **Founder & Owner**: Aryan Thakur  
> **GitHub Organization**: [8whie](https://github.com/8whie)  
> **Copyright**: © 2026 8WHIE / Aryan Thakur. All rights reserved.

---

## 1. Overview

**8WHIE VoiceForge** is an advanced, production-grade multilingual AI speech platform and acoustic voice design system built independently from first principles. It delivers high-fidelity speech synthesis across 18 languages, features an original micro-prosodic expressive conditioning parser, handles complex text normalization (such as Indian Rupee `₹1,499` expansion and brand phonetics), and enforces strict consent-gated voice cloning backed by inaudible high-frequency cryptographic audio watermarking.

This project was engineered specifically for the **8WHIE** technology ecosystem founded by **Aryan Thakur**. It is **not** a fork, clone, or derivative of OmniVoice, ElevenLabs, or any existing speech generation repository.

---

## 2. Key Features

- **Multilingual Support (18 Languages)**: English, Hindi, Hinglish, Bengali, Marathi, Tamil, Telugu, Gujarati, Punjabi, Urdu, Spanish, French, German, Portuguese, Italian, Arabic, Japanese, and Korean.
- **Micro-Prosodic Expressive Speech**: Original AST tag tokenizer supporting `[pause]`, `[pause:500ms]`, `[breath]`, `[laugh]`, `[whisper]`, `[excited]`, `[sad]`, `[angry]`, `[calm]`, and `[emphasis]...[/emphasis]`.
- **Acoustic Voice Designer**: Generate synthetic speaker personas from natural language descriptions (e.g. *"Young adult female, warm conversational voice, medium pitch, Indian English accent, calm delivery"*).
- **Consent-Gated Authorized Voice Cloning**: Multi-step legal ownership verification, anti-impersonation declarations, and SHA-256 cryptographic audit signatures for verified speakers.
- **Robust Text Normalization**: Automated spoken expansion for currencies (`₹1,499` → *"one thousand four hundred ninety-nine Indian rupees"*), cardinal/ordinal numbers, dates, URLs, abbreviations, and brand pronunciation (`8WHIE` → *"Eight-Why"*).
- **Interactive Pronunciation Laboratory**: User-customizable pronunciation dictionaries with IPA phonetic hints and category scopes.
- **Inaudible Audio Watermarking**: Embedded 19.5 kHz pilot carrier modulation identifying 8WHIE and Aryan Thakur as originators to prevent deepfake exploitation.
- **Dual Synthesis Engines**:
  - *8WHIE First-Principles DSP Formant Engine*: Instantaneous zero-latency CPU/GPU synthesis without heavy external models.
  - *Neural Adapter Architecture*: Pluggable interface for Google GenAI speech APIs and self-trained PyTorch checkpoints.
- **Real-Time Streaming**: Server-Sent Events (SSE) progressive chunked speech generation for ultra-low first-packet latency.
- **Futuristic AI Audio Workstation**: Sleek, responsive, developer-grade UI optimized for mobile, tablet, and desktop viewports.

---

## 3. Architecture

```
8WHIE VoiceForge
├── Frontend (React 19 + TypeScript + Tailwind CSS v4)
│   ├── Waveform Canvas Visualizer (HTML5 Canvas 60 FPS)
│   ├── Text-to-Speech Studio & Expressive Tag Bar
│   ├── AI Voice Designer & Consent Portal
│   ├── Pronunciation & Normalization Workbench
│   └── Safety & Cryptographic Watermark Inspector
│
├── Integration Layer (Express + TypeScript / Node.js)
│   ├── REST API Endpoints (/api/tts, /api/voices, /api/normalize)
│   ├── In-Memory Caching & Audit Records
│   ├── Google GenAI Neural Adapter (@google/genai)
│   └── Full-Stack Dev Server with Vite Middleware
│
└── Standalone Python Backend (/backend)
    ├── FastAPI REST Framework (uvicorn)
    ├── Text Normalization & Transliteration Pipeline
    ├── Expressive AST Speech Plan Generator
    ├── Model Provider Adapters (Local DSP, Compatible Open, Future Custom)
    └── Cryptographic Consent & Audio Watermark Modules
```

---

## 4. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Web Audio API |
| **Backend (Node)** | Express 4, TypeScript, tsx, @google/genai |
| **Backend (Python)** | FastAPI, Uvicorn, Pydantic v2, PyTorch, NumPy, SciPy |
| **Audio Processing** | 16-bit PCM RIFF/WAVE encoding, 19.5 kHz Pilot Tone Steganography |
| **Security & Safety** | SHA-256 Consent Hashing, Zero-Impersonation Audit Logging |

---

## 5. Quick Start & Installation

### Option A: Running the Full-Stack Web Application (Node / React / Express)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Add `GEMINI_API_KEY` for neural voice generation fallback. The system runs flawlessly offline using the built-in 8WHIE DSP Formant engine if no key is provided.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

### Option B: Running the Standalone Python / FastAPI Engine

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Create and Activate a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install Requirements**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch the FastAPI Server**:
   ```bash
   python main.py
   # Or using uvicorn directly:
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Interactive Swagger docs will be available at `http://localhost:8000/docs`.

5. **Run the Test Suite**:
   ```bash
   pytest
   ```

---

## 6. Docker Deployment

Deploy the Python backend in a containerized environment:

```bash
cd backend
docker-compose up --build -d
```

Check health:
```bash
curl http://localhost:8000/api/health
```

---

## 7. REST API Documentation

### 1. `POST /api/tts/generate`
Synthesizes speech from text with normalization and expressive tags.

**Request**:
```json
{
  "text": "Welcome to 8WHIE VoiceForge. Pro subscription is ₹1,499.",
  "voiceId": "8whie-aryan",
  "language": "en",
  "speed": 1.0,
  "pitch": 0.0,
  "volume": 1.0,
  "sampleRate": 24000,
  "outputFormat": "wav",
  "applyTextNormalization": true
}
```

**Response**:
```json
{
  "success": true,
  "id": "gen-1718000000-abcde",
  "audioBase64": "UklGRi...",
  "format": "wav",
  "sampleRate": 24000,
  "durationSeconds": 3.84,
  "textRaw": "Welcome to 8WHIE VoiceForge. Pro subscription is ₹1,499.",
  "textNormalized": "Welcome to Eight-Why VoiceForge. Pro subscription is 1499 Indian rupees.",
  "voiceId": "8whie-aryan",
  "voiceName": "Aryan Thakur (8WHIE Lead)",
  "modelProvider": "8whie_dsp_engine",
  "watermarkMetadata": {
    "platform": "8WHIE VoiceForge",
    "creator": "Aryan Thakur",
    "generationHash": "d41d8cd98f00b204e9800998ecf8427e",
    "hasWatermark": true
  }
}
```

### 2. `POST /api/voices/design`
Creates a synthetic speaker persona from natural language prompt.

**Request**:
```json
{
  "prompt": "Young adult female, warm conversational voice, Indian English accent, confident delivery.",
  "targetLanguage": "en"
}
```

### 3. `POST /api/voices/clone`
Registers an authorized voice clone with cryptographic consent verification.

**Request**:
```json
{
  "ownerName": "Aryan Thakur",
  "voiceName": "Aryan (Executive Briefing)",
  "declarationAccepted": true,
  "audioBase64": "...",
  "gender": "male",
  "language": "en"
}
```

### 4. `POST /api/normalize`
Inspects normalization transformations on currencies, numbers, and brand terms.

---

## 8. Third-Party Dependencies & Licensing Table

In strict accordance with open-source transparency, all third-party dependencies are documented below. 8WHIE makes no ownership claim over these third-party libraries:

| Package | Version | License | Origin / Owner | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `express` | ^4.21.2 | MIT | OpenJS Foundation | HTTP API server & route handling |
| `react` | ^19.0.1 | MIT | Meta Platforms, Inc. | User interface rendering |
| `react-dom` | ^19.0.1 | MIT | Meta Platforms, Inc. | DOM mounting & reconciliation |
| `vite` | ^8.3.0 | MIT | Yuxi (Evan) You & Vite Contributors | Build tooling & development server |
| `tailwindcss` | ^4.3.3 | MIT | Tailwind Labs, Inc. | Utility-first styling system |
| `lucide-react` | ^0.546.0 | ISC | Lucide Contributors | Interface iconography |
| `@google/genai` | ^2.4.0 | Apache-2.0 | Google LLC | Neural speech model adapter |
| `fastapi` | >=0.110.0 | MIT | Sebastián Ramírez | Python REST API framework |
| `numpy` | >=1.24.0 | BSD-3-Clause | NumPy Developers | Numerical array operations |
| `scipy` | >=1.11.0 | BSD-3-Clause | SciPy Developers | Signal processing & wave filter |
| `torch` | >=2.1.0 | Modified BSD | PyTorch Foundation | Neural network computation |

---

## 9. Safety, Ethics & Anti-Impersonation Charter

8WHIE VoiceForge enforces strict anti-abuse protections:

1. **Anti-Deepfake Covenant**: Users are prohibited from generating deceptive political speech, unconsented celebrity voices, or fraudulent phone calls.
2. **Explicit Consent Gateway**: Voice cloning requires checking legal ownership declarations and logs an immutable SHA-256 consent record.
3. **Audio Watermarking**: Every audio file embeds an inaudible high-frequency pilot watermark (19.5 kHz) verifiable in the application's Safety Center.

---

## 10. Proprietary Model Training Roadmap

To train a fully proprietary 8WHIE neural checkpoint:

1. **Curate Permissively Licensed Corpora**: Use public domain / CC-0 slices from LibriTTS-R, Common Voice, and IndicSpeech with explicit redistribution rights.
2. **Tokenization**: Run 8WHIE's Devanagari and Latin phonemizers to extract IPA representation.
3. **Acoustic Backbone**: Train a conditional flow-matching transformer predicting 80-band Mel spectrograms.
4. **Vocoder**: Train an adversarial multi-period vocoder (e.g. BigVGAN derivative) on 48 kHz uncompressed audio.
5. **Mount Checkpoint**: Place weights into `backend/models/8whie_v1.pt` and activate via `FutureCustomModelProvider`.

---

## 11. Project Ownership & Attribution

- **Brand**: 8WHIE
- **Founder & Owner**: Aryan Thakur
- **Organization**: `8whie`
- **Copyright**: Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
- **Originality Notice**: Designed and built independently from first principles. No code was copied or adapted from OmniVoice or existing speech platforms.
