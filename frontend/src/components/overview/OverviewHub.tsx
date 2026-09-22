"use client";

import React from "react";
import {
  Bus,
  Users,
  ShieldAlert,
  Zap,
  TrendingUp,
  UserPlus,
  Plus,
  Radio,
  Scan,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import {
  Student,
  Bus as BusType,
  AttendanceRecord,
  SafetyAlert,
} from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";

interface OverviewHubProps {
  students: Student[];
  buses: BusType[];
  attendance: AttendanceRecord[];
  alerts: SafetyAlert[];
  onNavigateTab: (tab: string) => void;
  onOpenAddStudent: () => void;
  onTriggerSos: () => void;
}

export const OverviewHub: React.FC<OverviewHubProps> = ({
  students,
  buses,
  attendance,
  alerts,
  onNavigateTab,
  onOpenAddStudent,
  onTriggerSos,
}) => {
  const activeBuses = buses.filter((b) => b.status === "ON_ROUTE").length;
  const onboardStudents = students.filter((s) => s.status === "BOARDED").length;
  const criticalAlerts = alerts.filter((a) => !a.resolved && a.severity === "CRITICAL").length;

  const statCards = [
    {
      title: "Active Buses En Route",
      value: `${activeBuses} / ${buses.length}`,
      subtitle: "Buses running morning transit",
      trend: "100% on track",
      icon: Bus,
      color: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      title: "Students Transit Status",
      value: `${onboardStudents} / ${students.length}`,
      subtitle: "Verified biometric boardings",
      trend: "83% checked in",
      icon: Users,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Active Safety Anomalies",
      value: criticalAlerts.toString(),
      subtitle: criticalAlerts > 0 ? "Requires review" : "Zero active threats",
      trend: criticalAlerts > 0 ? "1 Critical" : "All routes safe",
      icon: ShieldAlert,
      color: criticalAlerts > 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "AI Recognition Accuracy",
      value: "99.4%",
      subtitle: "Cosine distance < 0.40",
      trend: "ArcFace 512-d",
      icon: Zap,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="clean-card rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900">{card.value}</h3>
                </div>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">{card.subtitle}</span>
                <span className="font-semibold text-slate-800">{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Operations Bar */}
      <div className="clean-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Quick Dispatch Actions</h4>
            <p className="text-xs text-slate-400">Manage daily transit operations with single-click shortcuts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => onNavigateTab("routes")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Route</span>
          </button>
          <button
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition-all active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Broadcast SOS</span>
          </button>
        </div>
      </div>

      {/* 2-Column Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Biometric Camera Simulator */}
        <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Scan className="w-4 h-4 text-cyan-600" />
                Live CCTV Biometrics Feed
              </h3>
              <p className="text-xs text-slate-500">Bus #14 Gate 1 camera live streaming</p>
            </div>
            <Badge variant="success" pulse>
              Live Cam Active
            </Badge>
          </div>

          <div className="w-full h-56 rounded-xl bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
            <div className="absolute inset-x-0 h-0.5 bg-cyan-400 animate-scanline z-20" />
            <div className="absolute top-2 left-2 text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded">
              CAM-BUS-14 • 1080p
            </div>

            {/* Simulated Detected Face */}
            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-2 text-xs font-bold text-white">Yash Sharma (STU-10492)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Verified Match (99.4%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-slate-100">
            <span className="text-slate-500">Last scanned: 07:42:18 AM</span>
            <button
              onClick={() => onNavigateTab("attendance")}
              className="text-slate-900 font-bold hover:underline"
            >
              View Full Attendance Ledger →
            </button>
          </div>
        </div>

        {/* Live Safety Exceptions Reel */}
        <div className="clean-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Active Safety &amp; Transit Alerts
              </h3>
              <p className="text-xs text-slate-500">Exceptions flagged by AI &amp; telematics</p>
            </div>
            <button
              onClick={() => onNavigateTab("alerts")}
              className="text-xs font-bold text-slate-900 hover:underline"
            >
              Manage ({alerts.length})
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                  alert.resolved
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : alert.severity === "CRITICAL"
                    ? "bg-rose-50 border-rose-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant={alert.resolved ? "neutral" : alert.severity === "CRITICAL" ? "error" : "warning"}>
                      {alert.severity}
                    </Badge>
                    <span className="font-bold text-slate-900">{alert.busNumber}</span>
                  </div>
                  <h5 className="font-bold text-slate-900">{alert.title}</h5>
                  <p className="text-slate-600 mt-0.5">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab("alerts")}
              className="text-xs font-bold text-slate-900 hover:underline"
            >
              Open Safety Command Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
