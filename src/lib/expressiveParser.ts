/**
 * 8WHIE VoiceForge - Original Expressive Speech Conditioning Parser
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 * 
 * An original AST-based expressive tag tokenizer and acoustic plan generator.
 * Supports:
 *   [pause], [pause:500ms], [breath], [laugh], [whisper], [excited],
 *   [sad], [angry], [calm], [emphasis]...[/emphasis]
 */

export type ExpressiveTagType =
  | 'pause'
  | 'breath'
  | 'laugh'
  | 'whisper'
  | 'excited'
  | 'sad'
  | 'angry'
  | 'calm'
  | 'emphasis';

export interface AcousticEvent {
  type: ExpressiveTagType;
  durationMs?: number;
  pitchModifier: number; // Semitone delta
  formantModifier: number;
  energyMultiplier: number;
  noiseLevel: number; // Aspiration / breathiness
  tempoMultiplier: number;
}

export interface SpeechPlanChunk {
  text: string;
  isAction: boolean;
  actionType?: ExpressiveTagType;
  actionDurationMs?: number;
  acousticModifiers: {
    pitchShift: number;
    volumeMultiplier: number;
    breathiness: number;
    formantShift: number;
    tempoShift: number;
    isWhisper: boolean;
    isEmphasized: boolean;
  };
}

export interface ParsedSpeechPlan {
  originalText: string;
  cleanText: string;
  chunks: SpeechPlanChunk[];
  detectedTags: string[];
  totalEstimatedDurationMs: number;
}

const TAG_REGEX = /\[(\/?)(pause(?::\d+m?s)?|breath|laugh|whisper|excited|sad|angry|calm|emphasis)\]/gi;

export function parseExpressiveSpeech(input: string): ParsedSpeechPlan {
  const detectedTags: string[] = [];
  const chunks: SpeechPlanChunk[] = [];

  // Active state stack for scoped tags (e.g. [emphasis]...[/emphasis], [whisper]...[/whisper])
  let activeState = {
    isWhisper: false,
    isEmphasized: false,
    pitchShift: 0,
    volumeMultiplier: 1.0,
    breathiness: 0.1,
    formantShift: 0.0,
    tempoShift: 1.0,
  };

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TAG_REGEX.exec(input)) !== null) {
    const [fullTag, isClosing, tagNameRaw] = match;
    const startIndex = match.index;

    // Grab preceding plain text if any
    if (startIndex > lastIndex) {
      const textSegment = input.substring(lastIndex, startIndex);
      if (textSegment.trim().length > 0) {
        chunks.push({
          text: textSegment,
          isAction: false,
          acousticModifiers: { ...activeState },
        });
      }
    }

    lastIndex = TAG_REGEX.lastIndex;
    detectedTags.push(fullTag.toLowerCase());

    const lowerTag = tagNameRaw.toLowerCase();

    if (isClosing) {
      // Revert scoped tag
      if (lowerTag === 'whisper') {
        activeState.isWhisper = false;
        activeState.breathiness = 0.1;
        activeState.volumeMultiplier = 1.0;
      } else if (lowerTag === 'emphasis') {
        activeState.isEmphasized = false;
        activeState.volumeMultiplier = 1.0;
        activeState.pitchShift = 0;
      } else if (['excited', 'sad', 'angry', 'calm'].includes(lowerTag)) {
        activeState.pitchShift = 0;
        activeState.tempoShift = 1.0;
        activeState.volumeMultiplier = 1.0;
      }
    } else {
      // Opening or instant tag
      if (lowerTag.startsWith('pause')) {
        let pauseDuration = 400; // default 400ms
        const matchMs = lowerTag.match(/pause:(\d+)/);
        if (matchMs) {
          pauseDuration = parseInt(matchMs[1], 10);
        }
        chunks.push({
          text: ' ',
          isAction: true,
          actionType: 'pause',
          actionDurationMs: pauseDuration,
          acousticModifiers: { ...activeState },
        });
      } else if (lowerTag === 'breath') {
        chunks.push({
          text: ' ',
          isAction: true,
          actionType: 'breath',
          actionDurationMs: 350,
          acousticModifiers: {
            ...activeState,
            breathiness: 0.8,
            volumeMultiplier: 0.4,
          },
        });
      } else if (lowerTag === 'laugh') {
        chunks.push({
          text: ' ',
          isAction: true,
          actionType: 'laugh',
          actionDurationMs: 600,
          acousticModifiers: {
            ...activeState,
            pitchShift: 3.0,
            volumeMultiplier: 0.9,
          },
        });
      } else if (lowerTag === 'whisper') {
        activeState.isWhisper = true;
        activeState.breathiness = 0.7;
        activeState.volumeMultiplier = 0.6;
        activeState.pitchShift = 0.5;
      } else if (lowerTag === 'excited') {
        activeState.pitchShift = 2.5;
        activeState.tempoShift = 1.15;
        activeState.volumeMultiplier = 1.2;
      } else if (lowerTag === 'sad') {
        activeState.pitchShift = -2.0;
        activeState.tempoShift = 0.85;
        activeState.volumeMultiplier = 0.8;
      } else if (lowerTag === 'angry') {
        activeState.pitchShift = 1.0;
        activeState.tempoShift = 1.1;
        activeState.volumeMultiplier = 1.3;
        activeState.formantShift = -0.2;
      } else if (lowerTag === 'calm') {
        activeState.pitchShift = -0.8;
        activeState.tempoShift = 0.92;
        activeState.volumeMultiplier = 0.95;
      } else if (lowerTag === 'emphasis') {
        activeState.isEmphasized = true;
        activeState.volumeMultiplier = 1.25;
        activeState.pitchShift = 1.5;
        activeState.tempoShift = 0.9;
      }
    }
  }

  // Trailing text
  if (lastIndex < input.length) {
    const trailing = input.substring(lastIndex);
    if (trailing.trim().length > 0) {
      chunks.push({
        text: trailing,
        isAction: false,
        acousticModifiers: { ...activeState },
      });
    }
  }

  const cleanText = input.replace(TAG_REGEX, '').replace(/\s+/g, ' ').trim();

  // Estimate duration (average 150 words per minute ~ 400ms per word + pause durations)
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  let estimatedDuration = wordCount * 380;
  for (const c of chunks) {
    if (c.isAction && c.actionDurationMs) {
      estimatedDuration += c.actionDurationMs;
    }
  }

  return {
    originalText: input,
    cleanText,
    chunks,
    detectedTags,
    totalEstimatedDurationMs: Math.max(500, estimatedDuration),
  };
}

export function stripExpressiveTags(text: string): string {
  return text.replace(TAG_REGEX, '').replace(/\s+/g, ' ').trim();
}
