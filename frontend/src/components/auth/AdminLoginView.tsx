"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Cpu, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminLoginViewProps {
  onSuccess?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess }) => {
  const { loginAdmin, loginAsDemo, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const result = await loginAdmin(email, password);
    setSubmitting(false);
    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.error || "Invalid administrator credentials.");
    }
  };

  const handle1ClickDemo = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    const success = await loginAsDemo("admin-demo");
    setSubmitting(false);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* 3D Floating Geometric Gradient Lights */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 via-sky-200/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-slate-300/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Micro-Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                GUARDIAN TRANSIT
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-slate-900 text-white rounded-md">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Enterprise Fleet &amp; Biometric Safety Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">
            PostgreSQL DB Sync: Online
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[440px]"
        >
          <div className="rounded-[32px] bg-white/95 border border-slate-200/90 shadow-2xl p-7 sm:p-9 backdrop-blur-xl relative overflow-hidden">
            {/* Top Accent Light Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900" />

            {/* 3D Animated Floating Shield Icon */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xl shadow-slate-900/10 mb-3.5 ring-4 ring-slate-100"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Admin Command Center
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Enter your authorized school transport director credentials
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Administrator Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@guardiantransit.ai"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Master Password</label>
                  <span className="text-[11px] text-slate-500 font-medium">Confidential</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3 rounded-2xl bg-black hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Super Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Instant Demo Access */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span>⚡ 1-Click Quick Access</span>
                <span className="text-emerald-600 font-black">Pre-Authorized</span>
              </div>

              <button
                type="button"
                onClick={handle1ClickDemo}
                disabled={submitting}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    AD
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-black">
                      Yash Sharma (Director)
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      admin@guardiantransit.ai • Full Access
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-black text-white text-[10px] font-bold shadow-xs">
                  Instant Login →
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
        <div>Guardian Transit AI • Dedicated Admin Portal</div>
        <div className="flex items-center gap-3">
          <span>🔒 AES-256 Encrypted Session</span>
          <span>•</span>
          <span>PostgreSQL Active</span>
        </div>
      </footer>
    </div>
  );
};
