"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Bus } from "../../data/enterpriseMockData";
import { Play, Pause, FastForward, RotateCcw, Layers, MapPin, Bus as BusIcon, Radio } from "lucide-react";

interface LeafletLiveMapProps {
  buses: Bus[];
  selectedBusId: string;
  onSelectBus: (busId: string) => void;
  onTelemetryUpdate?: (busId: string, lat: number, lng: number, speed: number) => void;
}

// Route Trajectory Waypoints (Delhi-NCR Coordinates)
const ROUTE_TRAJECTORIES: Record<string, [number, number][]> = {
  "bus-01": [
    // Route A – Indirapuram to Apex Central Campus
    [28.6420, 77.3780],
    [28.6350, 77.3690],
    [28.6289, 77.3649], // Sector 62 Crossing
    [28.6200, 77.3450],
    [28.6050, 77.3100],
    [28.5900, 77.2600],
    [28.5800, 77.2300], // School Campus
  ],
  "bus-02": [
    // South Express – Saket to Apex Central Campus
    [28.5244, 77.2066], // Saket City Centre
    [28.5350, 77.2100],
    [28.5480, 77.2180], // Hauz Khas
    [28.5620, 77.2250], // Defence Colony
    [28.5800, 77.2300], // School Campus
  ],
  "bus-03": [
    // East Highway – Mayur Vihar to Apex Central Campus
    [28.6100, 77.3000], // Mayur Vihar Phase 1
    [28.6200, 77.2850],
    [28.6280, 77.2950], // Preet Vihar Hub
    [28.6050, 77.2650],
    [28.5800, 77.2300], // School Campus
  ],
  "bus-04": [
    // West Metro – Dwarka / Janakpuri to Apex Central Campus
    [28.5900, 77.0600], // Dwarka Sector 10
    [28.6150, 77.0900],
    [28.6400, 77.1200], // Janakpuri West Flyover
    [28.6200, 77.1600],
    [28.5950, 77.2000],
    [28.5800, 77.2300], // School Campus
  ],
};

const SCHOOL_COORDS: [number, number] = [28.5800, 77.2300];

