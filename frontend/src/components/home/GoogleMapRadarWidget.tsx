"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Layers,
  Plus,
  Minus,
  Bus as BusIcon,
  Phone,
  Gauge,
  BatteryCharging,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Bus } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";

interface GoogleMapRadarWidgetProps {
  buses: Bus[];
  selectedBusId?: string;
  onSelectBus?: (busId: string) => void;
}

export const GoogleMapRadarWidget: React.FC<GoogleMapRadarWidgetProps> = ({
  buses,
  selectedBusId,
  onSelectBus,
}) => {
  const [activeBus, setActiveBus] = useState<Bus>(
    buses.find((b) => b.id === selectedBusId) || buses[0]
  );
  const [mapMode, setMapMode] = useState<"live-tiles" | "radar-vector">("live-tiles");

  const handleBusSelect = (bus: Bus) => {
    setActiveBus(bus);
    if (onSelectBus) onSelectBus(bus.id);
  };

  return (
    <div className="clean-card rounded-2xl p-5 flex flex-col h-[560px] relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              Live Google Map &amp; GPS Telematics
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              Real GPS Tiles
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Selected: <strong className="text-slate-900">{activeBus.busNumber}</strong> ({activeBus.routeName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-slate-200 bg-slate-100 text-[11px] font-bold">
            <button
              onClick={() => setMapMode("live-tiles")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapMode === "live-tiles" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Real Map
            </button>
            <button
              onClick={() => setMapMode("radar-vector")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapMode === "radar-vector" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Radar View
            </button>
          </div>

          <Badge variant="success" pulse>
            Live GPS Online
          </Badge>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-xl relative overflow-hidden border border-slate-200 bg-slate-100 flex flex-col">
        {mapMode === "live-tiles" ? (
          // Real OpenStreetMap / Google Map interactive iframe
          <div className="w-full h-full relative">
            <iframe
              title="Google Map Live Fleet"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeBus.longitude - 0.05}%2C${activeBus.latitude - 0.03}%2C${activeBus.longitude + 0.05}%2C${activeBus.latitude + 0.03}&layer=mapnik&marker=${activeBus.latitude}%2C${activeBus.longitude}`}
              className="w-full h-full border-0 filter saturate-[1.1]"
            />
            
            {/* Live Vehicle Overlays on Real Map */}
            <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-lg text-xs space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <BusIcon className="w-3.5 h-3.5 text-slate-700" />
                {activeBus.busNumber} Telemetry
              </p>
              <p className="text-slate-500 text-[11px]">Lat: {activeBus.latitude.toFixed(4)} | Lon: {activeBus.longitude.toFixed(4)}</p>
              <div className="flex items-center gap-3 pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-800 font-bold">⚡ {activeBus.currentSpeed} km/h</span>
                <span className="text-emerald-700 font-bold">🔋 {activeBus.batteryFuel}% Fuel</span>
              </div>
            </div>
          </div>
        ) : (
          // Radar Vector Grid
          <div className="w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center bg-grid-pattern">
            <div className="absolute w-[450px] h-[450px] border border-cyan-500/15 rounded-full animate-pulse" />
            <div className="absolute w-[300px] h-[300px] border border-cyan-500/20 rounded-full" />
            <div className="absolute w-[150px] h-[150px] border border-cyan-500/25 rounded-full" />
            
            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 text-[10px] font-bold border border-cyan-400 mt-1 inline-block">
                APEX ACADEMY
              </span>
            </div>

            {/* Bus Pins */}
            {buses.map((b, idx) => {
              const offsets = [
                { top: "35%", left: "42%" },
                { top: "62%", left: "68%" },
                { top: "25%", left: "75%" },
                { top: "70%", left: "28%" },
              ];
              const isSelected = activeBus.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => handleBusSelect(b)}
                  style={{ top: offsets[idx]?.top || "50%", left: offsets[idx]?.left || "50%" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950 ring-2 ring-white scale-110 shadow-lg"
                        : "bg-slate-900 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <BusIcon className="w-3.5 h-3.5" />
                    <span>{b.busNumber}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Bus Selector Pill Strip inside Map */}
        <div className="p-2.5 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center gap-2 overflow-x-auto z-10">
          <span className="text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap pl-1">
            Focus Bus:
          </span>
          {buses.map((b) => (
            <button
              key={b.id}
              onClick={() => handleBusSelect(b)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeBus.id === b.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <BusIcon className="w-3.5 h-3.5" />
              <span>{b.busNumber}</span>
              <span className="text-[10px] opacity-80 font-normal">({b.insideBusCount || b.totalAssignedStudents || 0} in bus)</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
