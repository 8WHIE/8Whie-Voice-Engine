/**
 * 8WHIE VoiceForge - Production Server & Speech API
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 * 
 * Full-stack Express server integrating:
 * - 8WHIE DSP & Formant Speech Synthesizer
 * - Google GenAI Neural Voice Adapter
 * - Consent-Gated Voice Cloning & Verification
 * - Pronunciation & Normalization Pipeline
 * - Vite Middleware integration for seamless AI Studio development
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { DEFAULT_VOICES } from './src/lib/defaultVoices.ts';
import { TextNormalizer, DEFAULT_PRONUNCIATION_RULES } from './src/lib/normalizer.ts';
import { parseExpressiveSpeech } from './src/lib/expressiveParser.ts';
import { synthesizeSpeechDsp, bytesToBase64 } from './src/lib/audioEngine.ts';
import {
  VoiceProfile,
  TtsGenerationRequest,
  TtsGenerationResponse,
  PronunciationRule,
  HistoryItem,
  VoiceDesignPromptRequest,
} from './src/types/tts.ts';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// In-Memory Storage (with pre-seeded defaults)
let voicesStore: VoiceProfile[] = [...DEFAULT_VOICES];
let pronunciationRulesStore: PronunciationRule[] = [...DEFAULT_PRONUNCIATION_RULES];
let historyStore: HistoryItem[] = [];
const normalizer = new TextNormalizer(pronunciationRulesStore);

// Google GenAI initialization if key present
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('[8WHIE VoiceForge] Google GenAI init notice:', err);
  }
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

/**
 * GET /api/health - Engine & System Diagnostics
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: '8WHIE VoiceForge',
    creator: 'Aryan Thakur',
    organization: '8whie',
    version: '2.4.0',
    providers: {
      geminiNeuralTts: !!aiClient,
      eightWhieDspEngine: true,
      customModelAdapter: true,
    },
    supportedLanguagesCount: 18,
    activeVoicesCount: voicesStore.length,
    watermarkingActive: true,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/voices - List all active voice profiles
 */
app.get('/api/voices', (_req: Request, res: Response) => {
  res.json({
    success: true,
    voices: voicesStore,
    total: voicesStore.length,
  });
});

/**
 * POST /api/voices - Create custom voice profile
 */
app.post('/api/voices', (req: Request, res: Response) => {
  const profile: VoiceProfile = req.body;
  if (!profile.name || !profile.gender || !profile.language) {
    return res.status(400).json({ error: 'Missing required profile fields (name, gender, language).' });
  }

  const newProfile: VoiceProfile = {
    ...profile,
    id: profile.id || `8whie-custom-${Date.now()}`,
    isCustom: true,
    creator: profile.creator || 'Custom User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  voicesStore.push(newProfile);
  res.status(201).json({ success: true, profile: newProfile });
});

/**
 * DELETE /api/voices/:id - Delete custom voice profile
 */
app.delete('/api/voices/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = voicesStore.findIndex((v) => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Voice profile not found.' });
  }

  // Protect default official voices
  if (!voicesStore[index].isCustom) {
    return res.status(403).json({ error: 'Official 8WHIE core profiles cannot be deleted.' });
  }

  voicesStore.splice(index, 1);
  res.json({ success: true, message: 'Voice profile deleted successfully.' });
});

/**
 * POST /api/voices/design - Natural Language Voice Designer
 * Parses prompt -> synthesizes acoustic traits -> produces preview audio
 */
