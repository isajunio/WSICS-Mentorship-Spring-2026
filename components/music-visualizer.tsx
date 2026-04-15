"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PixelHeart } from "./pixel-heart";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Song } from "./song-card";

interface MusicVisualizerProps {
  song: Song;
  onBack: () => void;
}

export function MusicVisualizer({ song, onBack }: MusicVisualizerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(song.bpm);
  const [bars, setBars] = useState<number[]>(new Array(16).fill(10));
  const [progress, setProgress] = useState(0);
  const [heartScale, setHeartScale] = useState(1);

  const initAudio = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, []);

  const visualize = useCallback(() => {
    if (!analyserRef.current) {
      animationRef.current = requestAnimationFrame(visualize);
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Create 16 bars from frequency data
    const newBars: number[] = [];
    const step = Math.floor(bufferLength / 16);
    
    for (let i = 0; i < 16; i++) {
      const start = i * step;
      let sum = 0;
      for (let j = start; j < start + step && j < bufferLength; j++) {
        sum += dataArray[j];
      }
      const avg = sum / step;
      newBars.push(Math.max(10, (avg / 255) * 100));
    }
    
    setBars(newBars);

    // Calculate average for heart pulse effect
    const avgAmplitude = newBars.reduce((a, b) => a + b, 0) / newBars.length;
    setHeartScale(1 + (avgAmplitude / 200));
    
    // Simulate BPM variation based on music intensity
    const bpmVariation = Math.floor((avgAmplitude / 100) * 10) - 5;
    setCurrentBpm(song.bpm + bpmVariation);

    animationRef.current = requestAnimationFrame(visualize);
  }, [song.bpm]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    if (!audioContextRef.current) {
      initAudio();
    }
    
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      await audioRef.current.play();
      visualize();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(prog) ? 0 : prog);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Simulate bars when not playing with actual audio
  useEffect(() => {
    if (!song.previewUrl && isPlaying) {
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 80 + 20));
        setHeartScale(1 + Math.random() * 0.2);
        setCurrentBpm(song.bpm + Math.floor(Math.random() * 10) - 5);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, song.previewUrl, song.bpm]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b-4 border-foreground">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-card border-4 border-foreground font-[var(--font-pixel)] text-[10px] hover:bg-muted transition-colors pixel-shadow hover:translate-y-1 hover:shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </button>
        
        <a
          href={song.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] border-4 border-foreground font-[var(--font-pixel)] text-[10px] text-black hover:brightness-110 transition-all pixel-shadow hover:translate-y-1 hover:shadow-none"
        >
          SPOTIFY
          <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Song Info */}
        <div className="text-center">
          <h1 className="font-[var(--font-pixel)] text-sm md:text-base text-foreground leading-relaxed">
            {song.title}
          </h1>
          <p className="font-[var(--font-pixel-body)] text-2xl text-muted-foreground mt-2">
            {song.artist}
          </p>
        </div>

        {/* Visualizer Area */}
        <div className="w-full max-w-lg">
          {/* Pixel Heart with BPM */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="transition-transform duration-100"
              style={{ transform: `scale(${heartScale})` }}
            >
              <PixelHeart size={100} color="#ff6b9d" />
            </div>
            <div className="mt-4 text-center">
              <span className="font-[var(--font-pixel)] text-3xl text-primary">
                {currentBpm}
              </span>
              <span className="font-[var(--font-pixel)] text-xs text-muted-foreground ml-2">
                BPM
              </span>
            </div>
          </div>

          {/* Frequency Bars */}
          <div className="flex items-end justify-center gap-1 h-32 mb-8 px-4">
            {bars.map((height, i) => (
              <div
                key={i}
                className="flex-1 max-w-4 transition-all duration-75"
                style={{
                  height: `${height}%`,
                  background: i % 2 === 0 
                    ? 'linear-gradient(to top, #ff6b9d, #ff9cbb)' 
                    : 'linear-gradient(to top, #64d2ff, #9ce5ff)',
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-card border-4 border-foreground mb-6">
            <div 
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className="w-12 h-12 bg-card border-4 border-foreground flex items-center justify-center hover:bg-muted transition-colors pixel-shadow hover:translate-y-1 hover:shadow-none"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={togglePlay}
              className={cn(
                "w-20 h-20 border-4 border-foreground flex items-center justify-center transition-all pixel-shadow hover:translate-y-1 hover:shadow-none",
                isPlaying ? "bg-secondary" : "bg-primary"
              )}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-secondary-foreground" fill="currentColor" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              )}
            </button>

            <div className="w-12 h-12 bg-card border-4 border-foreground flex items-center justify-center">
              <span className="font-[var(--font-pixel)] text-[8px]">
                {Math.floor(progress / 100 * 30)}s
              </span>
            </div>
          </div>
        </div>

        {/* Floating Pixels Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </main>

      {/* Hidden Audio Element */}
      {song.previewUrl && (
        <audio
          ref={audioRef}
          src={song.previewUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}
