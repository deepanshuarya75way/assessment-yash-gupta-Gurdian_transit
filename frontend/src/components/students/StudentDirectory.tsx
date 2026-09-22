"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Scan,
  UserPlus,
  Bus,
} from "lucide-react";
import { Student } from "../../data/mockData";
import { Badge } from "../ui/Badge";

interface StudentDirectoryProps {
  students: Student[];
  onOpenRegisterModal: () => void;
  searchQuery: string;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  onOpenRegisterModal,
  searchQuery,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedBus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" ? true : s.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Student Biometric &amp; Transit Directory
          </h2>
          <p className="text-xs text-slate-400">
            Real-time transit states &amp; 512-d facial embedding enrollment status
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
            {["ALL", "BOARDED", "WAITING", "OFFBOARDED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === st
                    ? "bg-cyan-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Register Face Action Button */}
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
          >
            <Scan className="w-4 h-4" />
            <span>Enroll Biometrics</span>
          </button>
        </div>
      </div>

      {/* Student Data Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs uppercase font-bold text-slate-400 border-b border-white/10">
            <tr>
              <th className="px-5 py-4">Student Profile</th>
              <th className="px-5 py-4">Grade &amp; ID</th>
              <th className="px-5 py-4">Assigned Route</th>
              <th className="px-5 py-4">Transit Status</th>
              <th className="px-5 py-4">Biometrics</th>
              <th className="px-5 py-4">Parent Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-950/40 font-medium">
            {filteredStudents.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-4 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.avatarUrl}
                    alt={s.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{s.name}</p>
                    <p className="text-xs text-slate-400">Last: {s.lastCheckinTime}</p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold text-white">{s.grade} - {s.section}</span>
                  <p className="font-mono text-xs text-cyan-300">{s.studentIdNumber}</p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-200">
                    <Bus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{s.assignedBus}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <Badge
                    variant={
                      s.status === "BOARDED"
                        ? "success"
                        : s.status === "WAITING"
                        ? "warning"
                        : "neutral"
                    }
                    pulse={s.status === "BOARDED"}
                  >
                    {s.status}
                  </Badge>
                </td>

                <td className="px-5 py-4">
                  {s.faceRegistered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      512-d Synced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Clock className="w-4 h-4" />
                      Unregistered
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-xs">
                  <p className="text-white font-medium">{s.parentName}</p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    {s.parentPhone}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-semibold text-slate-300">No students match search</p>
            <p className="text-xs mt-1">Try resetting filters or searching with another term.</p>
          </div>
        )}
      </div>
    </div>
  );
};
