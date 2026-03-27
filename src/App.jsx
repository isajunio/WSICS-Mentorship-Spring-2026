import { useState, useEffect } from 'react'
import Home       from './pages/Home'
import SongList   from './pages/SongList'
import NowPlaying from './pages/NowPlaying'
import { exchangeCodeForToken } from './utils/spotify'
import './App.css'

export default function App() {
  const [page,    setPage]  = useState('home')
  const [bpm,     setBpm]   = useState(72)
  const [song,    setSong]  = useState(null)
  const [loading, setLoading] = useState(false)

  // Handle Spotify OAuth callback (?code=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code   = params.get('code')
    if (!code) return

    // Clean the URL immediately
    window.history.replaceState({}, '', window.location.pathname)

    setLoading(true)
    exchangeCodeForToken(code)
      .then(() => {
        // Restore the BPM the user had picked before being sent to Spotify
        const pendingBpm = Number(sessionStorage.getItem('pending_bpm') || 72)
        sessionStorage.removeItem('pending_bpm')
        setBpm(pendingBpm)
        setPage('songlist')
        setLoading(false)
      })
      .catch(err => {
        console.error('Spotify auth error:', err)
        setLoading(false)
      })
  }, [])

  const navigate = (to, data = {}) => {
    if (data.bpm  !== undefined) setBpm(data.bpm)
    if (data.song !== undefined) setSong(data.song)
    setPage(to)
  }

  if (loading) {
    return (
      <div className="splash-loading">
        <div className="splash-spinner" />
        <p>Connecting to Spotify…</p>
      </div>
    )
  }

  return (
    <div className="app">
      {page === 'home'       && <Home       navigate={navigate} />}
      {page === 'songlist'   && <SongList   bpm={bpm} navigate={navigate} />}
      {page === 'nowplaying' && <NowPlaying song={song} bpm={bpm} navigate={navigate} />}
    </div>
  )
}