"use client"

import { useState } from "react";
import { PixelBackground } from "@/components/pixel-background";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { supabase } from '@/lib/supabase-client';
import Link from "next/link";

export function AvatarComputerGirl({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.125} viewBox="0 0 40 45" fill="none">
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
  )
}

export function AvatarRobot({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.125} viewBox="0 0 40 45" fill="none">
      <rect x="14" y="0"  width="12" height="4"  fill="#aaa" />
      <rect x="18" y="4"  width="4"  height="4"  fill="#888" />
      <rect x="6"  y="8"  width="28" height="22" fill="#778899" />
      <rect x="8"  y="10" width="24" height="18" fill="#4a6080" />
      <rect x="10" y="13" width="6"  height="6"  fill="#ffd93d" />
      <rect x="24" y="13" width="6"  height="6"  fill="#ffd93d" />
      <rect x="11" y="14" width="4"  height="4"  fill="#1a1a3e" />
      <rect x="25" y="14" width="4"  height="4"  fill="#1a1a3e" />
      <rect x="12" y="22" width="16" height="2"  fill="#00d4aa" />
      <rect x="2"  y="12" width="4"  height="8"  fill="#778899" />
      <rect x="34" y="12" width="4"  height="8"  fill="#778899" />
      <rect x="12" y="30" width="6"  height="12" fill="#778899" />
      <rect x="22" y="30" width="6"  height="12" fill="#778899" />
      <rect x="10" y="40" width="8"  height="4"  fill="#556" />
      <rect x="22" y="40" width="8"  height="4"  fill="#556" />
    </svg>
  )
}

export function AvatarCat({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.125} viewBox="0 0 40 45" fill="none">
      <rect x="4"  y="6"  width="6"  height="8"  fill="#ff8c42" />
      <rect x="30" y="6"  width="6"  height="8"  fill="#ff8c42" />
      <rect x="6"  y="8"  width="4"  height="4"  fill="#ffd93d" />
      <rect x="30" y="8"  width="4"  height="4"  fill="#ffd93d" />
      <rect x="6"  y="10" width="28" height="24" fill="#ff8c42" />
      <rect x="8"  y="12" width="24" height="20" fill="#ffaa70" />
      <rect x="10" y="16" width="6"  height="6"  fill="#1a1a3e" />
      <rect x="24" y="16" width="6"  height="6"  fill="#1a1a3e" />
      <rect x="12" y="17" width="2"  height="2"  fill="#00d4aa" />
      <rect x="26" y="17" width="2"  height="2"  fill="#00d4aa" />
      <rect x="16" y="24" width="2"  height="2"  fill="#ff6b9d" />
      <rect x="20" y="24" width="2"  height="2"  fill="#1a1a3e" />
      <rect x="22" y="24" width="2"  height="2"  fill="#1a1a3e" />
      <rect x="14" y="26" width="12" height="2"  fill="#ff6b9d" />
      <rect x="2"  y="20" width="8"  height="2"  fill="#ff8c42" />
      <rect x="30" y="20" width="8"  height="2"  fill="#ff8c42" />
      <rect x="2"  y="24" width="6"  height="2"  fill="#ff8c42" />
      <rect x="32" y="24" width="6"  height="2"  fill="#ff8c42" />
    </svg>
  )
}

export function AvatarGhost({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.125} viewBox="0 0 40 45" fill="none">
      <rect x="8"  y="4"  width="24" height="4"  fill="#c8b4f0" />
      <rect x="4"  y="8"  width="32" height="24" fill="#c8b4f0" />
      <rect x="2"  y="10" width="4"  height="20" fill="#c8b4f0" />
      <rect x="34" y="10" width="4"  height="20" fill="#c8b4f0" />
      <rect x="2"  y="30" width="6"  height="8"  fill="#c8b4f0" />
      <rect x="10" y="30" width="6"  height="6"  fill="#c8b4f0" />
      <rect x="18" y="30" width="4"  height="8"  fill="#c8b4f0" />
      <rect x="24" y="30" width="6"  height="6"  fill="#c8b4f0" />
      <rect x="32" y="30" width="6"  height="8"  fill="#c8b4f0" />
      <rect x="2"  y="38" width="4"  height="4"  fill="#9b7fd4" />
      <rect x="34" y="38" width="4"  height="4"  fill="#9b7fd4" />
      <rect x="12" y="14" width="6"  height="6"  fill="#1a1a3e" />
      <rect x="22" y="14" width="6"  height="6"  fill="#1a1a3e" />
      <rect x="13" y="15" width="2"  height="2"  fill="#fff" />
      <rect x="23" y="15" width="2"  height="2"  fill="#fff" />
      <rect x="14" y="24" width="12" height="2"  fill="#9b7fd4" />
      <rect x="12" y="22" width="2"  height="2"  fill="#9b7fd4" />
      <rect x="26" y="22" width="2"  height="2"  fill="#9b7fd4" />
    </svg>
  )
}

