"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, AlertTriangle, ShieldCheck, Clock, Radio } from "lucide-react";

interface HeaderProps {
  onTriggerSos: () => void;
  criticalAlertCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTriggerSos,
  criticalAlertCount,
  searchQuery,
  setSearchQuery,
}) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Search Input */}
      <div className="relative w-80 md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student, parent, bus, driver..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
        />
      </div>

      {/* Center Live Clock & System Status */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-slate-900 font-bold">{time || "08:00:00 AM"}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Safety Metric:</span>
          <span className="font-bold text-emerald-700">99.4% Safe</span>
        </div>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Emergency SOS Broadcast Button */}
        <button
          onClick={onTriggerSos}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>EMERGENCY SOS</span>
        </button>

        {/* Notifications Icon with Badge */}
        <button className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          <Bell className="w-4 h-4" />
          {criticalAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
              {criticalAlertCount}
            </span>
          )}
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AD
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">Admin Console</p>
            <p className="text-[10px] text-slate-500">School Dispatcher</p>
          </div>
        </div>
      </div>
    </header>
  );
};
