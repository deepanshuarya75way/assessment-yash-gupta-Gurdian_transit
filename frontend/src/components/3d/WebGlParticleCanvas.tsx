"use client";

import React, { useEffect, useRef } from "react";

export const WebGlParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates for 3D gyro tilt
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 3D Particles on a virtual sphere
    const numParticles = 75;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      radius: number;
      vx: number;
      vy: number;
      vz: number;
      baseColor: string;
    }> = [];

    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 250 + Math.random() * 200;

      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        radius: 1.5 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        vz: (Math.random() - 0.5) * 0.002,
        baseColor: i % 4 === 0 ? "rgba(14, 165, 233, " : i % 3 === 0 ? "rgba(16, 185, 129, " : "rgba(148, 163, 184, ",
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      angleX += 0.0015 + (mouseY - height / 2) * 0.000005;
      angleY += 0.002 + (mouseX - width / 2) * 0.000005;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const fov = 400;
      const centerX = width * 0.8; // positioned subtly on right half
      const centerY = height * 0.35;

      const projected: Array<{ x: number; y: number; scale: number; alpha: number; color: string }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D rotation around X and Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const distance = fov + z2;
        if (distance > 0) {
          const scale = fov / distance;
          const projX = centerX + x1 * scale;
          const projY = centerY + y1 * scale;
          const alpha = Math.max(0.08, Math.min(0.4, (z2 + 300) / 600));

          projected.push({
            x: projX,
            y: projY,
            scale,
            alpha,
            color: p.baseColor,
          });

          // Draw Particle Node
          ctx.beginPath();
          ctx.arc(projX, projY, p.radius * scale, 0, Math.PI * 2);
          ctx.fillStyle = `${p.baseColor}${alpha})`;
          ctx.fill();
        }
      }

      // Draw connecting filaments between close nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const lineAlpha = (1 - dist / 65) * 0.15;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
