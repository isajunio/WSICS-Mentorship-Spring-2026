"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { PixelBackground } from "./pixel-background"
import type { Song } from "@/lib/itunes"
import { cn } from "@/lib/utils"

interface VisualizerViewProps {
  song: Song
  onBack: () => void
}

// ── Pixel icons (exact from zip) ─────────────────────────────────────────────

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

function PixelHeart({ size = 16, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={size * 0.875} viewBox="0 0 16 14" fill="none"
      className={cn(animate && "animate-pulse-heart")}>
      <rect x="2"  y="0"  width="4"  height="2" fill="#ff6b9d" />
      <rect x="10" y="0"  width="4"  height="2" fill="#ff6b9d" />
      <rect x="0"  y="2"  width="8"  height="2" fill="#ff6b9d" />
      <rect x="8"  y="2"  width="8"  height="2" fill="#ff6b9d" />
      <rect x="0"  y="4"  width="16" height="2" fill="#ff6b9d" />
      <rect x="0"  y="6"  width="16" height="2" fill="#ff4d6d" />
      <rect x="2"  y="8"  width="12" height="2" fill="#ff4d6d" />
      <rect x="4"  y="10" width="8"  height="2" fill="#e8405f" />
      <rect x="6"  y="12" width="4"  height="2" fill="#e8405f" />
    </svg>
  )
}

function PixelPlay() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
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
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="4" height="12" />
      <rect x="9" y="2" width="4" height="12" />
    </svg>
  )
}

function PixelSkip({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"
      style={{ transform: direction === "left" ? "scaleX(-1)" : undefined }}>
      <rect x="2"  y="2" width="2" height="12" />
      <rect x="5"  y="6" width="2" height="4"  />
      <rect x="7"  y="5" width="2" height="6"  />
      <rect x="9"  y="4" width="2" height="8"  />
      <rect x="11" y="3" width="2" height="10" />
      <rect x="13" y="2" width="2" height="12" />
    </svg>
  )
}

