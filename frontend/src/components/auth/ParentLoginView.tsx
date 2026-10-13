"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bus, KeyRound, Phone, Mail, ArrowRight, AlertCircle, ShieldCheck, Heart } from "lucide-react";
import { useAuth, DEMO_PERSONAS } from "../../context/AuthContext";

interface ParentLoginViewProps {
  onSuccess?: () => void;
}

export const ParentLoginView: React.FC<ParentLoginViewProps> = ({ onSuccess }) => {
  const { loginParent, loginAsDemo, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const result = await loginParent(identifier, password);
    setSubmitting(false);
    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.error || "Authentication failed. Please verify your registered details.");
    }
  };

  const handleDemoClick = async (personaId: string) => {
    setSubmitting(true);
    setErrorMsg(null);
    const success = await loginAsDemo(personaId);
    setSubmitting(false);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between items-center relative overflow-hidden font-sans select-none p-3 sm:p-6">
      {/* 3D Ambient Background Lights */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-b from-sky-200/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-t from-emerald-100/40 via-teal-100/20 to-transparent blur-3xl pointer-events-none" />

      {/* Top Status */}
      <header className="w-full max-w-[420px] pt-3 pb-2 flex items-center justify-between z-10 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span>Guardian Transit Parent Mesh</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
          <ShieldCheck className="w-3 h-3" />
          <span>Encrypted Gateway</span>
        </div>
      </header>

      {/* Main Mobile App Card Frame */}
      <main className="w-full max-w-[420px] z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-[36px] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Top Decorative Pill */}
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

          {/* 3D Animated Bus Shield Badge */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mx-auto shadow-xl shadow-black/10 mb-3 ring-4 ring-slate-100"
            >
              <Bus className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Parent Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Track your child&apos;s daily bus commute, stops &amp; safety alerts
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Mobile or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 7897727565 or vinay.gupta@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Security PIN / Password</label>
                <span className="text-[11px] text-slate-500 font-medium">e.g. GT-8423</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="GT-XXXX"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 transition-all font-mono uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full py-3 rounded-2xl bg-black hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Parent Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Profiles */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-1">
              ⚡ 1-Click Quick Parent Login
            </div>

            {DEMO_PERSONAS.filter((p) => p.role === "PARENT").map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleDemoClick(persona.id)}
                disabled={submitting}
                className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={persona.avatar}
                    alt={persona.label}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-black">
                      {persona.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">{persona.subLabel}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-black text-white text-[9px] font-bold">
                  Enter →
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[420px] py-2 text-center text-[11px] text-slate-400 font-medium z-10 flex items-center justify-center gap-1.5">
        <span>Guardian Transit</span>
        <span>•</span>
        <span>Dedicated Parent Application</span>
      </footer>
    </div>
  );
};
