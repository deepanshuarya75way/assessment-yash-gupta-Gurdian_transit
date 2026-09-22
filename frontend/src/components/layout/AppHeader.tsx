"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Radio,
  Clock,
  Settings,
  Bus as BusIcon,
  Clock3,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SafetyAlert } from "../../data/enterpriseMockData";
import { NavTabType } from "./FloatingIslandNav";

interface AppHeaderProps {
  activeTab: NavTabType;
  onNavigateTab: (tab: NavTabType) => void;
  onTriggerSos: () => void;
  criticalAlertCount: number;
  alerts?: SafetyAlert[];
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  onNavigateTab,
  onTriggerSos,
  criticalAlertCount,
  alerts = [],
}) => {
  const [time, setTime] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const isHome = activeTab === "home";

  // Lightweight Event-Driven Modal State (Zero MutationObserver, Zero CPU overhead)
  useEffect(() => {
    const handleModalToggle = (e: any) => {
      setIsModalOpen(Boolean(e?.detail?.open));
    };

    window.addEventListener("modal-toggle", handleModalToggle);
    return () => {
      window.removeEventListener("modal-toggle", handleModalToggle);
    };
  }, []);

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
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]);

  // If any modal popup is open, hide header cleanly
  if (isModalOpen) {
    return null;
  }

  // Dynamic sample live notification feed (delays, safety warnings, biometrics)
  const notificationFeed = [
    {
      id: "notif-01",
      title: "Bus Delay Alert: Bus #08",
      description: "Route 8 delayed by ~8 mins near Gazipur Border Flyover due to NH-09 morning traffic.",
      time: "2 mins ago",
      type: "DELAY",
      severity: "WARNING",
    },
    {
      id: "notif-02",
      title: "Excess Speed Warning (NH-09 Expressway)",
      description: "Bus #08 exceeded designated safety limit (55 km/h near Gazipur Border). Conductor notified.",
      time: "07:42 AM",
      type: "SPEED",
      severity: "CRITICAL",
    },
    {
      id: "notif-03",
      title: "Biometric Attendance Active",
      description: "80+ students verified via 3D AI Biometrics across 8 buses with 99.4% average accuracy.",
      time: "07:30 AM",
      type: "BIOMETRIC",
      severity: "INFO",
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xs transition-all">
      {/* 1. Left Side: Full Brand on Home, Sleek Mini Return-Home Icon on other pages */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateTab("home")}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10 hover:bg-slate-800 transition-all flex-shrink-0"
          title="Return to Home Dashboard"
        >
          <BusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Brand details: Rendered ONLY on Home page as requested */}
        {isHome ? (
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Guardian Transit AI
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 truncate max-w-[260px] sm:max-w-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <strong className="text-slate-800">ABES Business School</strong> (Lal Kuan, Ghaziabad) • Live Safety Dispatch
            </p>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-900 capitalize tracking-tight">
              {activeTab.replace("-", " ")}
            </span>
            <span className="text-[10px] text-slate-400">• ABES Lal Kuan</span>
          </div>
        )}
      </div>

      {/* 2. Center Live Clock (Only on Home Page) */}
      {isHome && (
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-slate-900 font-bold">{time || "08:00:00 AM"}</span>
        </div>
      )}

      {/* 3. Right Controls: STRICTLY THE 3 REQUIRED ACTIONS (Notifications, Settings, Broadcast SOS) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* A. Live Notification Bell with Dropdown (Delays, Safety Warnings) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 sm:p-2.5 rounded-xl border transition-all ${
              isNotificationsOpen
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700"
            }`}
            title="Transit & Fleet Delay Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {/* Notification Flyout Modal */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-600" />
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Live Transit Notifications
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  3 Unresolved
                </span>
              </div>

              {/* Feed Items */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notificationFeed.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      item.severity === "CRITICAL"
                        ? "bg-rose-50/60 border-rose-200"
                        : item.severity === "WARNING"
                        ? "bg-amber-50/60 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {item.severity === "CRITICAL" ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        ) : item.severity === "WARNING" ? (
                          <Clock3 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        )}
                        <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    onNavigateTab("alerts");
                  }}
                  className="font-bold text-slate-900 hover:text-cyan-600 flex items-center gap-1 transition-colors"
                >
                  <span>Open Safety SOS Radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* B. Settings Button */}
        <button
          onClick={() => onNavigateTab("settings")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/20"
              : "bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700"
          }`}
          title="Campus & System Settings"
        >
          <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-cyan-300 animate-spin" : "text-slate-600"}`} />
          <span className="hidden sm:inline-block">Settings</span>
        </button>

        {/* C. BROADCAST SOS Button (Persistent on ALL pages) */}
        <button
          onClick={onTriggerSos}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all active:scale-95"
          title="Broadcast Emergency SOS Fleet Alert"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="whitespace-nowrap">BROADCAST SOS</span>
        </button>

        {/* D. User Profile: Rendered ONLY on Home Page */}
        {isHome && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 hidden md:flex">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">School Admin</p>
              <p className="text-[10px] text-slate-500 font-medium">Chief Dispatcher</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
