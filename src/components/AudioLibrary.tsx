/**
 * 8WHIE VoiceForge - Audio Library & Generation History
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState } from 'react';
import {
  History,
  Play,
  Pause,
  Download,
  Trash2,
  ShieldCheck,
  Search,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { HistoryItem } from '../types/tts';

interface AudioLibraryProps {
  history: HistoryItem[];
  onDeleteHistory: (id: string) => void;
  onLoadIntoStudio: (item: HistoryItem) => void;
}

export const AudioLibrary: React.FC<AudioLibraryProps> = ({
  history,
  onDeleteHistory,
  onLoadIntoStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.textRaw.toLowerCase().includes(q) ||
      item.textNormalized.toLowerCase().includes(q) ||
      item.voiceName.toLowerCase().includes(q)
    );
  });

  const handlePlayToggle = (item: HistoryItem) => {
    if (playingId === item.id) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(`data:audio/${item.format};base64,${item.audioBase64}`);
      audio.onended = () => setPlayingId(null);
      audio.play().then(() => {
        setAudioElement(audio);
        setPlayingId(item.id);
      });
    }
  };

  const handleDownload = (item: HistoryItem) => {
    const a = document.createElement('a');
    a.href = `data:audio/${item.format};base64,${item.audioBase64}`;
    a.download = `8WHIE_VoiceForge_${item.id}.${item.format}`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Audio Generation Library</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
              {history.length} Saved Records
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Audit history of synthesized speech clips with embedded 8WHIE watermarks and normalization logs.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audio history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Content */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Audio Generations Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Synthesize speech in the Text-to-Speech Studio or Voice Designer. All generated clips with cryptographic watermarks will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 hover:border-cyan-500/30 bg-slate-900/50 p-4 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayToggle(item)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isPlaying
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-slate-950" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      )}
                    </button>

                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{item.voiceName}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {item.language}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                        <span>{item.durationSeconds}s duration</span>
                        <span>•</span>
                        <span>{item.sampleRate} Hz {item.format.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Watermark & Timestamp */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Watermark: {item.watermarkMetadata.generationHash.slice(0, 8)}...</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(item.generatedAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Download WAV/MP3"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onLoadIntoStudio(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium transition-colors"
                      >
                        Load in TTS
                      </button>

                      <button
                        onClick={() => onDeleteHistory(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-950/60 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete from Library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Content Preview */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-200 font-sans">
                  "{item.textRaw}"
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
