"use client";

import React from "react";

export function SubtleDotsOverlay() {
  // Créer un pattern simple avec des points réguliers - très léger
  const patternDots = Array.from({ length: 15 }, (_, i) =>
    Array.from({ length: 25 }, (_, j) => (
      <circle
        key={`${i}-${j}`}
        cx={j * 25 + 10}  // Espacement de 25px
        cy={i * 25 + 10}
        r="1.5"
        fill="rgba(255, 255, 255, 0.1)"
        className="opacity-20"
      />
    ))
  ).flat();

  return (
    <div className="absolute inset-0 z-5 pointer-events-none select-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 640 380" // Format film large
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </radialGradient>
        </defs>

        {/* Pattern répétitif simple */}
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.02)" />
        {patternDots}
      </svg>
    </div>
  );
}