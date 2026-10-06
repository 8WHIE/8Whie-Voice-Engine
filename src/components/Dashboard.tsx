/**
 * 8WHIE VoiceForge - Dashboard Overview
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState } from 'react';
import {
  Mic,
  Sliders,
  Sparkles,
  ShieldCheck,
  Languages,
  Zap,
  Play,
  Volume2,
  ExternalLink,
  Code,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { VoiceProfile, HistoryItem } from '../types/tts';
import { SUPPORTED_LANGUAGES } from '../lib/languages';

interface DashboardProps {
  voices: VoiceProfile[];
  history: HistoryItem[];
  onNavigate: (tab: any) => void;
  onQuickSynthesize: (text: string, voiceId: string) => Promise<void>;
  isSynthesizing: boolean;
  latestAudioResult: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  voices,
  history,
  onNavigate,
  onQuickSynthesize,
  isSynthesizing,
  latestAudioResult,
}) => {
  const [quickText, setQuickText] = useState(
    '8WHIE is a premier cybersecurity and artificial intelligence research brand led by Aryan Thakur.'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState(voices[0]?.id || '8whie-aryan');

  const leadVoice = voices.find((v) => v.id === '8whie-aryan') || voices[0];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim() || isSynthesizing) return;
    onQuickSynthesize(quickText, selectedVoiceId);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-2xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Audio Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Multilingual AI Speech & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Acoustic Voice Design
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            An original, production-quality speech synthesis platform engineered by{' '}
            <strong className="text-white">8WHIE</strong> and founder{' '}
            <strong className="text-cyan-400">Aryan Thakur</strong>. Featuring micro-prosodic
            expressive tags, Indian and international phonetic normalization, and consent-gated voice cloning.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('tts')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Launch TTS Studio</span>
            </button>
            <button
              onClick={() => onNavigate('voice-studio')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-sm font-medium transition-all"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>AI Voice Designer</span>
            </button>
            <button
              onClick={() => onNavigate('pronunciation')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 border border-slate-800 text-sm font-medium transition-all"
            >
              <span>Normalizer & ₹ Dictionary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Multilingual Support</span>
            <Languages className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-0.5">18 Languages</div>
          <div className="text-[11px] text-slate-400">Hindi, Hinglish, Tamil, Bengali & more</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Voice Models</span>
            <Volume2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-0.5">{voices.length} Profiles</div>
          <div className="text-[11px] text-slate-400">Curated & Custom Cloned</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">DSP Synthesis Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-0.5">&lt; 200 ms</div>
          <div className="text-[11px] text-slate-400">Zero cold-start CPU/GPU execution</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Ethical Safeguards</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-0.5">100% Watermarked</div>
          <div className="text-[11px] text-slate-400">Steganographic 8WHIE signature</div>
        </div>
      </div>

      {/* Quick Workbench & Featured Voice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Generation Workbench */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Instant Speech Workbench</h3>
                <p className="text-xs text-slate-400">Test synthesis with brand pronunciation rules</p>
              </div>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono">16-bit PCM • 24kHz</span>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div>
              <textarea
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                placeholder="Type or paste text to synthesize..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Voice:</label>
                <select
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuickText(
                      '8WHIE cybersecurity technology channel offers solutions for ₹1,499 with natural AI speech!'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs"
                >
                  Sample with ₹ & 8WHIE
                </button>
                <button
                  type="submit"
                  disabled={isSynthesizing}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  {isSynthesizing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Synthesize</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick result audio preview if available */}
          {latestAudioResult && (
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Latest Output:</span>
                <span className="text-[11px] text-cyan-400 font-mono">
                  {latestAudioResult.durationSeconds}s • {latestAudioResult.processingTimeMs}ms
                </span>
              </div>
              <audio
                controls
                src={`data:audio/${latestAudioResult.format};base64,${latestAudioResult.audioBase64}`}
                className="w-full h-9 rounded-lg accent-cyan-400"
              />
            </div>
          )}
        </div>

        {/* Lead Voice Spotlight Card */}
        {leadVoice && (
          <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                  Featured Speaker
                </span>
                <span className="text-xs text-slate-400">8WHIE Lead</span>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-800 flex-shrink-0">
                  <img
                    src={leadVoice.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={leadVoice.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{leadVoice.name}</h4>
                  <p className="text-xs text-cyan-300">{leadVoice.accent} • {leadVoice.gender}</p>
                  <p className="text-[11px] text-slate-400 capitalize">{leadVoice.style.replace('_', ' ')} style</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {leadVoice.description}
              </p>

              {/* Acoustic Parameters Snapshot */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-center mb-4">
                <div>
                  <div className="text-slate-500">Speed</div>
                  <div className="font-mono text-slate-200">{leadVoice.acousticParams.speed}x</div>
                </div>
                <div>
                  <div className="text-slate-500">Pitch</div>
                  <div className="font-mono text-slate-200">{leadVoice.acousticParams.pitch} st</div>
                </div>
                <div>
                  <div className="text-slate-500">Warmth</div>
                  <div className="font-mono text-cyan-400">
                    {(leadVoice.acousticParams.timbreWarmth * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('tts')}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Use in TTS Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Language Matrix Highlight */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Multilingual Coverage (18 Languages)</h3>
            <p className="text-xs text-slate-400">Phonetic tokenization, Devanagari transliteration & prosody maps</p>
          </div>
          <button
            onClick={() => onNavigate('tts')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>Explore all</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {SUPPORTED_LANGUAGES.slice(0, 12).map((lang) => (
            <div
              key={lang.code}
              onClick={() => onNavigate('tts')}
              className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 hover:border-cyan-500/40 hover:bg-cyan-950/10 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                  {lang.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {lang.code}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">{lang.nativeName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
