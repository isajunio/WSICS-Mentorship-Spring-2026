"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase-client"
import { PixelBackground } from "@/components/pixel-background"
import { Header } from "@/components/header"
import Link from "next/link"

interface ListenedSong {
  id: string
  song_title: string
  artist: string
  album: string
  album_art: string | null
  bpm: number
  user_bpm: number
  listened_at: string
}

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

function getBarColor(diff: number): string {
  if (diff === 0)          return "#ff6b9d"
  if (Math.abs(diff) <= 3) return "#f97316"
  if (Math.abs(diff) <= 5) return "#eab308"
  return "#6b7280"
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days  = Math.floor(hours / 24)
  if (mins < 1)   return "just now"
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function RecentSongRow({ song }: { song: ListenedSong }) {
  const bpmDiff        = song.bpm - song.user_bpm
  const isExact        = bpmDiff === 0
  const matchPct       = Math.max(0, 100 - Math.abs(bpmDiff) * 5)
  const barColor       = getBarColor(bpmDiff)
  const colorIndex     = song.song_title.length % albumColors.length
  const fallbackColors = albumColors[colorIndex]

  return (
    <div
      className="group flex items-center gap-4 p-4 bg-card/80 border-2 border-border hover:border-primary/50 transition-all"
      style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
    >
      <div
        className="relative w-14 h-14 flex items-center justify-center shrink-0 border-2 border-foreground/20 overflow-hidden"
        style={song.album_art
          ? { backgroundImage: `url(${song.album_art})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {
              background: `linear-gradient(135deg, ${fallbackColors.bg} 0%, ${fallbackColors.accent} 100%)`,
              boxShadow: 'inset 3px 3px 0 rgba(255,255,255,0.2), inset -3px -3px 0 rgba(0,0,0,0.2)',
            }
        }
      >
        {song.album_art && <div className="absolute inset-0 bg-black/30" />}
        <div className="relative z-10"><PixelMusicNote color="white" /></div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-mono text-sm font-bold truncate text-foreground">{song.song_title}</h3>
        <p className="font-sans text-lg text-muted-foreground truncate">
          {song.artist} &middot; {song.album}
        </p>
      </div>

      <div className="text-right shrink-0">
        <div className="font-mono text-sm font-bold text-foreground">{song.bpm}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-16 h-2 bg-muted overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="h-full transition-all"
              style={{ width: `${matchPct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}` }} />
          </div>
          <span className="font-mono text-xs text-muted-foreground w-12">
            {isExact ? 'exact' : `${bpmDiff > 0 ? '+' : ''}${bpmDiff}`}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0 hidden sm:block">
        <div className="font-mono text-xs text-muted-foreground">♥ {song.user_bpm} BPM</div>
        <div className="font-mono text-xs text-muted-foreground/60">{timeAgo(song.listened_at)}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [songs,   setSongs]   = useState<ListenedSong[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    supabase
      .from("listened_songs")
      .select("*")
      .eq("user_id", user.id)
      .order("listened_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setSongs(data ?? [])
        setLoading(false)
      })
  }, [user, authLoading])

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center relative">
      <PixelBackground />
      <p className="font-mono text-xs text-primary animate-pulse tracking-widest">LOADING...</p>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center relative gap-4">
      <PixelBackground />
      <p className="font-mono text-xs text-muted-foreground">You need to be logged in.</p>
      <Link href="/login" className="font-mono text-xs text-primary border-2 border-primary px-4 py-2"
        style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}>LOGIN</Link>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PixelBackground />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-24 pb-20 relative z-10">
        <div className="mb-8">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-2">Your History</p>
          <h1 className="text-3xl md:text-4xl font-mono font-bold"
            style={{
              background: 'linear-gradient(180deg, #ffd93d 0%, #ff8c42 50%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 0 #000)',
            }}>
            Recently Listened
          </h1>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-16 bg-card/80 border-2 border-border"
            style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}>
            <p className="font-mono text-xs text-muted-foreground mb-2">NO SONGS YET</p>
            <p className="font-sans text-lg text-muted-foreground mb-6">Go listen to some music first!</p>
            <Link href="/" className="inline-block font-mono text-xs border-2 px-6 py-3"
              style={{ background: '#ff6b9d', color: '#000', borderColor: '#ff6b9d', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}>
              START LISTENING
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {songs.map(song => <RecentSongRow key={song.id} song={song} />)}
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs border-2 px-6 py-3 inline-flex items-center gap-2"
            style={{ background: '#ff6b9d', color: '#000', borderColor: '#ff6b9d', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}>
            ← BACK TO HOME
          </Link>
        </div>
      </main>
    </div>
  )
}