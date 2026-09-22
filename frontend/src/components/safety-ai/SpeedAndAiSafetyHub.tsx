"use client";

import React, { useState } from "react";
import { OverspeedDetection } from "./OverspeedDetection";
import { RashDrivingDetection } from "./RashDrivingDetection";
import { Bus } from "../../data/enterpriseMockData";
import { Gauge, Activity, Sparkles, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface SpeedAndAiSafetyHubProps {
  buses: Bus[];
}

export const SpeedAndAiSafetyHub: React.FC<SpeedAndAiSafetyHubProps> = ({ buses }) => {
  const [subTab, setSubTab] = useState<"speed" | "rash">("speed");

  return (
    <div className="space-y-6">
      {/* Prominent Coming Soon / Future Phase Roadmap Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-400/20 text-purple-200 border border-purple-400/30 flex items-center gap-1.5 backdrop-blur-md">
                <Clock className="w-3 h-3 text-purple-300" />
                COMING SOON • PHASE 2 ROADMAP
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                Under Active Research
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight pt-1">
              AI Speed Prediction &amp; Rash Driving Detection
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              This module is dedicated to upcoming Phase 2 safety intelligence capabilities — including <strong>Real-time Speed Prediction Models</strong> and <strong>AI Rash Driving &amp; Harsh G-Force Swerve Detection</strong> via onboard IoT telemetry. Below is the active prototype preview interface.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-mono font-bold text-purple-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>IoT Telematics v2.0</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 w-fit">
        <button
          onClick={() => setSubTab("speed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "speed"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Gauge className="w-4 h-4 text-sky-600" />
          <span>Speed &amp; Velocity Radar</span>
          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
            Preview
          </span>
        </button>

        <button
          onClick={() => setSubTab("rash")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "rash"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-4 h-4 text-purple-600" />
          <span>Rash Driving &amp; G-Force AI</span>
          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
            Coming Soon
          </span>
        </button>
      </div>

      {subTab === "speed" ? (
        <OverspeedDetection buses={buses} />
      ) : (
        <RashDrivingDetection />
      )}
    </div>
  );
};
