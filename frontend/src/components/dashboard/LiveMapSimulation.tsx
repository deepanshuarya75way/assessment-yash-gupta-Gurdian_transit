"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bus as BusIcon, Navigation, BatteryCharging, Gauge, Compass, MapPin } from "lucide-react";
import { Bus } from "../../data/mockData";
import { Badge } from "../ui/Badge";

interface LiveMapSimulationProps {
  buses: Bus[];
  selectedBusId?: string;
  onSelectBus?: (busId: string) => void;
}

export const LiveMapSimulation: React.FC<LiveMapSimulationProps> = ({
  buses,
  selectedBusId,
  onSelectBus,
}) => {
  const [activeBus, setActiveBus] = useState<Bus>(buses[0]);

  const handleBusClick = (b: Bus) => {
    setActiveBus(b);
    if (onSelectBus) onSelectBus(b.id);
  };

  // Mock visual positions on stylized 3D canvas
  const busCoordinates = [
    { id: buses[0]?.id, top: "35%", left: "42%", label: "Bus #14" },
    { id: buses[1]?.id, top: "60%", left: "68%", label: "Bus #07" },
    { id: buses[2]?.id, top: "25%", left: "75%", label: "Bus #03" },
    { id: buses[3]?.id, top: "70%", left: "28%", label: "Bus #21" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col h-[520px]">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            Live Fleet GPS Radar &amp; Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Real-time geospatial tracking with AI route geofencing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" pulse>
            4 Fleet Units Online
          </Badge>
        </div>
      </div>

      {/* Stylized Vector Radar Map Container */}
      <div className="flex-1 rounded-xl bg-slate-950/80 border border-white/10 relative overflow-hidden flex items-center justify-center bg-grid-pattern">
        {/* Radar Circular Grid Rings */}
        <div className="absolute w-[500px] h-[500px] border border-cyan-500/10 rounded-full animate-pulse" />
        <div className="absolute w-[350px] h-[350px] border border-cyan-500/15 rounded-full" />
        <div className="absolute w-[200px] h-[200px] border border-cyan-500/20 rounded-full" />
        <div className="absolute w-full h-[1px] bg-cyan-500/10" />
        <div className="absolute h-full w-[1px] bg-cyan-500/10" />

        {/* School Hub Center Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.8)]">
            <MapPin className="w-5 h-5 text-slate-950" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 shadow">
            APEX ACADEMY (HUB)
          </span>
        </div>

        {/* Route Paths (SVG lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/30 stroke-dasharray-4">
          <path d="M 150 400 Q 250 300 450 260" fill="none" strokeWidth="2" strokeDasharray="6,6" />
          <path d="M 750 320 Q 550 270 450 260" fill="none" strokeWidth="2" strokeDasharray="6,6" />
          <path d="M 400 120 Q 420 180 450 260" fill="none" strokeWidth="2" strokeDasharray="6,6" />
        </svg>

        {/* Bus Markers */}
        {busCoordinates.map((pos) => {
          const bus = buses.find((b) => b.id === pos.id);
          if (!bus) return null;
          const isSelected = activeBus.id === bus.id;

          return (
            <motion.button
              key={bus.id}
              onClick={() => handleBusClick(bus)}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  isSelected
                    ? "bg-gradient-to-tr from-cyan-400 to-blue-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.8)] ring-2 ring-white"
                    : "bg-slate-900 border border-cyan-400/40 text-cyan-300 hover:border-cyan-300 shadow-lg"
                }`}
              >
                <BusIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
              </div>

              <div
                className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border shadow transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 border-cyan-300"
                    : "bg-slate-900/90 text-slate-200 border-white/10"
                }`}
              >
                {bus.busNumber} • {bus.currentSpeed} km/h
              </div>
            </motion.button>
          );
        })}

        {/* Active Bus Telemetry Drawer (Floating Overlay) */}
        {activeBus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 z-30 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{activeBus.busNumber}</h4>
                  <Badge variant={activeBus.status === "ON_ROUTE" ? "success" : "warning"}>
                    {activeBus.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {activeBus.route} • Driver: <span className="text-slate-200">{activeBus.driverName}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-slate-400 text-[10px]">Speed</p>
                  <p className="font-bold text-white">{activeBus.currentSpeed} km/h</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-slate-400 text-[10px]">Battery / Fuel</p>
                  <p className="font-bold text-emerald-400">{activeBus.batteryFuel}%</p>
                </div>
              </div>

              <div className="border-l border-white/10 pl-4">
                <p className="text-slate-400 text-[10px]">Next Stop &amp; ETA</p>
                <p className="font-bold text-cyan-300">
                  {activeBus.nextStop} ({activeBus.eta})
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
