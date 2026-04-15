"use client";

import { cn } from "@/lib/utils";

interface PixelHeartProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

export function PixelHeart({ 
  size = 64, 
  color = "currentColor", 
  animate = false,
  className 
}: PixelHeartProps) {
  const pixelSize = size / 13;
  
  // Pixel heart pattern (13x12 grid)
  const heartPattern = [
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
  ];

  return (
    <svg 
      width={size} 
      height={size * (12/13)} 
      viewBox={`0 0 ${13 * pixelSize} ${12 * pixelSize}`}
      className={cn(animate && "animate-pulse-heart", className)}
    >
      {heartPattern.map((row, y) =>
        row.map((cell, x) =>
          cell === 1 ? (
            <rect
              key={`${x}-${y}`}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}
