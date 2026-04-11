const CLIENT_ID    = import.meta.env.VITE_SPOTIFY_CLIENT_ID || ''
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI      || 'http://127.0.0.1:5173/'
const SCOPES       = 'user-read-email user-read-private'
let refreshInFlight = null

// ── PKCE ──────────────────────────────────────────────────────
function generateRandom(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(b => chars[b % chars.length]).join('')
}
async function sha256(plain) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain))
}
function base64URLEncode(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
}

export async function loginWithSpotify() {
  const verifier  = generateRandom(64)
  const challenge = base64URLEncode(await sha256(verifier))
  sessionStorage.setItem('pkce_verifier', verifier)
  const params = new URLSearchParams({
    client_id: CLIENT_ID, response_type: 'code',
    redirect_uri: REDIRECT_URI, scope: SCOPES,
    code_challenge_method: 'S256', code_challenge: challenge,
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem('pkce_verifier')
  if (!verifier) throw new Error('No PKCE verifier')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID, grant_type: 'authorization_code',
      code, redirect_uri: REDIRECT_URI, code_verifier: verifier,
    }),
  })
  if (!res.ok) {
    const details = await res.text().catch(() => '')
    throw new Error(`Token exchange failed: ${res.status}${details ? ` - ${details}` : ''}`)
  }
  const data = await res.json()
  localStorage.setItem('sp_access_token',  data.access_token)
  localStorage.setItem('sp_refresh_token', data.refresh_token)
  localStorage.setItem('sp_expires_at',    String(Date.now() + data.expires_in * 1000))
  sessionStorage.removeItem('pkce_verifier')
  return data.access_token
}

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight

  const rt = localStorage.getItem('sp_refresh_token')
  if (!rt) return null

  refreshInFlight = (async () => {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: rt, client_id: CLIENT_ID }),
    })

    if (!res.ok) { logout(); return null }

    const data = await res.json()
    localStorage.setItem('sp_access_token', data.access_token)
    localStorage.setItem('sp_expires_at',   String(Date.now() + data.expires_in * 1000))
    if (data.refresh_token) localStorage.setItem('sp_refresh_token', data.refresh_token)
    return data.access_token
  })()

  try {
    return await refreshInFlight
  } finally {
    refreshInFlight = null
  }
}

export async function getValidToken() {
  const exp = Number(localStorage.getItem('sp_expires_at') || 0)
  if (Date.now() < exp - 60_000) return localStorage.getItem('sp_access_token')
  return refreshAccessToken()
}
export function isLoggedIn() { return !!localStorage.getItem('sp_access_token') }
export function logout() {
  ['sp_access_token','sp_refresh_token','sp_expires_at'].forEach(k => localStorage.removeItem(k))
}

// ── API fetch ─────────────────────────────────────────────────
async function apiFetch(endpoint, params = {}) {
  const token = await getValidToken()
  if (!token) throw new Error('Not authenticated')
  const url = new URL(`https://api.spotify.com/v1${endpoint}`)
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })

  const send = accessToken => fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
  let res = await send(token)

  if ((res.status === 401 || res.status === 403) && localStorage.getItem('sp_refresh_token')) {
    const refreshedToken = await refreshAccessToken()
    if (refreshedToken) res = await send(refreshedToken)
  }

  if (!res.ok) {
    let detail = ''
    try {
      const data = await res.json()
      detail = data?.error?.message || data?.error_description || ''
    } catch {
      detail = await res.text().catch(() => '')
    }

    if (res.status === 401) {
      logout()
      throw new Error(
        detail
          ? `Spotify authorization failed (${res.status}): ${detail}. Please sign in again.`
          : `Spotify authorization failed (${res.status}). Please sign in again.`
      )
    }

    if (res.status === 403) {
      throw new Error(
        detail
          ? `Spotify API forbidden (403): ${detail}. If your app is in Development mode, add your Spotify account in Spotify Dashboard → Users and Access, then re-authenticate.`
          : 'Spotify API forbidden (403). If your app is in Development mode, add your Spotify account in Spotify Dashboard → Users and Access, then re-authenticate.'
      )
    }

    throw new Error(detail ? `API error ${res.status}: ${detail}` : `API error ${res.status}`)
  }
  return res.json()
}

// ── BPM zone → genre + mood search terms ─────────────────────
// We use descriptive terms that correlate with tempo since
// Spotify's audio-features endpoint is deprecated for new apps
function getSearchTerms(bpm) {
  if (bpm <= 59)  return ['ambient','sleep music','meditation','classical slow','lo-fi slow']
  if (bpm <= 74)  return ['soul ballad','acoustic slow','indie folk','slow jazz','chill acoustic']
  if (bpm <= 84)  return ['coffeehouse acoustic','slow indie','soft pop','gentle rnb','mellow pop']
  if (bpm <= 94)  return ['soft rock','acoustic pop','indie singer songwriter','easy listening','calm pop']
  if (bpm <= 104) return ['pop hits','rnb smooth','indie rock','alternative pop','mainstream pop']
  if (bpm <= 114) return ['upbeat pop','dance pop','funk soul','hip hop beats','energetic pop']
  if (bpm <= 124) return ['club pop','edm pop','electronic dance','house pop','dance hits']
  if (bpm <= 139) return ['house music','electronic','dance anthems','big room','festival edm']
  if (bpm <= 159) return ['drum and bass','trance','techno','hard dance','fast edm']
  return ['hardcore','speedcore','fast techno','extreme edm','drum and bass fast']
}

function normalize(track) {
  const sec = Math.floor((track.duration_ms || 0) / 1000)
  return {
    id:          track.id,
    title:       track.name,
    artist:      track.artists?.map(a => a.name).join(', ') || 'Unknown',
    album:       track.album?.name || '',
    image:       track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || null,
    duration:    `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`,
    durationMs:  track.duration_ms,
    previewUrl:  track.preview_url,
    year:        track.album?.release_date?.slice(0,4) || '',
    popularity:  track.popularity || 0,
    externalUrl: track.external_urls?.spotify,
  }
}

async function searchTracks(q) {
  const limits = [20, 10, 5, 1]
  let lastErr = null

  for (const limit of limits) {
    try {
      const data = await apiFetch('/search', { q, type: 'track', limit, market: 'from_token' })
      return data?.tracks?.items || []
    } catch (err) {
      lastErr = err
      if (!/invalid limit/i.test(String(err?.message || ''))) throw err
    }
  }

  throw lastErr || new Error('Spotify search failed')
}

// ── Main export ───────────────────────────────────────────────
export async function fetchTracksByBPM(bpm) {
  const terms = getSearchTerms(bpm)
  await searchTracks(terms[0])
  const results = await Promise.allSettled(
    terms.map(q => searchTracks(q))
  )

  const firstFailure = results.find(r => r.status === 'rejected')
  if (firstFailure) {
    throw firstFailure.reason instanceof Error
      ? firstFailure.reason
      : new Error(String(firstFailure.reason || 'Spotify search failed'))
  }

  const items = results.map(r => r.value || [])

  // Deduplicate and sort by popularity
  const seen   = new Set()
  const tracks = items.flat()
    .filter(t => {
      if (!t?.id || seen.has(t.id)) return false
      seen.add(t.id)
      return true
    })
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 25)
    .map(normalize)

  return tracks
}