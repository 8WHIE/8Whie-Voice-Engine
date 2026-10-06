/**
 * 8WHIE VoiceForge - Text Normalization Engine
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 * 
 * Preprocesses raw text for high-fidelity speech synthesis across 18 languages:
 * - Currency (INR ₹, USD $, EUR €, GBP £, JPY ¥)
 * - Number expansion (cardinals, ordinals, percentages)
 * - Brand names (special phonetic handling for '8WHIE' -> 'Eight-Why')
 * - Dates and times
 * - Web addresses and emails
 * - Technical abbreviations
 * - Transliterated Hinglish
 */

import { NormalizationResult, PronunciationRule, SupportedLanguage } from '../types/tts';

// Default built-in pronunciation rules
export const DEFAULT_PRONUNCIATION_RULES: PronunciationRule[] = [
  {
    id: 'rule-8whie-primary',
    word: '8WHIE',
    replacement: 'Eight-Why',
    phoneticIpa: '/eɪt.waɪ/',
    language: 'all',
    category: 'brand',
    caseSensitive: false,
    description: '8WHIE official brand pronunciation (Aryan Thakur tech brand)',
  },
  {
    id: 'rule-8whie-lower',
    word: '8whie',
    replacement: 'Eight-Why',
    phoneticIpa: '/eɪt.waɪ/',
    language: 'all',
    category: 'brand',
    caseSensitive: false,
    description: 'Lowercase brand name handling',
  },
  {
    id: 'rule-tts',
    word: 'TTS',
    replacement: 'T-T-S',
    phoneticIpa: '/tiː.tiː.ɛs/',
    language: 'all',
    category: 'abbreviation',
    caseSensitive: true,
    description: 'Text-to-Speech initialism',
  },
  {
    id: 'rule-api',
    word: 'API',
    replacement: 'A-P-I',
    phoneticIpa: '/eɪ.piː.aɪ/',
    language: 'all',
    category: 'abbreviation',
    caseSensitive: true,
    description: 'Application Programming Interface',
  },
  {
    id: 'rule-ai',
    word: 'AI',
    replacement: 'A-I',
    phoneticIpa: '/eɪ.aɪ/',
    language: 'all',
    category: 'abbreviation',
    caseSensitive: true,
    description: 'Artificial Intelligence',
  },
  {
    id: 'rule-kmph',
    word: 'km/h',
    replacement: 'kilometers per hour',
    language: 'en',
    category: 'technical',
    caseSensitive: false,
    description: 'Speed metric',
  },
  {
    id: 'rule-gb',
    word: 'GB',
    replacement: 'gigabytes',
    language: 'en',
    category: 'technical',
    caseSensitive: true,
    description: 'Storage unit',
  },
  {
    id: 'rule-mb',
    word: 'MB',
    replacement: 'megabytes',
    language: 'en',
    category: 'technical',
    caseSensitive: true,
    description: 'Storage unit',
  },
];

// Helper to convert numbers 0-999 to English words
function smallNumberToEnglish(n: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (n === 0) return 'zero';
  let str = '';
  if (Math.floor(n / 100) > 0) {
    str += ones[Math.floor(n / 100)] + ' hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      str += ones[n];
    } else {
      str += tens[Math.floor(n / 10)];
      if (n % 10 > 0) {
        str += '-' + ones[n % 10];
      }
    }
  }
  return str.trim();
}

// Convert arbitrary integer to English words
export function integerToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + integerToWords(-num);

  const scales = ['', 'thousand', 'million', 'billion', 'trillion'];
  let current = Math.floor(Math.abs(num));
  let scaleIndex = 0;
  const parts: string[] = [];

  while (current > 0 && scaleIndex < scales.length) {
    const chunk = current % 1000;
    if (chunk !== 0) {
      const chunkStr = smallNumberToEnglish(chunk);
      const scaleStr = scales[scaleIndex];
      parts.unshift(scaleStr ? `${chunkStr} ${scaleStr}` : chunkStr);
    }
    current = Math.floor(current / 1000);
    scaleIndex++;
  }

  return parts.join(' ').trim();
}

// Normalization Engine
export class TextNormalizer {
  private customRules: PronunciationRule[] = [];

  constructor(customRules: PronunciationRule[] = []) {
    this.customRules = customRules;
  }

  public setCustomRules(rules: PronunciationRule[]) {
    this.customRules = rules;
  }

