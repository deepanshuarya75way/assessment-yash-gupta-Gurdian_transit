"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bus as BusIcon, Radio, KeyRound, ArrowRight, ShieldCheck, User } from "lucide-react";
import { SEED_BUSES } from "../../data/enterpriseMockData";

interface BusLoginViewProps {
  onSuccess?: (busNumber: string) => void;
}

export const BusLoginView: React.FC<BusLoginViewProps> = ({ onSuccess }) => {
  const [selectedBus, setSelectedBus] = useState(SEED_BUSES[0].busNumber);
  const [driverPin, setDriverPin] = useState("8899");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) {
      onSuccess(selectedBus);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between items-center relative overflow-hidden font-sans select-none p-4 sm:p-6">
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-amber-100/50 via-sky-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-md pt-3 pb-2 flex items-center justify-between z-10 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span>Fleet Terminal Telemetry</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
          v2.4 Bus Engine
        </span>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-md z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] bg-white border border-slate-200 shadow-xl p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-lg mb-3">
              <BusIcon className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-slate-900">Bus Terminal Console</h1>
            <p className="text-xs text-slate-500 mt-1">
              Select designated school vehicle to launch on-board camera &amp; biometric scanner
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vehicle &amp; Route Fleet
              </label>
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-black"
              >
                {SEED_BUSES.map((b) => (
                  <option key={b.id} value={b.busNumber}>
                    {b.busNumber} • {b.routeName} ({b.driverName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Driver / Terminal Authorization PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={driverPin}
                  onChange={(e) => setDriverPin(e.target.value)}
                  placeholder="PIN"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-black font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 mt-2"
            >
              <span>Initialize Bus {selectedBus} Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </main>

      <footer className="w-full max-w-md py-2 text-center text-[11px] text-slate-400 font-medium z-10">
        Guardian Transit AI • Dedicated Fleet Terminal
      </footer>
    </div>
  );
};
