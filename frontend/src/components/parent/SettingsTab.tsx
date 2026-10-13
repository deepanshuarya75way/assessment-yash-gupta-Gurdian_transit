"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  KeyRound,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Smartphone,
  Info,
} from "lucide-react";
import { AuthUser } from "../../context/AuthContext";

interface SettingsTabProps {
  user: AuthUser;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ user, onLogout }) => {
  const [showPin, setShowPin] = useState(false);
  const [notifyBoarding, setNotifyBoarding] = useState(true);
  const [notifyDelay, setNotifyDelay] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  const parentData = user.parentData || {
    name: user.name,
    email: user.email,
    phone: user.phone || "+91 98112 01001",
    address: "Ghaziabad, Uttar Pradesh",
    password: "••••",
  };

  const pinDisplay = parentData.password || "GT-5921";

  return (
    <div className="space-y-4 pb-20">
      {/* 1. PARENT PROFILE CARD */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black text-white font-bold flex items-center justify-center text-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered Parent Account
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2 text-slate-400">
              <Mail className="w-3.5 h-3.5" /> Email:
            </span>
            <strong className="text-slate-900">{user.email}</strong>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5" /> Mobile:
            </span>
            <strong className="text-slate-900">{user.phone || parentData.phone}</strong>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5" /> Address:
            </span>
            <strong className="text-slate-900 truncate max-w-[180px]">{parentData.address}</strong>
          </div>
        </div>
      </div>

      {/* 2. SECURITY PIN CREDENTIALS */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 text-xs font-bold">
            <KeyRound className="w-4 h-4 text-slate-900" />
            <span>School-Issued Portal PIN</span>
          </div>
          <button
            onClick={() => setShowPin(!showPin)}
            className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1"
          >
            {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPin ? "Hide" : "Show"}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Security Login PIN</span>
          <span className="font-mono font-extrabold text-sm tracking-wider text-slate-900">
            {showPin ? pinDisplay : "••••••"}
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          This PIN is assigned by the school transport office for secure parent login.
        </p>
      </div>

      {/* 3. NOTIFICATION PREFERENCES */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1 border-b border-slate-100">
          <Bell className="w-4 h-4 text-slate-900" />
          <span>Alert Preferences</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 font-medium">Child Boarding &amp; Drop Pings</span>
            <input
              type="checkbox"
              checked={notifyBoarding}
              onChange={(e) => setNotifyBoarding(e.target.checked)}
              className="w-4 h-4 accent-black rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 font-medium">Bus Delay &amp; Breakdown Alerts</span>
            <input
              type="checkbox"
              checked={notifyDelay}
              onChange={(e) => setNotifyDelay(e.target.checked)}
              className="w-4 h-4 accent-black rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 font-medium">WhatsApp Notification Backup</span>
            <input
              type="checkbox"
              checked={notifyWhatsapp}
              onChange={(e) => setNotifyWhatsapp(e.target.checked)}
              className="w-4 h-4 accent-black rounded"
            />
          </label>
        </div>
      </div>

      {/* 4. SCHOOL HELPDESK INFO */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-2 text-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Shield className="w-4 h-4 text-slate-900" />
          <span>School Information &amp; Support</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          ABES Business School Transit Wing • Lal Kuan, Ghaziabad, UP.
          <br />
          Helpline: <strong>+91 98112 00999</strong> • transport@abes.edu.in
        </p>
      </div>

      {/* 5. LOGOUT ACTION */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-600 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Parent Account</span>
        </button>
      </div>
    </div>
  );
};
