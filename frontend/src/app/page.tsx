"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Bus, Camera, ArrowRight, Sparkles, CheckCircle2, Navigation } from "lucide-react";

export default function RootGateway() {
  const portals = [
    {
      id: "admin",
      title: "Super Admin Console",
      subtitle: "Enterprise Operations & Fleet",
      desc: "Full school control center: live route map, CCTV AI biometrics, student directory, SOS safety anomalies & telemetry.",
      href: "/admin",
      icon: Shield,
      badge: "Port :3000 /admin",
      color: "bg-slate-900 text-white hover:bg-black",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "parent",
      title: "Parent Mobile Portal",
      subtitle: "Live Child Transit App",
      desc: "Minimalist mobile app: live bus location, stop milestones, instant WhatsApp cohort contact & biometric boarding notifications.",
      href: "/parent",
      icon: Bus,
      badge: "Port :3000 /parent",
      color: "bg-black text-white hover:bg-slate-800",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "bus",
      title: "Bus Camera Terminal",
      subtitle: "AI Face Recognition Boarding",
      desc: "Mounted vehicle scanner: 512-d ArcFace recognition, TTS voice confirmations, wrong bus detection & automatic parent alerts.",
      href: "/bus-terminal",
      icon: Camera,
      badge: "Port :3000 /bus-terminal",
      color: "bg-slate-900 text-white hover:bg-black",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between select-none font-sans relative overflow-hidden">
      {/* 3D Floating Ambient Halos */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-100/60 via-sky-100/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-emerald-100/60 via-teal-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                GUARDIAN TRANSIT AI
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-slate-100 text-slate-700 rounded border border-slate-200">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous School Transit &amp; Biometric Safety Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PostgreSQL Active</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>3 Independent Dedicated Enterprise Dashboards</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Select Your Transit Portal
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Each portal operates in complete isolation with dedicated authentication, live PostgreSQL database sync, and zero cross-role conflicts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
              >
                <Link
                  href={p.href}
                  className="h-full flex flex-col justify-between p-7 rounded-[32px] bg-white border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-black">
                        {p.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        {p.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-900 mt-4">
                    <span>Launch Portal</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium relative z-10 gap-2">
        <div>Guardian Transit AI • 3-Tier Enterprise Safety Architecture</div>
        <div>PostgreSQL • FastAPI 2.0 • Next.js 14</div>
      </footer>
    </div>
  );
}
