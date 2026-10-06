"""
8WHIE VoiceForge - Normalizer Tests
Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
"""

from text_processing.normalizer import TextNormalizer


def test_inr_currency_normalization():
    normalizer = TextNormalizer()
    text = "The course costs ₹1,499 today."
    normalized, transforms = normalizer.normalize(text)
    assert "1499 Indian rupees" in normalized
    assert len(transforms) > 0


def test_brand_8whie_pronunciation():
    normalizer = TextNormalizer()
    text = "8WHIE is a cybersecurity channel."
    normalized, transforms = normalizer.normalize(text)
    assert "Eight-Why" in normalized


def test_url_normalization():
    normalizer = TextNormalizer()
    text = "Visit https://8whie.org for details."
    normalized, transforms = normalizer.normalize(text)
    assert "8whie dot org" in normalized
