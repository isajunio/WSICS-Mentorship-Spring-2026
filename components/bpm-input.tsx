"use client";

import { useState, useEffect } from "react";
import { PixelHeart } from "./pixel-heart";
import { cn } from "@/lib/utils";

interface BpmInputProps {
  onSearch: (bpm: number) => void;
  isLoading?: boolean;
}

export function BpmInput({ onSearch, isLoading }: BpmInputProps) {
  const [bpm, setBpm] = useState(120);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (bpm >= 40 && bpm <= 200) {
      setIsAnimating(true);
    }
  }, [bpm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bpm >= 40 && bpm <= 200) {
      onSearch(bpm);
    }
  };

  const presetBpms = [
    { label: "Chill", bpm: 70, emoji: "~" },
    { label: "Normal", bpm: 100, emoji: "*" },
    { label: "Workout", bpm: 140, emoji: "!" },
    { label: "Intense", bpm: 180, emoji: "!!" },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Animated Heart */}
      <div className="relative">
        <PixelHeart 
          size={120} 
          color="#ff6b9d" 
          animate={isAnimating}
          className="drop-shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-[var(--font-pixel)] text-xs text-white font-bold drop-shadow-md"
            style={{ textShadow: '2px 2px 0 #000' }}
          >
            {bpm}
          </span>
        </div>
      </div>

      {/* BPM Display */}
      <div className="text-center">
        <p className="font-[var(--font-pixel-body)] text-2xl text-foreground mb-1">
          Your Heart Rate
        </p>
        <p className="font-[var(--font-pixel)] text-4xl text-primary">
          {bpm} BPM
        </p>
      </div>

      {/* Slider */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="relative">
          <input
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full h-4 bg-card appearance-none cursor-pointer pixel-inset"
            style={{
              background: `linear-gradient(to right, #ff6b9d ${((bpm - 40) / 160) * 100}%, #1a1040 ${((bpm - 40) / 160) * 100}%)`
            }}
          />
          <div className="flex justify-between text-xs font-[var(--font-pixel)] text-muted-foreground mt-2">
            <span>40</span>
            <span>200</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {presetBpms.map(({ label, bpm: presetBpm, emoji }) => (
            <button
              key={label}
              type="button"
              onClick={() => setBpm(presetBpm)}
              className={cn(
                "px-2 py-3 text-xs font-[var(--font-pixel)] transition-all pixel-shadow",
                "border-4 border-foreground bg-card hover:bg-primary hover:text-primary-foreground",
                bpm === presetBpm && "bg-primary text-primary-foreground"
              )}
            >
              <span className="block text-lg">{emoji}</span>
              <span className="block mt-1 text-[8px]">{label}</span>
            </button>
          ))}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full py-4 text-sm font-[var(--font-pixel)] transition-all pixel-shadow",
            "border-4 border-foreground bg-primary text-primary-foreground",
            "hover:translate-y-1 hover:shadow-none active:translate-y-2",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <span className="animate-pulse">SEARCHING...</span>
          ) : (
            <span>FIND MY SONGS</span>
          )}
        </button>
      </form>
    </div>
  );
}