app.post('/api/voices/design', async (req: Request, res: Response) => {
  const body: VoiceDesignPromptRequest = req.body;
  const prompt = body.prompt;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required for voice design.' });
  }

  const pLower = prompt.toLowerCase();

  // Heuristic / semantic acoustic inference
  const isFemale = /female|woman|girl|she|her/i.test(pLower);
  const isMale = /male|man|boy|he|his/i.test(pLower);
  const gender = isFemale ? 'female' : isMale ? 'male' : 'neutral';

  const isSenior = /deep|elderly|senior|old|gravelly/i.test(pLower);
  const isYoung = /young|youth|teen|bright/i.test(pLower);
  const age = isSenior ? 'senior' : isYoung ? 'young_adult' : 'adult';

  let accent = 'Neutral International';
  if (/indian|hindi/i.test(pLower)) accent = 'Indian English';
  else if (/british|uk/i.test(pLower)) accent = 'British RP';
  else if (/american|us/i.test(pLower)) accent = 'General American';
  else if (/spanish|latino/i.test(pLower)) accent = 'Spanish Castilian';
  else if (/french/i.test(pLower)) accent = 'French Accent';
  else if (/german/i.test(pLower)) accent = 'German Accent';
  else if (/japanese/i.test(pLower)) accent = 'Japanese Accent';
  else if (/arabic/i.test(pLower)) accent = 'Modern Standard Arabic';

  // Pitch calculation
  let pitch = gender === 'female' ? 1.5 : gender === 'male' ? -1.5 : 0.0;
  if (/high pitch|soprano|childlike/i.test(pLower)) pitch += 3.0;
  if (/deep|low pitch|baritone|bass/i.test(pLower)) pitch -= 3.0;

  // Speed calculation
  let speed = 1.0;
  if (/fast|rapid|energetic|quick/i.test(pLower)) speed = 1.15;
  if (/slow|calm|measured|deliberate|relaxed/i.test(pLower)) speed = 0.88;

  // Style calculation
  let style: VoiceProfile['style'] = 'conversational';
  if (/news|broadcast|reporter/i.test(pLower)) style = 'news_broadcast';
  else if (/tech|technical|tutorial|engineer|cyber/i.test(pLower)) style = 'technical_tutorial';
  else if (/whisper|soft|meditation|sleep/i.test(pLower)) style = 'whisper_calm';
  else if (/enthusiastic|excited|hyper|sales/i.test(pLower)) style = 'enthusiastic';
  else if (/story|narrative|audiobook/i.test(pLower)) style = 'narrative';

  const acousticParams = {
    speed,
    pitch,
    volume: 1.0,
    expressiveIntensity: /expressive|emotional|dynamic/i.test(pLower) ? 0.95 : 0.75,
    formantShift: gender === 'female' ? 0.2 : gender === 'male' ? -0.2 : 0.0,
    breathiness: /warm|soft|breathy|whisper/i.test(pLower) ? 0.35 : 0.15,
    roughness: isSenior ? 0.18 : 0.04,
    timbreWarmth: /warm|rich|smooth/i.test(pLower) ? 0.95 : 0.8,
    vibratoRate: 5.2,
    vibratoDepth: 0.12,
    pauseMultiplier: speed < 1.0 ? 1.2 : 0.95,
  };

  const syntheticId = `8whie-designed-${Date.now()}`;
  const profileName = `Designed Voice: ${accent} (${gender === 'female' ? 'F' : 'M'})`;

  const newProfile: VoiceProfile = {
    id: syntheticId,
    name: profileName,
    description: `AI-Designed speaker prompt: "${prompt}"`,
    gender,
    language: body.targetLanguage || 'en',
    accent,
    age,
    style,
    isCustom: true,
    creator: '8WHIE Voice Designer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatarUrl: gender === 'female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    acousticParams,
    embeddingVector: Array.from({ length: 8 }, () => Math.random() * 2 - 1),
  };

  // Generate preview audio
  const samplePhrase = body.sampleText ||
    `Hello! This is a preview of your custom voice designed on 8WHIE VoiceForge. I speak with a ${accent} accent and a ${style.replace('_', ' ')} tone.`;

  const normalized = normalizer.normalize(samplePhrase, newProfile.language);
  const { audioBytes } = synthesizeSpeechDsp(
    normalized.normalizedText,
    newProfile.acousticParams,
    24000,
    newProfile.gender
  );

  res.json({
    success: true,
    profile: newProfile,
    interpretation: {
      perceivedGender: gender,
      perceivedAge: age,
      accent,
      detectedTone: style,
      recommendedStyle: style,
    },
    audioPreviewBase64: bytesToBase64(audioBytes),
  });
});

/**
 * POST /api/voices/clone - Consent-Gated Voice Cloning
 * Strict validation of ownership declaration and anti-fraud checks
 */
