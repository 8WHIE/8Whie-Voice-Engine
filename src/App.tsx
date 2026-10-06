/**
 * 8WHIE VoiceForge - Main Application
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TtsStudio } from './components/TtsStudio';
import { VoiceStudio } from './components/VoiceStudio';
import { VoiceProfiles } from './components/VoiceProfiles';
import { PronunciationLab } from './components/PronunciationLab';
import { AudioLibrary } from './components/AudioLibrary';
import { SafetyCenter } from './components/SafetyCenter';
import { ApiExplorer } from './components/ApiExplorer';
import { About8Whie } from './components/About8Whie';
import { VoiceProfile, HistoryItem, TtsGenerationResponse } from './types/tts';
import { DEFAULT_VOICES } from './lib/defaultVoices';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [voices, setVoices] = useState<VoiceProfile[]>(DEFAULT_VOICES);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeResult, setActiveResult] = useState<TtsGenerationResponse | null>(null);
  const [systemHealthy, setSystemHealthy] = useState(true);
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);
  const [audioPreviewElement, setAudioPreviewElement] = useState<HTMLAudioElement | null>(null);

  // Initial fetch for voices, history, and health
  useEffect(() => {
    const initData = async () => {
      try {
        const [healthRes, voicesRes, historyRes] = await Promise.allSettled([
          fetch('/api/health'),
          fetch('/api/voices'),
          fetch('/api/history'),
        ]);

        if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
          setSystemHealthy(true);
        }

        if (voicesRes.status === 'fulfilled' && voicesRes.value.ok) {
          const vData = await voicesRes.value.json();
          if (vData.voices && vData.voices.length > 0) {
            setVoices(vData.voices);
          }
        }

        if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
          const hData = await historyRes.value.json();
          if (hData.history) {
            setHistory(hData.history);
          }
        }
      } catch (err) {
        console.warn('Initial server sync warning, using local state:', err);
      }
    };

    initData();
  }, []);

  // Main synthesis caller
  const handleSynthesize = async (payload: any): Promise<TtsGenerationResponse | null> => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setActiveResult(data);
        setHistory((prev) => [data, ...prev]);
        return data;
      }
      return null;
    } catch (err) {
      console.error('Synthesis error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick synthesize from Dashboard
  const handleQuickSynthesize = async (text: string, voiceId: string) => {
    const res = await handleSynthesize({
      text,
      voiceId,
      language: 'en',
      speed: 1.0,
      pitch: 0.0,
      volume: 1.0,
      expressiveIntensity: 0.85,
    });
    if (res) {
      setActiveResult(res);
    }
  };

  // Save new or designed voice profile
  const handleSaveProfile = (profile: VoiceProfile) => {
    setVoices((prev) => {
      const exists = prev.some((v) => v.id === profile.id);
      if (exists) {
        return prev.map((v) => (v.id === profile.id ? profile : v));
      }
      return [profile, ...prev];
    });
  };

  // Delete profile
  const handleDeleteProfile = async (id: string) => {
    try {
      await fetch(`/api/voices/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setVoices((prev) => prev.filter((v) => v.id !== id));
  };

  // Preview voice sample playback
  const handlePreviewVoice = (voice: VoiceProfile) => {
    if (previewPlayingId === voice.id) {
      if (audioPreviewElement) {
        audioPreviewElement.pause();
      }
      setPreviewPlayingId(null);
      return;
    }

    if (audioPreviewElement) {
      audioPreviewElement.pause();
    }

    // Synthesize quick preview on the fly
    handleSynthesize({
      text: `Hello! I am ${voice.name}. Powered by 8WHIE VoiceForge.`,
      voiceId: voice.id,
      language: voice.language,
      speed: voice.acousticParams.speed,
      pitch: voice.acousticParams.pitch,
    }).then((res) => {
      if (res) {
        const audio = new Audio(`data:audio/${res.format};base64,${res.audioBase64}`);
        audio.onended = () => setPreviewPlayingId(null);
        audio.play().then(() => {
          setAudioPreviewElement(audio);
          setPreviewPlayingId(voice.id);
        });
      }
    });
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleLoadIntoStudio = (item: HistoryItem) => {
    setActiveResult(item);
    setActiveTab('tts');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemHealthy={systemHealthy}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 md:pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            voices={voices}
            history={history}
            onNavigate={setActiveTab}
            onQuickSynthesize={handleQuickSynthesize}
            isSynthesizing={isGenerating}
            latestAudioResult={activeResult}
          />
        )}

        {activeTab === 'tts' && (
          <TtsStudio
            voices={voices}
            onSynthesize={handleSynthesize}
            isGenerating={isGenerating}
            activeResult={activeResult}
          />
        )}

        {activeTab === 'voice-studio' && (
          <VoiceStudio onSaveProfile={handleSaveProfile} />
        )}

        {activeTab === 'voices' && (
          <VoiceProfiles
            voices={voices}
            onDeleteProfile={handleDeleteProfile}
            onSelectForStudio={(id) => {
              setActiveTab('tts');
            }}
            onPreviewVoice={handlePreviewVoice}
            previewPlayingId={previewPlayingId}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationLab
            onQuickSpeak={(spokenText) => {
              handleSynthesize({
                text: spokenText,
                voiceId: voices[0]?.id || '8whie-aryan',
              });
              setActiveTab('tts');
            }}
          />
        )}

        {activeTab === 'history' && (
          <AudioLibrary
            history={history}
            onDeleteHistory={handleDeleteHistory}
            onLoadIntoStudio={handleLoadIntoStudio}
          />
        )}

        {activeTab === 'safety' && <SafetyCenter />}

        {activeTab === 'api' && <ApiExplorer />}

        {activeTab === 'about' && <About8Whie />}
      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">8WHIE VoiceForge</span>
            <span>•</span>
            <span>AI Speech & Voice Design</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <div>
              Built by <strong className="text-cyan-400">8WHIE</strong> | Founder & Owner:{' '}
              <strong className="text-slate-200">Aryan Thakur</strong>
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5">
              Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
