"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Bus as BusIcon,
  UserCheck,
  Navigation,
  Gauge,
  CalendarCheck,
  Compass,
  ShieldAlert,
  Settings,
} from "lucide-react";

export type NavTabType =
  | "home"
  | "students"
  | "parents"
  | "fleet"
  | "drivers"
  | "routes"
  | "speed-ai"
  | "attendance"
  | "tracking"
  | "alerts"
  | "settings";

interface FloatingIslandNavProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  criticalAlertCount: number;
}

export const FloatingIslandNav: React.FC<FloatingIslandNavProps> = ({
  activeTab,
  setActiveTab,
  criticalAlertCount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lightweight event listener on modal open (No heavy MutationObserver)
  useEffect(() => {
    const handleModalToggle = (e: any) => {
      setIsModalOpen(Boolean(e?.detail?.open));
    };

    window.addEventListener("modal-toggle", handleModalToggle);
    return () => {
      window.removeEventListener("modal-toggle", handleModalToggle);
    };
  }, []);

  if (isModalOpen) {
    return null;
  }

  const navItems = [
    { id: "home", label: "Overview", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "parents", label: "Parents", icon: HeartHandshake },
    { id: "fleet", label: "Buses", icon: BusIcon },
    { id: "routes", label: "Routes & Stops", icon: Navigation },
    { id: "drivers", label: "Drivers", icon: UserCheck },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "tracking", label: "Live GPS Map", icon: Compass },
    {
      id: "alerts",
      label: "Safety & SOS",
      icon: ShieldAlert,
      badge: criticalAlertCount > 0 ? criticalAlertCount.toString() : undefined,
    },
  ];

  return (
    <div className="floating-dock-container fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4 transition-all">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_40px_-10px_rgba(15,23,42,0.15)] rounded-2xl p-1.5 flex items-center gap-1 max-w-full overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTabType)}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap group focus:outline-none ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              {/* Morphing Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeFloatingPill"
                  className="absolute inset-0 bg-slate-900 rounded-xl shadow-md"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-500"}`} />
                <span className="hidden sm:inline-block">{item.label}</span>
              </span>

              {item.badge && (
                <span
                  className={`relative z-10 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    item.badge === "AI"
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-rose-500 text-white animate-pulse"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
