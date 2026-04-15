"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ── Inline Web Serial API types ───────────────────────────────────────────────
interface SerialPortInfo { usbVendorId?: number; usbProductId?: number }
interface SerialOptions { baudRate: number; dataBits?: number; stopBits?: number; parity?: string; bufferSize?: number; flowControl?: string }
interface SerialPort {
  open(options: SerialOptions): Promise<void>
  close(): Promise<void>
  readable: ReadableStream<Uint8Array> | null
  writable: WritableStream<Uint8Array> | null
  getInfo(): SerialPortInfo
}
interface Serial {
  requestPort(options?: { filters?: SerialPortInfo[] }): Promise<SerialPort>
  getPorts(): Promise<SerialPort[]>
}

interface ArduinoBpmProps {
  onBpmConfirmed: (bpm: number) => void
}

const SUMMARISE_AFTER = 8
const GRAPH_POINTS    = 80
const LOG_LINES       = 60
const BAUD_RATE       = 115200
const GRAPH_FLUSH_MS  = 200

type ConnectionState = "disconnected" | "connecting" | "connected" | "unsupported"

// ── Pixel icons ───────────────────────────────────────────────────────────────

function PixelUSB() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <rect x="6"  y="0"  width="4" height="2" />
      <rect x="4"  y="2"  width="8" height="2" />
      <rect x="6"  y="4"  width="4" height="6" />
      <rect x="2"  y="8"  width="4" height="2" />
      <rect x="10" y="8"  width="4" height="2" />
      <rect x="2"  y="10" width="2" height="2" />
      <rect x="12" y="10" width="2" height="2" />
      <rect x="6"  y="10" width="4" height="4" />
      <rect x="7"  y="14" width="2" height="2" />
    </svg>
  )
}

function PixelHeart({ animate = false, size = 20 }: { animate?: boolean; size?: number }) {
  return (
    <svg width={size} height={size * 14 / 16} viewBox="0 0 16 14" fill="none"
      style={animate ? { animation: 'pulse 0.3s ease-out' } : {}}>
      <rect x="2"  y="0"  width="4"  height="2" fill="#ff6b9d" />
      <rect x="10" y="0"  width="4"  height="2" fill="#ff6b9d" />
      <rect x="0"  y="2"  width="8"  height="2" fill="#ff6b9d" />
      <rect x="8"  y="2"  width="8"  height="2" fill="#ff6b9d" />
      <rect x="0"  y="4"  width="16" height="2" fill="#ff6b9d" />
      <rect x="0"  y="6"  width="16" height="2" fill="#ff4d6d" />
      <rect x="2"  y="8"  width="12" height="2" fill="#ff4d6d" />
      <rect x="4"  y="10" width="8"  height="2" fill="#e8405f" />
      <rect x="6"  y="12" width="4"  height="2" fill="#e8405f" />
    </svg>
  )
}

function PixelX() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2"  y="2"  width="2" height="2" /><rect x="12" y="2"  width="2" height="2" />
      <rect x="4"  y="4"  width="2" height="2" /><rect x="10" y="4"  width="2" height="2" />
      <rect x="6"  y="6"  width="4" height="4" />
      <rect x="4"  y="10" width="2" height="2" /><rect x="10" y="10" width="2" height="2" />
      <rect x="2"  y="12" width="2" height="2" /><rect x="12" y="12" width="2" height="2" />
    </svg>
  )
}

// ── Raw signal graph ──────────────────────────────────────────────────────────

