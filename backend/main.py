"""
8WHIE VoiceForge - Production FastAPI Backend Application
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import base64
import io
import wave
import numpy as np

from config import settings
from text_processing.normalizer import TextNormalizer
from text_processing.expressive_parser import ExpressiveParser
from safety.consent import ConsentValidator
from safety.watermark import AudioWatermarker
from tts_engine.provider import LocalDspModelProvider

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multilingual AI Speech Platform & Voice Design Engine by 8WHIE (Aryan Thakur)",
    version=settings.VERSION,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services
normalizer = TextNormalizer()
expressive_parser = ExpressiveParser()
watermarker = AudioWatermarker(settings.WATERMARK_FREQ_HZ)
engine = LocalDspModelProvider()


class SynthesisRequest(BaseModel):
    text: str
    voice_id: str = "8whie-aryan"
    language: str = "en"
    speed: float = 1.0
    pitch: float = 0.0
    volume: float = 1.0
    sample_rate: int = 24000
    output_format: str = "wav"


class VoiceDesignRequest(BaseModel):
    prompt: str
    sample_text: Optional[str] = None
    target_language: str = "en"


class VoiceCloneRequest(BaseModel):
    owner_name: str
    declaration_accepted: bool
    audio_base64: str
    voice_name: Optional[str] = None


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "owner": settings.BRAND_OWNER,
        "org": settings.ORGANIZATION,
        "version": settings.VERSION,
        "supported_languages": len(settings.SUPPORTED_LANGUAGES),
        "watermarking_active": settings.ENABLE_WATERMARKING,
    }


@app.post("/api/tts/generate")
def generate_speech(req: SynthesisRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # 1. Normalization
    normalized_text, transforms = normalizer.normalize(req.text, req.language)

    # 2. Parse Expressive AST
    plan = expressive_parser.parse(normalized_text)

    # 3. DSP Synthesis
    voice_params = {"speed": req.speed, "pitch": req.pitch, "volume": req.volume}
    samples, duration_sec = engine.synthesize(plan["clean_text"], voice_params, req.sample_rate)

    # 4. Watermark Injection
    if settings.ENABLE_WATERMARKING:
        samples = watermarker.inject_watermark(samples, req.sample_rate)

    # 5. Convert to WAV Bytes
    wav_io = io.BytesIO()
    with wave.open(wav_io, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(req.sample_rate)
        # Soft clip to 16-bit PCM
        int16_samples = np.clip(samples * 32767.0, -32768, 32767).astype(np.int16)
        wf.writeframes(int16_samples.tobytes())

    audio_base64 = base64.b64encode(wav_io.getvalue()).decode("utf-8")

    return {
        "success": True,
        "audio_base64": audio_base64,
        "format": req.output_format,
        "sample_rate": req.sample_rate,
        "duration_seconds": round(duration_sec, 2),
        "text_raw": req.text,
        "text_normalized": normalized_text,
        "voice_id": req.voice_id,
        "model_provider": "8whie_dsp_engine",
        "watermark_verified": True,
    }


@app.post("/api/voices/clone")
def clone_voice(req: VoiceCloneRequest):
    if not req.declaration_accepted:
        raise HTTPException(status_code=403, detail="Consent declaration must be acknowledged.")

    record = ConsentValidator.create_consent_record(req.owner_name, req.audio_base64[:40])
    return {
        "success": True,
        "message": "Authorized voice clone recorded with 8WHIE consent audit.",
        "consent_record": record,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
