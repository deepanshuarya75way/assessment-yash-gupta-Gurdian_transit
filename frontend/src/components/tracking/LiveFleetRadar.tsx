"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
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

const LeafletLiveMap = dynamic(() => import("./LeafletLiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-2xl bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Loading Mapbox HD Live Radar Mesh...</span>
      </div>
    </div>
  ),
});

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
              Live Bus GPS Tracker &amp; Map Radar
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE TRACKING ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time live map tracking for all school buses converging to <strong>ABES Campus</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2">
            <BusIcon className="w-4 h-4 text-cyan-400" />
            <span>{buses.length} Buses in Fleet</span>
          </div>
        </div>
      </div>

      {/* 2. FLEET BUS SELECTOR */}
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

      {/* 3. HERO ACTIVE BUS STATUS CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-cyan-400 text-slate-950 uppercase">
                  {activeRouteData?.routeCode || "RT-01"}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {activeBus.routeName}
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mt-1">
                {activeBus.busNumber} • {activeBus.licensePlate}
              </h3>
              <p className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Current Location: <strong className="text-white">{activeBus.currentLocation || activeBus.nextStop}</strong></span>
              </p>
            </div>

            {/* Key Information Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-300" />
                <span>Next Stop: <strong className="text-white">{activeBus.nextStop}</strong> ({activeBus.eta})</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs flex items-center gap-2">
                <BusIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Occupancy: <strong className="text-white">{activeBus.insideBusCount || activeStudents.length || 0} / {activeBus.capacity || 40} Kids</strong></span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Trip Active</span>
              </div>
            </div>
          </div>

          {/* Direct Navigation Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 flex-shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4 text-slate-950" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
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

      {/* 4. INTERACTIVE LIVE GPS MAP */}
      <div className="clean-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Interactive Fleet GPS Map
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live moving bus markers and route stops
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Tracking:</span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-extrabold text-xs">
              {activeBus.busNumber} • {activeBus.licensePlate}
            </span>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="h-[440px] w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner bg-slate-950">
          <LeafletLiveMap
            buses={buses}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => setSelectedBusId(id)}
          />
        </div>
      </div>

      {/* 5. ROUTE CORRIDOR STOPS PROGRESSION */}
      <div className="clean-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Navigation className="w-4 h-4 text-slate-800" />
              <span>Route Stops Sequence ({activeBus.busNumber})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Scheduled pickup stops and expected timings for {activeBus.routeName}
            </p>
          </div>
        </div>

        {/* Stops Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(activeRouteData?.stops || []).map((stop, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                stop.passed
                  ? "bg-slate-900 text-white border-slate-800"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  stop.passed ? "bg-cyan-400 text-slate-950" : "bg-slate-200 text-slate-700"
                }`}>
                  Stop {idx + 1}
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {stop.time}
                </span>
              </div>
              <h4 className="font-bold text-xs leading-snug">
                {stop.name}
              </h4>
              <p className={`text-[10px] mt-1 font-semibold ${stop.passed ? "text-cyan-300" : "text-slate-400"}`}>
                {stop.passed ? "✓ Passed / Current" : "Upcoming Scheduled"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
