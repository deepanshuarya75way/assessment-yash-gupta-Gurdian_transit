"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  HeartHandshake,
  Bus as BusIcon,
  Navigation,
  CalendarCheck,
  Compass,
  ShieldAlert,
  Settings,
  Sparkles,
  Radio,
} from "lucide-react";

export type TabType =
  | "overview"
  | "students"
  | "parents"
  | "fleet"
  | "drivers"
  | "routes"
  | "attendance"
  | "tracking"
  | "alerts"
  | "settings";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  criticalAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  criticalAlertCount,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview Hub", icon: LayoutDashboard },
    { id: "students", label: "Students (CRUD)", icon: Users },
    { id: "parents", label: "Parents (CRUD)", icon: HeartHandshake },
    { id: "fleet", label: "Buses & Fleet", icon: BusIcon },
    { id: "drivers", label: "Drivers Directory", icon: UserCheck },
    { id: "routes", label: "Routes & Stops", icon: Navigation },
    { id: "attendance", label: "Attendance Ledger", icon: CalendarCheck },
    { id: "tracking", label: "Live GPS Radar", icon: Compass },
    {
      id: "alerts",
      label: "Safety & SOS Hub",
      icon: ShieldAlert,
      badge: criticalAlertCount > 0 ? criticalAlertCount : undefined,
    },
    { id: "settings", label: "System Config", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen p-4 select-none flex-shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 px-2 py-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white font-bold shadow-sm">
          <BusIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-base text-slate-900 tracking-tight">Guardian AI</h1>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-500">Transit Safety System</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? "bg-slate-900 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Vector DB Live Health Status */}
      <div className="mt-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            ArcFace Vector DB
          </span>
          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Cosine Distance &lt; 0.40 Threshold
        </p>
      </div>
    </aside>
  );
};
