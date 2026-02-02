"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
}

export const MouseTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  // Brand colors: Purple, Pink, Yellow/Gold (complementary), Blue (complementary)
  const colors = ["#7F26D9", "#F46AA3", "#FFD700", "#40E0D0"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const createParticle = (x: number, y: number) => {
      const size = Math.random() * 8 + 4; // Sizes between 4 and 12
      const color = colors[Math.floor(Math.random() * colors.length)];
      const speedX = Math.random() * 2 - 1;
      const speedY = Math.random() * 2 - 1;

      particles.current.push({
        x,
        y,
        size,
        color,
        speedX,
        speedY,
        life: 1.0, // 100% opacity
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Create a few particles per move for a richer trail
      for (let i = 0; i < 2; i++) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        // Update
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.02; // Fade out speed
        p.size *= 0.95; // Shrink speed

        // Draw
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead particles
        if (p.life <= 0 || p.size <= 0.5) {
          particles.current.splice(i, 1);
          i--;
        }
      }

      // Reset alpha
      ctx.globalAlpha = 1.0;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100%", height: "100%" }}
    />
  );
};
