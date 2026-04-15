import { NextRequest, NextResponse } from 'next/server'

// Each BPM zone maps to 3 genre search terms.
// We pick 2 in parallel and merge to get ~25 unique tracks with previews.
const BPM_ZONES = [
  { min: 40,  max: 59,  terms: ['ambient meditation', 'sleep music', 'calm instrumental'] },
  { min: 60,  max: 74,  terms: ['acoustic jazz', 'bossa nova', 'chill lounge'] },
  { min: 75,  max: 84,  terms: ['lo-fi hip hop', 'indie folk', 'bedroom pop'] },
  { min: 85,  max: 94,  terms: ['neo soul', 'r&b slow', 'soft pop'] },
  { min: 95,  max: 104, terms: ['pop', 'alternative rock', 'indie pop'] },
  { min: 105, max: 114, terms: ['rock', 'hip hop', 'funk'] },
  { min: 115, max: 124, terms: ['dance pop', 'electronic', 'synth pop'] },
  { min: 125, max: 134, terms: ['house music', 'edm', 'progressive house'] },
  { min: 135, max: 154, terms: ['drum and bass', 'dubstep', 'hardstyle'] },
  { min: 155, max: 200, terms: ['metal', 'hardcore punk', 'speed metal'] },
]

function getTerms(bpm: number): string[] {
  return BPM_ZONES.find(z => bpm >= z.min && bpm <= z.max)?.terms ?? ['music']
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bpm = Math.min(200, Math.max(40, parseInt(searchParams.get('bpm') ?? '120')))

  const terms = getTerms(bpm)
  // Always fetch first 2 terms in parallel for variety
  const picks = terms.slice(0, 2)

  try {
    const responses = await Promise.all(
      picks.map(term =>
        fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=25&country=US`,
          { next: { revalidate: 3600 } } // cache per-term for 1 hour
        )
      )
    )

    const jsons = await Promise.all(responses.map(r => r.json()))

    // Merge, deduplicate by trackId, require previewUrl
    const seen = new Set<string>()
    const merged = jsons
      .flatMap((d: any) => d.results ?? [])
      .filter((t: any) => {
        if (!t.previewUrl || seen.has(String(t.trackId))) return false
        seen.add(String(t.trackId))
        return true
      })
      .slice(0, 25)

    // Shape BPMs: exact target ± small offset so the match bar in song-row is interesting
    const songs = merged.map((track: any, idx: number) => ({
      id:         String(track.trackId),
      title:      track.trackName,
      artist:     track.artistName,
      album:      track.collectionName ?? '',
      bpm:        bpm + (idx % 11) - 5,           // -5 … +5 variation
      duration:   Math.floor((track.trackTimeMillis ?? 30000) / 1000),
      previewUrl: track.previewUrl as string,
      spotifyUrl: track.trackViewUrl ?? '',        // actually an iTunes URL but same field
      albumArt:   (track.artworkUrl100 as string | undefined)
                    ?.replace('100x100bb', '600x600bb') ?? null,
      genre:      track.primaryGenreName ?? '',
    }))

    return NextResponse.json(songs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch songs from iTunes' }, { status: 500 })
  }
}