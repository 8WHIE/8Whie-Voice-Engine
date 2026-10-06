"""
8WHIE VoiceForge - Configuration Module
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "8WHIE VoiceForge"
    BRAND_OWNER: str = "Aryan Thakur"
    ORGANIZATION: str = "8whie"
    VERSION: str = "2.4.0"

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    ENABLE_WATERMARKING: bool = True
    WATERMARK_FREQ_HZ: float = 19500.0

    MAX_AUDIO_UPLOAD_MB: int = 15
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60

    DEFAULT_SAMPLE_RATE: int = 24000
    SUPPORTED_LANGUAGES: List[str] = [
        "en", "hi", "hinglish", "bn", "mr", "ta", "te", "gu",
        "pa", "ur", "es", "fr", "de", "pt", "it", "ar", "ja", "ko"
    ]

    class Config:
        env_file = ".env"
        env_prefix = "VOICEFORGE_"


settings = Settings()
