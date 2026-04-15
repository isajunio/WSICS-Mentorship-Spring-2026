"use client";

import { useRef, useEffect } from "react";
import { SongCard, type Song } from "./song-card";
import { PixelHeart } from "./pixel-heart";

interface SongListProps {
  songs: Song[];
  bpm: number;
  playingSongId: string | null;
  onPlaySong: (songId: string) => void;
  onSelectSong: (song: Song) => void;
  onBack: () => void;
}

export function SongList({ 
  songs, 
  bpm, 
  playingSongId, 
  onPlaySong, 
  onSelectSong,
  onBack 
}: SongListProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const currentSong = songs.find(s => s.id === playingSongId);
      if (currentSong?.previewUrl) {
        audioRef.current.src = currentSong.previewUrl;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [playingSongId, songs]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b-4 border-foreground">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-card border-4 border-foreground font-[var(--font-pixel)] text-[10px] hover:bg-muted transition-colors pixel-shadow hover:translate-y-1 hover:shadow-none"
            >
              {"<"} BACK
            </button>
            
            <div className="flex items-center gap-3">
              <PixelHeart size={32} color="#ff6b9d" animate />
              <div className="text-right">
                <span className="font-[var(--font-pixel)] text-lg text-primary">
                  {bpm} BPM
                </span>
                <p className="font-[var(--font-pixel)] text-[8px] text-muted-foreground">
                  {songs.length} TRACKS
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Song Grid */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="font-[var(--font-pixel)] text-xs text-foreground mb-2">
            SONGS MATCHING YOUR HEARTBEAT
          </h2>
          <p className="font-[var(--font-pixel-body)] text-lg text-muted-foreground">
            Tap a song to open the visualizer
          </p>
        </div>

        <div className="space-y-3">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="animate-in slide-in-from-bottom-4 fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SongCard
                song={song}
                isPlaying={playingSongId === song.id}
                onPlay={() => onPlaySong(song.id)}
                onSelect={() => onSelectSong(song)}
              />
            </div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-12">
            <PixelHeart size={80} color="#ff6b9d" className="mx-auto mb-4 opacity-50" />
            <p className="font-[var(--font-pixel)] text-xs text-muted-foreground">
              No songs found at this BPM
            </p>
            <p className="font-[var(--font-pixel-body)] text-lg text-muted-foreground mt-2">
              Try adjusting your heart rate!
            </p>
          </div>
        )}
      </main>

      {/* Hidden Audio Player for Preview */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Decorative Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
    </div>
  );
}
