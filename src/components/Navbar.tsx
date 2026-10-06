/**
 * 8WHIE VoiceForge - Navigation & Header Bar
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React from 'react';
import {
  Mic,
  Sliders,
  Users,
  BookOpen,
  History,
  ShieldCheck,
  Code2,
  Info,
  Radio,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'tts'
  | 'voice-studio'
  | 'voices'
  | 'pronunciation'
  | 'history'
  | 'safety'
  | 'api'
  | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  systemHealthy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemHealthy }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tts', label: 'Text-to-Speech', icon: <Mic className="w-4 h-4" />, badge: 'Core' },
    { id: 'voice-studio', label: 'Voice Studio', icon: <Sliders className="w-4 h-4" />, badge: 'AI' },
    { id: 'voices', label: 'Voice Profiles', icon: <Users className="w-4 h-4" /> },
    { id: 'pronunciation', label: 'Pronunciation Lab', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'history', label: 'Audio Library', icon: <History className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety & Ethics', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'api', label: 'REST API', icon: <Code2 className="w-4 h-4" /> },
    { id: 'about', label: 'About 8WHIE', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* Top Banner with Brand & Creator Attribution */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold text-slate-200 tracking-wide">8WHIE VoiceForge</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">AI Speech • Voice Design • Multilingual TTS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Built by <strong className="text-cyan-400 font-medium">8WHIE</strong> • Founder & Owner:{' '}
            <strong className="text-slate-200 font-medium">Aryan Thakur</strong>
          </span>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-[11px] text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{systemHealthy ? 'DSP Synthesizer Active' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-white text-base">8WHIE</span>
              <span className="font-light text-cyan-400 text-sm tracking-wider">VOICEFORGE</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 shadow-sm shadow-cyan-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tts')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Open Studio</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scroll Nav */}
      <div className="lg:hidden px-4 pb-2 pt-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-900 bg-slate-950/95">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                isActive
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/50'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
