"""
8WHIE VoiceForge - Text Normalization Engine (Python)
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

import re
from typing import Dict, List, Tuple


class TextNormalizer:
    def __init__(self):
        self.brand_rules = {
            r"\b8WHIE\b": "Eight-Why",
            r"\b8whie\b": "Eight-Why",
            r"\bTTS\b": "T-T-S",
            r"\bAPI\b": "A-P-I",
            r"\bAI\b": "A-I",
            r"\bCEO\b": "C-E-O",
            r"\bkm/h\b": "kilometers per hour",
        }

    def normalize(self, text: str, language: str = "en") -> Tuple[str, List[Dict[str, str]]]:
        transformations = []
        normalized = text

        # 1. Indian Rupee (₹1,499)
        def replace_inr(match):
            val = match.group(1).replace(",", "")
            rep = f"{val} Indian rupees"
            transformations.append({"type": "currency", "from": match.group(0), "to": rep})
            return rep

        normalized = re.sub(r"(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)", replace_inr, normalized)

        # 2. US Dollar ($)
        def replace_usd(match):
            val = match.group(1).replace(",", "")
            rep = f"{val} dollars"
            transformations.append({"type": "currency", "from": match.group(0), "to": rep})
            return rep

        normalized = re.sub(r"\$\s*([\d,]+(?:\.\d+)?)", replace_usd, normalized)

        # 3. Brand Name & Acronym Pronunciation
        for pattern, replacement in self.brand_rules.items():
            if re.search(pattern, normalized):
                def replace_brand(m):
                    transformations.append({"type": "brand", "from": m.group(0), "to": replacement})
                    return replacement
                normalized = re.sub(pattern, replace_brand, normalized)

        # 4. URLs
        def replace_url(match):
            domain = match.group(1).replace(".", " dot ").replace("-", " dash ")
            transformations.append({"type": "url", "from": match.group(0), "to": domain})
            return domain

        normalized = re.sub(r"(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)", replace_url, normalized)

        # 5. Clean extra spaces
        normalized = re.sub(r"\s+", " ", normalized).strip()

        return normalized, transformations
