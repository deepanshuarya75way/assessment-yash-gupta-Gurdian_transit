"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "emerald" | "amber" | "rose" | "purple";
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = "",
  glowColor = "cyan",
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowStyles = {
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
    amber: "hover:border-amber-500/40 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
    rose: "hover:border-rose-500/40 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.35)]",
    purple: "hover:border-purple-500/40 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group cursor-pointer ${glowStyles[glowColor]} ${className}`}
    >
      <div
        style={{
          transform: "translateZ(30px)",
        }}
        className="w-full h-full relative z-10"
      >
        {children}
      </div>

      {/* Subtle Corner Light Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />
    </motion.div>
  );
};
