/**
 * 8WHIE VoiceForge - Waveform Player & Audio Visualizer
 * Copyright © 2026 8WHIE / Aryan Thakur. All rights reserved.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  ShieldCheck,
  Share2,
  Check,
  Activity,
} from 'lucide-react';

interface WaveformPlayerProps {
  audioBase64: string;
  durationSeconds?: number;
  sampleRate?: number;
  format?: string;
  title?: string;
  voiceName?: string;
  hasWatermark?: boolean;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioBase64,
  durationSeconds = 0,
  sampleRate = 24000,
  format = 'wav',
  title = 'Synthesized Speech',
  voiceName,
  hasWatermark = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const animationFrameRef = useRef<number | null>(null);

  // Convert base64 to Blob URL
  useEffect(() => {
    if (!audioBase64) return;
    try {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `audio/${format}` });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error('Error generating audio blob:', err);
    }
  }, [audioBase64, format]);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(audio.duration);
      } else {
        setDuration(durationSeconds);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [durationSeconds, audioUrl]);

  // Canvas visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 48;
      const barWidth = width / numBars - 2;
      const progress = duration > 0 ? currentTime / duration : 0;

      for (let i = 0; i < numBars; i++) {
        const barProgress = i / numBars;
        const isPast = barProgress <= progress;

        // Dynamic pseudo-spectrum height with wave motion when playing
        let barHeight = 6;
        if (isPlaying) {
          const t = Date.now() / 150;
          const sine = Math.sin(t + i * 0.4) * Math.cos(t * 0.8 + i * 0.2);
          barHeight = Math.max(4, Math.abs(sine) * (height * 0.85));
        } else {
          // Static harmonic contour based on index
          const harmonic = Math.sin((i / numBars) * Math.PI);
          barHeight = Math.max(4, harmonic * (height * 0.6));
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        if (isPast) {
          ctx.fillStyle = isPlaying ? '#06b6d4' : '#0891b2'; // Cyan
        } else {
          ctx.fillStyle = '#334155'; // Slate 700
        }

        // Draw rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((e) => console.error(e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `8WHIE_VoiceForge_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(audioBase64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSecs = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 shadow-xl shadow-cyan-950/20">
      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">{title}</div>
            <div className="text-[11px] text-slate-400">
              {voiceName ? `Voice: ${voiceName} • ` : ''}
              {format.toUpperCase()} • {sampleRate} Hz • 16-bit PCM
            </div>
          </div>
        </div>

        {hasWatermark && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[10px] text-emerald-300 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>8WHIE Steganographic Watermark</span>
          </div>
        )}
      </div>

      {/* Visualizer Canvas */}
      <div className="relative w-full h-16 bg-slate-950/80 rounded-lg border border-slate-800/80 overflow-hidden mb-3 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={64}
          className="w-full h-full cursor-pointer"
          onClick={togglePlay}
        />
      </div>

      {/* Scrubber & Time */}
      <div className="space-y-1 mb-3">
        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatSecs(currentTime)}</span>
          <span>{formatSecs(duration)}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/25 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs"
            title="Restart playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speed Multiplier Pill */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
          {[0.75, 1.0, 1.25, 1.5].map((spd) => (
            <button
              key={spd}
              onClick={() => changeSpeed(spd)}
              className={`px-2 py-0.5 rounded ${
                playbackSpeed === spd
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Actions (Download & Copy) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            title="Copy Audio Base64"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Base64'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium transition-all shadow-sm shadow-cyan-950"
            title="Download Audio File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
