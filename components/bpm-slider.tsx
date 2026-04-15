"use client"

interface BpmSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function BpmSlider({ value, onChange, min = 40, max = 200 }: BpmSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full max-w-md space-y-4">
      {/* BPM Input Display - Pixel Style */}
      <div 
        className="flex items-center justify-center gap-4 px-8 py-4 bg-card border-4 border-border"
        style={{
          boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.2)',
        }}
      >
        <span className="text-5xl font-mono font-bold text-foreground drop-shadow-lg">
          {value}
        </span>
        <span className="text-muted-foreground font-sans text-2xl">bpm</span>
      </div>
      
      {/* Slider - Pixel Style */}
      <div className="px-2">
        <div className="relative">
          {/* Track background */}
          <div 
            className="h-3 bg-muted border-2 border-border"
            style={{ boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)' }}
          />
          
          {/* Fill */}
          <div 
            className="absolute top-0 left-0 h-3 bg-primary"
            style={{ 
              width: `${percentage}%`,
              boxShadow: '0 0 12px #ff6b9d',
            }}
          />
          
          {/* Pixel markers */}
          <div className="absolute top-0 left-0 right-0 h-3 flex justify-between px-1 items-center pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-0.5 h-2 bg-background/30" />
            ))}
          </div>

          {/* Invisible input for interaction */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {/* Pixel thumb */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary border-4 border-foreground pointer-events-none"
            style={{ 
              left: `calc(${percentage}% - 12px)`,
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          />
        </div>
        
        {/* Labels - Pixel Style */}
        <div className="flex justify-between mt-3 font-sans text-lg text-muted-foreground">
          <span>{min}</span>
          <span>{Math.round((min + max) / 2)}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}
