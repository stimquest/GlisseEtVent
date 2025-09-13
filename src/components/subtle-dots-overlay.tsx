"use client";

import React from "react";

interface SubtleDotsOverlayProps {
  /** Densité des points (plus petit = plus dense) - défaut: 1.4 */
  density?: number;
  /** Taille des points (rayon) - défaut: 0.5 */
  dotSize?: number;
  /** Opacité des points (0-1) - défaut: 0.3 */
  opacity?: number;
  /** Couleur des points - défaut: noir */
  color?: string;
}

export function SubtleDotsOverlay({
  density = 5,
  dotSize = 1,
  opacity = 0.7,
  color = "0, 0, 0"
}: SubtleDotsOverlayProps) {
  const patternId = `dot-grid-${density}-${dotSize}-${opacity}-${color.replace(/\s/g, '')}`;

  return (
    <div className="absolute inset-0 z-5 pointer-events-none select-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Pattern répétitif contrôlable */}
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={density}
            height={density}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={density / 2}
              cy={density / 2}
              r={dotSize}
              fill={`rgba(${color}, ${opacity})`}
            />
          </pattern>
        </defs>

        {/* Rectangle qui couvre toute la surface */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
        />
      </svg>
    </div>
  );
}
