"use client";

import React, { useState } from "react";
import {
  Bus,
  Users,
  ShieldCheck,
  Activity,
  Gauge,
  Sun,
  Moon,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Bus as BusType, Student, SafetyAlert } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";

interface ExecutiveMetricsGridProps {
  buses: BusType[];
  students: Student[];
  alerts: SafetyAlert[];
  selectedBusId?: string;
  onSelectBus?: (busId: string) => void;
}

export const ExecutiveMetricsGrid: React.FC<ExecutiveMetricsGridProps> = ({
  buses,
  students,
  alerts,
  selectedBusId,
  onSelectBus,
}) => {
  // Morning Pickup vs Evening Drop Shift Toggle
  const [transitShift, setTransitShift] = useState<"morning" | "evening">("morning");

  // 1. School Fleet Status: Buses on road vs parked
  const activeBuses = buses.filter((b) => b.status === "ON_ROUTE" || b.status === "DELAYED").length;
  const idleBuses = buses.filter((b) => b.status === "IDLE" || b.status === "MAINTENANCE").length;

  // 2. Total sum of all students inside all active on-road buses right now
  const totalStudentsInFleet = buses.reduce((acc, b) => acc + b.insideBusCount, 0);
  const totalMorningBoarded = buses.reduce((acc, b) => acc + b.totalAssignedStudents, 0);

  // 3. Safety & Door Alerts
  const criticalAlerts = alerts.filter((a) => !a.resolved && a.severity === "CRITICAL").length;

  // 4. Advanced Speed Telemetry
  const overspeedingBuses = buses.filter((b) => b.currentSpeed > 45);

  return (
    <div className="space-y-6">
      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Buses On Road vs Parked */}
        <div className="clean-card clean-card-hover rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Fleet Status
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                Live GPS
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {activeBuses} on Road • {idleBuses} Parked
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Out of {buses.length} Total School Buses
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex justify-between">
            <span>Fleet Utilization</span>
            <span className="font-bold text-slate-900">{Math.round((activeBuses / buses.length) * 100)}% on road</span>
          </div>
        </div>

        {/* Card 2: Total Sum of Students in All Buses Right Now */}
        <div className="clean-card clean-card-hover rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Students in Buses (Total Sum)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Biometric Scanned
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {totalStudentsInFleet} Students Inside
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Sum of all {activeBuses} active on-road buses right now
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex justify-between">
            <span>Morning Boarded Total:</span>
            <span className="font-bold text-emerald-700">{totalMorningBoarded} Students</span>
          </div>
        </div>

        {/* Card 3: Safety & Door Security Alerts */}
        <div className="clean-card clean-card-hover rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Safety Alerts
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  criticalAlerts > 0
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {criticalAlerts > 0 ? "1 Critical Alert" : "100% Safe"}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {criticalAlerts > 0 ? "1 Pending Alert" : "Zero Alerts"}
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {criticalAlerts > 0
                ? "Unauthorized face scanned at Bus #07 gate"
                : "All bus gates & routes verified"}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex justify-between">
            <span>ArcFace Threshold</span>
            <span className="font-bold text-slate-900">Distance &lt; 0.40</span>
          </div>
        </div>

        {/* Card 4: Advanced Speed Telematics */}
        <div className="clean-card clean-card-hover rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Speed Radar Telematics
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  overspeedingBuses.length > 0
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }`}
              >
                Limit: 45 km/h
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {overspeedingBuses.length > 0 ? "1 Bus Speeding" : "41.5 km/h Avg"}
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {overspeedingBuses.length > 0
                ? "Bus #21 @ 52 km/h (Janakpuri flyover)"
                : "All buses operating within 45 km/h limit"}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex justify-between">
            <span>School Zone Geofence</span>
            <span className="font-bold text-purple-700">Live GPS Monitored</span>
          </div>
        </div>
      </div>

      {/* Bus-by-Bus Occupancy Manifest (with Morning vs Evening Drop Switcher) */}
      <div className="clean-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bus className="w-4 h-4 text-slate-800" />
              Live Bus-by-Bus Student Occupancy &amp; Transit Status
            </h4>
            <p className="text-xs text-slate-500">
              {transitShift === "morning"
                ? "Morning Pickup Mode: Showing live boarded students against bus seating capacity"
                : "Evening Drop Mode: Showing remaining students in bus against morning boarded total"}
            </p>
          </div>

          {/* Shift Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setTransitShift("morning")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                transitShift === "morning"
                  ? "bg-white text-slate-900 shadow-sm font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Morning Pickup</span>
            </button>
            <button
              onClick={() => setTransitShift("evening")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                transitShift === "evening"
                  ? "bg-white text-slate-900 shadow-sm font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Evening Drop</span>
            </button>
          </div>
        </div>

        {/* Bus Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {buses.map((bus) => {
            const isSelected = selectedBusId === bus.id;

            // Morning Calculation: e.g. 28 / 40 seats capacity
            const morningOccupancyPct = Math.round((bus.insideBusCount / bus.capacity) * 100);

            // Evening Calculation: e.g. 28 present / 30 morning boarded (2 dropped home)
            const eveningRemainingPct = Math.round((bus.insideBusCount / bus.totalAssignedStudents) * 100);

            return (
              <button
                key={bus.id}
                onClick={() => onSelectBus && onSelectBus(bus.id)}
                className={`clean-card clean-card-hover rounded-2xl p-4 text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "ring-2 ring-slate-900 border-transparent shadow-lg bg-slate-50/80"
                    : "hover:border-slate-300"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-base">{bus.busNumber}</span>
                  <Badge
                    variant={
                      bus.status === "ON_ROUTE"
                        ? "success"
                        : bus.status === "DELAYED"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {bus.status === "ON_ROUTE" ? "On Route" : bus.status === "DELAYED" ? "Delayed" : "Stationed"}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 truncate mb-3">{bus.routeName}</p>

                {/* Dynamic Shift-Aware Occupancy */}
                {transitShift === "morning" ? (
                  // Morning: 28 Boarded out of 40 Capacity
                  <div className="space-y-1.5 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        👥 {bus.insideBusCount} Boarded
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        out of {bus.capacity} seats ({morningOccupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          morningOccupancyPct > 80 ? "bg-amber-500" : "bg-slate-900"
                        }`}
                        style={{ width: `${morningOccupancyPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">
                      {bus.capacity - bus.insideBusCount} seats available
                    </p>
                  </div>
                ) : (
                  // Evening: 28 in Bus out of 30 Morning Boarded (2 dropped)
                  <div className="space-y-1.5 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        🏠 {bus.insideBusCount} in Bus
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        out of {bus.totalAssignedStudents} morning ({bus.offboardedCount} dropped)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${eveningRemainingPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-emerald-700 font-semibold text-right">
                      {bus.offboardedCount} students safely dropped
                    </p>
                  </div>
                )}

                {/* Speed & Driver Info */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-3 mt-3 border-t border-slate-100">
                  <span className="truncate">Driver: <strong>{bus.driverName}</strong></span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      bus.currentSpeed > 45
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "text-slate-900 font-mono"
                    }`}
                  >
                    ⚡ {bus.currentSpeed} km/h
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
