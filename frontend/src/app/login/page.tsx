"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Bus, Sparkles } from "lucide-react";
import { AdminLoginView } from "../../components/auth/AdminLoginView";
import { ParentLoginView } from "../../components/auth/ParentLoginView";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "PARENT">("ADMIN");

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col font-sans select-none relative">
      {/* Top Floating Role Switcher Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className="p-1 rounded-2xl bg-white/90 border border-slate-200 shadow-xl backdrop-blur-md flex items-center gap-1">
          <button
            onClick={() => setSelectedRole("ADMIN")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "ADMIN"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-black hover:bg-slate-50"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>

          <button
            onClick={() => setSelectedRole("PARENT")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "PARENT"
                ? "bg-black text-white shadow-xs"
                : "text-slate-600 hover:text-black hover:bg-slate-50"
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Parent Portal</span>
          </button>
        </div>
      </div>

      {/* Main Form View */}
      {selectedRole === "ADMIN" ? (
        <AdminLoginView onSuccess={() => router.push("/admin")} />
      ) : (
        <ParentLoginView onSuccess={() => router.push("/parent")} />
      )}
    </div>
  );
}
