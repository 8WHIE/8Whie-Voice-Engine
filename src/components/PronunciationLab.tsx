/**
 * 8WHIE VoiceForge - Pronunciation & Normalization Laboratory
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Sliders,
  DollarSign,
  Tag,
} from 'lucide-react';
import { PronunciationRule, SupportedLanguage } from '../types/tts';
import { defaultNormalizer } from '../lib/normalizer';
import { SUPPORTED_LANGUAGES } from '../lib/languages';

interface PronunciationLabProps {
  onQuickSpeak: (text: string) => void;
}

export const PronunciationLab: React.FC<PronunciationLabProps> = ({ onQuickSpeak }) => {
  const [testInput, setTestInput] = useState(
    '8WHIE is a premier cybersecurity channel. Pro license costs ₹1,499 per year. Check https://8whie.org or email contact@8whie.org for API access.'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [activeRules, setActiveRules] = useState<PronunciationRule[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState(false);

  // New Rule Form
  const [newWord, setNewWord] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newCategory, setNewCategory] = useState<PronunciationRule['category']>('brand');
  const [newLang, setNewLang] = useState<SupportedLanguage | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch current rules from server
  React.useEffect(() => {
    const fetchRules = async () => {
      setIsLoadingRules(true);
      try {
        const res = await fetch('/api/pronunciation');
        const data = await res.json();
        if (data.success) {
          setActiveRules(data.rules);
        }
      } catch (err) {
        console.error('Error fetching pronunciation rules:', err);
      } finally {
        setIsLoadingRules(false);
      }
    };
    fetchRules();
  }, []);

  // Compute live normalization
  const normalizedResult = defaultNormalizer.normalize(testInput, selectedLanguage);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newReplacement.trim()) return;

    setIsAdding(true);
    try {
      const res = await fetch('/api/pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: newWord.trim(),
          replacement: newReplacement.trim(),
          phoneticIpa: newIpa.trim() || undefined,
          category: newCategory,
          language: newLang,
          caseSensitive: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveRules((prev) => [...prev, data.rule]);
        setNewWord('');
        setNewReplacement('');
        setNewIpa('');
      }
    } catch (err) {
      console.error('Add rule error:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Pronunciation & Normalization Lab</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            Rules Engine
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Inspect real-time text normalization transformations for Indian currencies (₹), brand names ("8WHIE" → "Eight-Why"), abbreviations, URLs, and custom phonetic dictionaries.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE TRANSFORMATION PLAYGROUND */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Live Normalization Testbed</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Target Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Text Box */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Raw Input Text:</label>
          <textarea
            rows={3}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
            placeholder="Type text containing ₹1,499, 8WHIE, abbreviations or URLs..."
          />
        </div>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium">Quick Test Scenarios:</span>
          {[
            {
              label: '8WHIE Brand Test',
              text: '8WHIE is a premier cybersecurity technology channel founded by Aryan Thakur.',
            },
            {
              label: 'Indian Currency (₹1,499)',
              text: 'The complete AI Speech course subscription is ₹1,499 only.',
            },
            {
              label: 'Multi-Currency Comparison',
              text: 'International licenses are $49 in the US, €45 in Europe, and ₹3,999 in India.',
            },
            {
              label: 'Technical Acronyms & URLs',
              text: 'The TTS API accepts 48 kHz WAV buffers via https://8whie.org with 50 ms latency.',
            },
            {
              label: 'Hinglish Colloquial',
              text: '8WHIE VoiceForge me 100% natural speech synthesis hoti hai, bilkul authentic!',
            },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTestInput(preset.text)}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Result Breakdown Card */}
        <div className="pt-2">
          <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Spoken Normalization Output</span>
              </span>

              <button
                onClick={() => onQuickSpeak(normalizedResult.normalizedText)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>Hear Spoken Audio</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-sm font-mono text-slate-100 leading-relaxed">
              "{normalizedResult.normalizedText}"
            </div>

            {/* Transformations List */}
            {normalizedResult.transformations.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">
                  Detected Transformations ({normalizedResult.transformations.length}):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {normalizedResult.transformations.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {t.type}
                        </span>
                        <span className="text-slate-400 line-through font-mono">{t.from}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                        <ArrowRight className="w-3 h-3" />
                        <span>{t.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: PRONUNCIATION DICTIONARY MANAGER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add Custom Rule */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Custom Word Rule</span>
            </h3>
            <p className="text-[11px] text-slate-400">Define phonetic expansion for brand or technical words</p>
          </div>

          <form onSubmit={handleAddRule} className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Target Word / Acronym:</label>
              <input
                type="text"
                required
                placeholder="e.g. 8WHIE"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Spoken Replacement:</label>
              <input
                type="text"
                required
                placeholder="e.g. Eight-Why"
                value={newReplacement}
                onChange={(e) => setNewReplacement(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Optional IPA Phonetic:</label>
              <input
                type="text"
                placeholder="e.g. /eɪt.waɪ/"
                value={newIpa}
                onChange={(e) => setNewIpa(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2 py-1.5 text-xs text-slate-200"
                >
                  <option value="brand">Brand</option>
                  <option value="technical">Technical</option>
                  <option value="abbreviation">Abbreviation</option>
                  <option value="transliteration">Transliteration</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Language:</label>
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value as any)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2 py-1.5 text-xs text-slate-200"
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

            <button
              type="submit"
              disabled={isAdding || !newWord.trim() || !newReplacement.trim()}
              className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 mt-2"
            >
              {isAdding ? 'Registering...' : 'Register Pronunciation Rule'}
            </button>
          </form>
        </div>

        {/* Right: Active Dictionary Table (2 spans) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Active Pronunciation Rules</h3>
              <p className="text-[11px] text-slate-400">
                Loaded in 8WHIE Normalization Pipeline ({activeRules.length} entries)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2 font-medium">Word</th>
                  <th className="pb-2 font-medium">Spoken Pronunciation</th>
                  <th className="pb-2 font-medium">IPA Symbol</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Lang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {activeRules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="py-2.5 text-slate-200 font-bold">{r.word}</td>
                    <td className="py-2.5 text-cyan-400">{r.replacement}</td>
                    <td className="py-2.5 text-slate-400">{r.phoneticIpa || '—'}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{r.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
