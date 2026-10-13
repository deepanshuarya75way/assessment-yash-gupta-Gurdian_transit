"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import EnterpriseAdminConsole from "../../components/admin/EnterpriseAdminConsole";
import { AdminLoginView } from "../../components/auth/AdminLoginView";

export default function AdminPage() {
  const { adminUser, isAdminAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            Loading Super Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated as Admin, show dedicated White 3D Admin Login
  if (!isAdminAuthenticated || !adminUser) {
    return <AdminLoginView />;
  }

  return <EnterpriseAdminConsole />;
}
