"use client"

import { useState, useEffect, useCallback } from "react"
import { SongRow } from "./song-row"
import { PixelBackground } from "./pixel-background"
import { fetchSongsByBpm, getMoodForBpm, type Song } from "@/lib/itunes"
import { cn } from "@/lib/utils"

interface SongsViewProps {
  bpm: number
  onBack: () => void
  onSelectSong: (song: Song) => void
}

const rangeOptions = [
  { label: "+/- 3",  value: 3  },
  { label: "+/- 5",  value: 5  },
  { label: "+/- 10", value: 10 },
  { label: "+/- 15", value: 15 },
]

// ── Pixel icons ──────────────────────────────────────────────────────────────

function PixelArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <rect x="6" y="2"  width="2" height="2" />
      <rect x="4" y="4"  width="2" height="2" />
      <rect x="2" y="6"  width="2" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="6" y="12" width="2" height="2" />
      <rect x="6" y="6"  width="8" height="4" />
    </svg>
  )
}

function PixelSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="4"  y="2"  width="6" height="2" />
      <rect x="2"  y="4"  width="2" height="6" />
      <rect x="10" y="4"  width="2" height="4" />
      <rect x="4"  y="10" width="4" height="2" />
      <rect x="8"  y="10" width="2" height="2" />
      <rect x="10" y="12" width="2" height="2" />
      <rect x="12" y="14" width="2" height="2" />
    </svg>
  )
}

function PixelMusicBars() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[3, 4, 2, 4, 3].map((h, i) => (
        <div
          key={i}
          className="w-1 bg-primary animate-bounce-pixel"
          style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

// Pixel spinner for loading state
function PixelSpinner() {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      {/* 3×3 pixel spinner */}
      <div className="grid grid-cols-3 gap-1 w-12 h-12">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
        Fetching tracks…
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SongsView({ bpm, onBack, onSelectSong }: SongsViewProps) {
  const [songs,         setSongs]         = useState<Song[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState(5)
  const [playingId,     setPlayingId]     = useState<string | null>(null)

  const mood = getMoodForBpm(bpm)

  // Fetch from iTunes API whenever BPM changes
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSongs([])
    setPlayingId(null)
    try {
      const data = await fetchSongsByBpm(bpm)
      setSongs(data)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [bpm])

  useEffect(() => { load() }, [load])

  // Client-side range filter on the already-fetched songs
  const filtered = songs.filter(s => Math.abs(s.bpm - bpm) <= selectedRange)

  const handlePlay = (song: Song) => {
    setPlayingId(prev => prev === song.id ? null : song.id)
  }

  return (
    <div className="min-h-screen relative">
      <PixelBackground />

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 bg-background/95 border-b-4 border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">

          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="w-12 h-12 bg-card border-4 border-border flex items-center justify-center hover:bg-muted transition-colors pixel-btn text-foreground"
                style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
              >
                <PixelArrowLeft />
              </button>

              <div>
                <h1 className="font-mono text-base md:text-lg font-bold text-foreground">
                  Songs at {bpm} BPM
                </h1>
                <p className="font-sans text-lg text-muted-foreground">
                  {mood.label} &middot; {mood.description}
                </p>
              </div>
            </div>

            <span
              className="text-4xl md:text-5xl font-mono font-bold text-primary"
              style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
            >
              {bpm}
            </span>
          </div>

          {/* Range filter row */}
          <div className="flex items-center gap-4 mt-4 flex-wrap pb-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PixelSearch />
              <span className="font-sans text-lg">Range:</span>
            </div>

            <div className="flex items-center gap-2">
              {rangeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedRange(option.value)}
                  className={cn(
                    "px-4 py-2 font-mono text-xs font-bold transition-colors border-2",
                    selectedRange === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  )}
                  style={{
                    boxShadow: selectedRange === option.value
                      ? '3px 3px 0 rgba(0,0,0,0.3)'
                      : '2px 2px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {loading ? '…' : `${filtered.length} tracks`}
            </span>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">

        {/* Loading */}
        {loading && <PixelSpinner />}

        {/* Error */}
        {!loading && error && (
          <div
            className="text-center py-16 bg-card/80 border-4 border-destructive"
            style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}
          >
            <p className="font-mono text-xs text-destructive mb-4">!! {error}</p>
            <button
              onClick={load}
              className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs border-4 border-foreground"
              style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
            >
              RETRY
            </button>
          </div>
        )}

        {/* Empty (after load) */}
        {!loading && !error && filtered.length === 0 && (
          <div
            className="text-center py-16 bg-card/80 border-4 border-border"
            style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}
          >
            <p className="font-sans text-xl text-muted-foreground">
              No songs found in this range. Try expanding it.
            </p>
          </div>
        )}

        {/* Song list */}
        {!loading && !error && (
          <div className="space-y-3">
            {filtered.map(song => (
              <SongRow
                key={song.id}
                song={song}
                targetBpm={bpm}
                isPlaying={playingId === song.id}
                onPlay={() => handlePlay(song)}
                onSelect={() => onSelectSong(song)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Now Playing mini-bar ── */}
      {playingId && (() => {
        const s = filtered.find(x => x.id === playingId)
        if (!s) return null
        return (
          <div
            className="fixed bottom-0 left-0 right-0 bg-card border-t-4 border-border z-30"
            style={{ boxShadow: '0 -4px 0 rgba(0,0,0,0.2)' }}
          >
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Album art thumbnail */}
                <div
                  className="w-12 h-12 border-2 border-primary shrink-0 overflow-hidden"
                  style={s.albumArt
                    ? { backgroundImage: `url(${s.albumArt})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: 'rgba(255,107,157,0.2)' }
                  }
                >
                  {!s.albumArt && (
                    <div className="w-full h-full flex items-center justify-center">
                      <PixelMusicBars />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-foreground truncate max-w-[160px]">
                    {s.title}
                  </p>
                  <p className="font-sans text-lg text-muted-foreground truncate max-w-[160px]">
                    {s.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-primary font-mono text-sm font-bold">
                  {s.bpm} BPM
                </span>
                <button
                  onClick={() => onSelectSong(s)}
                  className="font-sans text-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tap to visualize →
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}