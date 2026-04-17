"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase-client"
import { AVATARS, AvatarComputerGirl } from "@/app/signup/page"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function PixelHeartLogo() {
  return (
    <svg width="28" height="24" viewBox="0 0 16 14" fill="none" className="animate-pulse-heart">
      <rect x="2" y="0" width="4" height="2" fill="#ff6b9d" />
      <rect x="10" y="0" width="4" height="2" fill="#ff6b9d" />
      <rect x="0" y="2" width="8" height="2" fill="#ff6b9d" />
      <rect x="8" y="2" width="8" height="2" fill="#ff6b9d" />
      <rect x="0" y="4" width="16" height="2" fill="#ff6b9d" />
      <rect x="0" y="6" width="16" height="2" fill="#ff4d6d" />
      <rect x="2" y="8" width="12" height="2" fill="#ff4d6d" />
      <rect x="4" y="10" width="8" height="2" fill="#e8405f" />
      <rect x="6" y="12" width="4" height="2" fill="#e8405f" />
      <rect x="2" y="2" width="2" height="2" fill="#ffa0b8" />
    </svg>
  )
}

function PixelMusicNote() {
  return (
    <svg width="16" height="20" viewBox="0 0 12 16" fill="none">
      <rect x="4" y="0" width="2" height="12" fill="#ffd93d" />
      <rect x="6" y="0" width="6" height="2" fill="#ffd93d" />
      <rect x="10" y="2" width="2" height="4" fill="#ffd93d" />
      <rect x="0" y="10" width="6" height="4" fill="#ffd93d" />
      <rect x="2" y="14" width="2" height="2" fill="#ffd93d" />
    </svg>
  )
}

const btnStyle = {
  background: '#ff6b9d',
  color: '#000',
  borderColor: '#ff6b9d',
  boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
}

export function Header() {
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

  const AvatarComponent = profile?.avatar
    ? (AVATARS.find(a => a.id === profile.avatar)?.Component ?? AvatarComputerGirl)
    : null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PixelHeartLogo />
          <span className="font-mono text-sm md:text-base font-bold tracking-tight text-foreground drop-shadow-lg">
            PulsePlay
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-card/80 border-2 border-border">
            <PixelHeartLogo />
            <span className="font-sans text-lg text-muted-foreground">heartbeat</span>
            <span className="text-primary font-mono text-xs">x</span>
            <PixelMusicNote />
            <span className="font-sans text-lg text-muted-foreground">music</span>
          </div>
          <div className="flex md:hidden items-center gap-1">
            <PixelHeartLogo />
            <span className="text-primary font-mono text-xs">x</span>
            <PixelMusicNote />
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              {AvatarComponent && (
                <Avatar className="w-9 h-9 border-2 rounded-none"
                  style={{ borderColor: '#ffd93d', background: '#1a1a3e' }}>
                  <AvatarFallback className="rounded-none bg-transparent p-0.5">
                    <AvatarComponent size={28} />
                  </AvatarFallback>
                </Avatar>
              )}
              {profile?.username && (
                <span className="font-mono text-xs text-[#ffd93d] hidden md:block">
                  {profile.username}
                </span>
              )}
              <button onClick={handleLogout}
                className="pixel-btn font-mono text-xs font-bold border-2 transition-colors"
                style={{ ...btnStyle, padding: '8px 14px' }}>
                LOG OUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="pixel-btn font-mono text-xs font-bold border-2 transition-colors"
                style={{ ...btnStyle, padding: '8px 14px' }}>LOGIN</Link>
              <Link href="/signup" className="pixel-btn font-mono text-xs font-bold border-2 transition-colors"
                style={{ ...btnStyle, padding: '8px 14px' }}>SIGNUP</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}