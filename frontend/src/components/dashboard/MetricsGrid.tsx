"use client";

import React from "react";
import { Bus, Users, ShieldAlert, Zap, TrendingUp } from "lucide-react";
import { Card3D } from "../ui/Card3D";

interface MetricsGridProps {
  activeBusesCount: number;
  totalBusesCount: number;
  onboardStudentsCount: number;
  totalStudentsCount: number;
  criticalAlertCount: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  activeBusesCount,
  totalBusesCount,
  onboardStudentsCount,
  totalStudentsCount,
  criticalAlertCount,
}) => {
  const metrics = [
    {
      title: "Active Fleet On-Route",
      value: `${activeBusesCount} / ${totalBusesCount}`,
      subtitle: "Buses running morning dispatch",
      progress: Math.round((activeBusesCount / totalBusesCount) * 100),
      icon: Bus,
      glowColor: "cyan" as const,
      trend: "+100% on schedule",
    },
    {
      title: "Students Transit Status",
      value: `${onboardStudentsCount} / ${totalStudentsCount}`,
      subtitle: "Verified biometric boardings",
      progress: Math.round((onboardStudentsCount / totalStudentsCount) * 100),
      icon: Users,
      glowColor: "emerald" as const,
      trend: "83% total checked-in",
    },
    {
      title: "Active Safety Anomalies",
      value: criticalAlertCount.toString(),
      subtitle: criticalAlertCount > 0 ? "Requires dispatcher review" : "Zero active safety threats",
      progress: criticalAlertCount > 0 ? 100 : 0,
      icon: ShieldAlert,
      glowColor: criticalAlertCount > 0 ? ("rose" as const) : ("emerald" as const),
      trend: criticalAlertCount > 0 ? "1 Critical Anomaly" : "All routes safe",
    },
    {
      title: "AI Recognition Precision",
      value: "99.4%",
      subtitle: "Cosine distance threshold < 0.40",
      progress: 99,
      icon: Zap,
      glowColor: "purple" as const,
      trend: "ArcFace 512-d active",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card3D key={idx} glowColor={m.glowColor} className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {m.title}
                </p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {m.value}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              {/* Mini Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${m.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{m.subtitle}</span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {m.trend}
                </span>
              </div>
            </div>
          </Card3D>
        );
      })}
    </div>
  );
};
