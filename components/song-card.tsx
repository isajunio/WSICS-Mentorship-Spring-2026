"use client";

import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  bpm: number;
  previewUrl: string | null;
  spotifyUrl: string;
  duration: number;
}

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlay: () => void;
  onSelect: () => void;
}

export function SongCard({ song, isPlaying, onPlay, onSelect }: SongCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-card border-4 border-foreground pixel-shadow transition-all cursor-pointer group",
        "hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        isPlaying && "border-primary bg-card/80"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 p-3">
        {/* Album Art with Play Button */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className="w-full h-full bg-muted border-2 border-foreground overflow-hidden">
            {/* Pixelated album art placeholder */}
            <div 
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, 
                  hsl(${(song.id.charCodeAt(0) * 15) % 360}, 70%, 60%), 
                  hsl(${(song.id.charCodeAt(1) * 15) % 360}, 70%, 40%)
                )`,
                imageRendering: 'pixelated'
              }}
            />
          </div>
          
          {/* Play/Pause overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity",
              isPlaying && "opacity-100"
            )}
          >
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
              )}
            </div>
          </button>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-[var(--font-pixel)] text-[10px] text-foreground truncate leading-tight">
            {song.title}
          </h3>
          <p className="font-[var(--font-pixel-body)] text-lg text-muted-foreground truncate">
            {song.artist}
          </p>
          <p className="font-[var(--font-pixel-body)] text-sm text-muted-foreground/70 truncate">
            {song.album}
          </p>
        </div>

        {/* BPM Badge */}
        <div className="flex-shrink-0 text-center">
          <div className="bg-secondary border-2 border-foreground px-3 py-2">
            <span className="font-[var(--font-pixel)] text-xs text-secondary-foreground">
              {song.bpm}
            </span>
          </div>
          <span className="font-[var(--font-pixel)] text-[8px] text-muted-foreground mt-1 block">
            BPM
          </span>
        </div>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary">
          <div className="h-full bg-accent animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
}
