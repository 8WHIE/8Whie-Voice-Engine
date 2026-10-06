/**
 * 8WHIE VoiceForge - Voice Profiles Library
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState } from 'react';
import {
  Users,
  Play,
  Trash2,
  Download,
  ShieldCheck,
  Sparkles,
  Sliders,
  Filter,
  Check,
  Volume2,
} from 'lucide-react';
import { VoiceProfile } from '../types/tts';
import { SUPPORTED_LANGUAGES } from '../lib/languages';

interface VoiceProfilesProps {
  voices: VoiceProfile[];
  onDeleteProfile: (id: string) => void;
  onSelectForStudio: (voiceId: string) => void;
  onPreviewVoice: (voice: VoiceProfile) => void;
  previewPlayingId: string | null;
}

export const VoiceProfiles: React.FC<VoiceProfilesProps> = ({
  voices,
  onDeleteProfile,
  onSelectForStudio,
  onPreviewVoice,
  previewPlayingId,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'official' | 'custom'>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVoices = voices.filter((v) => {
    if (filterType === 'official' && v.isCustom) return false;
    if (filterType === 'custom' && !v.isCustom) return false;
    if (selectedLang !== 'all' && v.language !== selectedLang) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.accent.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportProfile = (voice: VoiceProfile) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(voice, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `8WHIE_VoiceProfile_${voice.id}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Voice Profile Library</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
              {voices.length} Total Profiles
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Curated 8WHIE official speakers, prompt-designed synthetic voices, and verified authorized clones.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="official">8WHIE Official Only</option>
            <option value="custom">Custom / Cloned</option>
          </select>

          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Languages</option>
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVoices.map((voice) => {
          const isPlayingThis = previewPlayingId === voice.id;

          return (
            <div
              key={voice.id}
              className="rounded-xl border border-slate-800 hover:border-cyan-500/40 bg-slate-900/50 p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-cyan-950/20"
            >
              <div>
                {/* Card Top: Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      !voice.isCustom
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40'
                        : voice.isCloned
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                        : 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                    }`}
                  >
                    {!voice.isCustom
                      ? '8WHIE Core'
                      : voice.isCloned
                      ? 'Authorized Clone'
                      : 'AI Designed'}
                  </span>

                  {voice.consentRecord && (
                    <span
                      title="Cryptographic consent verified"
                      className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Avatar & Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0 group-hover:border-cyan-500/50 transition-colors">
                    <img
                      src={
                        voice.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                      }
                      alt={voice.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                      {voice.name}
                    </h3>
                    <p className="text-xs text-cyan-400 truncate">
                      {voice.accent} • {voice.gender}
                    </p>
                    <p className="text-[11px] text-slate-400 capitalize">
                      {voice.style.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {voice.description}
                </p>

                {/* Acoustic Specs Strip */}
                <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] text-center font-mono mb-4">
                  <div>
                    <span className="text-slate-500 block text-[9px]">Speed</span>
                    <span className="text-slate-200">{voice.acousticParams.speed}x</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Pitch</span>
                    <span className="text-slate-200">{voice.acousticParams.pitch} st</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Warmth</span>
                    <span className="text-cyan-400">
                      {(voice.acousticParams.timbreWarmth * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Formant</span>
                    <span className="text-slate-200">
                      {voice.acousticParams.formantShift > 0 ? `+${voice.acousticParams.formantShift}` : voice.acousticParams.formantShift}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onPreviewVoice(voice)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isPlayingThis
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Play className={`w-3 h-3 ${isPlayingThis ? 'fill-slate-950' : 'fill-slate-200'}`} />
                  <span>{isPlayingThis ? 'Playing...' : 'Test Voice'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => exportProfile(voice)}
                    className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Export Profile JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectForStudio(voice.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium transition-colors"
                  >
                    Use in TTS
                  </button>

                  {voice.isCustom && (
                    <button
                      onClick={() => onDeleteProfile(voice.id)}
                      className="p-1.5 rounded-lg hover:bg-red-950/60 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Custom Voice Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
