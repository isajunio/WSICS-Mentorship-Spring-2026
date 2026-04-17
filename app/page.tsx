"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ArduinoBpm } from "@/components/arduino-bpm"
import { SongsView } from "@/components/songs-view"
import { VisualizerView } from "@/components/visualizer-view"
import { DataView } from "@/components/data-view"
import { PixelBackground } from "@/components/pixel-background"
import Link from "next/link"; 
import { type Song } from "@/lib/itunes"
import { supabase } from "@/lib/supabase-client"
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext"


type View = "home" | "songs" | "visualizer" | "data"

export default function HomePage() {
  const [view,         setView]         = useState<View>("home")
  const [bpm,          setBpm]          = useState(72)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  
  // fetch the user from supabase authentication
  // query "profiles" table by matching user id
// Update your useEffect to depend on user from AuthContext
useEffect(() => {
  const fetchProfile = async () => {
    if (!user) {
      setProfile(null); // ← clears profile on logout
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(profile);
  };
  fetchProfile();
}, [user]); // ← re-runs when user changes (login/logout)
  async function handleLogout() {
    await supabase.auth.signOut()
    console.log("Logging out")
  }

  const handleBpmConfirmed = (confirmedBpm: number) => {
    setBpm(confirmedBpm)
    setView("songs")
  }

  if (view === "visualizer" && selectedSong) {
    return (
      <VisualizerView
        song={selectedSong}
        onBack={() => setView("songs")}
      />
    )
  }

  if (view === "songs") {
    return (
      <SongsView
        bpm={bpm}
        onBack={() => setView("home")}
        onSelectSong={song => { setSelectedSong(song); setView("visualizer") }}
      />
    )
  }

  if (view === "data") {
    return (
      <DataView

      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PixelBackground />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
        {profile ? 
        <h1
            className="text-3xl md:text-5xl font-mono font-bold leading-tight mb-6 text-balance"
            style={{
              background: 'linear-gradient(180deg, #ffd93d 0%, #ff8c42 50%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 0 #000) drop-shadow(-1px -1px 0 #000)',
            }}
          >
            Welcome {profile.username}!
          </h1>
        : 
        <div className="flex gap-3 w-full max-w-2xl mb-8">
          <Link href="/login"
              className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
              style={{
                background: '#ff6b9d',
                color: '#000',
                borderColor: '#ff6b9d',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                padding: '10px', 
                justifyContent: 'center',
                alignItems:'center',
                display: 'flex'
                }}>
                LOGIN
          </Link>
          <Link href="/signup"
              className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
              style={{
                background: '#ff6b9d',
                color: '#000',
                borderColor: '#ff6b9d',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                padding: '10px', 
                justifyContent: 'center',
                alignItems:'center',
                display: 'flex'
                }}>
                SIGNUP
          </Link>
        </div>}
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

        {/* Arduino BPM component */}
        <ArduinoBpm onBpmConfirmed={handleBpmConfirmed} />
        <div className="flex gap-3 w-full max-w-2xl mt-8">
          {/*Implement Data Report*/}
        <button 
            className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
            style={{
                background: '#ff6b9d',
                color: '#000',
                borderColor: '#ff6b9d',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                padding: '10px', 
            }}>
            LEARN MORE ABOUT OUR DATA
         </button>
         <button 
            className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
            style={{
                background: '#ff6b9d',
                color: '#000',
                borderColor: '#ff6b9d',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                padding: '10px', 
            }}
            onClick={handleLogout}>
            LOG OUT
         </button>
         </div>

        {/* Footer note */}
        <div
          className="mt-8 px-6 py-3 bg-card/80 border-2 border-border"
          style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
        >
          <p className="font-mono text-xs text-muted-foreground tracking-wider text-center">
            Powered by iTunes · Arduino Web Serial · Chrome / Edge required for sensor
          </p>
        </div>
      </main>

      {/* Pixel mascot */}
      <div className="fixed bottom-8 left-8 z-20 hidden lg:block animate-bounce-pixel">
        <PixelMascot />
      </div>
    </div>
  )
}

function PixelMascot() {
  return (
    <div className="relative">
      <svg width="80" height="90" viewBox="0 0 40 45" fill="none">
        <rect x="4"  y="4"  width="32" height="24" fill="#4a5568" />
        <rect x="6"  y="6"  width="28" height="20" fill="#2d3748" />
        <rect x="8"  y="8"  width="24" height="16" fill="#1a1a3e" />
        <rect x="12" y="12" width="4"  height="4"  fill="#00d4aa" />
        <rect x="24" y="12" width="4"  height="4"  fill="#00d4aa" />
        <rect x="12" y="12" width="2"  height="2"  fill="#fff"    />
        <rect x="24" y="12" width="2"  height="2"  fill="#fff"    />
        <rect x="10" y="18" width="4"  height="2"  fill="#ff6b9d" fillOpacity="0.5" />
        <rect x="26" y="18" width="4"  height="2"  fill="#ff6b9d" fillOpacity="0.5" />
        <rect x="16" y="18" width="8"  height="2"  fill="#00d4aa" />
        <rect x="14" y="16" width="2"  height="2"  fill="#00d4aa" />
        <rect x="24" y="16" width="2"  height="2"  fill="#00d4aa" />
        <rect x="16" y="28" width="8"  height="4"  fill="#4a5568" />
        <rect x="12" y="32" width="16" height="4"  fill="#4a5568" />
        <rect x="34" y="2"  width="4"  height="4"  fill="#ff6b9d" />
        <rect x="0"  y="8"  width="3"  height="3"  fill="#ff9ed2" />
        <rect x="36" y="12" width="2"  height="6"  fill="#ffd93d" />
        <rect x="36" y="10" width="4"  height="2"  fill="#ffd93d" />
      </svg>
    </div>
  )
}
