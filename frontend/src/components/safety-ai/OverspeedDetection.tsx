"use client";

import React from "react";
import { Gauge, AlertTriangle, ShieldCheck, Zap, Activity } from "lucide-react";
import { Bus } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";

interface OverspeedDetectionProps {
  buses: Bus[];
}

export const OverspeedDetection: React.FC<OverspeedDetectionProps> = ({ buses }) => {
  const SPEED_LIMIT_ZONE = 45; // km/h

  const speedViolations = buses.filter((b) => b.currentSpeed > SPEED_LIMIT_ZONE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">
              Fleet Speed &amp; Overspeed Detection System
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              COMING SOON • PREVIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            GPS velocity telemetry and AI overspeed prediction zone models (Real-time speed monitoring preview)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {speedViolations.length > 0 ? (
            <Badge variant="error" pulse>
              {speedViolations.length} Active Speed Violation
            </Badge>
          ) : (
            <Badge variant="success">
              All Units Under Speed Limit
            </Badge>
          )}
        </div>
      </div>

      {/* Speedometer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {buses.map((bus) => {
          const isOver = bus.currentSpeed > SPEED_LIMIT_ZONE;
          const pct = Math.min(100, Math.round((bus.currentSpeed / 60) * 100));

          return (
            <div
              key={bus.id}
              className={`clean-card rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isOver ? "border-rose-300 bg-rose-50/20" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">{bus.busNumber}</span>
                  <Badge variant={isOver ? "error" : "success"} pulse={isOver}>
                    {isOver ? "OVERSPEEDING" : "NORMAL"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{bus.routeName}</p>

                {/* Speed Value & Dial */}
                <div className="my-4 text-center">
                  <span
                    className={`text-4xl font-extrabold font-mono ${
                      isOver ? "text-rose-600" : "text-slate-900"
                    }`}
                  >
                    {bus.currentSpeed}
                  </span>
                  <span className="text-xs text-slate-400 font-bold ml-1">km/h</span>

                  {/* Progress Gauge */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isOver ? "bg-rose-500" : "bg-slate-900"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span>Driver: <strong>{bus.driverName}</strong></span>
                <span className="text-slate-400 text-[11px]">Limit: 45 km/h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