function PixelVolume() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2"  y="5" width="2" height="6"  />
      <rect x="4"  y="4" width="2" height="8"  />
      <rect x="6"  y="3" width="2" height="10" />
      <rect x="10" y="6" width="2" height="4"  />
      <rect x="12" y="4" width="2" height="8"  />
      <rect x="14" y="2" width="2" height="12" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VisualizerView({ song, onBack }: VisualizerViewProps) {
  const [isPlaying,      setIsPlaying]      = useState(false)
  const [currentTime,    setCurrentTime]    = useState(0)
  const [duration,       setDuration]       = useState(song.duration)
  const [volume,         setVolume]         = useState(70)
  const [liveBpm,        setLiveBpm]        = useState(song.bpm)
  const [bpmHistory,     setBpmHistory]     = useState<number[]>([])
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(48).fill(0.3))

  // Real audio refs
  const audioRef     = useRef<HTMLAudioElement | null>(null)
  const ctxRef       = useRef<AudioContext | null>(null)
  const analyserRef  = useRef<AnalyserNode | null>(null)
  const sourceRef    = useRef<MediaElementAudioSourceNode | null>(null)
  const freqRef      = useRef<Uint8Array | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  // Stable sparkle positions (avoid re-randomising on every render)
  const sparkles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      left: 15 + ((i * 37 + 11) % 70),
      top:  15 + ((i * 53 + 7)  % 70),
    })), [])

  // ── Boot audio ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!song.previewUrl) return

    const audio = new Audio(song.previewUrl)
    audio.crossOrigin = 'anonymous'
    audio.volume = volume / 100
    audio.preload = 'auto'
    audioRef.current = audio

    audio.onloadedmetadata = () => setDuration(audio.duration)
    audio.ontimeupdate     = () => setCurrentTime(audio.currentTime)
    audio.onended          = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    return () => {
      audio.pause()
      ctxRef.current?.close()
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.previewUrl])

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  // ── Visualizer animation loop (reads real FFT when playing) ────────────────
  const animLoop = useCallback(() => {
    if (analyserRef.current && freqRef.current) {
     analyserRef.current.getByteFrequencyData(freqRef.current!)
      const bars = Array.from({ length: 48 }, (_, i) => {
        const fi = Math.floor((i / 48) * freqRef.current!.length)
        return 0.1 + (freqRef.current![fi] / 255) * 0.9
      })
      setVisualizerBars(bars)
    }
    animFrameRef.current = requestAnimationFrame(animLoop)
  }, [])

  // ── Play / Pause ────────────────────────────────────────────────────────────
  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!ctxRef.current) {
      const ctx      = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      const source = ctx.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(ctx.destination)
      ctxRef.current      = ctx
      analyserRef.current = analyser
      sourceRef.current   = source
      freqRef.current     = new Uint8Array(analyser.frequencyBinCount)
    }

    if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()

    if (isPlaying) {
      audio.pause()
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    } else {
      await audio.play().catch(() => {})
      animFrameRef.current = requestAnimationFrame(animLoop)
    }
    setIsPlaying(p => !p)
  }

  // ── Simulated bars when no previewUrl (demo mode) ──────────────────────────
  useEffect(() => {
    if (song.previewUrl || !isPlaying) return
    const id = setInterval(() => {
      setVisualizerBars(prev => prev.map(() => 0.2 + Math.random() * 0.8))
    }, 100)
    return () => clearInterval(id)
  }, [isPlaying, song.previewUrl])

  // ── Simulated playback time when no previewUrl ─────────────────────────────
  useEffect(() => {
    if (song.previewUrl || !isPlaying) return
    const id = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= song.duration) { setIsPlaying(false); return 0 }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying, song.previewUrl, song.duration])

  // ── Live BPM fluctuation ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      const newBpm = song.bpm + Math.floor(Math.random() * 7) - 3
      setLiveBpm(newBpm)
      setBpmHistory(prev => [...prev.slice(-100), newBpm])
    }, 500)
    return () => clearInterval(id)
  }, [isPlaying, song.bpm])

  // ── BPM waveform canvas (pixel style, exact from zip) ──────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#1a1a3e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dotted grid
    ctx.fillStyle = '#2a2a5e'
    for (let i = 0; i < 5; i++) {
      const y = Math.floor((canvas.height / 5) * i)
      for (let x = 0; x < canvas.width; x += 4) {
        ctx.fillRect(x, y, 2, 1)
      }
    }

    if (bpmHistory.length < 2) return

    const step   = canvas.width / Math.max(bpmHistory.length - 1, 1)
    const minBpm = Math.min(...bpmHistory) - 5
    const maxBpm = Math.max(...bpmHistory) + 5
    const range  = maxBpm - minBpm || 1

    // Fill area
    ctx.fillStyle = 'rgba(255, 140, 66, 0.3)'
    bpmHistory.forEach((b, i) => {
      const x = Math.floor(i * step)
      const y = canvas.height - Math.floor(((b - minBpm) / range) * canvas.height * 0.8) - canvas.height * 0.1
      ctx.fillRect(x, y, Math.ceil(step) + 1, canvas.height - y)
    })

    // Line
    ctx.fillStyle = '#ff8c42'
    bpmHistory.forEach((b, i) => {
      const x = Math.floor(i * step)
      const y = canvas.height - Math.floor(((b - minBpm) / range) * canvas.height * 0.8) - canvas.height * 0.1
      ctx.fillRect(x, y - 2, Math.ceil(step) + 1, 4)
    })
  }, [bpmHistory])

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const ss = Math.floor(s % 60)
    return `${m}:${ss.toString().padStart(2, '0')}`
  }
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PixelBackground />

      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 relative z-10">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-card border-4 border-border flex items-center justify-center hover:bg-muted transition-colors pixel-btn text-foreground"
          style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
        >
          <PixelArrowLeft />
        </button>

        <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.3em]">
          Now Playing
        </span>

        {/* iTunes link */}
        {song.spotifyUrl && (
          <a
            href={song.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors border-2 border-border px-3 py-2"
            style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
          >
            iTunes ↗
          </a>
        )}
        {!song.spotifyUrl && <div className="w-12" />}
      </header>

      {/* Circular visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="relative w-72 h-72 md:w-80 md:h-80 mb-8">

          {/* Radiating bars — exact from zip */}
          <div className="absolute inset-0 flex items-center justify-center">
            {visualizerBars.map((height, i) => {
              const angle     = (i / visualizerBars.length) * 360
              const barLength = 50 * height
              return (
                <div
                  key={i}
                  className="absolute origin-center"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-${65 + barLength / 2}px)`,
                    width:      '6px',
                    height:     `${barLength}px`,
                    background: 'linear-gradient(to top, #ff8c42, #ffd93d)',
                    opacity:    0.7 + height * 0.3,
                  }}
                />
              )
            })}
          </div>

          {/* Centre square — exact from zip */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-36 h-36 md:w-40 md:h-40 flex flex-col items-center justify-center border-4 border-secondary overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #3d2060 0%, #2a1545 50%, #1a0f30 100%)',
                boxShadow: 'inset 4px 4px 0 rgba(255,255,255,0.1), inset -4px -4px 0 rgba(0,0,0,0.3)',
              }}
            >
              {/* Album art overlay if available */}
              {song.albumArt && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: `url(${song.albumArt})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              )}
              <h2 className="font-mono text-sm font-bold text-foreground text-center px-4 leading-tight relative z-10">
                {song.title}
              </h2>
              <p className="font-sans text-lg text-muted-foreground mt-1 relative z-10">
                {song.artist}
              </p>
            </div>
          </div>

          {/* Sparkles when playing — stable positions */}
          {isPlaying && sparkles.map((pos, i) => (
            <div
              key={i}
              className="absolute animate-sparkle"
              style={{ left: `${pos.left}%`, top: `${pos.top}%`, animationDelay: `${i * 0.5}s` }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="#ffd93d">
                <rect x="3" y="0" width="2" height="2" />
                <rect x="0" y="3" width="2" height="2" />
                <rect x="6" y="3" width="2" height="2" />
                <rect x="3" y="6" width="2" height="2" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* BPM waveform */}
      <div className="px-4 md:px-6 mb-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PixelHeart size={16} animate={isPlaying} />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Live BPM
            </span>
          </div>
          <span className="text-3xl font-mono font-bold text-primary"
            style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
            {liveBpm}
          </span>
        </div>
        <div className="border-4 border-border overflow-hidden"
          style={{ boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.3)' }}>
          <canvas ref={canvasRef} width={800} height={80}
            className="w-full h-20" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 md:px-6 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground w-10">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative">
            <div className="h-3 bg-muted border-2 border-border overflow-hidden"
              style={{ boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)' }}>
              <div className="h-full bg-muted-foreground transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-foreground"
              style={{ left: `calc(${progress}% - 8px)`, boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }} />
          </div>
          <span className="font-mono text-xs text-muted-foreground w-10 text-right">
            {formatTime(duration)}
          </span>
        </div>
        {!song.previewUrl && (
          <p className="font-mono text-xs text-muted-foreground/60 text-center mt-2">
            No preview available for this track
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 md:px-6 pb-8 relative z-10">
        <div className="flex items-center justify-center gap-6 md:gap-8">
          <button className="text-muted-foreground hover:text-foreground transition-colors" disabled>
            <PixelSkip direction="left" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center transition-colors bg-secondary text-secondary-foreground border-4 border-foreground pixel-btn"
            style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}
          >
            {isPlaying ? <PixelPause /> : <PixelPlay />}
          </button>

          <button className="text-muted-foreground hover:text-foreground transition-colors" disabled>
            <PixelSkip direction="right" />
          </button>
        </div>

        {/* Volume + genre */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <PixelVolume />
            <div className="w-20 h-2 bg-muted border border-border overflow-hidden">
              <div className="h-full bg-muted-foreground" style={{ width: `${volume}%` }} />
            </div>
          </div>
          <span className="font-sans text-lg text-muted-foreground">
            {song.genre}{song.genre ? ' · ' : ''}{new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}