export const LeafletLiveMap: React.FC<LeafletLiveMapProps> = ({
  buses,
  selectedBusId,
  onSelectBus,
  onTelemetryUpdate,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const polylineGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<"dark" | "satellite" | "streets">("dark");
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [stepIndices, setStepIndices] = useState<Record<string, number>>({
    "bus-01": 1,
    "bus-02": 0,
    "bus-03": 1,
    "bus-04": 2,
  });

  // Tile URL Map
  const tileUrls = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.6000, 77.2400],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial Tile Layer
    const tileLayer = L.tileLayer(tileUrls.dark, {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Polylines layer group
    const polyGroup = L.layerGroup().addTo(map);
    polylineGroupRef.current = polyGroup;

    // Draw School Landmark Marker
    const schoolIcon = L.divIcon({
      className: "custom-school-pin",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: #06b6d4; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(6,182,212,0.9); border: 2px solid #ffffff;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style="margin-top: 4px; padding: 2px 8px; border-radius: 6px; background: #0f172a; border: 1px solid #06b6d4; color: #38bdf8; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">
            🏫 APEX ACADEMY HUB
          </div>
        </div>
      `,
      iconSize: [44, 44],
    });
    L.marker(SCHOOL_COORDS, { icon: schoolIcon }).addTo(map);

    // Draw Geofence Radius Circle (4 km around school)
    L.circle(SCHOOL_COORDS, {
      radius: 3800,
      color: "#06b6d4",
      weight: 1.5,
      dashArray: "6, 6",
      fillColor: "#06b6d4",
      fillOpacity: 0.05,
    }).addTo(map);

    // Draw Route Polylines
    const routeColors: Record<string, string> = {
      "bus-01": "#38bdf8", // Indirapuram (Cyan)
      "bus-02": "#a855f7", // South Express (Purple)
      "bus-03": "#f59e0b", // East Highway (Amber)
      "bus-04": "#10b981", // West Metro (Emerald)
    };

    Object.entries(ROUTE_TRAJECTORIES).forEach(([busId, waypoints]) => {
      const color = routeColors[busId] || "#38bdf8";

      // Corridor line
      L.polyline(waypoints, {
        color,
        weight: 4,
        opacity: 0.75,
        dashArray: "4, 6",
      }).addTo(polyGroup);

      // Add Stop Dots along waypoints
      waypoints.slice(0, -1).forEach((pt, i) => {
        L.circleMarker(pt, {
          radius: 4,
          fillColor: "#0f172a",
          fillOpacity: 1,
          color,
          weight: 2,
        }).addTo(polyGroup);
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer Theme
  useEffect(() => {
    if (!tileLayerRef.current || !mapInstanceRef.current) return;
    tileLayerRef.current.setUrl(tileUrls[mapTheme]);
  }, [mapTheme]);

  // Handle Dynamic Real-Time Marker Updates
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    buses.forEach((bus) => {
      const trajectory = ROUTE_TRAJECTORIES[bus.id] || ROUTE_TRAJECTORIES["bus-01"];
      const currentIdx = stepIndices[bus.id] || 0;
      const targetPoint = trajectory[currentIdx % trajectory.length];
      const isSelected = bus.id === selectedBusId;

      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); cursor: pointer;">
          ${isSelected ? '<div style="position: absolute; inset: -8px; border-radius: 20px; background: rgba(6, 182, 212, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
          <div style="position: relative; width: 40px; height: 40px; border-radius: 12px; background: ${isSelected ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : '#0f172a'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${isSelected ? 'rgba(6,182,212,0.9)' : 'rgba(0,0,0,0.6)'}; border: 2px solid ${isSelected ? '#ffffff' : '#38bdf8'}; transition: all 0.3s ease;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
            <span style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; border-radius: 50%; background: #10b981; border: 2px solid #0f172a;"></span>
          </div>
          <div style="margin-top: 3px; padding: 2px 7px; border-radius: 6px; background: ${isSelected ? '#06b6d4' : '#0f172a'}; color: ${isSelected ? '#0f172a' : '#f8fafc'}; font-size: 10px; font-weight: 800; white-space: nowrap; border: 1px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.15)'}; box-shadow: 0 4px 6px rgba(0,0,0,0.5); font-family: monospace;">
            ${bus.busNumber} • ${bus.currentSpeed || 38} km/h
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-bus-pin",
        html: markerHtml,
        iconSize: [40, 40],
      });

      if (markersRef.current[bus.id]) {
        // Smoothly animate marker position
        markersRef.current[bus.id].setLatLng(targetPoint);
        markersRef.current[bus.id].setIcon(customIcon);
      } else {
        const marker = L.marker(targetPoint, { icon: customIcon }).addTo(map);
        marker.on("click", () => {
          onSelectBus(bus.id);
        });
        markersRef.current[bus.id] = marker;
      }
    });
  }, [buses, stepIndices, selectedBusId, onSelectBus]);

  // Smooth Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(800, Math.floor(2500 / simSpeed));
    const timer = setInterval(() => {
      setStepIndices((prev) => {
        const next: Record<string, number> = {};
        buses.forEach((b) => {
          const trajectory = ROUTE_TRAJECTORIES[b.id] || ROUTE_TRAJECTORIES["bus-01"];
          const cur = prev[b.id] || 0;
          const nextIdx = (cur + 1) % trajectory.length;
          next[b.id] = nextIdx;

          // Emit simulated telemetry
          if (b.id === selectedBusId && onTelemetryUpdate) {
            const pt = trajectory[nextIdx];
            const simulatedSpeed = Math.floor(32 + Math.random() * 15);
            onTelemetryUpdate(b.id, pt[0], pt[1], simulatedSpeed);
          }
        });
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, simSpeed, buses, selectedBusId, onTelemetryUpdate]);

  // Fly to selected bus when active bus changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const trajectory = ROUTE_TRAJECTORIES[selectedBusId] || ROUTE_TRAJECTORIES["bus-01"];
    const curIdx = stepIndices[selectedBusId] || 0;
    const point = trajectory[curIdx % trajectory.length];

    if (point) {
      mapInstanceRef.current.flyTo(point, 13.5, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [selectedBusId]);

  const handleRecenterSchool = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(SCHOOL_COORDS, 12, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Map Container Ref */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#0d1520]" />

      {/* Top Map HUD: Live Signal & Layer Controller */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Signal Status */}
        <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-mono shadow-xl pointer-events-auto">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold">LIVE TELEMETRY: 4 UNITS ACTIVE</span>
        </div>

        {/* Map Layers */}
        <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-white/10 text-white text-xs shadow-xl pointer-events-auto">
          <button
            onClick={() => setMapTheme("dark")}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              mapTheme === "dark" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Dark Grid
          </button>
          <button
            onClick={() => setMapTheme("streets")}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              mapTheme === "streets" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            OpenStreet
          </button>
          <button
            onClick={() => setMapTheme("satellite")}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              mapTheme === "satellite" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Bottom Floating Playback & Simulation Dock */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-slate-950/95 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 text-white shadow-2xl">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause Real-Time Simulation" : "Resume Real-Time Simulation"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
            isPlaying ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Live Tracking" : "Paused"}</span>
        </button>

        <button
          onClick={() => setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-xs border border-white/10"
          title="Change Simulation Speed"
        >
          {simSpeed}x Speed
        </button>

        <button
          onClick={handleRecenterSchool}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
          title="Re-Center School Campus"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
