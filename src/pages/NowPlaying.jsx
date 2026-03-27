import { useState, useEffect, useRef, useCallback } from 'react'

export default function NowPlaying({ song, bpm, navigate }) {
  const [isPlaying, setIsPlaying]   = useState(false)
  const [progress,  setProgress]    = useState(0)
  const [liveBpm,   setLiveBpm]     = useState(bpm)
  const [volume,    setVolume]       = useState(0.7)
  const [duration,  setDuration]    = useState(song?.durationMs ? song.durationMs / 1000 : 30)

  const circleRef = useRef(null)
  const waveRef   = useRef(null)
  const animRef   = useRef(null)
  const waveAnim  = useRef(null)
  const phaseRef  = useRef(0)
  const wavePhase = useRef(0)

  // Real audio via preview URL
  const audioRef    = useRef(null)
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef   = useRef(null)
  const freqDataRef = useRef(null)

  // ── Boot Audio ─────────────────────────────────────────────
  useEffect(() => {
    if (!song?.previewUrl) return

    const audio = new Audio(song.previewUrl)
    audio.crossOrigin = 'anonymous'
    audio.volume = volume
    audio.preload = 'auto'
    audioRef.current = audio

    const ctx      = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    const source = ctx.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(ctx.destination)

    audioCtxRef.current = ctx
    analyserRef.current = analyser
    sourceRef.current   = source
    freqDataRef.current = new Uint8Array(analyser.frequencyBinCount)

    audio.onloadedmetadata = () => setDuration(audio.duration)
    audio.ontimeupdate     = () => setProgress(audio.currentTime)
    audio.onended          = () => setIsPlaying(false)

    return () => {
      audio.pause()
      source.disconnect()
      analyser.disconnect()
      ctx.close()
    }
  }, [song?.previewUrl])

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audioCtxRef.current?.resume()
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Live BPM drift
  useEffect(() => {
    const id = setInterval(() => {
      setLiveBpm(bpm + Math.floor(Math.random() * 7) - 3)
    }, 1800)
    return () => clearInterval(id)
  }, [bpm])

  // ── Circle Visualizer ──────────────────────────────────────
  const drawCircle = useCallback(() => {
    const canvas = circleRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2, cy = H / 2
    const INNER_R  = 90
    const NUM_BARS = 64
    const speed    = (bpm / 60) * 0.04

    phaseRef.current += isPlaying ? speed : speed * 0.08

    // Get real audio data if available
    const freqData = freqDataRef.current
    if (analyserRef.current && isPlaying) analyserRef.current.getByteFrequencyData(freqData)

    for (let i = 0; i < NUM_BARS; i++) {
      const angle  = (i / NUM_BARS) * Math.PI * 2 - Math.PI / 2
      let   amp

      if (freqData && isPlaying && freqData[i % freqData.length] > 0) {
        // Real FFT data
        amp = (freqData[i % freqData.length] / 255) * 1.2
      } else {
        const t = phaseRef.current
        amp = Math.max(0,
          Math.sin(t + i * 0.18) * 0.45 +
          Math.sin(t * 1.6 + i * 0.4) * 0.3 +
          Math.sin(t * 0.7 + i * 0.08) * 0.25 + 0.3
        )
      }

      const barLen = 12 + amp * 95
      const x1 = cx + Math.cos(angle) * INNER_R
      const y1 = cy + Math.sin(angle) * INNER_R
      const x2 = cx + Math.cos(angle) * (INNER_R + barLen)
      const y2 = cy + Math.sin(angle) * (INNER_R + barLen)

      const alpha = 0.25 + amp * 0.75
      ctx.strokeStyle = `rgba(255, 140, 50, ${alpha})`
      ctx.lineWidth   = 2.2
      ctx.lineCap     = 'round'
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
    }

    // Scatter dots
    for (let i = 0; i < 6; i++) {
      const dotAngle = phaseRef.current * 0.3 + (i / 6) * Math.PI * 2
      const dotR = INNER_R + 110 + Math.sin(phaseRef.current * 2 + i) * 20
      ctx.fillStyle = 'rgba(255,140,50,0.4)'
      ctx.beginPath()
      ctx.arc(cx + Math.cos(dotAngle) * dotR, cy + Math.sin(dotAngle) * dotR, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Album art or dark centre
    if (song?.image) {
      const img = document.getElementById('__album_img__')
      if (img?.complete) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, INNER_R - 2, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(img, cx - INNER_R + 2, cy - INNER_R + 2, (INNER_R - 2) * 2, (INNER_R - 2) * 2)
        // Dark overlay so text reads
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(cx - INNER_R, cy - INNER_R, INNER_R * 2, INNER_R * 2)
        ctx.restore()
      } else {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, INNER_R)
        g.addColorStop(0, 'rgba(20,8,0,1)'); g.addColorStop(1, 'rgba(5,2,0,0.95)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, INNER_R - 1, 0, Math.PI * 2); ctx.fill()
      }
    } else {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, INNER_R)
      g.addColorStop(0, 'rgba(20,8,0,1)'); g.addColorStop(1, 'rgba(5,2,0,0.95)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, INNER_R - 1, 0, Math.PI * 2); ctx.fill()
    }

    animRef.current = requestAnimationFrame(drawCircle)
  }, [bpm, isPlaying, song])

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawCircle)
    return () => cancelAnimationFrame(animRef.current)
  }, [drawCircle])

  // ── Waveform ───────────────────────────────────────────────
  const drawWave = useCallback(() => {
    const canvas = waveRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    wavePhase.current += isPlaying ? (bpm / 60) * 0.035 : 0.005

    const freqData = freqDataRef.current
    if (analyserRef.current && isPlaying) analyserRef.current.getByteFrequencyData(freqData)

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
    bgGrad.addColorStop(0, 'rgba(255,120,20,0.08)')
    bgGrad.addColorStop(1, 'rgba(255,80,10,0.02)')
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H)

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath()
      const midY = H * 0.45
      const amplitude = isPlaying ? (22 - layer * 5) : (3 - layer)

      for (let x = 0; x <= W; x += 2) {
        const xn = x / W
        let extra = 0
        if (freqData && isPlaying) {
          const fi = Math.floor(xn * freqData.length)
          extra = (freqData[fi] / 255) * 14
        }
        const y = midY
          + (Math.sin(xn * 8 + wavePhase.current + layer * 1.2) * amplitude
          +  Math.sin(xn * 3 - wavePhase.current * 0.6 + layer) * (amplitude * 0.6)
          +  Math.sin(xn * 14 + wavePhase.current * 1.4) * (amplitude * 0.3))
          + extra

        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }

      ctx.strokeStyle = `rgba(255,140,50,${[0.9,0.5,0.25][layer]})`
      ctx.lineWidth = [1.5, 1, 0.5][layer]
      ctx.stroke()
    }

    waveAnim.current = requestAnimationFrame(drawWave)
  }, [bpm, isPlaying])

  useEffect(() => {
    waveAnim.current = requestAnimationFrame(drawWave)
    return () => cancelAnimationFrame(waveAnim.current)
  }, [drawWave])

  // ── Helpers ────────────────────────────────────────────────
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2,'0')}`
  const pct = duration > 0 ? (progress / duration) * 100 : 0
  const beatInterval = `${(60 / liveBpm).toFixed(3)}s`

  return (
    <div className="nowplaying">
      {/* Hidden img for canvas drawImage */}
      {song?.image && <img id="__album_img__" src={song.image} style={{ display: 'none' }} crossOrigin="anonymous" alt="" />}

      <div className="np-topbar">
        <button className="back-btn" onClick={() => { audioRef.current?.pause(); navigate('songlist', { bpm }) }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="np-now-label">NOW PLAYING</span>
        <a href={song?.externalUrl} target="_blank" rel="noopener noreferrer" className="np-spotify-btn" title="Open in Spotify">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </a>
      </div>

      {/* Visualizer */}
      <div className="np-viz-section">
        <div className="np-song-labels">
          <h2 className="np-song-title">{song?.title || 'Unknown'}</h2>
          <p className="np-song-artist">{song?.artist || 'Unknown'}</p>
        </div>
        <canvas ref={circleRef} width={380} height={380} className="np-circle-canvas" />
      </div>

      {/* Live BPM */}
      <div className="np-live-row">
        <div className="np-live-left">
          <div className="np-live-heart" style={{ animationDuration: beatInterval }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF3D5A">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="np-live-label">LIVE BPM</span>
        </div>
        <span className="np-live-bpm">{liveBpm}</span>
      </div>

      {/* Waveform */}
      <canvas ref={waveRef} width={900} height={60} className="np-wave-canvas" />

      {/* Progress */}
      <div className="np-progress-row">
        <span className="np-time">{fmt(progress)}</span>
        <div className="np-progress-track" onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const p = (e.clientX - rect.left) / rect.width
          const t = p * duration
          if (audioRef.current) audioRef.current.currentTime = t
          setProgress(t)
        }}>
          <div className="np-progress-fill" style={{ width: `${pct}%` }}>
            <div className="np-progress-dot" />
          </div>
        </div>
        <span className="np-time">{fmt(duration)}</span>
      </div>

      {/* Controls */}
      <div className="np-controls">
        <button className="np-ctrl-btn" disabled>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#444"><path d="M19 20L9 12l10-8v16zM5 4h2v16H5z"/></svg>
        </button>
        <button className="np-play-btn" onClick={() => setIsPlaying(p => !p)}>
          {isPlaying
            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
          }
        </button>
        <button className="np-ctrl-btn" disabled>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#444"><path d="M5 4l10 8-10 8V4zM17 4h2v16h-2z"/></svg>
        </button>
      </div>

      {/* No preview notice */}
      {!song?.previewUrl && (
        <p className="no-preview-notice">
          No 30-s preview available for this track.{' '}
          <a href={song?.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1DB954' }}>
            Open in Spotify
          </a>
        </p>
      )}

      {/* Bottom */}
      <div className="np-bottom-row">
        <div className="np-volume-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
            <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07"/>
          </svg>
          <input type="range" min={0} max={1} step={0.01} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="volume-slider" style={{ '--vol': `${volume * 100}%` }}
          />
        </div>
        <span className="np-genre-label">{song?.year || ''}{song?.year && song?.popularity ? ' · ' : ''}{song?.popularity ? `Pop. ${song.popularity}` : ''}</span>
      </div>
    </div>
  )
}