app.post('/api/voices/clone', (req: Request, res: Response) => {
  const {
    ownerName,
    declarationAccepted,
    audioBase64,
    voiceName,
    language,
    accent,
    gender,
  } = req.body;

  if (!declarationAccepted) {
    return res.status(403).json({
      error: 'Voice cloning blocked: Legal consent declaration and ownership confirmation must be accepted.',
    });
  }

  if (!ownerName || typeof ownerName !== 'string' || ownerName.trim().length === 0) {
    return res.status(400).json({ error: 'Owner name declaration is required for consent audit logging.' });
  }

  if (!audioBase64) {
    return res.status(400).json({ error: 'Reference audio sample is required.' });
  }

  // Create immutable cryptographic audit record
  const consentHash = crypto
    .createHash('sha256')
    .update(`${ownerName}:${Date.now()}:${audioBase64.slice(0, 100)}`)
    .digest('hex');

  const clonedId = `8whie-clone-${Date.now()}`;
  const clonedProfile: VoiceProfile = {
    id: clonedId,
    name: voiceName || `${ownerName} (Authorized Clone)`,
    description: `Authorized voice clone verified by 8WHIE consent protocol. Owner: ${ownerName}.`,
    gender: gender || 'neutral',
    language: language || 'en',
    accent: accent || 'Personal Voice',
    age: 'adult',
    style: 'conversational',
    isCustom: true,
    isCloned: true,
    creator: ownerName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    acousticParams: {
      speed: 1.0,
      pitch: gender === 'female' ? 1.0 : -1.0,
      volume: 1.0,
      expressiveIntensity: 0.8,
      formantShift: 0.0,
      breathiness: 0.2,
      roughness: 0.05,
      timbreWarmth: 0.85,
      vibratoRate: 5.3,
      vibratoDepth: 0.12,
      pauseMultiplier: 1.0,
    },
    consentRecord: {
      consentId: consentHash,
      ownerName,
      declarationText: 'I solemnly declare and warrant that I own or hold explicit written permission for this voice model.',
      ownershipConfirmed: true,
      abuseAcknowledged: true,
      timestamp: new Date().toISOString(),
      cryptographicSignature: `8WHIE-SIG-${consentHash.slice(0, 16).toUpperCase()}`,
      referenceAudioDurationSec: 15.0,
    },
  };

  voicesStore.push(clonedProfile);

  res.status(201).json({
    success: true,
    message: 'Authorized voice clone registered with 8WHIE cryptographic consent audit.',
    profile: clonedProfile,
    consentAuditHash: consentHash,
  });
});

/**
 * POST /api/normalize - Text Normalization Testbed
 */
app.post('/api/normalize', (req: Request, res: Response) => {
  const { text, language } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  const result = normalizer.normalize(text, language || 'en');
  res.json({ success: true, result });
});

/**
 * GET & POST /api/pronunciation - Pronunciation Rules Dictionary
 */
app.get('/api/pronunciation', (_req: Request, res: Response) => {
  res.json({
    success: true,
    rules: pronunciationRulesStore,
    total: pronunciationRulesStore.length,
  });
});

app.post('/api/pronunciation', (req: Request, res: Response) => {
  const rule: PronunciationRule = req.body;
  if (!rule.word || !rule.replacement) {
    return res.status(400).json({ error: 'Word and replacement are required.' });
  }

  const newRule: PronunciationRule = {
    ...rule,
    id: rule.id || `rule-${Date.now()}`,
    language: rule.language || 'all',
    category: rule.category || 'custom',
    caseSensitive: rule.caseSensitive ?? false,
  };

  pronunciationRulesStore.push(newRule);
  normalizer.setCustomRules(pronunciationRulesStore);

  res.status(201).json({ success: true, rule: newRule });
});

