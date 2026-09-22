"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, AlertOctagon, Scan, ShieldCheck, UserCheck } from "lucide-react";
import { AiRecognitionEvent } from "../../data/mockData";
import { Badge } from "../ui/Badge";

interface AiLiveRecognitionStreamProps {
  events: AiRecognitionEvent[];
}

export const AiLiveRecognitionStream: React.FC<AiLiveRecognitionStreamProps> = ({ events }) => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Cycle through events to simulate live streaming
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [events.length]);

  const currentEvent = events[activeEventIndex] || events[0];
  const isMatch = currentEvent.matchStatus === "VERIFIED_MATCH";

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-cyan-400 animate-pulse" />
            AI Biometric Camera Stream
          </h2>
          <p className="text-xs text-slate-400">
            Real-time ArcFace 512-d embeddings matching (Bus #14 Gate 1)
          </p>
        </div>

        <Badge variant={isMatch ? "success" : "error"} pulse>
          {isMatch ? "Face Matched (0.18 Dist)" : "Unknown Biometric"}
        </Badge>
      </div>

      {/* Simulated Live Video Canvas */}
      <div className="flex-1 rounded-xl bg-slate-950 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Animated Laser Scanning Bar */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline z-20 pointer-events-none" />

        {/* Video Overlay Watermark & Rec Indicator */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/10 text-[11px] text-white">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono font-bold">REC // BUS-14-CAM-01</span>
        </div>

        <div className="absolute top-3 right-3 z-20 text-[11px] font-mono text-cyan-400 bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/10">
          FPS: 30.0 | RES: 1080p
        </div>

        {/* Live Subject Photo & Bounding Box */}
        <div className="relative flex flex-col items-center justify-center">
          <motion.div
            key={currentEvent.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative w-40 h-40 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all ${
              isMatch
                ? "border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] ring-4 ring-emerald-500/20"
                : "border-rose-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] ring-4 ring-rose-500/20"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentEvent.photoUrl}
              alt={currentEvent.studentName}
              className="w-full h-full object-cover"
            />

            {/* Bounding Box Corner Reticles */}
            <div
              className={`absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 ${
                isMatch ? "border-emerald-300" : "border-rose-400"
              }`}
            />
            <div
              className={`absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 ${
                isMatch ? "border-emerald-300" : "border-rose-400"
              }`}
            />
            <div
              className={`absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 ${
                isMatch ? "border-emerald-300" : "border-rose-400"
              }`}
            />
            <div
              className={`absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 ${
                isMatch ? "border-emerald-300" : "border-rose-400"
              }`}
            />

            {/* Live Status Overlay Tag */}
            <div
              className={`absolute bottom-0 inset-x-0 py-1 text-center text-[10px] font-bold text-white uppercase backdrop-blur-md ${
                isMatch ? "bg-emerald-600/80" : "bg-rose-600/80"
              }`}
            >
              {isMatch ? "VERIFIED BOARDING" : "UNAUTHORIZED"}
            </div>
          </motion.div>

          {/* Student Info Card Under Camera */}
          <motion.div
            key={`info-${currentEvent.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center"
          >
            <h3 className="font-bold text-white text-base flex items-center justify-center gap-1.5">
              {isMatch ? (
                <UserCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              )}
              {currentEvent.studentName}
            </h3>
            <p className="text-xs text-slate-400">
              ID: <span className="font-mono text-cyan-300">{currentEvent.studentId}</span> • Confidence:{" "}
              <span className={`font-bold ${isMatch ? "text-emerald-400" : "text-rose-400"}`}>
                {currentEvent.confidence}%
              </span>
            </p>
          </motion.div>
        </div>

        {/* Live Recognition Feed Reel */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 overflow-x-auto py-1 z-20">
          {events.map((ev, i) => (
            <button
              key={ev.id}
              onClick={() => setActiveEventIndex(i)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all ${
                activeEventIndex === i
                  ? "bg-cyan-500/20 border-cyan-400 text-white font-bold"
                  : "bg-slate-900/60 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ev.photoUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
              <span>{ev.studentName}</span>
              <span className="text-[10px] text-slate-500">({ev.timestamp})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