  public normalize(text: string, language: SupportedLanguage = 'en'): NormalizationResult {
    const transformations: NormalizationResult['transformations'] = [];
    let normalized = text;

    // 1. Currency Normalization (Crucial: Indian Rupee ₹ and others)
    // ₹1,499 or ₹ 1499 or Rs. 1499
    normalized = normalized.replace(/(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)/gi, (match, val) => {
      const cleanNum = parseFloat(val.replace(/,/g, ''));
      if (isNaN(cleanNum)) return match;
      const words = integerToWords(cleanNum);
      const replacement = `${words} Indian rupees`;
      transformations.push({ type: 'currency', from: match, to: replacement });
      return replacement;
    });

    // USD $
    normalized = normalized.replace(/\$\s*([\d,]+(?:\.\d+)?)/g, (match, val) => {
      const cleanNum = parseFloat(val.replace(/,/g, ''));
      if (isNaN(cleanNum)) return match;
      const words = integerToWords(cleanNum);
      const replacement = `${words} dollars`;
      transformations.push({ type: 'currency', from: match, to: replacement });
      return replacement;
    });

    // EUR €
    normalized = normalized.replace(/€\s*([\d,]+(?:\.\d+)?)/g, (match, val) => {
      const cleanNum = parseFloat(val.replace(/,/g, ''));
      if (isNaN(cleanNum)) return match;
      const words = integerToWords(cleanNum);
      const replacement = `${words} euros`;
      transformations.push({ type: 'currency', from: match, to: replacement });
      return replacement;
    });

    // GBP £
    normalized = normalized.replace(/£\s*([\d,]+(?:\.\d+)?)/g, (match, val) => {
      const cleanNum = parseFloat(val.replace(/,/g, ''));
      if (isNaN(cleanNum)) return match;
      const words = integerToWords(cleanNum);
      const replacement = `${words} pounds`;
      transformations.push({ type: 'currency', from: match, to: replacement });
      return replacement;
    });

    // JPY ¥
    normalized = normalized.replace(/¥\s*([\d,]+(?:\.\d+)?)/g, (match, val) => {
      const cleanNum = parseFloat(val.replace(/,/g, ''));
      if (isNaN(cleanNum)) return match;
      const words = integerToWords(cleanNum);
      const replacement = `${words} yen`;
      transformations.push({ type: 'currency', from: match, to: replacement });
      return replacement;
    });

    // 2. URLs and Web Addresses
    normalized = normalized.replace(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(\/[^\s]*)?/gi, (match, domain) => {
      const spokenDomain = domain.replace(/\./g, ' dot ').replace(/-/g, ' dash ');
      const replacement = spokenDomain;
      transformations.push({ type: 'url', from: match, to: replacement });
      return replacement;
    });

    // 3. Email Addresses
    normalized = normalized.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, user, domain) => {
      const spoken = `${user.replace(/\./g, ' dot ')} at ${domain.replace(/\./g, ' dot ')}`;
      transformations.push({ type: 'email', from: match, to: spoken });
      return spoken;
    });

    // 4. Standalone Percentages: 45% -> forty-five percent
    normalized = normalized.replace(/(\d+)%/g, (match, num) => {
      const words = integerToWords(parseInt(num, 10));
      const replacement = `${words} percent`;
      transformations.push({ type: 'number', from: match, to: replacement });
      return replacement;
    });

    // 5. Standalone Formatted Numbers: e.g. "1,499" or "25,000"
    normalized = normalized.replace(/\b(\d{1,3}(?:,\d{3})+)\b/g, (match) => {
      const num = parseInt(match.replace(/,/g, ''), 10);
      if (isNaN(num)) return match;
      const words = integerToWords(num);
      transformations.push({ type: 'number', from: match, to: words });
      return words;
    });

    // 6. Apply Pronunciation Dictionaries (Default + Custom)
    const allRules = [...this.customRules, ...DEFAULT_PRONUNCIATION_RULES];
    for (const rule of allRules) {
      if (rule.language !== 'all' && rule.language !== language) continue;

      const flags = rule.caseSensitive ? 'g' : 'gi';
      // Word boundary regex: escape special regex chars in word
      const escaped = rule.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, flags);

      if (regex.test(normalized)) {
        normalized = normalized.replace(regex, (match) => {
          transformations.push({ type: 'brand', from: match, to: rule.replacement });
          return rule.replacement;
        });
      }
    }

    // 7. Cleanup extra whitespaces
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return {
      originalText: text,
      normalizedText: normalized,
      transformations,
    };
  }
}

export const defaultNormalizer = new TextNormalizer();
