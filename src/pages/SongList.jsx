import { useState, useEffect, useRef } from 'react'
import { fetchTracksByBPM } from '../utils/spotify'

const BPM_ZONES = [
  { label: 'Meditative', min: 40,  max: 59  },
  { label: 'Relaxed',    min: 60,  max: 74  },
  { label: 'Chill',      min: 75,  max: 84  },
  { label: 'Mellow',     min: 85,  max: 94  },
  { label: 'Moderate',   min: 95,  max: 104 },
  { label: 'Active',     min: 105, max: 114 },
  { label: 'Energetic',  min: 115, max: 124 },
  { label: 'Pumped',     min: 125, max: 134 },
  { label: 'Intense',    min: 135, max: 154 },
  { label: 'Maximum',    min: 155, max: 200 },
]

function getMood(bpm) {
  return BPM_ZONES.find(z => bpm >= z.min && bpm <= z.max)?.label || 'Custom'
}

export default function SongList({ bpm, navigate }) {
  const [songs,   setSongs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)
  const mood = getMood(bpm)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setSongs([])

    fetchTracksByBPM(bpm)
      .then(data => { if (!cancelled) { setSongs(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err.message); setLoading(false) } })

    return () => { cancelled = true }
  }, [bpm])

  const handlePlay = (song) => {
    if (!song.previewUrl) return
    if (playing?.id === song.id) {
      audioRef.current?.pause()
      setPlaying(null)
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
      const audio = new Audio(song.previewUrl)
      audio.volume = 0.8
      audio.play().catch(() => {})
      audio.onended = () => setPlaying(null)
      audioRef.current = audio
      setPlaying(song)
    }
  }

  const handleCardClick = (song) => {
    if (audioRef.current) audioRef.current.pause()
    navigate('nowplaying', { song, bpm })
  }

  return (
    <div className="songlist">
      {/* Header */}
      <div className="songlist-header">
        <div className="songlist-header-left">
          <button className="back-btn" onClick={() => { audioRef.current?.pause(); navigate('home') }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h2 className="songlist-title">Songs for {bpm} BPM</h2>
            <p className="songlist-subtitle">{mood} · Spotify picks for your tempo</p>
          </div>
        </div>
        <span className="songlist-bpm-display">{bpm}</span>
      </div>

      {/* Track count */}
      {!loading && !error && (
        <div className="sl-track-count">{songs.length} tracks</div>
      )}

      {/* Body */}
      <div className="songs-list">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Finding tracks for {bpm} BPM…</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>⚠ {error}</p>
            <p className="error-hint">Check your connection and try again.</p>
          </div>
        )}

        {!loading && !error && songs.length === 0 && (
          <div className="no-songs">
            <p>No tracks found for {bpm} BPM.</p>
            <p className="no-songs-hint">Try a different BPM value.</p>
          </div>
        )}

        {songs.map(song => {
          const isActive = playing?.id === song.id
          return (
            <div
              key={song.id}
              className={`song-card ${isActive ? 'song-card-active' : ''}`}
            >
              {/* Album art — click to preview */}
              <div
                className="song-art"
                style={song.image
                  ? { backgroundImage: `url(${song.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: 'linear-gradient(135deg, #2a1a2a, #1a1a3a)' }
                }
                onClick={() => handlePlay(song)}
              >
                {!song.image && !isActive && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
                    <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
                  </svg>
                )}
                <div className={`song-art-overlay ${!isActive ? 'song-art-overlay-hover' : ''}`}>
                  {isActive
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF3D5A"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                  }
                </div>
              </div>

              {/* Info */}
              <div className="song-info" onClick={() => handleCardClick(song)}>
                <span className={`song-title ${isActive ? 'song-title-active' : ''}`}>{song.title}</span>
                <span className="song-meta">{song.artist} · {song.album}</span>
                {!song.previewUrl && <span className="no-preview-tag">No preview</span>}
              </div>

              {/* Right side */}
              <div className="song-right" onClick={() => handleCardClick(song)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="song-duration">{song.duration}</span>
                  <a
                    href={song.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="spotify-link-btn"
                    title="Open in Spotify"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mini Player */}
      {playing && (
        <div className="mini-player" onClick={() => handleCardClick(playing)}>
          <div
            className="mini-player-art"
            style={playing.image
              ? { backgroundImage: `url(${playing.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(135deg, #2a1a2a, #1a1a3a)' }
            }
          />
          <div className="mini-player-info">
            <span className="mini-player-title">{playing.title}</span>
            <span className="mini-player-artist">{playing.artist}</span>
          </div>
          <div className="mini-player-right">
            <span className="mini-player-bpm">{bpm} BPM</span>
            <span className="mini-player-cta">Tap to visualize</span>
          </div>
        </div>
      )}
    </div>
  )
}