export function AvatarHeart({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.125} viewBox="0 0 40 45" fill="none">
      <rect x="4"  y="8"  width="8"  height="4"  fill="#ff6b9d" />
      <rect x="28" y="8"  width="8"  height="4"  fill="#ff6b9d" />
      <rect x="2"  y="12" width="16" height="4"  fill="#ff6b9d" />
      <rect x="22" y="12" width="16" height="4"  fill="#ff6b9d" />
      <rect x="2"  y="16" width="36" height="4"  fill="#ff6b9d" />
      <rect x="2"  y="20" width="36" height="4"  fill="#ff4d6d" />
      <rect x="4"  y="24" width="32" height="4"  fill="#ff4d6d" />
      <rect x="8"  y="28" width="24" height="4"  fill="#e8405f" />
      <rect x="12" y="32" width="16" height="4"  fill="#e8405f" />
      <rect x="16" y="36" width="8"  height="4"  fill="#c8304f" />
      <rect x="4"  y="12" width="4"  height="4"  fill="#ffa0b8" />
      <rect x="16" y="17" width="4"  height="2"  fill="#fff" fillOpacity="0.4" />
    </svg>
  )
}

export function AvatarAlien({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.125} viewBox="0 0 40 45" fill="none">
      <rect x="10" y="2"  width="20" height="4"  fill="#00d4aa" />
      <rect x="6"  y="6"  width="28" height="22" fill="#00d4aa" />
      <rect x="4"  y="8"  width="4"  height="14" fill="#00d4aa" />
      <rect x="32" y="8"  width="4"  height="14" fill="#00d4aa" />
      <rect x="8"  y="10" width="10" height="8"  fill="#1a1a3e" />
      <rect x="22" y="10" width="10" height="8"  fill="#1a1a3e" />
      <rect x="9"  y="11" width="6"  height="5"  fill="#ffd93d" />
      <rect x="23" y="11" width="6"  height="5"  fill="#ffd93d" />
      <rect x="10" y="12" width="3"  height="3"  fill="#1a1a3e" />
      <rect x="24" y="12" width="3"  height="3"  fill="#1a1a3e" />
      <rect x="16" y="20" width="2"  height="2"  fill="#00ffcc" />
      <rect x="22" y="20" width="2"  height="2"  fill="#00ffcc" />
      <rect x="14" y="24" width="12" height="2"  fill="#1a1a3e" />
      <rect x="12" y="28" width="16" height="8"  fill="#00b894" />
      <rect x="10" y="36" width="6"  height="8"  fill="#00b894" />
      <rect x="24" y="36" width="6"  height="8"  fill="#00b894" />
      <rect x="2"  y="14" width="4"  height="2"  fill="#00ffcc" />
      <rect x="34" y="14" width="4"  height="2"  fill="#00ffcc" />
    </svg>
  )
}

export const AVATARS = [
  { id: "computer_girl", label: "Computer Girl", Component: AvatarComputerGirl },
  { id: "robot",         label: "Robot",         Component: AvatarRobot },
  { id: "cat",           label: "Cat",           Component: AvatarCat },
  { id: "ghost",         label: "Ghost",         Component: AvatarGhost },
  { id: "heart",         label: "Heart",         Component: AvatarHeart },
  { id: "alien",         label: "Alien",         Component: AvatarAlien },
]

