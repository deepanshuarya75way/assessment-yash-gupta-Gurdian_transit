"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  Send,
  Filter,
  Check,
  Phone,
  Siren,
  Sparkles,
  Zap,
} from "lucide-react";
import { SafetyAlert, Bus } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

interface AlertManagementProps {
  alerts: SafetyAlert[];
  buses?: Bus[];
  onResolveAlert: (alertId: string) => void;
  onSendBroadcast: (alert: SafetyAlert) => void;
}

const SOS_PRESETS = [
  {
    label: "🚨 Unauthorized Boarding Attempt",
    text: "CRITICAL PROTOCOL: Unauthorized person detected near school bus gate. Drivers, verify manifest and initiate safety lock.",
    severity: "CRITICAL" as const,
  },
  {
    label: "⚠️ Route Obstruction / Breakdown",
    text: "TRAFFIC ADVISORY: Significant corridor obstruction reported. Expected 15-minute delay. Drive at caution speed.",
    severity: "HIGH" as const,
  },
  {
    label: "🛑 Medical Emergency / Immediate Halt",
    text: "MEDICAL ALERT: Student medical assistance required onboard. Safely halt at nearest depot corridor. Ambulance notified.",
    severity: "CRITICAL" as const,
  },
  {
    label: "🌧️ Severe Weather / Low Speed",
    text: "WEATHER WARNING: Heavy rain and low visibility. Maintain maximum 30 km/h speed and headlamps on.",
    severity: "MEDIUM" as const,
  },
];

export const AlertManagement: React.FC<AlertManagementProps> = ({
  alerts,
  buses = [],
  onResolveAlert,
  onSendBroadcast,
}) => {
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "RESOLVED">("ALL");
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [targetBus, setTargetBus] = useState("ALL_BUSES");
  const [sosMessage, setSosMessage] = useState(SOS_PRESETS[0].text);
  const [sosSeverity, setSosSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("CRITICAL");

  const filtered = alerts.filter((a) => {
    const matchesSev = filterSeverity === "ALL" ? true : a.severity === filterSeverity;
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? !a.resolved
        : a.resolved;
    return matchesSev && matchesStatus;
  });

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: SafetyAlert = {
      id: `alt-${Date.now()}`,
      title: "DISPATCH EMERGENCY BROADCAST",
      description: sosMessage,
      severity: sosSeverity,
      busNumber: targetBus === "ALL_BUSES" ? "All Fleet" : targetBus,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      type: "SOS_TRIGGERED",
      resolved: false,
    };
    onSendBroadcast(newAlert);
    setIsSosModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Safety SOS &amp; Fleet Anomaly Control Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
              LIVE MONITORING
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric exceptions, unauthorized boardings, geofence deviations, and fleet emergency broadcasts
          </p>
        </div>

        <button
          onClick={() => setIsSosModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Broadcast Emergency SOS</span>
        </button>
      </div>

      {/* 2. Instant Emergency Hotlines Command Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="tel:112"
          className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between hover:bg-slate-800 transition-all border border-slate-800 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center font-black text-sm">
              🚓
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Police Dispatch</span>
              <p className="font-extrabold text-sm text-white">Dial 112 (National Emergency)</p>
            </div>
          </div>
          <Phone className="w-4 h-4 text-slate-400" />
        </a>

        <a
          href="tel:108"
          className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between hover:bg-slate-800 transition-all border border-slate-800 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-sm">
              🚑
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Medical Ambulance</span>
              <p className="font-extrabold text-sm text-white">Dial 108 (First Responder)</p>
            </div>
          </div>
          <Phone className="w-4 h-4 text-slate-400" />
        </a>

        <a
          href="tel:+919812345678"
          className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between hover:bg-slate-800 transition-all border border-slate-800 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-black text-sm">
              🛠️
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fleet Towing &amp; Depot</span>
              <p className="font-extrabold text-sm text-white">+91 98123 45678</p>
            </div>
          </div>
          <Phone className="w-4 h-4 text-slate-400" />
        </a>
      </div>

      {/* 3. Filter Bar & Unresolved Counter */}
      <div className="clean-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "ACTIVE" ? "bg-white text-rose-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active ({alerts.filter((a) => !a.resolved).length})
            </button>
            <button
              onClick={() => setStatusFilter("RESOLVED")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "RESOLVED" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resolved ({alerts.filter((a) => a.resolved).length})
            </button>
          </div>

          {/* Severity filter */}
          {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterSeverity === sev
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Unresolved Anomalies:{" "}
          <strong className="text-rose-600 font-mono text-sm font-extrabold">
            {alerts.filter((a) => !a.resolved).length}
          </strong>
        </span>
      </div>

      {/* 4. Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`clean-card rounded-2xl p-6 flex flex-col justify-between transition-all ${
              alert.resolved
                ? "bg-slate-50/60 opacity-70 border-slate-200"
                : alert.severity === "CRITICAL"
                ? "border-rose-300 bg-rose-50/30 ring-1 ring-rose-200"
                : "border-amber-300 bg-amber-50/30 ring-1 ring-amber-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      alert.resolved
                        ? "neutral"
                        : alert.severity === "CRITICAL"
                        ? "error"
                        : "warning"
                    }
                    pulse={!alert.resolved}
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-xs font-extrabold text-slate-900">{alert.busNumber}</span>
                </div>

                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {alert.timestamp}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-base mt-2">{alert.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
              <span className="text-xs font-semibold text-slate-500">
                Protocol Type: <strong className="text-slate-800">{alert.type}</strong>
              </span>

              {!alert.resolved ? (
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-xs transition-all active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  Resolve Issue
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolved &amp; Logged
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Emergency SOS Broadcast Modal with 1-Click Presets */}
      <Modal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        title="Broadcast Emergency Fleet SOS"
        subtitle="Instantly transmit urgent override notice to active vehicle dashboards & staff"
        maxWidth="lg"
      >
        <form onSubmit={handleBroadcastSubmit} className="space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              ⚡ 1-Click Emergency Preset Templates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOS_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSosMessage(preset.text);
                    setSosSeverity(preset.severity);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left text-xs transition-all"
                >
                  <span className="font-bold text-slate-900 block">{preset.label}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{preset.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Fleet Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Vehicle Fleet *
              </label>
              <select
                value={targetBus}
                onChange={(e) => setTargetBus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="ALL_BUSES">🚨 Broadcast to All Active Buses</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.busNumber}>
                    {b.busNumber} ({b.driverName}) - {b.routeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alert Severity Level *
              </label>
              <select
                value={sosSeverity}
                onChange={(e) => setSosSeverity(e.target.value as "CRITICAL" | "HIGH" | "MEDIUM")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="CRITICAL">🔴 CRITICAL (Immediate Action Required)</option>
                <option value="HIGH">🟠 HIGH (Caution / Advisory)</option>
                <option value="MEDIUM">🟡 MEDIUM (Informational)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Emergency Broadcast Text *
            </label>
            <textarea
              rows={3}
              required
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSosModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Transmit Fleet SOS</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
