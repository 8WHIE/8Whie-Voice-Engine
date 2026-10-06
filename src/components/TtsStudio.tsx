/**
 * 8WHIE VoiceForge - Text-to-Speech Studio
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState } from 'react';
import {
  Mic,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  Radio,
  FileAudio,
  Layers,
  HelpCircle,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { VoiceProfile, SupportedLanguage, SpeakingStyle, TtsGenerationResponse } from '../types/tts';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '../lib/languages';
import { WaveformPlayer } from './WaveformPlayer';

interface TtsStudioProps {
  voices: VoiceProfile[];
  onSynthesize: (payload: any) => Promise<TtsGenerationResponse | null>;
  isGenerating: boolean;
  activeResult: TtsGenerationResponse | null;
}

export const TtsStudio: React.FC<TtsStudioProps> = ({
  voices,
  onSynthesize,
  isGenerating,
  activeResult,
}) => {
  const [text, setText] = useState<string>(
    'Welcome to 8WHIE VoiceForge. [excited] Our advanced speech engine [/excited] natively normalizes Indian currencies like ₹1,499, expands technical abbreviations, and delivers [whisper] crystal clear audio [/whisper] with customizable acoustic contours.'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(voices[0]?.id || '8whie-aryan');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [expressiveIntensity, setExpressiveIntensity] = useState<number>(0.85);
  const [outputFormat, setOutputFormat] = useState<'wav' | 'mp3'>('wav');
  const [sampleRate, setSampleRate] = useState<24000 | 48000>(24000);
  const [applyNormalization, setApplyNormalization] = useState<boolean>(true);
  const [streamingMode, setStreamingMode] = useState<boolean>(false);
  const [streamProgress, setStreamProgress] = useState<string>('');

  const currentVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0];
  const currentLangInfo = getLanguageInfo(selectedLanguage);

  // Helper to insert expressive tag into text cursor position
  const insertTag = (tagOpen: string, tagClose: string = '') => {
    setText((prev) => {
      if (tagClose) {
        return `${prev} ${tagOpen}text${tagClose} `;
      }
      return `${prev} ${tagOpen} `;
    });
  };

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return;

    if (streamingMode) {
      setStreamProgress('Connecting to SSE streaming channel...');
      try {
        const response = await fetch('/api/tts/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceId: selectedVoiceId,
            language: selectedLanguage,
            speed,
            pitch,
            volume,
            sampleRate,
          }),
        });

        if (!response.body) return;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunkText = decoder.decode(value);
            setStreamProgress(`Streaming chunks received...`);
          }
        }
        setStreamProgress('Stream synthesis complete.');
      } catch (err) {
        console.error('Streaming error:', err);
        setStreamProgress('Streaming error. Reverting to standard synthesis.');
      }
    }

    // Call standard synthesis
    await onSynthesize({
      text,
      voiceId: selectedVoiceId,
      language: selectedLanguage,
      speed,
      pitch,
      volume,
      expressiveIntensity,
      outputFormat,
      sampleRate,
      applyTextNormalization: applyNormalization,
    });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedDuration = (wordCount * 0.38).toFixed(1);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Speech Synthesis Studio</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
              DSP v2.4
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Synthesize multilingual speech with acoustic micro-prosody and 8WHIE audio watermarking.
          </p>
        </div>

        {/* Streaming Mode Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <span className={streamingMode ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
              Streaming SSE
            </span>
            <div
              onClick={() => setStreamingMode(!streamingMode)}
              className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                streamingMode ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  streamingMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Text Input & Expressive Controls (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Text Editor Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
            {/* Expressive Tags Quick Bar */}
            <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Expressive Tags:</span>
              </span>

              <div className="flex flex-wrap items-center gap-1">
                {[
                  { label: '[pause]', open: '[pause]' },
                  { label: '[pause:500ms]', open: '[pause:500ms]' },
                  { label: '[whisper]', open: '[whisper]', close: '[/whisper]' },
                  { label: '[breath]', open: '[breath]' },
                  { label: '[laugh]', open: '[laugh]' },
                  { label: '[excited]', open: '[excited]', close: '[/excited]' },
                  { label: '[sad]', open: '[sad]', close: '[/sad]' },
                  { label: '[emphasis]', open: '[emphasis]', close: '[/emphasis]' },
                  { label: '[calm]', open: '[calm]', close: '[/calm]' },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => insertTag(tag.open, tag.close)}
                    className="px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950/50 hover:text-cyan-300 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Enter your text here. You can include expressive tags like [whisper] or Indian currency like ₹1,499..."
              className="w-full bg-slate-950/40 p-4 text-slate-100 placeholder-slate-600 text-sm md:text-base leading-relaxed focus:outline-none resize-none font-sans"
            />

            {/* Editor Footer: Counters & Language Preset Sample */}
            <div className="px-4 py-2.5 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>{charCount} chars</span>
                <span>•</span>
                <span>{wordCount} words</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{estimatedDuration}s estimated</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setText(currentLangInfo.sampleText)}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs"
                >
                  Load {currentLangInfo.name} Sample Text
                </button>
                <button
                  onClick={() => setText('')}
                  className="text-slate-500 hover:text-slate-300 text-xs ml-2"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Action Button & Normalization Info */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyNormalization}
                  onChange={(e) => setApplyNormalization(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Auto-Normalize Currency (₹), Numbers, Brand (8WHIE)</span>
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Voice...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Generate Speech</span>
                </>
              )}
            </button>
          </div>

          {streamingMode && streamProgress && (
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 font-mono">
              {streamProgress}
            </div>
          )}

          {/* Waveform Output Player */}
          {activeResult && (
            <div className="mt-6 space-y-3">
              <WaveformPlayer
                audioBase64={activeResult.audioBase64}
                durationSeconds={activeResult.durationSeconds}
                sampleRate={activeResult.sampleRate}
                format={activeResult.format}
                voiceName={activeResult.voiceName}
                title={`Synthesis Result (${activeResult.durationSeconds}s)`}
              />

              {/* Normalization & Processing Metadata Box */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied Pipeline Steps</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {activeResult.processingTimeMs} ms • {activeResult.modelProvider}
                  </span>
                </div>

                <div className="text-slate-400">
                  <strong className="text-slate-300">Spoken Normalized:</strong>{' '}
                  <span className="text-slate-200 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block mt-1">
                    "{activeResult.textNormalized}"
                  </span>
                </div>

                {activeResult.expressiveTagsDetected.length > 0 && (
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Expressive Tags Conditioned:</strong>{' '}
                    {activeResult.expressiveTagsDetected.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-block mr-1.5 mt-1 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/50 text-[10px] text-cyan-300 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Speaker & Acoustic Tuning (1 span) */}
        <div className="space-y-4">
          {/* Voice Selector Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice Profile</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{voices.length} Available</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Select Speaker:</label>
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.accent} - {v.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Voice Details Badge */}
            {currentVoice && (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
                <img
                  src={
                    currentVoice.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={currentVoice.name}
                  className="w-10 h-10 rounded-lg object-cover border border-cyan-500/30 flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">{currentVoice.name}</div>
                  <div className="text-[11px] text-cyan-400 truncate">{currentVoice.accent}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{currentVoice.style.replace('_', ' ')}</div>
                </div>
              </div>
            )}

            {/* Language Selector */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Language Target:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Script: {currentLangInfo.script} • Family: {currentLangInfo.family}
              </div>
            </div>
          </div>

          {/* Acoustic Fine-Tuning Sliders */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Acoustic Modulators</span>
              </span>
              <button
                onClick={() => {
                  setSpeed(1.0);
                  setPitch(0.0);
                  setVolume(1.0);
                  setExpressiveIntensity(0.85);
                }}
                className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                title="Reset sliders to defaults"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Speaking Speed</span>
                <span className="font-mono text-cyan-400">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Pitch Offset</span>
                <span className="font-mono text-cyan-400">
                  {pitch > 0 ? `+${pitch.toFixed(1)}` : pitch.toFixed(1)} st
                </span>
              </div>
              <input
                type="range"
                min="-12.0"
                max="12.0"
                step="0.5"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Expressive Intensity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Expressive Dynamic</span>
                <span className="font-mono text-cyan-400">
                  {(expressiveIntensity * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={expressiveIntensity}
                onChange={(e) => setExpressiveIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Master Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Gain / Volume</span>
                <span className="font-mono text-cyan-400">{(volume * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Audio Format and Sample Rate */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Format:</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as 'wav' | 'mp3')}
                  className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-200 text-xs"
                >
                  <option value="wav">WAV (PCM 16-bit)</option>
                  <option value="mp3">MP3</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Sample Rate:</label>
                <select
                  value={sampleRate}
                  onChange={(e) => setSampleRate(parseInt(e.target.value) as 24000 | 48000)}
                  className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-200 text-xs font-mono"
                >
                  <option value="24000">24 kHz</option>
                  <option value="48000">48 kHz</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