export default function Signup() {
  const [email,       setEmail]       = useState("");
  const [username,    setUsername]    = useState("");
  const [password,    setPassword]    = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [errorMsg,    setErrorMsg]    = useState("");
  const router = useRouter();

  const avatar = AVATARS[activeIndex].id;

  function prev() { setActiveIndex(i => (i - 1 + AVATARS.length) % AVATARS.length); }
  function next() { setActiveIndex(i => (i + 1) % AVATARS.length); }

  async function handleSignup(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, email, avatar } }
    });
    if (error) { setErrorMsg(error.message); return; }
    router.push('/');
  }

  const inputClass = "w-full px-5 py-4 text-base font-mono rounded-lg border-2 border-[#ff6b9d] bg-[#1a1a3e] text-white placeholder-[#8888aa] focus:outline-none focus:ring-2 focus:ring-[#ffd93d] focus:border-[#ffd93d] transition duration-200";
  const getSlot = (offset: number) => (activeIndex + offset + AVATARS.length) % AVATARS.length;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PixelBackground />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
        <div className="text-center mb-10 max-w-2xl">
          <p className="font-mono text-xs md:text-sm text-primary tracking-[0.3em] uppercase mb-4">
            Find the Rhythm of Your Heart in
          </p>
          <h1 className="text-3xl md:text-5xl font-mono font-bold leading-tight mb-6"
            style={{
              background: 'linear-gradient(180deg, #ffd93d 0%, #ff8c42 50%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 0 #000) drop-shadow(-1px -1px 0 #000)',
            }}>
            PulsePlay
          </h1>
          <p className="text-muted-foreground font-sans text-xl md:text-2xl leading-relaxed">
            Enter a username and password to get started. We promise not to play with your heart {"<3"}
          </p>
        </div>

        <form onSubmit={handleSignup} className="w-full max-w-md flex flex-col gap-4">
          {/* Netflix carousel */}
          <div className="mb-2">
            <p className="font-mono text-xs text-[#ff6b9d] tracking-[0.2em] uppercase mb-4 text-center">
              Choose Your Avatar
            </p>
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={prev}
                className="font-mono text-xl font-bold flex-shrink-0 transition-colors hover:text-[#ffd93d]"
                style={{ color: '#ff6b9d', textShadow: '2px 2px 0 #000' }}>◀</button>

              <div className="flex items-center justify-center gap-3 overflow-hidden" style={{ width: '300px' }}>
                {/* Left ghost */}
                <div className="flex-shrink-0 transition-all duration-300" style={{ opacity: 0.3, transform: 'scale(0.7)', filter: 'blur(1px)' }}>
                  {(() => { const A = AVATARS[getSlot(-1)].Component; return <A size={64} />; })()}
                </div>
                {/* Center selected */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-300">
                  <div className="p-3 rounded-xl border-2" style={{
                    borderColor: '#ffd93d', background: '#1a1a3e',
                    boxShadow: '0 0 20px #ffd93d55, 4px 4px 0 rgba(0,0,0,0.4)',
                    filter: 'drop-shadow(0 0 12px #ffd93d)',
                  }}>
                    {(() => { const A = AVATARS[activeIndex].Component; return <A size={90} />; })()}
                  </div>
                  <span className="font-mono text-[10px] text-[#ffd93d] tracking-widest uppercase">
                    {AVATARS[activeIndex].label}
                  </span>
                </div>
                {/* Right ghost */}
                <div className="flex-shrink-0 transition-all duration-300" style={{ opacity: 0.3, transform: 'scale(0.7)', filter: 'blur(1px)' }}>
                  {(() => { const A = AVATARS[getSlot(1)].Component; return <A size={64} />; })()}
                </div>
              </div>

              <button type="button" onClick={next}
                className="font-mono text-xl font-bold flex-shrink-0 transition-colors hover:text-[#ffd93d]"
                style={{ color: '#ff6b9d', textShadow: '2px 2px 0 #000' }}>▶</button>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-3">
              {AVATARS.map((_, i) => (
                <button key={i} type="button" onClick={() => setActiveIndex(i)}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{ background: i === activeIndex ? '#ffd93d' : '#ff6b9d44' }} />
              ))}
            </div>
          </div>

          <input name="email"    placeholder="Email"    className={inputClass} type="email"    onChange={e => setEmail(e.target.value)}    required />
          <input name="username" placeholder="Username" className={inputClass} type="text"     onChange={e => setUsername(e.target.value)} required />
          <input name="password" placeholder="Password" className={inputClass} type="password" onChange={e => setPassword(e.target.value)} required />

          {errorMsg && <p className="font-mono text-xs text-red-400">{errorMsg}</p>}

          <button type="submit" className="pixel-btn w-full font-mono text-sm font-bold border-2 transition-colors mt-2"
            style={{ background: '#ff6b9d', color: '#000', borderColor: '#ff6b9d', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)', padding: '14px' }}>
            SIGN UP
          </button>
          <p className="font-mono text-xs text-center text-[#8888aa] mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-[#ff6b9d] hover:text-[#ffd93d] transition-colors">Log in here</Link>
          </p>
        </form>
      </main>
    </div>
  );
}