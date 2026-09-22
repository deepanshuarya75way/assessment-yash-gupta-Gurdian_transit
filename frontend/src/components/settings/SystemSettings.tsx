"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Cpu,
  Database,
  Shield,
  School,
  Save,
  CheckCircle2,
  Gauge,
  MapPin,
  Lock,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  Radio,
  UserCheck,
  Building,
  Key,
} from "lucide-react";
import { Badge } from "../ui/Badge";

interface SystemSettingsProps {
  onResetDatabase?: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ onResetDatabase }) => {
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "telematics" | "security">("general");

  // General School Settings
  const [schoolName, setSchoolName] = useState("ABES Business School");
  const [campusAddress, setCampusAddress] = useState("NH-09 (NH-24), Near Lal Kuan, Crossings Republik, Ghaziabad, UP 201009");
  const [morningStartTime, setMorningStartTime] = useState("08:00 AM");
  const [eveningCloseTime, setEveningCloseTime] = useState("03:30 PM");
  const [dispatchPhone, setDispatchPhone] = useState("+91 120 713 5112");
  const [adminEmail, setAdminEmail] = useState("transport.admin@abes.ac.in");

  // AI Biometric Engine Settings
  const [confidenceThreshold, setConfidenceThreshold] = useState("85");
  const [livenessDetection, setLivenessDetection] = useState(true);
  const [autoRetryScans, setAutoRetryScans] = useState(true);
  const [maxRetries, setMaxRetries] = useState("3");
  const [biometricModel, setBiometricModel] = useState("ArcFace 512-D Vision Model");

  // Fleet Telematics & Safety Rules
  const [speedLimit, setSpeedLimit] = useState("45");
  const [geofenceRadius, setGeofenceRadius] = useState("150");
  const [idleTimeout, setIdleTimeout] = useState("5");
  const [pingInterval, setPingInterval] = useState("3");

  // Security & Admin Profile
  const [adminName, setAdminName] = useState("Principal Administrator");
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // Status feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("guardian_system_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.schoolName) setSchoolName(parsed.schoolName);
        if (parsed.campusAddress) setCampusAddress(parsed.campusAddress);
        if (parsed.dispatchPhone) setDispatchPhone(parsed.dispatchPhone);
        if (parsed.adminEmail) setAdminEmail(parsed.adminEmail);
        if (parsed.confidenceThreshold) setConfidenceThreshold(parsed.confidenceThreshold);
        if (parsed.speedLimit) setSpeedLimit(parsed.speedLimit);
        if (parsed.geofenceRadius) setGeofenceRadius(parsed.geofenceRadius);
      }
    } catch {
      // fallback
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const configData = {
      schoolName,
      campusAddress,
      morningStartTime,
      eveningCloseTime,
      dispatchPhone,
      adminEmail,
      confidenceThreshold,
      livenessDetection,
      autoRetryScans,
      maxRetries,
      biometricModel,
      speedLimit,
      geofenceRadius,
      idleTimeout,
      pingInterval,
      adminName,
      twoFactorAuth,
    };

    try {
      localStorage.setItem("guardian_system_settings", JSON.stringify(configData));
    } catch {
      // storage
    }

    triggerToast("System configuration saved successfully!");
  };

  const handleExportBackup = () => {
    const backupData = {
      schoolName,
      campusAddress,
      dispatchPhone,
      confidenceThreshold,
      speedLimit,
      timestamp: new Date().toISOString(),
      version: "2.4.0-enterprise",
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guardian_transit_config_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast("Configuration backup JSON exported!");
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset all parameters to system defaults?")) {
      setSchoolName("Apex International Academy");
      setCampusAddress("Plot 12, Sector 62, Indirapuram, Delhi-NCR");
      setMorningStartTime("08:00 AM");
      setEveningCloseTime("03:15 PM");
      setDispatchPhone("+91 11 2890 4455");
      setConfidenceThreshold("85");
      setSpeedLimit("45");
      setGeofenceRadius("150");
      setIdleTimeout("5");
      setLivenessDetection(true);
      if (onResetDatabase) {
        onResetDatabase();
      }
      try {
        localStorage.removeItem("guardian_system_settings");
      } catch {}
      triggerToast("System settings reset to default values!");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">
              System Control &amp; Platform Settings
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure school parameters, AI biometric vision engine, fleet safety rules, and administrative access
          </p>
        </div>

        {toastMessage && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-full animate-bounce shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {toastMessage}
          </span>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "general"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <School className="w-4 h-4" />
          <span>School &amp; Campus Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "ai"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Biometrics Vision Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("telematics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "telematics"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Fleet Safety &amp; GPS Telematics</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "security"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security &amp; Data Backup</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 1. GENERAL SCHOOL SETTINGS */}
        {activeTab === "general" && (
          <div className="clean-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-5 h-5 text-slate-800" />
              <h3 className="font-bold text-slate-900 text-base">Institution &amp; Transport Hub Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  School / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Transport Helpdesk Hotline *
                </label>
                <input
                  type="text"
                  required
                  value={dispatchPhone}
                  onChange={(e) => setDispatchPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campus Main Gate Address
                </label>
                <input
                  type="text"
                  value={campusAddress}
                  onChange={(e) => setCampusAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Morning School Arrival Time
                </label>
                <input
                  type="text"
                  value={morningStartTime}
                  onChange={(e) => setMorningStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Evening School Departure Time
                </label>
                <input
                  type="text"
                  value={eveningCloseTime}
                  onChange={(e) => setEveningCloseTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. AI BIOMETRIC VISION SETTINGS */}
        {activeTab === "ai" && (
          <div className="clean-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Cpu className="w-5 h-5 text-slate-800" />
              <h3 className="font-bold text-slate-900 text-base">ArcFace Biometrics &amp; Vision Engine</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Face Match Confidence Cutoff Threshold ({confidenceThreshold}%)
                </label>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(e.target.value)}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>60% (Lenient)</span>
                  <span className="font-bold text-slate-900">{confidenceThreshold}% Recommended</span>
                  <span>98% (Strict)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Scans with similarity score &ge; <strong>{confidenceThreshold}%</strong> are automatically verified as boarding entries.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Active Vision Engine Architecture
                </label>
                <select
                  value={biometricModel}
                  onChange={(e) => setBiometricModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ArcFace 512-D Vision Model">ArcFace ResNet-50 (512-D Embeddings)</option>
                  <option value="MobileFaceNet Edge AI">MobileFaceNet Edge (Fast Real-Time)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={livenessDetection}
                  onChange={(e) => setLivenessDetection(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Anti-Spoofing &amp; Live Blink Verification
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Prevents photo and screen spoofing by validating 3D facial depth and eyelid movement.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRetryScans}
                  onChange={(e) => setAutoRetryScans(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Automatic Multi-Angle Frame Sampling
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Takes 3 rapid frames per student when boarding in motion to ensure optimal match accuracy.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 3. FLEET SAFETY & GPS TELEMATICS SETTINGS */}
        {activeTab === "telematics" && (
          <div className="clean-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Gauge className="w-5 h-5 text-slate-800" />
              <h3 className="font-bold text-slate-900 text-base">Fleet Safety Rules &amp; GPS Telemetry</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  School Safety Buffer Speed Limit (km/h) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={speedLimit}
                    onChange={(e) => setSpeedLimit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                    km/h
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Speeding beyond <strong>{speedLimit} km/h</strong> automatically flags a safety alert.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Route Corridor Deviation Buffer (meters) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={geofenceRadius}
                    onChange={(e) => setGeofenceRadius(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                    meters
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Deviation greater than <strong>{geofenceRadius}m</strong> triggers a geofence warning.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GPS Satellite Telemetry Ping Frequency
                </label>
                <select
                  value={pingInterval}
                  onChange={(e) => setPingInterval(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="1">High Frequency (Every 1 Second)</option>
                  <option value="3">Standard Telemetry (Every 3 Seconds)</option>
                  <option value="5">Battery Optimized (Every 5 Seconds)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unscheduled Halt Idle Timeout
                </label>
                <select
                  value={idleTimeout}
                  onChange={(e) => setIdleTimeout(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="3">3 Minutes</option>
                  <option value="5">5 Minutes (Recommended)</option>
                  <option value="10">10 Minutes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. SECURITY, DATA BACKUP & RESET */}
        {activeTab === "security" && (
          <div className="clean-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Shield className="w-5 h-5 text-slate-800" />
              <h3 className="font-bold text-slate-900 text-base">Security Credentials &amp; Database Controls</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrator Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Database & Data Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Database &amp; Storage Backup
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Config JSON Backup</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Factory Default Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Apply All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
