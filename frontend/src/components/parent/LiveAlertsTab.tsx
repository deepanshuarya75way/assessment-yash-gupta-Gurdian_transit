"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Phone,
  MessageSquare,
  ShieldAlert,
  ArrowRightLeft,
  Wrench,
  UserX,
  Clock,
  Shield,
  Navigation,
} from "lucide-react";
import { Student, SafetyAlert, SEED_ALERTS } from "../../data/enterpriseMockData";
import { LiveWebSocketEvent } from "../../hooks/useParentWebSocket";

interface LiveAlertsTabProps {
  currentStudent: Student;
  liveEvents?: LiveWebSocketEvent[];
  allAlerts?: SafetyAlert[];
  isConnected: boolean;
}

interface FormattedAlertItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "EMERGENCY" | "BOARDING" | "INCIDENTS";
  type: string;
  busNumber?: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
  isLive?: boolean;
}

export const LiveAlertsTab: React.FC<LiveAlertsTabProps> = ({
  currentStudent,
  liveEvents = [],
  allAlerts = SEED_ALERTS,
  isConnected,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "EMERGENCY" | "BOARDING" | "INCIDENTS">("ALL");

  // Helper to determine icon and styles based on alert metadata
  const getAlertStyles = (type: string = "", severity: string = "", title: string = "") => {
    const t = type.toUpperCase();
    const s = severity.toUpperCase();
    const ttl = title.toLowerCase();

    if (t === "UNAUTHORIZED_PERSON" || t === "UNAUTHORIZED" || ttl.includes("unauthorized") || ttl.includes("intruder")) {
      return {
        icon: ShieldAlert,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50 border-rose-200",
        category: "EMERGENCY" as const,
        badge: "Security Alert",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-300 font-extrabold",
      };
    }

    if (t === "ROUTE_DEVIATION" || ttl.includes("deviation") || ttl.includes("route")) {
      return {
        icon: Navigation,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50 border-amber-200",
        category: "EMERGENCY" as const,
        badge: "Route Deviation",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-300 font-bold",
      };
    }

    if (t === "SOS_TRIGGERED" || s === "CRITICAL" || ttl.includes("emergency") || ttl.includes("sos")) {
      return {
        icon: Radio,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50 border-rose-200",
        category: "EMERGENCY" as const,
        badge: "Emergency SOS",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-300 font-extrabold",
      };
    }

    if (t === "BOARD" || t === "ONBOARD" || ttl.includes("boarded") || ttl.includes("boarding")) {
      return {
        icon: CheckCircle2,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-50 border-emerald-200",
        category: "BOARDING" as const,
        badge: "Boarded",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold",
      };
    }

    if (t === "OFFBOARD" || ttl.includes("deboarded") || ttl.includes("dropped")) {
      return {
        icon: CheckCircle2,
        iconColor: "text-slate-600",
        iconBg: "bg-slate-100 border-slate-200",
        category: "BOARDING" as const,
        badge: "Deboarded",
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      };
    }

    if (t === "FLEET_TRANSFER" || ttl.includes("transfer")) {
      return {
        icon: ArrowRightLeft,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50 border-blue-200",
        category: "INCIDENTS" as const,
        badge: "Fleet Transfer",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }

    if (t === "OVERSPEEDING" || ttl.includes("speed")) {
      return {
        icon: AlertTriangle,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50 border-amber-200",
        category: "INCIDENTS" as const,
        badge: "Speed Warning",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      };
    }

    return {
      icon: Clock,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100 border-slate-200",
      category: "INCIDENTS" as const,
      badge: "Notice",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    };
  };

  // Unified list of alerts merged and deduplicated
  const unifiedAlerts = useMemo(() => {
    const list: FormattedAlertItem[] = [];
    const seenKeys = new Set<string>();

    // 1. Process Live WebSocket Events
    liveEvents.forEach((evt, idx) => {
      // Ignore internal system handshake pings
      if (evt.type === "CONNECTION_ESTABLISHED" || evt.type === "PARENT_CHANNEL_CONNECTED" || evt.type === "BUS_TELEMETRY") {
        return;
      }

      const rawData = evt.data || {};
      const title = evt.title || rawData.title || (evt.type === "ATTENDANCE_EVENT" ? "Student Attendance Update" : "Fleet Safety Notice");
      const description = typeof rawData === "string" ? rawData : rawData.description || rawData.message || (evt.type === "ATTENDANCE_EVENT" ? `${rawData.studentName || "Student"} ${rawData.eventType === "BOARD" ? "boarded" : "deboarded"} ${rawData.busNumber || "bus"}` : "Live fleet notification received.");
      const busNumber = rawData.busNumber || rawData.bus_number;
      const type = rawData.type || evt.type || "ALERT";
      const severity = rawData.severity || "HIGH";
      const timestamp = rawData.timestamp || "Just Now";

      const key = `${title.toLowerCase().trim()}_${description.toLowerCase().trim()}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        const styles = getAlertStyles(type, severity, title);
        list.push({
          id: `live-${idx}-${Date.now()}`,
          title,
          description,
          timestamp,
          category: styles.category,
          type,
          busNumber,
          icon: styles.icon,
          iconColor: styles.iconColor,
          iconBg: styles.iconBg,
          badge: busNumber ? `${busNumber} • ${styles.badge}` : styles.badge,
          badgeColor: styles.badgeColor,
          isLive: true,
        });
      }
    });

    // 2. Process DB / Seed Alerts
    allAlerts.forEach((a) => {
      const title = a.title || "Safety Broadcast";
      const description = a.description || "Transport safety notice.";
      const key = `${title.toLowerCase().trim()}_${description.toLowerCase().trim()}`;

      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        const styles = getAlertStyles(a.type, a.severity, title);
        list.push({
          id: a.id,
          title,
          description,
          timestamp: a.timestamp || "Recent Broadcast",
          category: styles.category,
          type: a.type || "ALERT",
          busNumber: a.busNumber,
          icon: styles.icon,
          iconColor: styles.iconColor,
          iconBg: styles.iconBg,
          badge: a.busNumber ? `${a.busNumber} • ${styles.badge}` : styles.badge,
          badgeColor: styles.badgeColor,
        });
      }
    });

    // 3. Baseline School Transit Logs
    const baselineItems = [
      {
        id: "base-01",
        title: "Child Safely Boarded Bus",
        description: `${currentStudent.name} boarded ${currentStudent.busNumber} at designated stop via Face Biometrics.`,
        timestamp: "07:18 AM Today",
        type: "BOARD",
        severity: "INFO",
      },
      {
        id: "base-02",
        title: "Planned Fleet Maintenance Notice",
        description: `Bus #02 students scheduled on Bus #08 for evening return due to planned AC servicing.`,
        timestamp: "Yesterday, 02:15 PM",
        type: "FLEET_TRANSFER",
        severity: "INFO",
      },
      {
        id: "base-03",
        title: "Child Dropped Home Safely",
        description: `${currentStudent.name} safely deboarded at designated home stop. Conductor confirmed handoff.`,
        timestamp: "19 Sep, 03:15 PM",
        type: "OFFBOARD",
        severity: "INFO",
      },
    ];

    baselineItems.forEach((b) => {
      const key = `${b.title.toLowerCase().trim()}_${b.description.toLowerCase().trim()}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        const styles = getAlertStyles(b.type, b.severity, b.title);
        list.push({
          id: b.id,
          title: b.title,
          description: b.description,
          timestamp: b.timestamp,
          category: styles.category,
          type: b.type,
          icon: styles.icon,
          iconColor: styles.iconColor,
          iconBg: styles.iconBg,
          badge: styles.badge,
          badgeColor: styles.badgeColor,
        });
      }
    });

    return list;
  }, [liveEvents, allAlerts, currentStudent]);

  // Filter based on active filter button
  const filteredAlerts = unifiedAlerts.filter((a) => {
    if (selectedFilter === "ALL") return true;
    return a.category === selectedFilter;
  });

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* 1. CONNECT WITH SCHOOL ADMIN / TRANSPORT HELPDESK */}
      <div className="rounded-3xl bg-black text-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              School Transport Control Desk
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            24/7 Live Desk
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Need assistance or wish to report a safety concern? Directly connect with the School Transport Control Room.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="tel:+919811200999"
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-black" />
            <span>Call Admin</span>
          </a>

          <a
            href="https://wa.me/919811200999?text=Hello%20School%20Transport%20Office,%20I%20am%20a%20parent%20seeking%20transit%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-700"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Admin</span>
          </a>
        </div>
      </div>

      {/* 2. FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setSelectedFilter("ALL")}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap flex-shrink-0 ${
            selectedFilter === "ALL"
              ? "bg-black text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Activity ({unifiedAlerts.length})
        </button>
        <button
          onClick={() => setSelectedFilter("EMERGENCY")}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
            selectedFilter === "EMERGENCY"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>🚨 Emergency SOS</span>
        </button>
        <button
          onClick={() => setSelectedFilter("BOARDING")}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap flex-shrink-0 ${
            selectedFilter === "BOARDING"
              ? "bg-black text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Boarding Logs
        </button>
        <button
          onClick={() => setSelectedFilter("INCIDENTS")}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap flex-shrink-0 ${
            selectedFilter === "INCIDENTS"
              ? "bg-black text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Transfers &amp; Delays
        </button>
      </div>

      {/* 3. ALERTS TIMELINE LIST (Clean, Modern, Human-Readable Cards) */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center border border-slate-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-800">No Alerts in this Category</h4>
            <p className="text-[11px] text-slate-500">All bus routes and student transit operations are running smoothly.</p>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => {
            const Icon = alert.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm space-y-2.5 transition-all hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center flex-shrink-0 ${alert.iconBg}`}>
                      <Icon className={`w-4 h-4 ${alert.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {alert.title}
                        </h4>
                        {alert.isLive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Event" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] border flex-shrink-0 ${alert.badgeColor}`}
                  >
                    {alert.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-11">
                  {alert.description}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
