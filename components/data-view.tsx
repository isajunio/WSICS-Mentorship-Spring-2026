interface DataViewProps {
  onBack: () => void
}
export function DataView({ onBack }: { onBack: () => void }) {
    return (
        <div className="min-h-screen w-full" style={{ background: '#0f0c29' }}>

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
                    <iframe
                        src="https://rpubs.com/starcollector/1422747"
                        width="100%"
                        height="900px"
                        style={{ border: '2px solid #5dcaa5', background: '#ffffff' }}
                        title="RPubs Data Report"
                    />
                </div>

            </div>
        </div>
    )
}