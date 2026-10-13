"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  ShieldCheck,
  UserCheck,
  Sparkles,
  AlertCircle,
  FileText,
  ChevronRight,
  Bus as BusIcon,
} from "lucide-react";
import { Student } from "../../data/enterpriseMockData";

interface AttendanceTabProps {
  currentStudent: Student;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ currentStudent }) => {
  const [absenceMarked, setAbsenceMarked] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("Medical Leave");
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);

  return (
    <div className="space-y-4 pb-20">
      {/* Student Biometric Identity Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{currentStudent.name}</h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {currentStudent.busNumber}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Roll No: <strong className="text-slate-200 font-mono">{currentStudent.rollNo}</strong> • {currentStudent.grade}-{currentStudent.section}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>512-D Neural Biometric Face Registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Transit Status Card */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Today&apos;s Biometric Logs
            </h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            {currentStudent.status === "BOARDED" ? "🟢 ON BUS" : "⚪ NOT ON ROUTE"}
          </span>
        </div>

        {/* Morning Shift */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Morning Pickup Check-In</div>
              <div className="text-[10px] text-slate-400">
                Verified at <strong>07:18 AM</strong> • Stop Gate 2
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">
            99.8% Match
          </span>
        </div>

        {/* Evening Shift */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Evening Return Drop-Off</div>
              <div className="text-[10px] text-slate-500">
                Scheduled at <strong>02:45 PM</strong> • Stop Gate 2
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
            Pending
          </span>
        </div>
      </div>

      {/* Mark Absence Quick Action Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Leave / Absence Request</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Notify bus driver and conductor in advance if student is not taking bus
            </p>
          </div>
        </div>

        {absenceMarked ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Absence marked for today ({absenceReason})</span>
            </div>
            <button
              onClick={() => setAbsenceMarked(false)}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={absenceReason}
              onChange={(e) => setAbsenceReason(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="Medical Leave">Medical / Sick Leave</option>
              <option value="Personal Family Work">Personal Family Event</option>
              <option value="Self Pickup by Parent">Parent Self Pickup</option>
            </select>

            <button
              onClick={() => setAbsenceMarked(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all active:scale-95"
            >
              Submit Leave
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
