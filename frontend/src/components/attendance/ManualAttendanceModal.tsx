"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Student, AttendanceRecord, Bus } from "../../data/enterpriseMockData";
import { UserCheck, Bus as BusIcon, MapPin, Sparkles, CheckCircle2, Lock } from "lucide-react";

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  buses: Bus[];
  onRecordAttendance: (record: AttendanceRecord) => void;
}

export const ManualAttendanceModal: React.FC<ManualAttendanceModalProps> = ({
  isOpen,
  onClose,
  students,
  buses,
  onRecordAttendance,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [eventType, setEventType] = useState<"BOARD" | "OFFBOARD">("BOARD");
  const [verificationMethod, setVerificationMethod] = useState<
    "AI Face Biometrics" | "RFID Smart Card" | "Manual Override"
  >("AI Face Biometrics");
  const [stopLocation, setStopLocation] = useState("Sector 62 Crossing");

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      rollNo: selectedStudent.rollNo,
      grade: selectedStudent.grade,
      busNumber: selectedStudent.busNumber || "Bus #12",
      eventType,
      timestamp: timeString,
      confidence: verificationMethod === "Manual Override" ? 100 : 99.2,
      verificationMethod,
      status: "VERIFIED",
      photoUrl:
        selectedStudent.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      shift: "Morning Pickup",
      stopLocation,
    };

    onRecordAttendance(newRecord);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Attendance &amp; Passenger Boarding Check-in"
      subtitle="Record student boarding or stop dropoff event into the live transit ledger"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Student */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Student *
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo}) - {s.grade} • {s.busNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Student Preview Pill */}
        {selectedStudent && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStudent.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div>
                <p className="font-bold text-slate-900">{selectedStudent.name}</p>
                <p className="text-[11px] text-slate-500">
                  {selectedStudent.grade} • {selectedStudent.rollNo}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
              {selectedStudent.busNumber}
            </span>
          </div>
        )}

        {/* Transit Event Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Action *
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as "BOARD" | "OFFBOARD")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="BOARD">🟢 Boarded Bus (Pickup)</option>
              <option value="OFFBOARD">🔵 Dropped / Offboarded (Drop)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Verification Pipeline *
            </label>
            <select
              value={verificationMethod}
              onChange={(e) =>
                setVerificationMethod(
                  e.target.value as "AI Face Biometrics" | "RFID Smart Card" | "Manual Override"
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="AI Face Biometrics">AI Face Biometrics (Active CV)</option>
              <option value="Manual Override">Manual Driver / Staff Override</option>
              <option value="RFID Smart Card" disabled>
                🔒 RFID Smart Card (Coming Soon)
              </option>
            </select>
          </div>
        </div>

        {/* Coming Soon notice for RFID */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Primary Active Engine:</strong> AI Computer Vision Face Recognition. RFID Smart Card NFC module is scheduled for future hardware phase.
          </span>
        </div>

        {/* Stop Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Pickup / Drop Scheduled Stop
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={stopLocation}
              onChange={(e) => setStopLocation(e.target.value)}
              placeholder="e.g. Sector 62 Main Crossing"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Confirm &amp; Record Attendance</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
