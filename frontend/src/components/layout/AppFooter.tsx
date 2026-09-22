"use client";

import React from "react";
import { Shield, Sparkles, Database, Activity, HeartHandshake } from "lucide-react";

export const AppFooter: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 pb-24">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-slate-700" />
        <span className="font-bold text-slate-800">Guardian Transit AI Enterprise v2.4</span>
        <span>• Autonomous School Safety System</span>
      </div>

      <div className="flex items-center gap-6 text-[11px]">
        <span className="flex items-center gap-1">
          <Database className="w-3.5 h-3.5 text-cyan-600" />
          pgvector Cosine &lt; 0.40
        </span>
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          IoT IMU Gyro Active
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          ArcFace 512-d Model
        </span>
      </div>
    </footer>
  );
};
