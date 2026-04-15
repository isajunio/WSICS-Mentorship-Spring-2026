"use client"

import { useEffect, useState } from "react"

// Pixel Star component
function PixelStar({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute animate-twinkle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 8 8" fill="none">
        <rect x="3" y="0" width="2" height="2" fill="#fff" />
        <rect x="0" y="3" width="2" height="2" fill="#fff" />
        <rect x="6" y="3" width="2" height="2" fill="#fff" />
        <rect x="3" y="6" width="2" height="2" fill="#fff" />
        <rect x="3" y="3" width="2" height="2" fill="#fff" />
      </svg>
    </div>
  )
}

// Pixel Heart component
function PixelHeart({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <div
      className="absolute animate-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 16 14" fill="none">
        <rect x="2" y="0" width="4" height="2" fill={color} />
        <rect x="10" y="0" width="4" height="2" fill={color} />
        <rect x="0" y="2" width="8" height="2" fill={color} />
        <rect x="8" y="2" width="8" height="2" fill={color} />
        <rect x="0" y="4" width="16" height="2" fill={color} />
        <rect x="0" y="6" width="16" height="2" fill={color} />
        <rect x="2" y="8" width="12" height="2" fill={color} />
        <rect x="4" y="10" width="8" height="2" fill={color} />
        <rect x="6" y="12" width="4" height="2" fill={color} />
      </svg>
    </div>
  )
}

// Pixel Music Note component
function PixelNote({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <div
      className="absolute animate-drift"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${5 + Math.random() * 3}s`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 12 16" fill="none">
        <rect x="4" y="0" width="2" height="12" fill={color} />
        <rect x="6" y="0" width="6" height="2" fill={color} />
        <rect x="10" y="2" width="2" height="4" fill={color} />
        <rect x="0" y="10" width="6" height="4" fill={color} />
        <rect x="0" y="12" width="6" height="2" fill={color} />
        <rect x="2" y="14" width="2" height="2" fill={color} />
      </svg>
    </div>
  )
}

// Pixel Cloud component
function PixelCloud({ x, y, scale, delay }: { x: number; y: number; scale: number; delay: number }) {
  return (
    <div
      className="absolute opacity-60"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `scale(${scale})`,
        animation: `cloud-move ${80 + delay * 20}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
        <rect x="16" y="16" width="32" height="8" fill="#4a5568" />
        <rect x="8" y="20" width="48" height="8" fill="#4a5568" />
        <rect x="20" y="8" width="8" height="8" fill="#4a5568" />
        <rect x="32" y="12" width="12" height="8" fill="#4a5568" />
      </svg>
    </div>
  )
}

// Pixel Mountain component
function PixelMountain({ x, height, color, shadowColor }: { x: number; height: number; color: string; shadowColor: string }) {
  return (
    <div
      className="absolute bottom-0"
      style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
    >
      <svg width={height * 1.5} height={height} viewBox="0 0 150 100" fill="none" preserveAspectRatio="none">
        {/* Main mountain */}
        <polygon points="75,0 150,100 0,100" fill={color} />
        {/* Shadow side */}
        <polygon points="75,0 150,100 75,100" fill={shadowColor} />
        {/* Snow cap */}
        <polygon points="75,0 90,20 60,20" fill="#e8e8f0" />
        <polygon points="75,0 90,20 75,20" fill="#c8c8d8" />
      </svg>
    </div>
  )
}

// Pixel Tree component
function PixelTree({ x, size, delay }: { x: number; size: number; delay: number }) {
  return (
    <div
      className="absolute bottom-0 animate-sway origin-bottom"
      style={{
        left: `${x}%`,
        transform: 'translateX(-50%)',
        animationDelay: `${delay}s`,
      }}
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 24 36" fill="none">
        {/* Tree trunk */}
        <rect x="10" y="28" width="4" height="8" fill="#5d4037" />
        {/* Tree layers */}
        <polygon points="12,0 22,12 2,12" fill="#2d5016" />
        <polygon points="12,6 24,20 0,20" fill="#3d6b1e" />
        <polygon points="12,12 26,28 -2,28" fill="#4a7c23" />
      </svg>
    </div>
  )
}

