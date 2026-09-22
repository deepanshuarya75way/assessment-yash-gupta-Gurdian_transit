"use client";

import React, { useState } from "react";
import { Bus, Student } from "../../data/enterpriseMockData";
import {
  Compass,
  MapPin,
  Bus as BusIcon,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio,
  Clock,
  Gauge,
  Phone,
  ArrowRight,
  Layers,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface LiveFleetRadarProps {
  buses: Bus[];
  students: Student[];
}

interface BusRouteData {
  routeCode: string;
  color: string;
  lineName: string;
  currentStopIndex: number;
  stops: { name: string; time: string; passed: boolean }[];
}

const FLEET_ROUTE_MAPS: Record<string, BusRouteData> = {
  "bus-01": {
    routeCode: "RT-01",
    color: "#06b6d4", // Cyan
    lineName: "Route 1 (Indirapuram & Vaishali)",
    currentStopIndex: 1,
    stops: [
      { name: "Vaishali Metro Station (Gate 2)", time: "07:05 AM", passed: true },
      { name: "Shipra Mall Crossing, Indirapuram (Current)", time: "07:20 AM", passed: true },
      { name: "CISF Camp Road, Ahinsa Khand", time: "07:35 AM", passed: false },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
  "bus-02": {
    routeCode: "RT-02",
    color: "#a855f7", // Purple
    lineName: "Route 2 (Noida Sector 62 & Tech Corridor)",
    currentStopIndex: 1,
    stops: [
      { name: "Noida Electronic City Metro", time: "07:10 AM", passed: true },
      { name: "Fortis Hospital Crossing, Sec 62 (Current)", time: "07:25 AM", passed: true },
      { name: "Mamura Chowk Flyover", time: "07:38 AM", passed: false },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:58 AM", passed: false },
    ],
  },
  "bus-03": {
    routeCode: "RT-03",
    color: "#f59e0b", // Amber
    lineName: "Route 3 (Raj Nagar Extension & Mohan Nagar)",
    currentStopIndex: 1,
    stops: [
      { name: "Mohan Nagar Temple Metro", time: "07:00 AM", passed: true },
      { name: "Raj Nagar Extension Flyover (Current)", time: "07:20 AM", passed: true },
      { name: "Old Bus Stand, Ghaziabad", time: "07:35 AM", passed: false },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
  "bus-04": {
    routeCode: "RT-04",
    color: "#10b981", // Emerald
    lineName: "Route 4 (Crossings Republik & Chipiyana)",
    currentStopIndex: 1,
    stops: [
      { name: "Crossings Roundabout (Mahagun)", time: "07:20 AM", passed: true },
      { name: "GH-7 Crossings Market Plaza (Current)", time: "07:30 AM", passed: true },
      { name: "Chipiyana Buzurg Road Gate", time: "07:42 AM", passed: false },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
  "bus-05": {
    routeCode: "RT-05",
    color: "#ec4899", // Pink
    lineName: "Route 5 (Greater Noida West • Gaur City)",
    currentStopIndex: 1,
    stops: [
      { name: "Gaur City 1 Mall Hub", time: "07:10 AM", passed: true },
      { name: "Char Murti Chowk Crossing (Current)", time: "07:22 AM", passed: true },
      { name: "Gaur City 2 (14th Avenue Gate)", time: "07:35 AM", passed: false },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
  "bus-06": {
    routeCode: "RT-06",
    color: "#3b82f6", // Blue
    lineName: "Route 6 (Vasundhara & Sahibabad)",
    currentStopIndex: 1,
    stops: [
      { name: "Vasundhara Sector 4 Plaza", time: "07:05 AM", passed: true },
      { name: "Sahibabad Industrial Gate", time: "07:20 AM", passed: true },
      { name: "Arthala Metro Red Line (Current)", time: "07:35 AM", passed: true },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
  "bus-07": {
    routeCode: "RT-07",
    color: "#eab308", // Yellow
    lineName: "Route 7 (Shastri Nagar & Kavi Nagar)",
    currentStopIndex: 1,
    stops: [
      { name: "Kavi Nagar C-Block Community", time: "07:15 AM", passed: true },
      { name: "Shastri Nagar Central Market", time: "07:28 AM", passed: true },
      { name: "Hapur Chungi Crossing (Current)", time: "07:40 AM", passed: true },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
  "bus-08": {
    routeCode: "RT-08",
    color: "#ef4444", // Red
    lineName: "Route 8 (Anand Vihar & Kaushambi Express)",
    currentStopIndex: 2,
    stops: [
      { name: "Anand Vihar ISBT Terminal", time: "07:00 AM", passed: true },
      { name: "Kaushambi Metro Station Hub", time: "07:15 AM", passed: true },
      { name: "Gazipur Border Toll Plaza (Current)", time: "07:30 AM", passed: true },
      { name: "ABES Business School (Lal Kuan Hub)", time: "07:55 AM", passed: false },
    ],
  },
};

export const LiveFleetRadar: React.FC<LiveFleetRadarProps> = ({
  buses = [],
  students = [],
}) => {
  const [selectedBusId, setSelectedBusId] = useState<string>(buses[0]?.id || "bus-01");

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0] || {
    id: "bus-01",
    busNumber: "Bus #01",
    driverName: "Rajeshwar Singh",
    driverPhone: "+91 98112 01001",
    routeName: "Route 1 – Indirapuram & Vaishali",
    currentLocation: "Shipra Mall Crossing, Indirapuram",
    latitude: 28.6380,
    longitude: 77.3680,
    currentSpeed: 38,
    nextStop: "CISF Camp Road",
    eta: "4 mins",
  };

  const activeRouteData = FLEET_ROUTE_MAPS[activeBus.id] || FLEET_ROUTE_MAPS["bus-01"];

  const latitude = activeBus.latitude || 28.6366;
  const longitude = activeBus.longitude || 77.4484;

  // Direct Google Maps Link with exact GPS coordinates query
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const activeStudents = students.filter(
    (s) => s.busNumber === activeBus?.busNumber || s.busId === activeBus?.id
  );

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">
              Live Bus GPS Tracker &amp; Route Radar
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GPS TRACKER ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry coordinates for <strong>ABES Business School</strong> (Lal Kuan, NH-09 Ghaziabad) with 1-click Google Maps launcher
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-2 border border-slate-200">
            <Radio className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span>8 Fleets Tracked</span>
          </div>
        </div>
      </div>

      {/* 2. TOP BUS SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {buses.map((bus) => {
          const isSelected = bus.id === activeBus.id;
          return (
            <button
              key={bus.id}
              onClick={() => setSelectedBusId(bus.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs">{bus.busNumber}</span>
                <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-cyan-400" : "bg-emerald-500"}`} />
              </div>
              <p className={`text-[10px] truncate mt-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                {bus.driverName}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. HERO LOCATION HUD & 1-CLICK GOOGLE MAPS LAUNCHER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-cyan-500 text-slate-950 uppercase">
                  {activeRouteData?.routeCode || "RT-01"}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {activeBus.routeName}
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mt-1">
                {activeBus.busNumber} • {activeBus.licensePlate}
              </h3>
              <p className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Current Location: <strong className="text-white">{activeBus.currentLocation}</strong></span>
              </p>
            </div>

            {/* Latitude & Longitude Digital Box */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">LATITUDE (GPS)</span>
                <span className="font-extrabold text-cyan-300 text-sm">{latitude.toFixed(6)}° N</span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">LONGITUDE (GPS)</span>
                <span className="font-extrabold text-cyan-300 text-sm">{longitude.toFixed(6)}° E</span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">SPEED &amp; STATUS</span>
                <span className="font-extrabold text-emerald-400 text-sm">{activeBus.currentSpeed} km/h • ON ROUTE</span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">NEXT STOP &amp; ETA</span>
                <span className="font-bold text-slate-200 text-xs">{activeBus.nextStop} ({activeBus.eta})</span>
              </div>
            </div>
          </div>

          {/* Big Open in Google Maps Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 flex-shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            >
              <MapPin className="w-5 h-5 text-slate-950" />
              <span>Open {activeBus.busNumber} in Google Maps</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>Driver: <strong className="text-slate-200">{activeBus.driverName}</strong></span>
              <span>•</span>
              <a href={`tel:${activeBus.driverPhone}`} className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {activeBus.driverPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SCHEMATIC METRO-STYLE ROUTE MAP (ALL 8 BUS LINES CONVERGING TO ABES CAMPUS) */}
      <div className="clean-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Navigation className="w-4 h-4 text-slate-800" />
              <span>ABES Business School Transit Corridors (Lal Kuan, Ghaziabad)</span>
            </h3>
            <p className="text-xs text-slate-500">
              All 8 active bus transit lines across Delhi-NCR converging into ABES Business School Central Campus
            </p>
          </div>

          {/* Campus Coordinates Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus: 28.6366° N, 77.4484° E</span>
          </div>
        </div>

        {/* Metro Visual Network Lines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(FLEET_ROUTE_MAPS).map(([busId, routeData]) => {
            const busObj = buses.find((b) => b.id === busId);
            if (!busObj) return null;
            const isSelected = busObj.id === activeBus.id;

            return (
              <div
                key={busId}
                onClick={() => setSelectedBusId(busObj.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-slate-900/30"
                    : "bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                {/* Route Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/10">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: routeData.color }}
                    />
                    <span className="font-extrabold text-xs">{busObj.busNumber}</span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold ${isSelected ? "text-cyan-300" : "text-slate-600"}`}>
                    {busObj.currentSpeed} km/h
                  </span>
                </div>

                {/* Stops Timeline */}
                <div className="space-y-2 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300/60">
                  {routeData.stops.map((stop, idx) => (
                    <div key={idx} className="relative flex items-center justify-between text-[11px]">
                      <div
                        className={`absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          stop.passed
                            ? "bg-cyan-400 border-cyan-500"
                            : isSelected
                            ? "bg-slate-800 border-slate-600"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {stop.passed && <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                      </div>

                      <span className={`font-semibold truncate max-w-[140px] ${
                        isSelected
                          ? stop.passed ? "text-cyan-200 font-bold" : "text-slate-300"
                          : stop.passed ? "text-slate-900 font-bold" : "text-slate-600"
                      }`}>
                        {stop.name}
                      </span>
                      <span className={`font-mono text-[9px] ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                        {stop.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
