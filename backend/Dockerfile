# 8WHIE VoiceForge - Production Backend Dockerfile
# Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

EXPOSE 8000

ENV PYTHONUNBUFFERED=1
ENV VOICEFORGE_HOST=0.0.0.0
ENV VOICEFORGE_PORT=8000

CMD ["python", "main.py"]
