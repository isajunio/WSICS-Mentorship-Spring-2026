"use client"

import { cn } from "@/lib/utils"
import type { Song } from "@/lib/itunes"

interface SongRowProps {
  song: Song
  targetBpm: number
  isPlaying: boolean
  onPlay: () => void
  onSelect: () => void
}

// 8 gradient pairs for album art (when no artwork available)
const albumColors = [
  { bg: "#ef4444", accent: "#dc2626" },
  { bg: "#f97316", accent: "#ea580c" },
  { bg: "#eab308", accent: "#ca8a04" },
  { bg: "#22c55e", accent: "#16a34a" },
  { bg: "#14b8a6", accent: "#0d9488" },
  { bg: "#3b82f6", accent: "#2563eb" },
  { bg: "#a855f7", accent: "#9333ea" },
  { bg: "#ec4899", accent: "#db2777" },
]

// ── Pixel icons ──────────────────────────────────────────────────────────────

function PixelMusicNote({ color }: { color: string }) {
  return (
    <svg width="24" height="28" viewBox="0 0 12 16" fill={color}>
      <rect x="4"  y="0"  width="2" height="12" />
      <rect x="6"  y="0"  width="6" height="2"  />
      <rect x="10" y="2"  width="2" height="4"  />
      <rect x="0"  y="10" width="6" height="4"  />
      <rect x="2"  y="14" width="2" height="2"  />
    </svg>
  )
}

function PixelPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <rect x="4"  y="2" width="2" height="12" />
      <rect x="6"  y="3" width="2" height="10" />
      <rect x="8"  y="4" width="2" height="8"  />
      <rect x="10" y="5" width="2" height="6"  />
      <rect x="12" y="6" width="2" height="4"  />
    </svg>
  )
}

function PixelPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <rect x="3" y="2" width="4" height="12" />
      <rect x="9" y="2" width="4" height="12" />
    </svg>
  )
}

// ── BPM match helpers (exact from zip) ───────────────────────────────────────

function getBarColor(diff: number): string {
  if (diff === 0)           return "#ff6b9d"
  if (Math.abs(diff) <= 3)  return "#f97316"
  if (Math.abs(diff) <= 5)  return "#eab308"
  return "#6b7280"
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ── Component ────────────────────────────────────────────────────────────────

export function SongRow({ song, targetBpm, isPlaying, onPlay, onSelect }: SongRowProps) {
  const bpmDiff        = song.bpm - targetBpm
  const isExact        = bpmDiff === 0
  const matchPct       = Math.max(0, 100 - Math.abs(bpmDiff) * 5)
  const barColor       = getBarColor(bpmDiff)
  const colorIndex     = song.title.length % albumColors.length
  const fallbackColors = albumColors[colorIndex]

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 transition-all cursor-pointer border-2",
        isPlaying
          ? "bg-primary/10 border-primary"
          : "bg-card/80 border-border hover:border-primary/50"
      )}
      style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
      onClick={onSelect}
    >
      {/* ── Album art / play button ── */}
      <div
        className="relative w-14 h-14 flex items-center justify-center shrink-0 border-2 border-foreground/20 overflow-hidden"
        style={song.albumArt
          ? { backgroundImage: `url(${song.albumArt})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {
              background: `linear-gradient(135deg, ${fallbackColors.bg} 0%, ${fallbackColors.accent} 100%)`,
              boxShadow: 'inset 3px 3px 0 rgba(255,255,255,0.2), inset -3px -3px 0 rgba(0,0,0,0.2)',
            }
        }
        onClick={e => { e.stopPropagation(); onPlay() }}
      >
        {/* Dark overlay on artwork so icons are visible */}
        {song.albumArt && (
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
        )}

        <div className="relative z-10">
          {isPlaying ? (
            <PixelPause />
          ) : (
            <>
              <div className={cn(song.albumArt ? "block" : "group-hover:hidden")}>
                <PixelMusicNote color="white" />
              </div>
              {!song.albumArt && (
                <div className="hidden group-hover:block">
                  <PixelPlay />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Song info ── */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-mono text-sm font-bold truncate",
          isPlaying ? "text-primary" : "text-foreground"
        )}>
          {song.title}
        </h3>
        <p className="font-sans text-lg text-muted-foreground truncate">
          {song.artist} &middot; {song.album}
        </p>
        {song.genre && (
          <p className="font-sans text-sm text-muted-foreground/60 truncate">{song.genre}</p>
        )}
      </div>

      {/* ── BPM match + duration ── */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="font-mono text-sm font-bold text-foreground">{song.bpm}</div>
          <div className="flex items-center gap-2 mt-1">
            {/* Pixel-style BPM match bar */}
            <div
              className="w-16 h-2 bg-muted overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${matchPct}%`,
                  background: barColor,
                  boxShadow: `0 0 8px ${barColor}`,
                }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground w-12">
              {isExact ? 'exact' : `${bpmDiff > 0 ? '+' : ''}${bpmDiff}`}
            </span>
          </div>
        </div>

        <span className="font-sans text-lg text-muted-foreground w-12 text-right">
          {formatDuration(song.duration)}
        </span>
      </div>
    </div>
  )
}