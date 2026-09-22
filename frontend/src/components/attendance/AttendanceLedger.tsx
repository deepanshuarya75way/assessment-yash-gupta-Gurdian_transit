"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Bus as BusIcon,
  Clock,
  Zap,
  Plus,
  Users,
  ShieldCheck,
  ArrowUpDown,
  MapPin,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AttendanceRecord, Bus, Student } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";
import { ManualAttendanceModal } from "./ManualAttendanceModal";

interface AttendanceLedgerProps {
  attendanceRecords: AttendanceRecord[];
  buses: Bus[];
  students: Student[];
  onAddAttendanceRecord?: (record: AttendanceRecord) => void;
}

export const AttendanceLedger: React.FC<AttendanceLedgerProps> = ({
  attendanceRecords,
  buses,
  students,
  onAddAttendanceRecord,
}) => {
  const [search, setSearch] = useState("");
  const [selectedBusFilter, setSelectedBusFilter] = useState("ALL");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Overall Global Fleet Attendance Metrics
  const totalAssignedStudents = buses.reduce((acc, b) => acc + (b.totalAssignedStudents || b.capacity || 30), 0);
  const totalBoardedToday = buses.reduce((acc, b) => acc + (b.insideBusCount || 0) + (b.offboardedCount || 0), 0);
  const currentlyInsideTransit = buses.reduce((acc, b) => acc + (b.insideBusCount || 0), 0);
  const totalDroppedOffboarded = buses.reduce((acc, b) => acc + (b.offboardedCount || 0), 0);
  const attendancePercentage = totalAssignedStudents > 0 ? Math.round((totalBoardedToday / totalAssignedStudents) * 100) : 0;

  const filtered = attendanceRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(search.toLowerCase()) ||
      rec.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      rec.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      (rec.stopLocation && rec.stopLocation.toLowerCase().includes(search.toLowerCase()));

    const matchesBus = selectedBusFilter === "ALL" ? true : rec.busNumber === selectedBusFilter;
    const matchesEvent = eventFilter === "ALL" ? true : rec.eventType === eventFilter;
    const matchesMethod = methodFilter === "ALL" ? true : rec.verificationMethod === methodFilter;

    return matchesSearch && matchesBus && matchesEvent && matchesMethod;
  });

  // Export CSV Handler
  const handleExportCsv = () => {
    const headers = [
      "Record ID",
      "Student Name",
      "Roll No",
      "Grade",
      "Bus Number",
      "Transit Event",
      "Timestamp",
      "Verification Method",
      "Confidence Score (%)",
      "Stop Location",
    ];

    const rows = filtered.map((r) => [
      r.id,
      `"${r.studentName}"`,
      r.rollNo,
      r.grade,
      r.busNumber,
      r.eventType,
      r.timestamp,
      `"${r.verificationMethod}"`,
      r.confidence,
      `"${r.stopLocation || "Main Corridor"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fleet_attendance_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRecordNew = (record: AttendanceRecord) => {
    if (onAddAttendanceRecord) {
      onAddAttendanceRecord(record);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">
              AI Biometric Attendance &amp; Boarding Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              VISION AI ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric facial recognition attendance with live per-bus passenger occupancy tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Record Attendance</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Essential Real-Time Attendance KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned Students */}
        <div className="clean-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Assigned Fleet
            </span>
            <p className="text-xl font-extrabold text-slate-900 font-mono">{totalAssignedStudents}</p>
            <span className="text-[10px] text-slate-500 font-medium">Enrolled Students</span>
          </div>
        </div>

        {/* Total Boarded Today */}
        <div className="clean-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Boarded Today
            </span>
            <p className="text-xl font-extrabold text-emerald-700 font-mono">
              {totalBoardedToday} <span className="text-xs font-bold text-slate-400">/ {totalAssignedStudents}</span>
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">{attendancePercentage}% Present Rate</span>
          </div>
        </div>

        {/* Currently Inside Transit (Present in Bus Right Now) */}
        <div className="clean-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center flex-shrink-0">
            <BusIcon className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Present in Bus Now
            </span>
            <p className="text-xl font-extrabold text-sky-700 font-mono">{currentlyInsideTransit}</p>
            <span className="text-[10px] text-sky-600 font-bold">Inside Transit Active</span>
          </div>
        </div>

        {/* Total Dropped / Offboarded at Stops */}
        <div className="clean-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dropped at Stops
            </span>
            <p className="text-xl font-extrabold text-indigo-700 font-mono">{totalDroppedOffboarded}</p>
            <span className="text-[10px] text-slate-500 font-medium">Safely Offboarded</span>
          </div>
        </div>
      </div>

      {/* Real-Time Bus-Wise Live Passenger Occupancy Tracker Grid */}
      <div className="clean-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BusIcon className="w-4 h-4 text-slate-700" />
              <span>Live Bus-Wise Passenger Occupancy &amp; Drop Tracker</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click any bus to isolate and inspect its real-time student boarding status &amp; remaining passengers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBusFilter("ALL")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedBusFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              View All Buses
            </button>
          </div>
        </div>

        {/* Bus Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {buses.map((b) => {
            const isSelected = selectedBusFilter === b.busNumber;
            const assigned = b.totalAssignedStudents || b.capacity || 30;
            const inside = b.insideBusCount || 0;
            const dropped = b.offboardedCount || 0;
            const totalBoarded = inside + dropped;

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBusFilter(isSelected ? "ALL" : b.busNumber)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20"
                    : "bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm">{b.busNumber}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? "bg-white/20 text-slate-200" : "bg-slate-200 text-slate-700"
                    }`}>
                      {b.licensePlate}
                    </span>
                  </div>
                  <Badge variant={b.status === "ON_ROUTE" ? "success" : "neutral"}>
                    {b.status === "ON_ROUTE" ? "ON TRIP" : "IDLE"}
                  </Badge>
                </div>

                <p className={`text-[11px] truncate mb-3 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  {b.routeName}
                </p>

                {/* Real-Time Live Counts */}
                <div className="grid grid-cols-3 gap-1.5 text-center my-2 py-2 rounded-xl bg-black/10">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Assigned</span>
                    <span className="text-xs font-extrabold font-mono">{assigned}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 block">In Bus</span>
                    <span className="text-xs font-extrabold font-mono text-emerald-500">{inside}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-indigo-400 block">Dropped</span>
                    <span className="text-xs font-extrabold font-mono text-indigo-400">{dropped}</span>
                  </div>
                </div>

                {/* Occupancy Progress Bar */}
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${assigned > 0 ? (inside / assigned) * 100 : 0}%` }}
                      title={`Inside Bus: ${inside}`}
                    />
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${assigned > 0 ? (dropped / assigned) * 100 : 0}%` }}
                      title={`Dropped: ${dropped}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={isSelected ? "text-slate-300" : "text-slate-500"}>
                      Driver: <strong>{b.driverName}</strong>
                    </span>
                    <span className={isSelected ? "text-cyan-300 font-bold" : "text-slate-700 font-bold"}>
                      {inside} Remaining in Bus
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="clean-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, roll no, stop..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Dynamic Bus Filter */}
          <select
            value={selectedBusFilter}
            onChange={(e) => setSelectedBusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none"
          >
            <option value="ALL">All Fleet Buses ({buses.length})</option>
            {buses.map((b) => (
              <option key={b.id} value={b.busNumber}>
                {b.busNumber} ({b.licensePlate}) - {b.insideBusCount || 0} in bus
              </option>
            ))}
          </select>

          {/* Event Filter */}
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none"
          >
            <option value="ALL">All Transit Events</option>
            <option value="BOARD">🟢 Boarded (Pickup)</option>
            <option value="OFFBOARD">🔵 Dropped / Offboarded</option>
          </select>

          {/* Verification Method Filter with RFID Coming Soon Badge */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none"
          >
            <option value="ALL">All Verification Methods</option>
            <option value="AI Face Biometrics">AI Face Biometrics (Active CV)</option>
            <option value="Manual Override">Manual Driver Override</option>
            <option value="RFID Smart Card" disabled>
              🔒 RFID Smart Card (Coming Soon)
            </option>
          </select>
        </div>
      </div>

      {/* Attendance Ledger Table */}
      <div className="clean-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 min-w-[200px]">Student Profile</th>
                <th className="px-5 py-3.5 min-w-[150px] whitespace-nowrap">Assigned Bus &amp; Stop</th>
                <th className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">Transit Action</th>
                <th className="px-5 py-3.5 min-w-[130px] whitespace-nowrap">Time &amp; Shift</th>
                <th className="px-5 py-3.5 min-w-[180px] whitespace-nowrap">Verification Pipeline</th>
                <th className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">Biometric Match Score</th>
                <th className="px-5 py-3.5 min-w-[120px] text-right whitespace-nowrap">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Student Profile */}
                  <td className="px-5 py-3.5 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={record.photoUrl}
                        alt={record.studentName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{record.studentName}</p>
                        <p className="font-mono text-[10px] text-slate-400 font-bold">
                          {record.rollNo} • {record.grade}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Bus & Stop Location */}
                  <td className="px-5 py-3.5 min-w-[150px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <BusIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{record.busNumber}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {record.stopLocation || "Indirapuram Corridor"}
                    </span>
                  </td>

                  {/* Event */}
                  <td className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">
                    <Badge
                      variant={record.eventType === "BOARD" ? "success" : "info"}
                      pulse={record.eventType === "BOARD"}
                    >
                      {record.eventType === "BOARD" ? "🟢 BOARDED" : "🔵 DROPPED"}
                    </Badge>
                  </td>

                  {/* Timestamp & Shift */}
                  <td className="px-5 py-3.5 min-w-[130px] whitespace-nowrap">
                    <span className="font-mono font-bold text-xs text-slate-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {record.timestamp}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {record.shift || "Morning Pickup"}
                    </span>
                  </td>

                  {/* Verification Pipeline */}
                  <td className="px-5 py-3.5 min-w-[180px] whitespace-nowrap">
                    {record.verificationMethod === "AI Face Biometrics" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                        <Sparkles className="w-3 h-3 text-sky-600" />
                        <span>AI Vision Biometrics</span>
                      </span>
                    ) : record.verificationMethod === "RFID Smart Card" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>RFID (Preview)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Zap className="w-3 h-3 text-slate-600" />
                        <span>Manual Override</span>
                      </span>
                    )}
                  </td>

                  {/* Biometric Match Score */}
                  <td className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-emerald-700 text-xs">
                        {record.confidence}%
                      </span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${record.confidence}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Current Status */}
                  <td className="px-5 py-3.5 text-right min-w-[120px] whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      record.eventType === "BOARD"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{record.eventType === "BOARD" ? "IN TRANSIT" : "OFFBOARDED"}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Attendance Modal */}
      <ManualAttendanceModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        students={students}
        buses={buses}
        onRecordAttendance={handleRecordNew}
      />
    </div>
  );
};
