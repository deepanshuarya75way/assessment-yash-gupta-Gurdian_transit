"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Check, Clock, Radio } from "lucide-react";
import { SafetyAlert } from "../../data/mockData";
import { Badge } from "../ui/Badge";

interface RecentAlertsFeedProps {
  alerts: SafetyAlert[];
  onResolveAlert: (id: string) => void;
}

export const RecentAlertsFeed: React.FC<RecentAlertsFeedProps> = ({
  alerts,
  onResolveAlert,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
            Safety Alerts &amp; Critical Exceptions
          </h2>
          <p className="text-xs text-slate-400">
            Real-time anomaly triggers from AI cameras and GPS telematics
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {alerts.filter((a) => !a.resolved).length} Unresolved
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-xl border transition-all ${
                alert.resolved
                  ? "bg-slate-900/40 border-white/5 opacity-60"
                  : alert.severity === "CRITICAL"
                  ? "bg-rose-950/30 border-rose-500/40 shadow-glowRose"
                  : "bg-amber-950/20 border-amber-500/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
                    <span className="text-xs font-bold text-cyan-300">
                      {alert.busNumber}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {alert.timestamp}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {!alert.resolved && (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all whitespace-nowrap active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Resolve
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-300">No active alerts</p>
            <p className="text-xs">All transit operations are currently running safely.</p>
          </div>
        )}
      </div>
    </div>
  );
};
