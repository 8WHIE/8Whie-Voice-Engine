#!/usr/bin/env bash
# 8WHIE VoiceForge - Backend Startup Script
# Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.

set -e

echo "=========================================================="
echo " Starting 8WHIE VoiceForge Speech Platform (Python Engine)"
echo " Brand: 8WHIE | Owner: Aryan Thakur | Org: 8whie"
echo "=========================================================="

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
