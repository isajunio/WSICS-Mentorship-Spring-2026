"use client"

import { PixelBackground } from "./pixel-background"

interface DataViewProps {
  onBack: () => void
}
export function DataView({ onBack }: { onBack: () => void }) {
    return (
        <div className="min-h-screen w-full" style={{ background: '#0f0c29' }}>
                <PixelBackground />
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
            {/* Back button */}
            <div className="text-center py-6">
                <button
                    onClick={onBack}
                    style={{
                        fontFamily: "'Press Start 2P', monospace",
                        color: '#5dcaa5',
                        fontSize: '8px',
                        background: 'none',
                        border: '2px solid #5dcaa5',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        marginBottom: '12px'
                    }}>
                    ← BACK
                </button>
                <h1 style={{
                    fontFamily: "'Press Start 2P', monospace",
                    color: '#ff6b9d',
                    fontSize: '18px',
                    letterSpacing: '2px'
                }}>
                    OUR DATA
                </h1>
            </div>

            {/* Centered container — content goes INSIDE here */}
            <div style={{ width: '80%', margin: '0 auto' }}>

                {/* Shiny App */}
                <div className="mb-6">
                    <p style={{
                        fontFamily: "'Press Start 2P', monospace",
                        color: '#5dcaa5',
                        fontSize: '8px',
                        marginBottom: '10px'
                    }}>
                        INTERACTIVE GRAPH
                    </p>
                    <iframe
                        src="https://lunathemoon.shinyapps.io/BPM4SongnGenre/"
                        width="100%"
                        height="700px"
                        style={{ border: '2px solid #ff6b9d', background: '#1a1040' }}
                        title="Shiny Interactive Graph"
                    />
                </div>

               {/* RPubs Report */}
<div className="mb-12">
    <p style={{
        fontFamily: "'Press Start 2P', monospace",
        color: '#5dcaa5',
        fontSize: '8px',
        marginBottom: '10px'
    }}>
        DATA REPORT
    </p>
    <div style={{
        border: '2px solid #5dcaa5',
        background: '#1a1040',
        padding: '40px',
        textAlign: 'center'
    }}>
        <p style={{
            fontFamily: "'Press Start 2P', monospace",
            color: '#9f8fbf',
            fontSize: '8px',
            marginBottom: '20px',
            lineHeight: '2'
        }}>
            Our full data report is hosted on RPubs.
        </p>
        <button
            onClick={() => window.open('https://rpubs.com/starcollector/1422747', '_blank')}
            style={{
                fontFamily: "'Press Start 2P', monospace",
                background: '#5dcaa5',
                color: '#0f0c29',
                border: 'none',
                padding: '12px 24px',
                fontSize: '9px',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.4)'
            }}>
            OPEN DATA REPORT ↗
        </button>
    </div>
</div>

            </div>
            </main>
        </div>
    )
}