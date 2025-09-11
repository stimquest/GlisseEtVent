"use client";

import { useEffect, useRef } from "react";

export function ParticlesAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration des particules
    const particles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      speed: number;
    }> = [];

    const numberOfParticles = 50;

    function init() {
      if (!canvas || !canvas.parentElement) return;

      particles.length = 0;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Effet de fading pour laisser une trace
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.dx * particle.speed;
        particle.y += particle.dy * particle.speed;

        // Collision avec les bords
        if (particle.x > canvas.width || particle.x < 0) {
          particle.dx = -particle.dx;
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.dy = -particle.dy;
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init();
    }

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none opacity-60"
    />
  );
}