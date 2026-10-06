/**
 * 8WHIE VoiceForge - Type Definitions
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

export type SupportedLanguage =
  | 'en' // English
  | 'hi' // Hindi
  | 'hinglish' // Hinglish
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'ur' // Urdu
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'pt' // Portuguese
  | 'it' // Italian
  | 'ar' // Arabic
  | 'ja' // Japanese
  | 'ko'; // Korean

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  family: string;
  script: string;
  sampleText: string;
  phonemeSupport: boolean;
}

export type GenderPresentation = 'male' | 'female' | 'neutral';

export type SpeakingStyle =
  | 'conversational'
  | 'news_broadcast'
  | 'narrative'
  | 'enthusiastic'
  | 'whisper_calm'
  | 'technical_tutorial'
  | 'dramatic'
  | 'empathetic';

export interface AcousticParameters {
  speed: number; // 0.5 to 2.0 (1.0 = normal)
  pitch: number; // -12 to +12 semitones (0 = normal)
  volume: number; // 0.0 to 1.0 (1.0 = 100%)
  expressiveIntensity: number; // 0.0 to 1.0
  formantShift: number; // -1.0 to +1.0
  breathiness: number; // 0.0 to 1.0
  roughness: number; // 0.0 to 1.0
  timbreWarmth: number; // 0.0 to 1.0
  vibratoRate: number; // Hz (e.g. 5.5)
  vibratoDepth: number; // semitones (0 to 1.5)
  pauseMultiplier: number; // 0.5 to 2.0
}

export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  gender: GenderPresentation;
  language: SupportedLanguage;
  accent: string;
  age: 'young_adult' | 'adult' | 'senior' | 'child';
  style: SpeakingStyle;
  isCustom: boolean;
  isCloned?: boolean;
  acousticParams: AcousticParameters;
  embeddingVector?: number[]; // Synthetic latent vector (32-dim)
  createdAt: string;
  updatedAt: string;
  creator: string; // e.g. "8WHIE Official" or user
  avatarUrl?: string;
  consentRecord?: VoiceConsentRecord;
}

export interface VoiceConsentRecord {
  consentId: string;
  ownerName: string;
  declarationText: string;
  ownershipConfirmed: boolean;
  abuseAcknowledged: boolean;
  timestamp: string;
  ipHash?: string;
  referenceAudioDurationSec?: number;
  cryptographicSignature: string;
}

export interface TtsGenerationRequest {
  text: string;
  voiceId: string;
  language?: SupportedLanguage;
  speed?: number;
  pitch?: number;
  volume?: number;
  style?: SpeakingStyle;
  expressiveIntensity?: number;
  outputFormat?: 'wav' | 'mp3';
  sampleRate?: 24000 | 44100 | 48000;
  enableStreaming?: boolean;
  applyPronunciationDictionary?: boolean;
  applyTextNormalization?: boolean;
  clientMetadata?: Record<string, string>;
}

export interface TtsGenerationResponse {
  id: string;
  audioBase64: string;
  audioUrl?: string;
  format: 'wav' | 'mp3';
  sampleRate: number;
  durationSeconds: number;
  textRaw: string;
  textNormalized: string;
  voiceId: string;
  voiceName: string;
  language: SupportedLanguage;
  generatedAt: string;
  processingTimeMs: number;
  modelProvider: '8whie_gemini_engine' | '8whie_dsp_engine' | '8whie_custom_model';
  watermarkMetadata: {
    platform: '8WHIE VoiceForge';
    creator: 'Aryan Thakur';
    generationHash: string;
    hasWatermark: boolean;
  };
  expressiveTagsDetected: string[];
}

export interface PronunciationRule {
  id: string;
  word: string;
  replacement: string;
  phoneticIpa?: string;
  language: SupportedLanguage | 'all';
  category: 'brand' | 'technical' | 'transliteration' | 'abbreviation' | 'custom';
  caseSensitive: boolean;
  description?: string;
}

export interface NormalizationResult {
  originalText: string;
  normalizedText: string;
  transformations: Array<{
    type: 'currency' | 'number' | 'date' | 'url' | 'email' | 'abbreviation' | 'brand' | 'phonetic';
    from: string;
    to: string;
  }>;
}

export interface VoiceDesignPromptRequest {
  prompt: string; // e.g., "Young adult female, warm conversational voice, medium pitch, Indian English accent, calm and confident delivery."
  sampleText?: string;
  targetLanguage?: SupportedLanguage;
}

export interface VoiceDesignResult {
  profile: VoiceProfile;
  interpretation: {
    perceivedGender: GenderPresentation;
    perceivedAge: string;
    accent: string;
    detectedTone: string;
    recommendedStyle: SpeakingStyle;
  };
  audioPreviewBase64: string;
}

export interface HistoryItem extends TtsGenerationResponse {
  isFavorite?: boolean;
}
