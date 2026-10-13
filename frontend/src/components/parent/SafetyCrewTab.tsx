"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Phone,
  PhoneCall,
  Bus as BusIcon,
  User,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Bus, Student } from "../../data/enterpriseMockData";

interface SafetyCrewTabProps {
  currentStudent: Student;
  bus: Bus;
}

export const SafetyCrewTab: React.FC<SafetyCrewTabProps> = ({ currentStudent, bus }) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const handleSos = () => {
    setSosTriggered(true);
    setConfirmModal(false);
    // Auto reset after 8 seconds
    setTimeout(() => setSosTriggered(false), 8000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Driver & Conductor Card */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <BusIcon className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {bus.busNumber} Crew &amp; Registration
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800">
            {bus.licensePlate}
          </span>
        </div>

        {/* Driver Contact */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Designated Driver</span>
              <strong className="text-xs text-white block">{bus.driverName}</strong>
              <span className="text-[10px] text-slate-400">{bus.driverPhone}</span>
            </div>
          </div>

          <a
            href={`tel:${bus.driverPhone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>

        {/* Conductor Contact */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Bus Attendant / Conductor</span>
              <strong className="text-xs text-white block">{bus.conductorName || "Amit Sharma"}</strong>
              <span className="text-[10px] text-slate-400">{bus.conductorPhone || "+91 98112 01002"}</span>
            </div>
          </div>

          <a
            href={`tel:${bus.conductorPhone || "+91 98112 01002"}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>

      {/* Safety Compliance & AI Shield */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Vehicle Safety &amp; AI Compliance</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Speed Governor (&lt;45km/h)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Dual AI CCTV Cameras</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>GPS Tracking Active</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>First Aid &amp; Fire Ext.</span>
          </div>
        </div>
      </div>

      {/* Emergency SOS & School Helpline Card */}
      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Emergency SOS &amp; Security Control</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400">
          In case of any urgent delay or emergency, instantly broadcast an alert to School Transport Control and Principal Office.
        </p>

        {sosTriggered ? (
          <div className="p-3 rounded-xl bg-rose-500 text-white text-xs font-bold text-center animate-pulse">
            🚨 SOS Alert Broadcasted to Transport Control Room! Dispatching assistance.
          </div>
        ) : (
          <button
            onClick={() => setConfirmModal(true)}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Trigger Emergency SOS</span>
          </button>
        )}
      </div>

      {/* SOS Confirmation Dialog */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-rose-500/40 p-5 space-y-4 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Broadcast Emergency SOS?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  This will notify School Transport Office, Police Helpline, and Bus Conductor immediately.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmModal(false)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSos}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold"
                >
                  Yes, Trigger SOS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
