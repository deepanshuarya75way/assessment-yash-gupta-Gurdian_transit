"use client";

import React from "react";
import { Activity, Zap, Sparkles, AlertOctagon, ShieldAlert, Cpu } from "lucide-react";
import { Badge } from "../ui/Badge";

export const RashDrivingDetection: React.FC = () => {
  const telemetryMetrics = [
    {
      title: "Harsh Braking Incidents (Deceleration > 0.45G)",
      status: "0 Detected",
      detail: "AI accelerometer sensor telemetry active",
      icon: AlertOctagon,
      state: "NORMAL",
    },
    {
      title: "Rapid Acceleration Spikes (> 3.5 m/s²)",
      status: "0 Detected",
      detail: "Engine throttle & telematics compliant",
      icon: Zap,
      state: "NORMAL",
    },
    {
      title: "Sudden Sharp Cornering / Swerving (> 0.35G Lateral)",
      status: "0 Detected",
      detail: "3-axis gyroscopic stabilization check",
      icon: Activity,
      state: "NORMAL",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">
              AI Rash Driving &amp; Harsh Maneuver Detection
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              COMING SOON • PHASE 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Harsh braking, aggressive acceleration spikes, and sharp cornering AI identification (Under development for next phase)
          </p>
        </div>

        <Badge variant="purple">
          Vision AI Fusion Model v2.4
        </Badge>
      </div>

      {/* Feature Teaser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {telemetryMetrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="clean-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="success">All Systems Safe</Badge>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{m.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{m.detail}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700">{m.status}</span>
                <span className="text-[10px] font-mono text-purple-600">3-Axis IMU Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Vision Coming Soon Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">In-Cabin Driver Behavior Vision AI (Phase 8 Integration)</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Drowsiness detection, mobile phone usage alerts while driving, and seatbelt compliance cameras are actively being trained for hardware deployment.
          </p>
        </div>

        <button className="px-5 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold shadow hover:bg-slate-100 transition-all whitespace-nowrap">
          View AI Vision Specs
        </button>
      </div>
    </div>
  );
};
