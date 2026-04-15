// Central Song type used by songs-view, song-row, and visualizer-view.
// Replaces the mock-songs Song interface.
export interface Song {
  id:         string
  title:      string
  artist:     string
  album:      string
  bpm:        number          // target BPM ± small variation assigned server-side
  duration:   number          // seconds
  previewUrl: string          // iTunes 30-second preview
  spotifyUrl: string          // actually an iTunes track URL
  albumArt:   string | null   // 600×600 artwork URL
  genre:      string
}

// Mood labels — kept here so components don't import from mock-songs
export interface Mood { label: string; description: string }

export function getMoodForBpm(bpm: number): Mood {
  if (bpm < 60)  return { label: 'Meditative', description: 'Deep calm & focus' }
  if (bpm < 75)  return { label: 'Relaxed',    description: 'Calm & easy listening' }
  if (bpm < 85)  return { label: 'Chill',      description: 'Laid-back & effortless' }
  if (bpm < 95)  return { label: 'Mellow',     description: 'Soft & steady vibes' }
  if (bpm < 105) return { label: 'Moderate',   description: 'Balanced & grounded' }
  if (bpm < 115) return { label: 'Active',     description: 'Moving & motivated' }
  if (bpm < 125) return { label: 'Energetic',  description: 'High-tempo momentum' }
  if (bpm < 135) return { label: 'Pumped',     description: 'Powering through' }
  if (bpm < 155) return { label: 'Intense',    description: 'Full-tilt energy' }
  return           { label: 'Maximum',    description: 'Absolute peak intensity' }
}

// Client-side fetch — calls the /api/songs Next.js route
export async function fetchSongsByBpm(bpm: number): Promise<Song[]> {
  const res = await fetch(`/api/songs?bpm=${bpm}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Failed to fetch songs')
  }
  return res.json()
}