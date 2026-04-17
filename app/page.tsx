"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ArduinoBpm } from "@/components/arduino-bpm"
import { SongsView } from "@/components/songs-view"
import { VisualizerView } from "@/components/visualizer-view"
import { DataView } from "@/components/data-view"
import { PixelBackground } from "@/components/pixel-background"
import { type Song } from "@/lib/itunes"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/context/AuthContext"
import { AVATARS, AvatarComputerGirl } from "@/app/signup/page"
import Link from "next/link"

type View = "home" | "songs" | "visualizer" | "data"

export default function HomePage() {
  const [view,         setView]         = useState<View>("home")
  const [bpm,          setBpm]          = useState(72)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ username: string; avatar: string } | null>(null)

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase.from("profiles").select("username, avatar").eq("id", user.id).single()
      .then(({ data }) => {
        setProfile({
          username: data?.username ?? user.user_metadata?.username,
          avatar:   data?.avatar   ?? user.user_metadata?.avatar,
        })
      })
  }, [user])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const handleSelectSong = async (song: Song) => {
    setSelectedSong(song)
    setView("visualizer")
    if (user) {
      await supabase.from("listened_songs").insert({
        user_id:    user.id,
        song_title: song.title,
        artist:     song.artist,
        album:      song.album,
        album_art:  song.albumArt,
        bpm:        song.bpm,
        user_bpm:   bpm,
      })
    }
  }

  const handleBpmConfirmed = (confirmedBpm: number) => {
    setBpm(confirmedBpm)
    setView("songs")
  }

  if (view === "visualizer" && selectedSong) {
    return <VisualizerView song={selectedSong} onBack={() => setView("songs")} />
  }
  if (view === "songs") {
    return (
      <SongsView
        bpm={bpm}
        onBack={() => setView("home")}
        onSelectSong={song => handleSelectSong(song)}
      />
    )
  }
  if (view === "data") {
    return <DataView onBack={() => setView("home")} />
  }

  const btnStyle = {
    background: '#ff6b9d', color: '#000', borderColor: '#ff6b9d',
    boxShadow: '3px 3px 0 rgba(0,0,0,0.4)', padding: '10px',
    justifyContent: 'center', alignItems: 'center', display: 'flex'
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PixelBackground />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">

        {/* Welcome message — logged in only */}
        {profile && (
          <h1
            className="text-3xl md:text-5xl font-mono font-bold leading-tight mb-6 text-balance text-center"
            style={{
              background: 'linear-gradient(180deg, #ffd93d 0%, #ff8c42 50%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 0 #000) drop-shadow(-1px -1px 0 #000)',
            }}
          >
            Welcome {profile.username}!
          </h1>
        )}

        {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <p className="font-mono text-xs md:text-sm text-primary tracking-[0.3em] uppercase mb-4">
            Start Your
          </p>
          <h1
            className="text-3xl md:text-5xl font-mono font-bold leading-tight mb-6 text-balance"
            style={{
              background: 'linear-gradient(180deg, #ffd93d 0%, #ff8c42 50%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 0 #000) drop-shadow(-1px -1px 0 #000)',
            }}
          >
            Rhythm Adventure
          </h1>
          <p className="text-muted-foreground font-sans text-xl md:text-2xl leading-relaxed">
            Connect your Arduino pulse sensor or enter your BPM manually.
          </p>
        </div>

        <ArduinoBpm onBpmConfirmed={handleBpmConfirmed} />

        <div className="flex flex-col gap-3 w-full max-w-2xl mt-8">

          {/* VIEW YOUR DASHBOARD — logged in only, full width */}
          {profile && (
            <Link
              href="/dashboard"
              className="pixel-btn w-full font-mono text-xs font-bold border-2 transition-colors"
              style={btnStyle}
            >
              VIEW YOUR DASHBOARD
            </Link>
          )}

          {/* LEARN MORE + LOG OUT row */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setView("data")}
              className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
              style={btnStyle}
            >
              LEARN MORE ABOUT OUR DATA
            </button>

            {profile && (
              <button
                onClick={handleLogout}
                className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
                style={btnStyle}
              >
                LOG OUT
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 left-8 z-20 hidden lg:block animate-bounce-pixel">
        <PixelMascot avatarId={profile?.avatar} />
      </div>
    </div>
  )
}

function PixelMascot({ avatarId }: { avatarId?: string }) {
  const match = AVATARS.find(a => a.id === avatarId)
  const Component = match ? match.Component : AvatarComputerGirl
  return (
    <div className="relative" style={{ filter: 'drop-shadow(0 0 8px #ffd93d88)' }}>
      <Component size={90} />
    </div>
  )
}