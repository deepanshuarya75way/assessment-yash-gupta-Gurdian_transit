"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Bus, Student } from "../../data/enterpriseMockData";
import {
  AlertTriangle,
  ArrowRight,
  Bus as BusIcon,
  CheckCircle2,
  BellRing,
  Send,
  Users,
  ShieldAlert,
  Sparkles,
  Info,
} from "lucide-react";

interface EmergencyTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  buses: Bus[];
  students: Student[];
  onExecuteTransfer: (
    sourceBusId: string,
    targetBusId: string,
    reason: string,
    notifyParents: boolean
  ) => void;
}

export const EmergencyTransferModal: React.FC<EmergencyTransferModalProps> = ({
  isOpen,
  onClose,
  buses,
  students,
  onExecuteTransfer,
}) => {
  const [sourceBusId, setSourceBusId] = useState<string>(buses[0]?.id || "");
  const [targetBusId, setTargetBusId] = useState<string>(buses[1]?.id || "");
  const [reason, setReason] = useState<string>("Mechanical Breakdown / Workshop Maintenance");
  const [notifyParents, setNotifyParents] = useState<boolean>(true);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  const sourceBus = buses.find((b) => b.id === sourceBusId) || buses[0];
  const targetBus = buses.find((b) => b.id === targetBusId) || buses[1];

  // Students currently assigned to source bus
  const affectedStudents = students.filter(
    (s) => s.busId === sourceBus?.id || s.busNumber === sourceBus?.busNumber
  );

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceBusId === targetBusId) {
      alert("Target replacement bus must be different from the source bus!");
      return;
    }
    onExecuteTransfer(sourceBusId, targetBusId, reason, notifyParents);
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      onClose();
    }, 2400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚨 Emergency Fleet & Route Transfer"
      subtitle="Temporarily reassign students & route from an unserviceable bus to a replacement bus"
      maxWidth="2xl"
    >
      {transferSuccess ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Emergency Fleet Transfer Activated!
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            All <strong>{affectedStudents.length} students</strong> on{" "}
            <strong>{sourceBus?.busNumber}</strong> have been reassigned to{" "}
            <strong>{targetBus?.busNumber}</strong>.
          </p>
          {notifyParents && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-xs font-bold text-sky-800">
              <BellRing className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Instant SMS Broadcast dispatched to {affectedStudents.length} Parents!</span>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleExecute} className="space-y-5">
          {/* Top Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-900">
                Unserviceable Bus Route Handover
              </p>
              <p className="text-amber-700 mt-0.5">
                Use this feature when a bus suffers a mechanical issue, puncture, or delay. The route, stops, and students will instantly map to the replacement vehicle with automated parent broadcast.
              </p>
            </div>
          </div>

          {/* Step 1: Bus Selection Swap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Bus (Broken) */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  1. Source Bus (Unserviceable)
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white">
                  BREAKDOWN
                </span>
              </div>
              <select
                value={sourceBusId}
                onChange={(e) => setSourceBusId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.busNumber} ({b.licensePlate}) - {b.routeName}
                  </option>
                ))}
              </select>
              {sourceBus && (
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                  <p>
                    <strong>Driver:</strong> {sourceBus.driverName} ({sourceBus.driverPhone})
                  </p>
                  <p>
                    <strong>Conductor:</strong> {sourceBus.conductorName || "N/A"}
                  </p>
                  <p>
                    <strong>Route:</strong> {sourceBus.routeName}
                  </p>
                </div>
              )}
            </div>

            {/* Target Bus (Replacement) */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BusIcon className="w-3.5 h-3.5" />
                  2. Replacement Standby Bus
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-600 text-white">
                  STANDBY / ACTIVE
                </span>
              </div>
              <select
                value={targetBusId}
                onChange={(e) => setTargetBusId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {buses
                  .filter((b) => b.id !== sourceBusId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} ({b.licensePlate}) - {b.driverName} (Cap: {b.capacity})
                    </option>
                  ))}
              </select>
              {targetBus && (
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                  <p>
                    <strong>Replacement Driver:</strong> {targetBus.driverName} ({targetBus.driverPhone})
                  </p>
                  <p>
                    <strong>GPS Status:</strong> <span className="text-emerald-700 font-bold">{targetBus.gpsStatus}</span> • Capacity: {targetBus.capacity} Seats
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reason for Reassignment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Emergency Transfer *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="Mechanical Breakdown / Engine Fault">Mechanical Breakdown / Engine Fault</option>
              <option value="Tire Puncture / En-Route Delay">Tire Puncture / En-Route Delay</option>
              <option value="Air Conditioning & Safety Sensor Issue">Air Conditioning & Safety Sensor Issue</option>
              <option value="Scheduled Depot Fleet Maintenance">Scheduled Depot Fleet Maintenance</option>
              <option value="Driver Medical Leave / Emergency Shift Swap">Driver Medical Leave / Emergency Shift Swap</option>
            </select>
          </div>

          {/* Affected Students List Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>Affected Students Being Reassigned ({affectedStudents.length})</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Will board {targetBus?.busNumber}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
              {affectedStudents.length > 0 ? (
                affectedStudents.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-800 shadow-2xs"
                  >
                    <span>{s.name}</span>
                    <span className="text-[9px] text-slate-400 font-normal">
                      ({s.grade})
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No active students currently mapped to this bus.
                </span>
              )}
            </div>
          </div>

          {/* Automated Parent Notification Broadcast Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyParents}
                  onChange={(e) => setNotifyParents(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-sky-600" />
                  Auto-Dispatch SMS / App Notification to All {affectedStudents.length} Parents
                </span>
              </label>
            </div>

            {notifyParents && (
              <div className="p-3 bg-white rounded-xl border border-sky-200 text-xs font-mono text-slate-700 space-y-1">
                <p className="text-[10px] uppercase font-bold text-sky-700 tracking-wider flex items-center gap-1">
                  <Send className="w-3 h-3" /> Live SMS Template Preview:
                </p>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  &ldquo;Dear Parent, due to temporary maintenance on <strong>{sourceBus?.busNumber}</strong>, your ward will travel in replacement <strong>{targetBus?.busNumber} ({targetBus?.licensePlate})</strong> today. Driver: <strong>{targetBus?.driverName} ({targetBus?.driverPhone})</strong>. Live GPS tracking is active on your portal.&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 pb-2 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Execute Transfer &amp; Dispatch Alerts</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