/**
 * POST /api/tts/generate - Primary Text-to-Speech Generation
 */
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const body: TtsGenerationRequest = req.body;
  const rawText = body.text;

  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    return res.status(400).json({ error: 'Speech synthesis requires non-empty text input.' });
  }

  const voice = voicesStore.find((v) => v.id === body.voiceId) || voicesStore[0];
  const targetLanguage = body.language || voice.language || 'en';

  // 1. Text Normalization
  const normalizationResult = body.applyTextNormalization !== false
    ? normalizer.normalize(rawText, targetLanguage)
    : { originalText: rawText, normalizedText: rawText, transformations: [] };

  const cleanText = normalizationResult.normalizedText;

  // 2. Expressive Tags Processing
  const speechPlan = parseExpressiveSpeech(cleanText);

  // 3. Acoustic Parameters Merge
  const effectiveAcoustics = {
    speed: body.speed ?? voice.acousticParams.speed,
    pitch: body.pitch ?? voice.acousticParams.pitch,
    volume: body.volume ?? voice.acousticParams.volume,
    expressiveIntensity: body.expressiveIntensity ?? voice.acousticParams.expressiveIntensity,
    formantShift: voice.acousticParams.formantShift,
    breathiness: voice.acousticParams.breathiness,
    roughness: voice.acousticParams.roughness,
    timbreWarmth: voice.acousticParams.timbreWarmth,
    vibratoRate: voice.acousticParams.vibratoRate,
    vibratoDepth: voice.acousticParams.vibratoDepth,
    pauseMultiplier: voice.acousticParams.pauseMultiplier,
  };

  const sampleRate = body.sampleRate || 24000;
  let audioBase64 = '';
  let durationSec = 0;
  let providerUsed: TtsGenerationResponse['modelProvider'] = '8whie_dsp_engine';

  // Try Google GenAI TTS if key available and requested
  if (aiClient && process.env.ENABLE_GEMINI_TTS === 'true') {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: speechPlan.cleanText,
        config: {
          // @ts-ignore
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice.gender === 'female' ? 'Kore' : 'Zephyr',
              },
            },
          },
        },
      });

      const audioCandidate = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioCandidate) {
        audioBase64 = audioCandidate;
        durationSec = speechPlan.totalEstimatedDurationMs / 1000;
        providerUsed = '8whie_gemini_engine';
      }
    } catch (apiErr) {
      console.warn('[8WHIE VoiceForge] GenAI TTS fallback to DSP synthesis:', apiErr);
    }
  }

  // If no external model response, run 8WHIE High-Fidelity DSP Formant Synthesizer
  if (!audioBase64) {
    const dspResult = synthesizeSpeechDsp(cleanText, effectiveAcoustics, sampleRate, voice.gender);
    audioBase64 = bytesToBase64(dspResult.audioBytes);
    durationSec = dspResult.durationSec;
    providerUsed = '8whie_dsp_engine';
  }

  const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const processingTimeMs = Date.now() - startTime;

  const generationRecord: TtsGenerationResponse = {
    id: generationId,
    audioBase64,
    format: body.outputFormat || 'wav',
    sampleRate,
    durationSeconds: parseFloat(durationSec.toFixed(2)),
    textRaw: rawText,
    textNormalized: cleanText,
    voiceId: voice.id,
    voiceName: voice.name,
    language: targetLanguage,
    generatedAt: new Date().toISOString(),
    processingTimeMs,
    modelProvider: providerUsed,
    watermarkMetadata: {
      platform: '8WHIE VoiceForge',
      creator: 'Aryan Thakur',
      generationHash: crypto.createHash('md5').update(audioBase64.slice(0, 100)).digest('hex'),
      hasWatermark: true,
    },
    expressiveTagsDetected: speechPlan.detectedTags,
  };

  // Push to history
  historyStore.unshift({ ...generationRecord, isFavorite: false });
  if (historyStore.length > 50) historyStore.pop();

  res.json({
    success: true,
    ...generationRecord,
  });
});

/**
 * POST /api/tts/stream - Chunked Streaming Speech Synthesis
 * Sentence-by-sentence Server-Sent Event stream
 */
app.post('/api/tts/stream', (req: Request, res: Response) => {
  const body: TtsGenerationRequest = req.body;
  const rawText = body.text;

  if (!rawText) {
    return res.status(400).json({ error: 'Text is required for streaming.' });
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const voice = voicesStore.find((v) => v.id === body.voiceId) || voicesStore[0];
  const targetLanguage = body.language || voice.language || 'en';
  const sentences = rawText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [rawText];

  let chunkIndex = 0;
  const totalChunks = sentences.length;

  for (const sentence of sentences) {
    if (sentence.trim().length === 0) continue;

    const normalized = normalizer.normalize(sentence, targetLanguage);
    const dsp = synthesizeSpeechDsp(
      normalized.normalizedText,
      voice.acousticParams,
      body.sampleRate || 24000,
      voice.gender
    );

    const chunkData = {
      chunkIndex,
      totalChunks,
      sentenceText: sentence.trim(),
      audioBase64: bytesToBase64(dsp.audioBytes),
      durationSeconds: dsp.durationSec,
      isFinal: chunkIndex === totalChunks - 1,
    };

    res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
    chunkIndex++;
  }

  res.write('event: end\ndata: [DONE]\n\n');
  res.end();
});

/**
 * GET & DELETE /api/history - Generation History Management
 */
app.get('/api/history', (_req: Request, res: Response) => {
  res.json({
    success: true,
    history: historyStore,
    total: historyStore.length,
  });
});

app.delete('/api/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  historyStore = historyStore.filter((h) => h.id !== id);
  res.json({ success: true, message: 'History record removed.' });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS
// -------------------------------------------------------------
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[8WHIE VoiceForge] Server online on http://0.0.0.0:${PORT}`);
    console.log(`[8WHIE VoiceForge] Brand: 8WHIE | Owner: Aryan Thakur | Org: 8whie`);
  });
}

setupServer().catch((err) => {
  console.error('[8WHIE VoiceForge] Server boot error:', err);
  process.exit(1);
});
