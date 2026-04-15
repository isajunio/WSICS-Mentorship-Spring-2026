"use client"

import React, { useMemo } from "react"
import { Star, Music, Heart, Dot } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type ParticleShape = "star" | "note" | "heart" | "dot"

interface Particle {
  id: number
  shape: ParticleShape
  size: number
  left: number   // vw %
  delay: number  // animation-delay seconds
  duration: number // animation-duration seconds
  opacity: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 20  // keep low — 50+ will tank the browser

const SHAPE_COMPONENTS: Record<ParticleShape, React.ComponentType<{ size: number; className?: string; style?: React.CSSProperties }>> = {
  star:  Star,
  note:  Music,
  heart: Heart,
  dot:   Dot,
}

const SHAPES: ParticleShape[] = ["star", "note", "heart", "dot"]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Seeded pseudo-random so particles are stable across re-renders */
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnimatedBackground() {
  /**
   * Particles are memoized with NO dependencies — they are generated once and
   * never change. All motion is handled by CSS @keyframes (see globals.css),
   * so React never re-renders this component after mount.
   */
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id:       i,
      shape:    SHAPES[Math.floor(seededRand(i * 4)     * SHAPES.length)],
      size:     Math.floor(seededRand(i * 4 + 1)        * 12) + 8,   // 8–20px
      left:     Math.floor(seededRand(i * 4 + 2)        * 100),      // 0–100vw
      delay:    parseFloat((seededRand(i * 4 + 3)        * 8).toFixed(2)),  // 0–8s
      duration: parseFloat((seededRand(i * 4 + 4) * 10 + 8).toFixed(2)),   // 8–18s
      opacity:  parseFloat((seededRand(i * 4 + 5) * 0.3 + 0.1).toFixed(2)),// 0.1–0.4
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {particles.map((p) => {
        const Icon = SHAPE_COMPONENTS[p.shape]
        return (
          <div
            key={p.id}
            className="absolute bottom-0 animate-float-up"
            style={{
              left:               `${p.left}%`,
              animationDelay:     `${p.delay}s`,
              animationDuration:  `${p.duration}s`,
              opacity:             p.opacity,
            }}
          >
            <Icon
              size={p.size}
              className="text-primary"
              style={{ display: "block" }}
            />
          </div>
        )
      })}
    </div>
  )
}