function RawGraph({ points }: { points: number[] }) {
  if (points.length < 2) {
    return (
      <div className="w-full h-16 flex items-center justify-center"
        style={{ background: '#0a0a0a' }}>
        <span className="font-mono text-xs" style={{ color: '#1a5a1a' }}>awaiting signal…</span>
      </div>
    )
  }
  const W = 400, H = 64
  const min   = Math.min(...points)
  const max   = Math.max(...points)
  const range = max - min || 1
  const pts   = points.map((v, i) => {
    const x = (i / (points.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <div className="w-full" style={{ background: '#0a0a0a' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        style={{ display: 'block', height: '64px', imageRendering: 'pixelated' }}>
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1="0" y1={H * f} x2={W} y2={H * f}
            stroke="#1a3a1a" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        <polyline points={pts} fill="none" stroke="#00ff41" strokeWidth="1.5" />
        <polyline points={pts} fill="none" stroke="#00ff41" strokeWidth="4" opacity="0.1" />
      </svg>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ArduinoBpm({ onBpmConfirmed }: ArduinoBpmProps) {
  const [connState,   setConnState]   = useState<ConnectionState>("disconnected")
  const [liveBpm,     setLiveBpm]     = useState<number | null>(null)
  const [liveIbi,     setLiveIbi]     = useState<number | null>(null)
  const [bpmReadings, setBpmReadings] = useState<number[]>([])
  const [rawPoints,   setRawPoints]   = useState<number[]>([])
  const [logLines,    setLogLines]    = useState<string[]>(["[system] PulsePlay ready — connect your Arduino"])
  const [avgBpm,      setAvgBpm]      = useState<number | null>(null)
  const [manualBpm,   setManualBpm]   = useState<number>(120)
  const [mode,        setMode]        = useState<"arduino" | "manual">("arduino")
  const [beatFlash,   setBeatFlash]   = useState(false)

  const portRef      = useRef<SerialPort | null>(null)
  const readerRef    = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const bufferRef    = useRef("")
  const readingsRef  = useRef<number[]>([])
  const logRef       = useRef<HTMLDivElement>(null)
  const lastIbiRef   = useRef<number | null>(null)

  const rawBufRef    = useRef<number[]>([])
  const lastRawFlush = useRef(0)
  const lastLogFlush = useRef(0)
  const logBufRef    = useRef<string[]>([])

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serial" in navigator)) {
      setConnState("unsupported")
    }
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logLines])

  const flushRaw = useCallback(() => {
    const now = Date.now()
    if (now - lastRawFlush.current < GRAPH_FLUSH_MS) return
    lastRawFlush.current = now
    if (rawBufRef.current.length === 0) return
    const combined = rawBufRef.current
    rawBufRef.current = []
    setRawPoints(prev => [...prev, ...combined].slice(-GRAPH_POINTS))
  }, [])

  const flushLog = useCallback(() => {
    const now = Date.now()
    if (now - lastLogFlush.current < 300) return
    lastLogFlush.current = now
    if (logBufRef.current.length === 0) return
    const lines = logBufRef.current
    logBufRef.current = []
    setLogLines(prev => [...prev.slice(-(LOG_LINES - lines.length)), ...lines])
  }, [])

  const addLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour12: false })
    logBufRef.current.push(`[${ts}] ${msg}`)
    flushLog()
  }, [flushLog])

  const addLogImmediate = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour12: false })
    setLogLines(prev => [...prev.slice(-(LOG_LINES - 1)), `[${ts}] ${msg}`])
  }, [])

  // ── Shared beat handler ───────────────────────────────────────────────────
  const handleBeat = useCallback((bpmVal: number, ibiVal: number | null) => {
    if (isNaN(bpmVal) || bpmVal < 40 || bpmVal > 200) return
    setLiveBpm(bpmVal)
    if (ibiVal !== null && !isNaN(ibiVal)) setLiveIbi(ibiVal)
    setBeatFlash(true)
    setTimeout(() => setBeatFlash(false), 200)

    const next = [...readingsRef.current, bpmVal]
    readingsRef.current = next
    setBpmReadings(next)

    const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length)
    setAvgBpm(avg)

    const ibiStr = ibiVal ? `  IBI: ${ibiVal}ms` : ""
    addLog(`♥ BPM: ${bpmVal}${ibiStr}`)

    if (next.length === SUMMARISE_AFTER) {
      addLogImmediate(`★ Ready! Avg BPM: ${avg}`)
    }
  }, [addLog, addLogImmediate])

  // ── Line parser — handles both serial formats ─────────────────────────────
  const parseLine = useCallback((line: string) => {
    line = line.trim()
    if (!line) return

    if (line.startsWith("Signal:")) {
      const val = parseInt(line.slice(7))
      if (!isNaN(val)) { rawBufRef.current.push(val); flushRaw() }
      return
    }

    if (line.startsWith("BPM:")) {
      const parts  = line.split(",")
      const bpmVal = parseInt(parts[0].slice(4))
      const ibiVal = parts[1] ? parseInt(parts[1].replace("IBI:", "")) : null
      handleBeat(bpmVal, ibiVal)
      return
    }

    const csvParts = line.split(",")
    if (csvParts.length === 3) {
      const bpmVal    = parseInt(csvParts[0])
      const ibiVal    = parseInt(csvParts[1])
      const signalVal = parseInt(csvParts[2])

      if (!isNaN(signalVal)) { rawBufRef.current.push(signalVal); flushRaw() }

      if (!isNaN(bpmVal) && !isNaN(ibiVal) && ibiVal !== lastIbiRef.current) {
        lastIbiRef.current = ibiVal
        handleBeat(bpmVal, ibiVal)
      }
      return
    }

    if (line.length < 80) addLog(line)
  }, [addLog, flushRaw, handleBeat])

  const readLoop = useCallback(async () => {
    const port = portRef.current
    if (!port?.readable) return
    const reader = port.readable.getReader() as ReadableStreamDefaultReader<Uint8Array>
    readerRef.current = reader
    const decoder = new TextDecoder()
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        bufferRef.current += decoder.decode(value, { stream: true })
        const lines = bufferRef.current.split("\n")
        bufferRef.current = lines.pop() ?? ""
        lines.forEach(parseLine)
      }
    } catch { /* port closed */ }
    finally { reader.releaseLock() }
  }, [parseLine])

  const connect = async () => {
    try {
      setConnState("connecting")
      addLogImmediate("Requesting serial port…")
      const serial = (navigator as Navigator & { serial: Serial }).serial
      const port   = await serial.requestPort()
      await port.open({ baudRate: BAUD_RATE })
      portRef.current = port
      setConnState("connected")
      addLogImmediate(`✓ Connected at ${BAUD_RATE} baud`)
      addLogImmediate("Place finger firmly on sensor — keep still")
      readLoop()
    } catch (err: unknown) {
      setConnState("disconnected")
      addLogImmediate(`✗ ${err instanceof Error ? err.message : "Connection cancelled"}`)
    }
  }

  const disconnect = async () => {
    try { await readerRef.current?.cancel(); await portRef.current?.close() } catch { /* ignore */ }
    portRef.current    = null
    readerRef.current  = null
    rawBufRef.current  = []
    logBufRef.current  = []
    lastIbiRef.current = null
    setConnState("disconnected")
    addLogImmediate("Disconnected")
  }

  const resetReadings = () => {
    setBpmReadings([]);  readingsRef.current = []
    rawBufRef.current = []; setRawPoints([])
    setAvgBpm(null); setLiveBpm(null); setLiveIbi(null)
    lastIbiRef.current = null
    addLogImmediate("Readings cleared")
  }

  const confirmedBpm = mode === "arduino"
    ? (bpmReadings.length >= SUMMARISE_AFTER ? avgBpm : null)
    : manualBpm

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["arduino", "manual"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="flex-1 py-2 font-mono text-xs font-bold border-2 transition-colors"
            style={{
              background:  mode === m ? '#ff6b9d' : 'transparent',
              color:       mode === m ? '#000'    : '#888',
              borderColor: mode === m ? '#ff6b9d' : '#333',
              boxShadow:   mode === m ? '3px 3px 0 rgba(0,0,0,0.4)' : '2px 2px 0 rgba(0,0,0,0.2)',
            }}>
            {m === "arduino" ? "⚡ ARDUINO SENSOR" : "✏  MANUAL INPUT"}
          </button>
        ))}
      </div>

      {/* ── ARDUINO MODE ── */}
      {mode === "arduino" && (
        <div className="space-y-3">

          {connState === "unsupported" && (
            <div className="p-4 border-2 border-yellow-600 font-mono text-xs text-yellow-400"
              style={{ background: 'rgba(234,179,8,0.05)' }}>
              ⚠ Web Serial requires Chrome or Edge — not supported in Safari / Firefox.
            </div>
          )}

          {connState !== "unsupported" && (
            <div className="flex items-center gap-3 flex-wrap">
              {connState !== "connected" ? (
                <button onClick={connect} disabled={connState === "connecting"}
                  className="flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold border-4 border-foreground disabled:opacity-50"
                  style={{ background: '#00d4aa', color: '#000', boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}>
                  <PixelUSB />
                  {connState === "connecting" ? "CONNECTING…" : "CONNECT ARDUINO"}
                </button>
              ) : (
                <button onClick={disconnect}
                  className="flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold border-4 border-foreground"
                  style={{ background: '#ef4444', color: '#fff', boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}>
                  <PixelX /> DISCONNECT
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{
                  background: connState === "connected" ? '#00ff41' : connState === "connecting" ? '#ffd93d' : '#444',
                  boxShadow:  connState === "connected" ? '0 0 8px #00ff41' : 'none',
                }} />
                <span className="font-mono text-xs" style={{ color: connState === "connected" ? '#00ff41' : '#555' }}>
                  {connState === "connected"  ? `CONNECTED — ${BAUD_RATE} BAUD`
                  : connState === "connecting" ? "CONNECTING…" : "OFFLINE"}
                </span>
              </div>
            </div>
          )}

          {/* Live BPM + Avg */}
          <div className="flex items-center justify-between p-4 border-4 transition-all duration-100"
            style={{
              borderColor: beatFlash ? '#ff6b9d' : '#333',
              background:  beatFlash ? 'rgba(255,107,157,0.08)' : 'rgba(0,0,0,0.5)',
              boxShadow:   beatFlash ? '0 0 24px rgba(255,107,157,0.35)' : '4px 4px 0 rgba(0,0,0,0.4)',
            }}>

            <div className="flex items-center gap-3">
              <PixelHeart animate={beatFlash} size={28} />
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-1">LIVE BPM</div>
                <div className="font-mono font-bold" style={{
                  fontSize: '3.5rem', lineHeight: 1,
                  color:      liveBpm ? '#ff6b9d' : '#333',
                  textShadow: liveBpm ? '2px 2px 0 rgba(0,0,0,0.6)' : 'none',
                }}>
                  {liveBpm ?? '--'}
                </div>
                {liveIbi && <div className="font-mono text-xs text-muted-foreground mt-1">IBI: {liveIbi}ms</div>}
              </div>
            </div>

            {avgBpm && bpmReadings.length >= SUMMARISE_AFTER ? (
              <div className="text-right">
                <div className="font-mono text-xs text-yellow-500 mb-1">AVG BPM</div>
                <div className="font-mono font-bold text-yellow-400"
                  style={{ fontSize: '2.8rem', lineHeight: 1, textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}>
                  {avgBpm}
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-1">{bpmReadings.length} readings</div>
              </div>
            ) : (
              <div className="text-right">
                <div className="font-mono text-xs text-muted-foreground mb-1">COLLECTING</div>
                <div className="font-mono text-primary font-bold text-2xl">
                  {bpmReadings.length} / {SUMMARISE_AFTER}
                </div>
                <div className="mt-2 w-24 h-2 bg-muted" style={{ border: '1px solid #333' }}>
                  <div className="h-full bg-primary transition-all"
                    style={{ width: `${(bpmReadings.length / SUMMARISE_AFTER) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Raw signal graph */}
          <div style={{ background: '#0a0a0a', border: '2px solid #1a3a1a' }}>
            <div className="flex items-center justify-between px-3 py-1"
              style={{ borderBottom: '1px solid #1a3a1a' }}>
              <span className="font-mono text-xs" style={{ color: '#00ff41' }}>● PULSE SIGNAL (A0)</span>
              <span className="font-mono text-xs" style={{ color: '#1a5a1a' }}>
                {rawPoints.length > 0 ? `Signal: ${rawPoints[rawPoints.length - 1]}` : '---'}
              </span>
            </div>
            <RawGraph points={rawPoints} />
          </div>

          {/* Serial monitor */}
          <div style={{ background: '#0a0a0a', border: '2px solid #1a3a1a' }}>
            <div className="flex items-center justify-between px-3 py-1"
              style={{ borderBottom: '1px solid #1a3a1a' }}>
              <span className="font-mono text-xs" style={{ color: '#00ff41' }}>
                ● SERIAL MONITOR ({BAUD_RATE} baud)
              </span>
              <button onClick={() => setLogLines(["[system] Cleared"])}
                className="font-mono text-xs hover:text-white transition-colors"
                style={{ color: '#1a5a1a' }}>
                CLEAR
              </button>
            </div>
            <div ref={logRef} className="p-2 h-36 overflow-y-auto space-y-0.5"
              style={{ scrollbarColor: '#1a3a1a #0a0a0a', scrollbarWidth: 'thin' }}>
              {logLines.map((line, i) => (
                <div key={i} className="font-mono text-xs leading-relaxed" style={{
                  color: line.includes('♥')        ? '#ff6b9d'
                       : line.includes('★')        ? '#ffd93d'
                       : line.includes('✗')        ? '#ef4444'
                       : line.includes('✓')        ? '#00d4aa'
                       : line.includes('[system]') ? '#555'
                       : '#00ff41',
                }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Reset only — no summarise button */}
          <div className="flex justify-end">
            <button onClick={resetReadings}
              className="px-4 py-2 font-mono text-xs font-bold border-2 hover:border-red-600 hover:text-red-400 transition-colors"
              style={{ borderColor: '#333', color: '#555', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
              RESET
            </button>
          </div>
        </div>
      )}

      {/* ── MANUAL MODE ── */}
      {mode === "manual" && (
        <div className="p-6 border-4 border-border space-y-5"
          style={{ background: 'rgba(0,0,0,0.4)', boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}>
          <div className="font-mono text-xs text-muted-foreground tracking-widest">ENTER YOUR BPM</div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setManualBpm(b => Math.max(40, b - 1))}
              className="w-14 h-14 font-mono text-2xl font-bold border-4 border-border hover:bg-muted transition-colors flex items-center justify-center"
              style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.4)', color: '#ff6b9d' }}>
              −
            </button>

            {/* Fixed 3-digit display — no input box, no truncation */}
            <div style={{
              fontFamily:    'var(--font-pixel, monospace)',
              fontSize:      '5rem',
              lineHeight:    1,
              color:         '#ff6b9d',
              textShadow:    '3px 3px 0 rgba(0,0,0,0.7)',
              width:         '3ch',
              textAlign:     'right',
              letterSpacing: '0.05em',
              userSelect:    'none',
            }}>
              {manualBpm}
            </div>

            <button
              onClick={() => setManualBpm(b => Math.min(200, b + 1))}
              className="w-14 h-14 font-mono text-2xl font-bold border-4 border-border hover:bg-muted transition-colors flex items-center justify-center"
              style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.4)', color: '#ff6b9d' }}>
              +
            </button>
          </div>

          <input
            type="range" min={40} max={200} value={manualBpm}
            onChange={e => setManualBpm(parseInt(e.target.value))}
            className="w-full h-3 appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ff6b9d 0%, #ff6b9d ${((manualBpm - 40) / 160) * 100}%, #2a2040 ${((manualBpm - 40) / 160) * 100}%, #2a2040 100%)`,
              border: '2px solid #333',
            }}
          />
          <div className="flex justify-between font-mono text-xs text-muted-foreground px-1">
            <span>40</span><span>120</span><span>200</span>
          </div>
        </div>
      )}

      {/* ── Find Songs ── */}
      <button
        onClick={() => confirmedBpm && onBpmConfirmed(confirmedBpm)}
        disabled={!confirmedBpm}
        className="w-full py-4 font-mono text-sm font-bold border-4 border-foreground disabled:opacity-30 transition-all"
        style={{
          background: confirmedBpm ? '#ffd93d' : '#222',
          color:      confirmedBpm ? '#000'    : '#555',
          boxShadow:  confirmedBpm ? '6px 6px 0 rgba(0,0,0,0.5)' : 'none',
        }}>
        {mode === "arduino" && !confirmedBpm
          ? `COLLECTING READINGS…  ${bpmReadings.length} / ${SUMMARISE_AFTER}`
          : `▶ FIND SONGS FOR ${confirmedBpm ?? '??'} BPM`}
      </button>
    </div>
  )
}