"use client";

import React from "react";
import { Bus as BusIcon, Navigation, BatteryCharging, Gauge, Phone, Users, CheckCircle2 } from "lucide-react";
import { Bus } from "../../data/mockData";
import { Badge } from "../ui/Badge";
import { Card3D } from "../ui/Card3D";

interface FleetManagementViewProps {
  buses: Bus[];
  searchQuery: string;
}

export const FleetManagementView: React.FC<FleetManagementViewProps> = ({
  buses,
  searchQuery,
}) => {
  const filteredBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-cyan-400" />
            Bus Fleet &amp; Route Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Live bus manifests, driver communication lines, and onboard occupancy
          </p>
        </div>

        <Badge variant="info">
          {buses.length} Fleet Vehicles Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBuses.map((bus) => (
          <Card3D key={bus.id} glowColor="cyan" className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold">
                  <BusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{bus.busNumber}</h3>
                  <p className="text-xs text-slate-400">{bus.route}</p>
                </div>
              </div>

              <Badge
                variant={
                  bus.status === "ON_ROUTE"
                    ? "success"
                    : bus.status === "DELAYED"
                    ? "warning"
                    : "neutral"
                }
                pulse={bus.status === "ON_ROUTE"}
              >
                {bus.status}
              </Badge>
            </div>

            {/* Driver & Onboard Stats */}
            <div className="grid grid-cols-2 gap-4 my-4 p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Driver</span>
                <p className="font-bold text-white mt-0.5">{bus.driverName}</p>
                <p className="text-cyan-400 flex items-center gap-1 mt-1 text-[11px]">
                  <Phone className="w-3 h-3" />
                  {bus.driverPhone}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Occupancy</span>
                <p className="font-bold text-white mt-0.5">
                  {bus.onboardCount} / {bus.capacity} Students
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${(bus.onboardCount / bus.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Real-time Telemetry Metrics */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Speed: <strong className="text-white">{bus.currentSpeed} km/h</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>Battery: <strong className="text-emerald-400">{bus.batteryFuel}%</strong></span>
              </div>

              <div className="text-cyan-300 font-semibold text-right">
                Next: {bus.nextStop}
              </div>
            </div>
          </Card3D>
        ))}
      </div>
    </div>
  );
};
