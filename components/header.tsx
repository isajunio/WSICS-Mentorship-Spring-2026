"use client"

// Pixel Heart Logo
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
      {/* Shine */}
      <rect x="2" y="2" width="2" height="2" fill="#ffa0b8" />
    </svg>
  )
}

// Pixel Music Note
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

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <PixelHeartLogo />
          <span className="font-mono text-sm md:text-base font-bold tracking-tight text-foreground drop-shadow-lg">
            PulsePlay
          </span>
        </div>
        
        {/* Tagline */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-card/80 border-2 border-border">
          <PixelHeartLogo />
          <span className="font-sans text-lg text-muted-foreground">heartbeat</span>
          <span className="text-primary font-mono text-xs">x</span>
          <PixelMusicNote />
          <span className="font-sans text-lg text-muted-foreground">music</span>
        </div>

        {/* Mobile tagline */}
        <div className="flex md:hidden items-center gap-1">
          <PixelHeartLogo />
          <span className="text-primary font-mono text-xs">x</span>
          <PixelMusicNote />
        </div>
      </div>
    </header>
  )
}
