"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Bell,
  Settings,
  Wifi,
  Battery,
  Maximize2,
  Minimize2,
  Bus as BusIcon,
  LogOut,
  Radio,
  Phone,
  AlertTriangle,
} from "lucide-react";
import { AuthUser } from "../../context/AuthContext";
import { Student, Parent, Bus, Route, SafetyAlert, SEED_STUDENTS, SEED_PARENTS, SEED_BUSES, SEED_ROUTES, SEED_ALERTS } from "../../data/enterpriseMockData";
import { useParentWebSocket } from "../../hooks/useParentWebSocket";
import { HomeTab } from "./HomeTab";
import { BusCommunityTab } from "./BusCommunityTab";
import { LiveAlertsTab } from "./LiveAlertsTab";
import { SettingsTab } from "./SettingsTab";

export type ParentTabType = "HOME" | "COHORT" | "ALERTS" | "SETTINGS";

interface ParentMobileAppProps {
  user: AuthUser;
  onLogout: () => void;
  activeStudent: Student;
  myStudents?: Student[];
  allStudents?: Student[];
  allParents?: Parent[];
  allBuses?: Bus[];
  allRoutes?: Route[];
  allAlerts?: SafetyAlert[];
  onSwitchStudent?: (studentId: string) => void;
}

export const ParentMobileApp: React.FC<ParentMobileAppProps> = ({
  user,
  onLogout,
  activeStudent,
  myStudents,
  allStudents = SEED_STUDENTS,
  allParents = SEED_PARENTS,
  allBuses = SEED_BUSES,
  allRoutes = SEED_ROUTES,
  allAlerts = SEED_ALERTS,
  onSwitchStudent,
}) => {
  const [activeTab, setActiveTab] = useState<ParentTabType>("HOME");
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState("09:41");
  const [activeSosAlert, setActiveSosAlert] = useState<SafetyAlert | null>(null);

  // Real-Time WebSocket Alerts Engine
  const { isConnected, events, latestAlert } = useParentWebSocket(user.id);

  // Listen to incoming real-time alerts from WebSocket
  useEffect(() => {
    if (latestAlert) {
      setActiveSosAlert(latestAlert);
    }
  }, [latestAlert]);

  // Simulated Mobile Status Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const studentsList =
    myStudents && myStudents.length > 0
      ? myStudents
      : user.students && user.students.length > 0
      ? user.students
      : [activeStudent];

  // Resolve the live up-to-date student record from fresh myStudents
  const liveStudent = myStudents?.find((s) => s.id === activeStudent.id) || activeStudent;

  // Resolve the assigned bus fleet for the active student
  const primaryBus =
    allBuses.find(
      (b) =>
        b.id === liveStudent.busId ||
        (liveStudent.busNumber && b.busNumber?.trim().toLowerCase() === liveStudent.busNumber?.trim().toLowerCase())
    ) || allBuses[0];

  // Resolve the active bus route for the active student & bus
  const currentRoute =
    allRoutes.find(
      (r) =>
        r.id === liveStudent.routeId ||
        (liveStudent.busNumber && r.assignedBusNumber?.trim().toLowerCase() === liveStudent.busNumber?.trim().toLowerCase()) ||
        (primaryBus.busNumber && r.assignedBusNumber?.trim().toLowerCase() === primaryBus.busNumber?.trim().toLowerCase()) ||
        r.id === primaryBus.routeId
    ) ||
    allRoutes[0];

  const totalAlertsCount = events.length + (allAlerts.filter((a) => !a.resolved).length > 0 ? 1 : 0);

  const navTabs: { id: ParentTabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: "HOME", label: "Home", icon: Home },
    { id: "COHORT", label: "Bus Cohort", icon: Users },
    { id: "ALERTS", label: "Alerts", icon: Bell, badge: totalAlertsCount > 0 ? totalAlertsCount : undefined },
    { id: "SETTINGS", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 select-none font-sans">
      {/* Top Desktop View Toggle & Quick Sign Out Bar */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between pb-3 px-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span className="font-bold text-slate-900 truncate max-w-[180px]">
            {user.name || "Guardian Parent Portal"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-bold transition-all shadow-sm"
            title="Toggle Phone Frame"
          >
            {isPhoneFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{isPhoneFrame ? "Full Width" : "Phone Frame"}</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs text-rose-600 font-bold transition-all shadow-sm"
            title="Sign Out of Account"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Smartphone Shell (Minimal Black & White Theme) */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-[#f8fafc] relative ${
          isPhoneFrame
            ? "max-w-[420px] h-[92vh] sm:h-[844px] rounded-none sm:rounded-[44px] border-0 sm:border-[8px] sm:border-slate-900 shadow-2xl overflow-hidden"
            : "max-w-2xl min-h-screen sm:min-h-[860px] rounded-none sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xl"
        }`}
      >
        {/* Dynamic Island & Status Bar */}
        <div className="pt-3 px-4 sm:px-6 pb-2.5 flex items-center justify-between z-30 bg-[#f8fafc]/95 backdrop-blur-md sticky top-0 border-b border-slate-200">
          <span className="text-xs font-black text-slate-900 font-mono">{currentTime}</span>

          {/* Dynamic Island Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{primaryBus.busNumber} • Live</span>
          </div>

          <div className="flex items-center gap-2 text-slate-800">
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              title="Sign Out of Account"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-Time WebSocket Emergency SOS Alert Banner */}
        <AnimatePresence>
          {activeSosAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mx-3 mt-2 p-3.5 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/30 flex items-start gap-3 z-40 border border-rose-400/50"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full">
                    🚨 {activeSosAlert.busNumber || "Fleet SOS Broadcast"}
                  </span>
                  <button
                    onClick={() => setActiveSosAlert(null)}
                    className="text-white/80 hover:text-white text-xs font-bold px-1"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="text-xs font-extrabold mt-1 text-white truncate">
                  {activeSosAlert.title || "Emergency SOS Broadcast"}
                </h4>
                <p className="text-[11px] text-white/90 line-clamp-2 mt-0.5">
                  {activeSosAlert.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("ALERTS");
                      setActiveSosAlert(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-rose-700 font-extrabold text-[10px] shadow-sm hover:bg-rose-50 transition-colors"
                  >
                    View in Alerts →
                  </button>
                  <a
                    href="tel:+919811200999"
                    className="px-2.5 py-1 rounded-lg bg-black/40 text-white font-bold text-[10px] hover:bg-black/60 transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5" />
                    <span>Call Admin</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "HOME" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <HomeTab
                  currentStudent={liveStudent}
                  allStudents={studentsList}
                  onSwitchStudent={onSwitchStudent}
                  bus={primaryBus}
                  route={currentRoute}
                  allBuses={allBuses}
                  allRoutes={allRoutes}
                />
              </motion.div>
            )}

            {activeTab === "COHORT" && (
              <motion.div
                key="cohort"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <BusCommunityTab
                  currentStudent={liveStudent}
                  allStudents={allStudents}
                  allParents={allParents}
                  currentBus={primaryBus}
                  currentRoute={currentRoute}
                />
              </motion.div>
            )}

            {activeTab === "ALERTS" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <LiveAlertsTab
                  currentStudent={liveStudent}
                  liveEvents={events}
                  allAlerts={allAlerts}
                  isConnected={isConnected}
                />
              </motion.div>
            )}

            {activeTab === "SETTINGS" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <SettingsTab user={user} onLogout={onLogout} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Native Mobile Bottom Navigation Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 py-2">
          <div className="grid grid-cols-4 gap-1 relative">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200 ${
                    isActive ? "text-black font-extrabold" : "text-slate-400 hover:text-slate-700 font-medium"
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomNavPill"
                      className="absolute inset-0 bg-slate-100 rounded-2xl"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <Icon className="w-5 h-5 transition-transform duration-200" />
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-black text-white">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] mt-1 tracking-tight leading-none">
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
