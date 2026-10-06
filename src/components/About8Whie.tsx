/**
 * 8WHIE VoiceForge - About 8WHIE & Intellectual Property Notice
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  GitBranch,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Layers,
} from 'lucide-react';

export const About8Whie: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Brand Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Project Owner & Creator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            8WHIE VoiceForge
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            An original, independent multilingual Text-to-Speech (TTS) and AI voice design platform developed and owned by <strong className="text-white">8WHIE</strong> and founder <strong className="text-cyan-400">Aryan Thakur</strong>.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <div>Brand: <strong className="text-white">8WHIE</strong></div>
            <div>•</div>
            <div>Founder & Owner: <strong className="text-cyan-400">Aryan Thakur</strong></div>
            <div>•</div>
            <div>GitHub Org: <strong className="text-slate-200">8whie</strong></div>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTELLECTUAL PROPERTY & ORIGINALITY CHARTER */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Statement of Originality & First-Principles Architecture</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          8WHIE VoiceForge has been designed and implemented independently from first principles. It does not copy, fork, reproduce, translate, paraphrase, or modify the source code, architecture-specific implementation, documentation, UI, prompts, comments, assets, or checkpoints of any existing project (including OmniVoice or other public/proprietary speech repositories).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200">Original DSP Synthesizer</span>
            <p className="text-slate-400 text-[11px]">
              Vocal tract formant filter bank and glottal pulse excitation model engineered from fundamental acoustic physics.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200">Original Expressive AST</span>
            <p className="text-slate-400 text-[11px]">
              Custom tokenizer conditioning pitch, breathiness, and cadence on [whisper], [breath], and [laugh] tokens.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200">Original Normalizer</span>
            <p className="text-slate-400 text-[11px]">
              Tailored expansion for Indian currency (₹), international currencies, Devanagari transliteration, and 8WHIE brand identity.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: THIRD-PARTY DEPENDENCY & LICENSING AUDIT */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Third-Party Dependency & Licensing Transparency Table</span>
        </h3>
        <p className="text-xs text-slate-400">
          In strict compliance with open-source licensing rules, third-party libraries used in the integration layer are identified below. 8WHIE makes no ownership claim over third-party dependencies:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-medium">Dependency</th>
                <th className="pb-2 font-medium">License</th>
                <th className="pb-2 font-medium">Purpose in 8WHIE VoiceForge</th>
                <th className="pb-2 font-medium">Ownership / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              <tr>
                <td className="py-2 text-white font-bold">Express</td>
                <td className="py-2 text-cyan-400">MIT</td>
                <td className="py-2 text-slate-300">HTTP REST API routing & middleware</td>
                <td className="py-2 text-slate-400">OpenJS Foundation</td>
              </tr>
              <tr>
                <td className="py-2 text-white font-bold">React & ReactDOM</td>
                <td className="py-2 text-cyan-400">MIT</td>
                <td className="py-2 text-slate-300">Frontend UI component reactivity</td>
                <td className="py-2 text-slate-400">Meta Platforms, Inc.</td>
              </tr>
              <tr>
                <td className="py-2 text-white font-bold">Tailwind CSS</td>
                <td className="py-2 text-cyan-400">MIT</td>
                <td className="py-2 text-slate-300">Responsive utility styling system</td>
                <td className="py-2 text-slate-400">Tailwind Labs, Inc.</td>
              </tr>
              <tr>
                <td className="py-2 text-white font-bold">Lucide React</td>
                <td className="py-2 text-cyan-400">ISC</td>
                <td className="py-2 text-slate-300">Clean UI vector iconography</td>
                <td className="py-2 text-slate-400">Lucide Contributors</td>
              </tr>
              <tr>
                <td className="py-2 text-white font-bold">@google/genai</td>
                <td className="py-2 text-cyan-400">Apache-2.0</td>
                <td className="py-2 text-slate-300">Neural speech & voice model adapter</td>
                <td className="py-2 text-slate-400">Google LLC</td>
              </tr>
              <tr>
                <td className="py-2 text-white font-bold">TypeScript</td>
                <td className="py-2 text-cyan-400">Apache-2.0</td>
                <td className="py-2 text-slate-300">Static type safety & AST verification</td>
                <td className="py-2 text-slate-400">Microsoft Corporation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: CUSTOM MODEL TRAINING ROADMAP */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>8WHIE Proprietary Neural Model Training Roadmap</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          While this web platform integrates an instant DSP formant synthesizer and neural cloud model adapters, 8WHIE has architected a comprehensive roadmap to train its own proprietary speech checkpoints using ethically sourced, permissively licensed datasets:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300">1. Dataset Preparation</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Curate multi-speaker corpora with explicit commercial redistributable licenses (e.g. Common Voice CC-0/permissive slices, LibriTTS-R, IndicSpeech under open terms). Filter for SNR &gt; 35dB, 24/48kHz uncompressed audio.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300">2. Phoneme & Acoustic Modeling</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Train a conditional flow-matching or diffusion acoustic backbone with rotary position embeddings (RoPE) predicting 80-band Mel spectrograms from normalized phoneme tokens.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300">3. Neural Vocoder</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pair with an adversarial multi-period vocoder (e.g. BigVGAN / HiFi-GAN derivatives) capable of high-fidelity, artifact-free 48kHz audio reconstruction on single GPU/CPU instances.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300">4. Adapter Integration</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Plug the trained checkpoint into 8WHIE VoiceForge’s `ModelProvider` interface without altering frontend code or REST API contracts.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: COPYRIGHT & ATTRIBUTION */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-2">
        <div className="text-xs text-slate-300">
          <strong>Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.</strong>
        </div>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
          The original application codebase, user interface, acoustic synthesis algorithms, expressive parsing mechanisms, and 8WHIE branding are the intellectual property of 8WHIE and Aryan Thakur.
        </p>
      </div>
    </div>
  );
};
