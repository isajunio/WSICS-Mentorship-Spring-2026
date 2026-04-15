"use client"

import { cn } from "@/lib/utils"

interface BpmDisplayProps {
  bpm: number
  mood: { label: string; description: string }
  isAnimating?: boolean
}

// Pixel Heart SVG
function PixelHeart({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg 
      width="48" 
      height="42" 
      viewBox="0 0 16 14" 
      fill="none" 
      className={cn(animate && "animate-pulse-heart", className)}
    >
      <rect x="2" y="0" width="4" height="2" fill="#ff6b9d" />
      <rect x="10" y="0" width="4" height="2" fill="#ff6b9d" />
      <rect x="0" y="2" width="8" height="2" fill="#ff6b9d" />
      <rect x="8" y="2" width="8" height="2" fill="#ff6b9d" />
      <rect x="0" y="4" width="16" height="2" fill="#ff6b9d" />
      <rect x="0" y="6" width="16" height="2" fill="#ff4d6d" />
      <rect x="2" y="8" width="12" height="2" fill="#ff4d6d" />
      <rect x="4" y="10" width="8" height="2" fill="#e8405f" />
      <rect x="6" y="12" width="4" height="2" fill="#e8405f" />
      {/* Shine */}
      <rect x="2" y="2" width="2" height="2" fill="#ffa0b8" />
    </svg>
  )
}

export function BpmDisplay({ bpm, mood, isAnimating = true }: BpmDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular BPM Display */}
      <div className="relative">
        {/* Outer glow */}
        <div 
          className={cn(
            "absolute -inset-4 rounded-full bg-primary/30 blur-2xl",
            isAnimating && "animate-glow-pulse"
          )}
        />
        
        {/* Pixel border frame */}
        <div className="relative">
          {/* Main circle with pixel border */}
          <div 
            className="relative w-52 h-52 flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #3d2060 0%, #2a1545 50%, #1a0f30 100%)',
              border: '4px solid #5a3890',
              boxShadow: 'inset 4px 4px 0 rgba(255,255,255,0.1), inset -4px -4px 0 rgba(0,0,0,0.3), 8px 8px 0 rgba(0,0,0,0.3)',
            }}
          >
            {/* Corner decorations */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary" />
            
            {/* Heart icon */}
            <PixelHeart animate={isAnimating} />
            
            {/* BPM number */}
            <span className="text-6xl font-mono font-bold text-foreground mt-2 drop-shadow-lg">
              {bpm}
            </span>
            
            {/* BPM label */}
            <span className="text-sm font-sans text-muted-foreground uppercase tracking-[0.3em] mt-1">
              BPM
            </span>
          </div>
        </div>
      </div>
      
      {/* Mood indicator - pixel style */}
      <div 
        className="flex items-center gap-3 px-6 py-3 bg-card border-4 border-border"
        style={{
          boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
        }}
      >
        <span className="text-primary font-mono text-sm font-bold">{mood.label}</span>
        <span className="text-muted-foreground font-sans text-lg">{mood.description}</span>
      </div>
      
      {/* Mood dots indicator - pixel style */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              "w-3 h-3 transition-colors",
              i < Math.floor(bpm / 20) ? "bg-primary" : "bg-muted"
            )}
            style={{
              boxShadow: i < Math.floor(bpm / 20) ? '0 0 8px #ff6b9d' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
