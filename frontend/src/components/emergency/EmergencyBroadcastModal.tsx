"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X, Radio, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import { SafetyAlert } from "../../data/mockData";

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendAlert: (alert: SafetyAlert) => void;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  onSendAlert,
}) => {
  const [targetBus, setTargetBus] = useState("ALL_BUSES");
  const [alertType, setAlertType] = useState("UNAUTHORIZED_PERSON");
  const [message, setMessage] = useState(
    "CRITICAL PROTOCOL: Unauthorized person detected near Bus Gate. Drivers, initiate safety lock."
  );
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: SafetyAlert = {
      id: `alt-${Date.now()}`,
      title: "DISPATCH EMERGENCY BROADCAST",
      description: message,
      severity: "CRITICAL",
      busNumber: targetBus === "ALL_BUSES" ? "All Fleet" : targetBus,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      type: "SOS_TRIGGERED",
      resolved: false,
    };
    onSendAlert(newAlert);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-panel rounded-3xl p-8 max-w-lg w-full relative border border-rose-500/40 shadow-glowRose"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center shadow-glowRose text-white">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Emergency Fleet Broadcast</h3>
            <p className="text-xs text-rose-300">
              Immediate override transmission to all driver tablets &amp; parents
            </p>
          </div>
        </div>

        {sent ? (
          <div className="p-8 text-center bg-rose-950/40 rounded-2xl border border-rose-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white">Broadcast Dispatched!</h4>
            <p className="text-xs text-slate-300 mt-1">
              All active bus units and safety responders have received the critical alert.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Target Fleet Channel
              </label>
              <select
                value={targetBus}
                onChange={(e) => setTargetBus(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
              >
                <option value="ALL_BUSES">🚨 Broadcast to All Active Buses</option>
                <option value="Bus #14">Bus #14 (North Route)</option>
                <option value="Bus #07">Bus #07 (South Express)</option>
                <option value="Bus #03">Bus #03 (East Corridor)</option>
                <option value="Bus #21">Bus #21 (West Metro)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Emergency Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm shadow-glowRose transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Transmit SOS Alert</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
