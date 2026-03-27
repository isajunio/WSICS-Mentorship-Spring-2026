import { useState, useEffect, useRef } from 'react'
import { loginWithSpotify, isLoggedIn } from '../utils/spotify'

const BPM_ZONES = [
  { label: 'Meditative', description: 'Deep calm & focus',       min: 40,  max: 59  },
  { label: 'Relaxed',    description: 'Calm & easy listening',   min: 60,  max: 74  },
  { label: 'Chill',      description: 'Laid-back & effortless',  min: 75,  max: 84  },
  { label: 'Mellow',     description: 'Soft & steady vibes',     min: 85,  max: 94  },
  { label: 'Moderate',   description: 'Balanced & grounded',     min: 95,  max: 104 },
  { label: 'Active',     description: 'Moving & motivated',      min: 105, max: 114 },
  { label: 'Energetic',  description: 'High-tempo momentum',     min: 115, max: 124 },
  { label: 'Pumped',     description: 'Powering through',        min: 125, max: 134 },
  { label: 'Intense',    description: 'Full-tilt energy',        min: 135, max: 154 },
  { label: 'Maximum',    description: 'Absolute peak intensity', min: 155, max: 200 },
]

function getMood(bpm) {
  const zone = BPM_ZONES.find(z => bpm >= z.min && bpm <= z.max) || BPM_ZONES[0]
  return { mood: zone.label, description: zone.description, zoneIndex: BPM_ZONES.indexOf(zone) }
}

export default function Home({ navigate }) {
  const [bpm, setBpm] = useState(72)
  const heartRef = useRef(null)
  const { mood, description, zoneIndex } = getMood(bpm)

  useEffect(() => {
    if (heartRef.current) {
      heartRef.current.style.animationDuration = `${(60 / bpm).toFixed(3)}s`
    }
  }, [bpm])

  const handleFindRhythm = () => {
    if (isLoggedIn()) {
      // Already authenticated — go straight to song list
      navigate('songlist', { bpm })
    } else {
      // Save BPM so we can use it after Spotify redirects back
      sessionStorage.setItem('pending_bpm', String(bpm))
      loginWithSpotify()
    }
  }

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="nav">
        <div className="nav-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2 12 L6 6 L10 16 L14 4 L18 12 L22 12" stroke="#FF3D5A" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="nav-logo-text">PulsePlay</span>
        </div>
        <div className="nav-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF3D5A">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="nav-tag-text">heartbeat × music</span>
        </div>
      </nav>

      <main className="home-main">
        <h1 className="home-title">
          Match your heartbeat<br />to the perfect song
        </h1>
        <p className="home-subtitle">
          Enter your heart rate and discover songs from Spotify<br />
          that sync with your rhythm. Every beat matters.
        </p>

        {/* Heart Circle */}
        <div className="heart-circle">
          <div className="heart-circle-inner">
            <div className="heart-icon" ref={heartRef}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="#FF3D5A">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="heart-bpm-number">{bpm}</span>
            <span className="heart-bpm-label">BPM</span>
          </div>
        </div>

        {/* Mood Badge */}
        <div className="mood-section">
          <div className="mood-badge">
            <span className="mood-name">{mood}</span>
            <span className="mood-desc">{description}</span>
          </div>
          <div className="zone-dots">
            {BPM_ZONES.map((_, i) => (
              <div
                key={i}
                className={`zone-dot ${i < zoneIndex ? 'zone-dot-past' : ''} ${i === zoneIndex ? 'zone-dot-active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* BPM Input */}
        <div className="bpm-input-row">
          <input
            type="number"
            className="bpm-input"
            value={bpm}
            onChange={e => setBpm(Math.min(200, Math.max(40, Number(e.target.value) || 40)))}
            min={40} max={200}
          />
          <span className="bpm-input-unit">bpm</span>
        </div>

        {/* Slider */}
        <div className="slider-container">
          <input
            type="range" min={40} max={200} value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            className="bpm-slider"
            style={{ '--pct': `${((bpm - 40) / 160) * 100}%` }}
          />
          <div className="slider-labels">
            <span>40</span><span>120</span><span>200</span>
          </div>
        </div>

        {/* Single CTA — always visible */}
        <button className="cta-btn" onClick={handleFindRhythm}>
          Find My Rhythm
        </button>
      </main>

      <footer className="home-footer">Powered by Spotify · Real tracks at your exact tempo</footer>
    </div>
  )
}