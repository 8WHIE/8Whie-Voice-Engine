"""
8WHIE VoiceForge - Expressive AST Parser (Python)
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

import re
from typing import List, Dict, Any


class ExpressiveParser:
    TAG_REGEX = re.compile(
        r"\[(\/?)(pause(?::\d+m?s)?|breath|laugh|whisper|excited|sad|angry|calm|emphasis)\]",
        re.IGNORECASE
    )

    def parse(self, text: str) -> Dict[str, Any]:
        detected_tags = []
        chunks = []
        last_idx = 0

        for match in self.TAG_REGEX.finditer(text):
            start = match.start()
            if start > last_idx:
                segment = text[last_idx:start].strip()
                if segment:
                    chunks.append({"type": "text", "content": segment})

            tag_full = match.group(0).lower()
            tag_name = match.group(2).lower()
            is_closing = bool(match.group(1))

            detected_tags.append(tag_full)

            if not is_closing:
                if tag_name.startswith("pause"):
                    duration = 400
                    if ":" in tag_name:
                        num = re.findall(r"\d+", tag_name)
                        if num:
                            duration = int(num[0])
                    chunks.append({"type": "pause", "duration_ms": duration})
                elif tag_name in ["breath", "laugh"]:
                    chunks.append({"type": tag_name, "duration_ms": 400 if tag_name == "breath" else 600})
                else:
                    chunks.append({"type": "modifier_open", "modifier": tag_name})
            else:
                chunks.append({"type": "modifier_close", "modifier": tag_name})

            last_idx = match.end()

        if last_idx < len(text):
            trailing = text[last_idx:].strip()
            if trailing:
                chunks.append({"type": "text", "content": trailing})

        clean_text = self.TAG_REGEX.sub("", text).strip()
        clean_text = re.sub(r"\s+", " ", clean_text)

        return {
            "original_text": text,
            "clean_text": clean_text,
            "chunks": chunks,
            "detected_tags": detected_tags,
        }
