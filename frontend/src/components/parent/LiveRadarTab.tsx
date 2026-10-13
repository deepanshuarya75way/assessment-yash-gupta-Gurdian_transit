"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Radio,
  MapPin,
  Clock,
  Gauge,
  BatteryCharging,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Bell,
  Layers,
  Sparkles,
  ChevronRight,
  Shield,
  Bus as BusIcon,
} from "lucide-react";
import { Student, Bus } from "../../data/enterpriseMockData";

// Dynamically import LeafletLiveMap with Mapbox HD tiles
const LeafletLiveMap = dynamic(
  () => import("../tracking/LeafletLiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full rounded-2xl bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Connecting to Mapbox Satellite Mesh...</span>
        </div>
      </div>
    ),
  }
);

interface LiveRadarTabProps {
  currentStudent: Student;
  bus: Bus;
  allBuses: Bus[];
}

export const LiveRadarTab: React.FC<LiveRadarTabProps> = ({
  currentStudent,
  bus,
  allBuses = [],
}) => {
  const [alarmSet, setAlarmSet] = useState(true);

  const stops = bus.stops || [
    { id: "st-1", name: "Indirapuram Gate 2", morningTime: "07:15 AM", studentCount: 4 },
    { id: "st-2", name: "Shipra Mall Crossing", morningTime: "07:30 AM", studentCount: 3 },
    { id: "st-3", name: "CISF Camp Road", morningTime: "07:42 AM", studentCount: 4 },
    { id: "st-4", name: "ABES Business School Hub", morningTime: "08:00 AM", studentCount: 3 },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Live Radar Map Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-xl">
        {/* Top Floating Badge */}
        <div className="p-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              {bus.busNumber} • Live Radar
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Online</span>
          </div>
        </div>

        {/* Mapbox Map Canvas */}
        <div className="h-[280px] w-full relative">
          <LeafletLiveMap
            buses={allBuses.length > 0 ? allBuses : [bus]}
            selectedBusId={bus.id}
            onSelectBus={() => {}}
          />
        </div>

        {/* Bottom Location Telemetry Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div className="truncate max-w-[210px]">
              <span className="text-[10px] text-slate-400 block">Current Location</span>
              <strong className="text-xs text-white truncate block">{bus.currentLocation}</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Next Stop ETA</span>
            <span className="text-xs font-extrabold text-cyan-300">{bus.eta || "4 mins"}</span>
          </div>
        </div>
      </div>

      {/* Speed, Fuel & Proximity Alarm HUD */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <Gauge className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <div className="text-sm font-black text-white">{bus.currentSpeed} <span className="text-[9px] text-slate-400">km/h</span></div>
          <span className="text-[9px] text-slate-400 font-medium">GPS Speed</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <BatteryCharging className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-sm font-black text-emerald-300">{bus.batteryFuel}%</div>
          <span className="text-[9px] text-slate-400 font-medium">Fuel / Range</span>
        </div>

        <button
          onClick={() => setAlarmSet(!alarmSet)}
          className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
            alarmSet
              ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
              : "bg-slate-900/80 border-slate-800 text-slate-400"
          }`}
        >
          <Bell className="w-4 h-4 mx-auto mb-1" />
          <div className="text-xs font-bold">{alarmSet ? "Alarm ON" : "Alarm OFF"}</div>
          <span className="text-[9px] text-slate-400 font-medium">Stop Ping</span>
        </button>
      </div>

      {/* Stop Progression Timeline Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Transit Route Stops
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {stops.length} Designated Stops
          </span>
        </div>

        <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {stops.map((stop, idx) => {
            const isDestination = idx === stops.length - 1;
            const isNext = idx === 1; // Simulated current stop index

            return (
              <div key={stop.id || idx} className="relative flex items-center justify-between text-xs">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    idx === 0
                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                      : isNext
                      ? "bg-cyan-400 border-white text-slate-950 animate-pulse ring-4 ring-cyan-500/30"
                      : isDestination
                      ? "bg-indigo-600 border-indigo-400 text-white"
                      : "bg-slate-950 border-slate-700 text-slate-400"
                  }`}
                >
                  {idx === 0 ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <span className="text-[9px] font-extrabold">{idx + 1}</span>
                  )}
                </div>

                {/* Stop Info */}
                <div className="pr-2">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{stop.name}</span>
                    {isNext && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-cyan-400 text-slate-950 uppercase">
                        Next
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Scheduled: {stop.morningTime}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                  {stop.studentCount} students
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
