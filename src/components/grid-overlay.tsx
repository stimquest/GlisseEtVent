"use client";

import { useRef, useEffect } from "react";

interface GridOverlayProps {
  rows?: number;
  cols?: number;
  dotSize?: number;
  gap?: number;
  opacity?: number;
}

export function GridOverlay({
  rows = 125,
  cols = 125,
  dotSize = 2,
  gap = 10,
  opacity = 0.4
}: GridOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const updateSize = () => {
      if (svg && svg.parentElement) {
        const { width, height } = svg.parentElement.getBoundingClientRect();
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
        svg.style.width = `${width}px`;
        svg.style.height = `${height}px`;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const generateDots = () => {
    const dots = [];
    let animationDelay = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (dotSize + gap) + dotSize / 2;
        const y = row * (dotSize + gap) + dotSize / 2;

        const key = `${row}-${col}`;
        animationDelay += 0.02; // Délai progressif

        dots.push(
          <circle
            key={key}
            cx={x}
            cy={y}
            r={dotSize / 2}
            fill={`rgba(255, 255, 255, ${opacity})`}
            className="animate-pulse"
            style={{
              animationDelay: `${animationDelay}s`,
              animationDuration: '3s'
            }}
          />
        );
      }
    }
    return dots;
  };

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    >
      <defs>
        <filter id="grid-glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#grid-glow)">
        {generateDots()}
      </g>
    </svg>
  );
}