// Pixel Flower component
function PixelFlower({ x, delay }: { x: number; delay: number }) {
  const colors = ['#ff6b9d', '#ff9ed2', '#ffd93d', '#ff8c42']
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  return (
    <div
      className="absolute bottom-2 animate-sway"
      style={{
        left: `${x}%`,
        animationDelay: `${delay}s`,
        animationDuration: '3s',
      }}
    >
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <rect x="3" y="6" width="2" height="6" fill="#4a7c23" />
        <rect x="2" y="2" width="4" height="4" fill={color} />
        <rect x="0" y="4" width="2" height="2" fill={color} />
        <rect x="6" y="4" width="2" height="2" fill={color} />
        <rect x="2" y="0" width="4" height="2" fill={color} />
        <rect x="3" y="3" width="2" height="2" fill="#ffd93d" />
      </svg>
    </div>
  )
}

// Sparkle component
function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div
      className="absolute animate-sparkle text-yellow-300"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <rect x="5" y="0" width="2" height="4" />
        <rect x="5" y="8" width="2" height="4" />
        <rect x="0" y="5" width="4" height="2" />
        <rect x="8" y="5" width="4" height="2" />
      </svg>
    </div>
  )
}

export function PixelBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Generate random positions
  const stars = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 50,
    size: 8 + Math.random() * 8,
    delay: Math.random() * 3,
  }))

  const hearts = Array.from({ length: 8 }, (_, i) => ({
    x: 5 + Math.random() * 90,
    y: 10 + Math.random() * 60,
    size: 16 + Math.random() * 16,
    delay: Math.random() * 4,
    color: ['#ff6b9d', '#ff9ed2', '#ff4d6d'][Math.floor(Math.random() * 3)],
  }))

  const notes = Array.from({ length: 6 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    y: 15 + Math.random() * 50,
    size: 20 + Math.random() * 12,
    delay: Math.random() * 5,
    color: ['#ffd93d', '#ff8c42', '#00d4aa'][Math.floor(Math.random() * 3)],
  }))

  const sparkles = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 70,
    delay: Math.random() * 4,
  }))

  const flowers = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 2,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a3e 30%, #2a2060 60%, #3d2080 100%)',
        }}
      />

      {/* Clouds */}
      <PixelCloud x={-10} y={8} scale={1.2} delay={0} />
      <PixelCloud x={30} y={12} scale={0.8} delay={5} />
      <PixelCloud x={70} y={6} scale={1} delay={10} />
      <PixelCloud x={110} y={15} scale={0.9} delay={15} />

      {/* Stars */}
      {stars.map((star, i) => (
        <PixelStar key={`star-${i}`} {...star} />
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle, i) => (
        <Sparkle key={`sparkle-${i}`} {...sparkle} />
      ))}

      {/* Mountains - back layer */}
      <PixelMountain x={15} height={200} color="#2d1f4a" shadowColor="#1f1535" />
      <PixelMountain x={40} height={280} color="#3d2a6a" shadowColor="#2d1f4a" />
      <PixelMountain x={70} height={240} color="#2d1f4a" shadowColor="#1f1535" />
      <PixelMountain x={90} height={180} color="#3d2a6a" shadowColor="#2d1f4a" />

      {/* Mountains - front layer */}
      <PixelMountain x={0} height={140} color="#4a3080" shadowColor="#3d2060" />
      <PixelMountain x={55} height={160} color="#5a3890" shadowColor="#4a3080" />
      <PixelMountain x={100} height={120} color="#4a3080" shadowColor="#3d2060" />

      {/* Ground */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: 'linear-gradient(180deg, #234518 0%, #1a3312 50%, #142810 100%)',
        }}
      />

      {/* Grass texture */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8"
        style={{
          background: 'repeating-linear-gradient(90deg, #2d5016 0px, #3d6b1e 4px, #4a7c23 8px, #3d6b1e 12px, #2d5016 16px)',
        }}
      />

      {/* Trees */}
      <PixelTree x={5} size={40} delay={0} />
      <PixelTree x={12} size={32} delay={0.5} />
      <PixelTree x={22} size={48} delay={1} />
      <PixelTree x={35} size={36} delay={1.5} />
      <PixelTree x={65} size={44} delay={0.3} />
      <PixelTree x={78} size={32} delay={0.8} />
      <PixelTree x={85} size={52} delay={1.2} />
      <PixelTree x={95} size={38} delay={0.6} />

      {/* Flowers */}
      {flowers.map((flower, i) => (
        <PixelFlower key={`flower-${i}`} {...flower} />
      ))}

      {/* Floating Hearts */}
      {hearts.map((heart, i) => (
        <PixelHeart key={`heart-${i}`} {...heart} />
      ))}

      {/* Floating Music Notes */}
      {notes.map((note, i) => (
        <PixelNote key={`note-${i}`} {...note} />
      ))}

      {/* Scanline overlay for retro effect */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </div>
  )
}
