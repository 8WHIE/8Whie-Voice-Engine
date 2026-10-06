/**
 * 8WHIE VoiceForge - Voice Studio
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 * 
 * - AI Natural Language Voice Designer
 * - Consent-Gated Authorized Voice Cloning
 * - Acoustic Parameter Sculptor
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Mic,
  Sliders,
  CheckCircle,
  Play,
  RotateCcw,
  Upload,
  Fingerprint,
  Info,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { VoiceProfile, SupportedLanguage } from '../types/tts';
import { SUPPORTED_LANGUAGES } from '../lib/languages';

interface VoiceStudioProps {
  onSaveProfile: (profile: VoiceProfile) => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({ onSaveProfile }) => {
  const [activeTab, setActiveTab] = useState<'designer' | 'clone' | 'sculpt'>('designer');

  // Voice Designer State
  const [designerPrompt, setDesignerPrompt] = useState(
    'Young adult female, warm conversational voice, medium pitch, Indian English accent, calm and confident delivery.'
  );
  const [samplePhrase, setSamplePhrase] = useState(
    'Hello! This is a preview of your custom synthetic voice engineered by 8WHIE VoiceForge.'
  );
  const [targetLang, setTargetLang] = useState<SupportedLanguage>('en');
  const [isDesigning, setIsDesigning] = useState(false);
  const [designResult, setDesignResult] = useState<any>(null);
  const [designSaved, setDesignSaved] = useState(false);

  // Voice Clone State (Consent Gated)
  const [cloneOwnerName, setCloneOwnerName] = useState('');
  const [cloneVoiceName, setCloneVoiceName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [antiFraudChecked, setAntiFraudChecked] = useState(false);
  const [cloneAudioFile, setCloneAudioFile] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneResult, setCloneResult] = useState<any>(null);
  const [cloneError, setCloneError] = useState<string | null>(null);

  // Manual Sculpt State
  const [sculptFormant, setSculptFormant] = useState(0.0);
  const [sculptBreath, setSculptBreath] = useState(0.2);
  const [sculptRoughness, setSculptRoughness] = useState(0.05);
  const [sculptWarmth, setSculptWarmth] = useState(0.85);

  // Handle Natural Language Design
  const handleDesignVoice = async () => {
    if (!designerPrompt.trim() || isDesigning) return;
    setIsDesigning(true);
    setDesignSaved(false);

    try {
      const res = await fetch('/api/voices/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: designerPrompt,
          sampleText: samplePhrase,
          targetLanguage: targetLang,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDesignResult(data);
      }
    } catch (err) {
      console.error('Design voice error:', err);
    } finally {
      setIsDesigning(false);
    }
  };

  const handleSaveDesignedVoice = () => {
    if (!designResult?.profile) return;
    onSaveProfile(designResult.profile);
    setDesignSaved(true);
  };

  // Handle Authorized Clone
  const handleExecuteClone = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloneError(null);

    if (!consentChecked || !antiFraudChecked) {
      setCloneError('Consent & non-impersonation declarations must be explicitly checked.');
      return;
    }

    if (!cloneOwnerName.trim()) {
      setCloneError('Please provide the full legal name of the voice owner for audit logging.');
      return;
    }

    if (!cloneAudioFile) {
      setCloneError('Please upload an authorized reference audio sample (minimum 5 seconds clean speech).');
      return;
    }

    setIsCloning(true);
    try {
      const res = await fetch('/api/voices/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: cloneOwnerName,
          voiceName: cloneVoiceName || `${cloneOwnerName}'s Authorized Voice`,
          declarationAccepted: true,
          audioBase64: cloneAudioFile,
          gender: 'neutral',
          language: 'en',
          accent: 'Authorized Clone',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCloneError(data.error || 'Cloning failed.');
      } else {
        setCloneResult(data);
        onSaveProfile(data.profile);
      }
    } catch (err: any) {
      setCloneError(err.message || 'Error communicating with 8WHIE clone verification engine.');
    } finally {
      setIsCloning(false);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation: Size limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      setCloneError('Audio sample exceeds 10MB size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      setCloneAudioFile(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Studio Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>8WHIE Voice Studio</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            Acoustic Sculpting
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Synthesize custom voice personas via natural language prompt or register authorized voice profiles with cryptographic consent records.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setActiveTab('designer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'designer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Voice Designer</span>
          </button>

          <button
            onClick={() => setActiveTab('clone')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'clone'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Authorized Voice Clone</span>
          </button>

          <button
            onClick={() => setActiveTab('sculpt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sculpt'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Formant Sculptor</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI VOICE DESIGNER */}
      {activeTab === 'designer' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                <span>Natural Language Voice Prompt:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Describe gender, age, pitch, accent, tone, energy & delivery style
                </span>
              </label>
              <textarea
                value={designerPrompt}
                onChange={(e) => setDesignerPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Young adult female, warm conversational voice, medium pitch, Indian English accent, calm and confident delivery."
              />
            </div>

            {/* Prompt Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Inspiration Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Young adult female, warm conversational voice, medium pitch, Indian English accent, calm and confident delivery.',
                  'Senior male, authoritative low-pitch baritone, German accent, precise technical instruction style.',
                  'Dynamic young male, energetic podcast host, American accent, enthusiastic cadence with rich timbre.',
                  'Soft-spoken female, meditative whisper tone, Tokyo Japanese accent, slow and peaceful rhythm.',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDesignerPrompt(preset)}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors text-left"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Sample Phrase & Target Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Preview Speech Phrase:</label>
                <input
                  type="text"
                  value={samplePhrase}
                  onChange={(e) => setSamplePhrase(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Language:</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as SupportedLanguage)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleDesignVoice}
                disabled={isDesigning || !designerPrompt.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {isDesigning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing & Designing Voice...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Synthesize & Preview Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Design Result & Preview Card */}
          {designResult && (
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{designResult.profile.name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      AI Generated
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{designResult.profile.description}</p>
                </div>

                <button
                  onClick={handleSaveDesignedVoice}
                  disabled={designSaved}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    designSaved
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold'
                  }`}
                >
                  {designSaved ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Saved to Profiles</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Voice Profile</span>
                    </>
                  )}
                </button>
              </div>

              {/* Inferred Traits Radar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Perceived Gender</div>
                  <div className="text-slate-200 font-semibold capitalize">
                    {designResult.interpretation.perceivedGender}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Accent Profile</div>
                  <div className="text-slate-200 font-semibold">
                    {designResult.interpretation.accent}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Recommended Style</div>
                  <div className="text-slate-200 font-semibold capitalize">
                    {designResult.interpretation.recommendedStyle.replace('_', ' ')}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Base Pitch Shift</div>
                  <div className="text-cyan-400 font-mono">
                    {designResult.profile.acousticParams.pitch.toFixed(1)} st
                  </div>
                </div>
              </div>

              {/* Audio Preview Element */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1.5 font-medium">Acoustic Preview:</span>
                <audio
                  controls
                  src={`data:audio/wav;base64,${designResult.audioPreviewBase64}`}
                  className="w-full h-10 rounded-lg accent-cyan-400"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONSENT-GATED VOICE CLONING */}
      {activeTab === 'clone' && (
        <form onSubmit={handleExecuteClone} className="space-y-6">
          {/* Safeguard Notice Box */}
          <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>8WHIE Ethical Voice Cloning & Anti-Impersonation Charter</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              8WHIE VoiceForge enforces strict zero-tolerance policies against deepfake impersonation, financial fraud, identity deception, and unauthorized likeness replication. Voice cloning is permissible strictly for authorized voice owners or individuals with explicit written licensing.
            </p>
            <div className="text-[11px] text-amber-200/80 font-mono bg-amber-950/40 p-2 rounded border border-amber-900/40">
              Every authorized clone receives an immutable cryptographic audit signature (SHA-256) embedded with watermarking into all generated audio files.
            </div>
          </div>

          {cloneError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 font-medium">
              {cloneError}
            </div>
          )}

          {/* Verification Form */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Legal Voice Owner Full Name: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cloneOwnerName}
                  onChange={(e) => setCloneOwnerName(e.target.value)}
                  placeholder="e.g. Aryan Thakur"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Desired Voice Profile Name:
                </label>
                <input
                  type="text"
                  value={cloneVoiceName}
                  onChange={(e) => setCloneVoiceName(e.target.value)}
                  placeholder="e.g. Aryan (Studio Presentation)"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Audio Upload */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Authorized Reference Audio (WAV / MP3, min 5 seconds clean speech):
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                  id="clone-file-upload"
                />
                <label htmlFor="clone-file-upload" className="cursor-pointer space-y-2 block">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-300 font-medium">
                    {cloneAudioFile ? 'Audio sample loaded successfully' : 'Click to upload audio recording'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    WAV, MP3, M4A up to 10MB (Raw samples are hashed, not publicly stored)
                  </div>
                </label>
              </div>
            </div>

            {/* Legal Consent Acknowledgements */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>
                  <strong>I solemnly declare and confirm</strong> that I own this voice or possess explicit written authorization from the speaker to synthesize speech.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiFraudChecked}
                  onChange={(e) => setAntiFraudChecked(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>
                  I understand that 8WHIE VoiceForge embeds inaudible cryptographic watermarks and that any fraudulent impersonation, scam, or unlawful use will result in immediate termination and audit reporting.
                </span>
              </label>
            </div>

            {/* Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isCloning || !consentChecked || !antiFraudChecked}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isCloning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Acoustic Features & Hashing...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Authorize & Generate Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Audit Result */}
          {cloneResult && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Authorized Voice Profile Successfully Created</span>
              </div>
              <p className="text-xs text-slate-300">
                Voice profile "{cloneResult.profile.name}" is now active in your Voice Profiles library.
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2.5 rounded border border-emerald-900/50 break-all">
                Audit Signature: {cloneResult.consentAuditHash}
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 3: FORMANT ACOUSTIC SCULPTOR */}
      {activeTab === 'sculpt' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">Manual Vocal Tract Sculpting</h3>
            <p className="text-xs text-slate-400">
              Directly adjust vocal tract resonant bandwidths, glottal aspiration, and warmth parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Vocal Tract Length (Formant Shift)</span>
                <span className="font-mono text-cyan-400">{sculptFormant.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={sculptFormant}
                onChange={(e) => setSculptFormant(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500 block">
                Negative shifts mimic larger resonant tracts (male/senior); positive shifts mimic smaller tracts.
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Aspiration / Breathiness Noise</span>
                <span className="font-mono text-cyan-400">{(sculptBreath * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={sculptBreath}
                onChange={(e) => setSculptBreath(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500 block">
                Injects turbulent glottal airflow for warm or whispery textures.
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Vocal Roughness / Subharmonics</span>
                <span className="font-mono text-cyan-400">{(sculptRoughness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.5"
                step="0.01"
                value={sculptRoughness}
                onChange={(e) => setSculptRoughness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500 block">
                Adds gravelly character or vocal fry.
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Timbre Warmth (Low Resonance)</span>
                <span className="font-mono text-cyan-400">{(sculptWarmth * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={sculptWarmth}
                onChange={(e) => setSculptWarmth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500 block">
                Boosts lower fundamental harmonics for richness.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
