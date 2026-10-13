"use client";

import React, { useState } from "react";
import {
  Bus as BusIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Gauge,
  BatteryCharging,
  Navigation,
  Radio,
  Video,
  AlertTriangle,
  UserCheck,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Bus, Driver, Route, Student } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";
import { BusModal } from "./BusModal";
import { EmergencyTransferModal } from "./EmergencyTransferModal";
import { ApiClient } from "../../services/apiClient";

interface BusManagementProps {
  buses: Bus[];
  drivers: Driver[];
  routes: Route[];
  students: Student[];
  onAddBus: (bus: Bus) => void;
  onUpdateBus: (bus: Bus) => void;
  onDeleteBus: (busId: string) => void;
  onEmergencyTransfer: (
    sourceBusId: string,
    targetBusId: string,
    reason: string,
    notifyParents: boolean
  ) => void;
  onNavigateToRoutes?: () => void;
}

export const BusManagement: React.FC<BusManagementProps> = ({
  buses,
  drivers,
  routes,
  students,
  onAddBus,
  onUpdateBus,
  onDeleteBus,
  onEmergencyTransfer,
  onNavigateToRoutes,
}) => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAlertMsg, setTransferAlertMsg] = useState<string | null>(null);

  const handleSimulateRouteDeviation = async (bus: Bus) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const detourLocation = bus.currentLocation || "CISF Camp Bypass Road";
    
    // Broadcast high-priority route deviation safety alert
    await ApiClient.broadcastSos({
      title: "🚨 Unauthorized Route Deviation Detected",
      busNumber: bus.busNumber,
      type: "ROUTE_DEVIATION",
      severity: "CRITICAL",
      timestamp: timeStr,
      resolved: false,
      description: `Bus ${bus.busNumber} has deviated from designated corridor (${bus.routeName}). Unscheduled stop near ${detourLocation}. Parents & transport controller alerted.`,
    });

    // Update bus status to DELAYED with updated note
    onUpdateBus({
      ...bus,
      status: "DELAYED",
      currentLocation: `${detourLocation} (Off-Route Deviation)`,
    });

    setTransferAlertMsg(
      `🚨 ROUTE DEVIATION ALERT TRIGGERED: Bus ${bus.busNumber} deviated from authorized route. Alert pushed to parents & admin via WebSocket.`
    );

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const filtered = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      b.driverName.toLowerCase().includes(search.toLowerCase()) ||
      (b.conductorName && b.conductorName.toLowerCase().includes(search.toLowerCase())) ||
      b.routeName.toLowerCase().includes(search.toLowerCase()) ||
      (b.currentLocation && b.currentLocation.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingBus(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bus: Bus) => {
    setEditingBus(bus);
    setIsModalOpen(true);
  };

  const handleExecuteTransfer = (
    sourceBusId: string,
    targetBusId: string,
    reason: string,
    notifyParents: boolean
  ) => {
    onEmergencyTransfer(sourceBusId, targetBusId, reason, notifyParents);
    const source = buses.find((b) => b.id === sourceBusId);
    const target = buses.find((b) => b.id === targetBusId);
    setTransferAlertMsg(
      `⚡ Emergency Transfer Active: Route & Students shifted from ${source?.busNumber} to ${target?.busNumber}. Parents notified via SMS broadcast.`
    );
  };

  const handleSaveBus = (data: Partial<Bus>) => {
    if (editingBus) {
      onUpdateBus({
        ...editingBus,
        ...data,
      } as Bus);
    } else {
      const newBus: Bus = {
        id: `bus-${Date.now()}`,
        busNumber: data.busNumber || "Bus #12",
        licensePlate: data.licensePlate || "UP14 AB 1234",
        capacity: data.capacity || 40,
        totalAssignedStudents: data.totalAssignedStudents || 30,
        insideBusCount: 0,
        offboardedCount: 0,
        waitingCount: 0,
        driverId: data.driverId || drivers[0]?.id || "",
        driverName: data.driverName || "Driver",
        driverPhone: data.driverPhone || "+91 94567 11223",
        conductorName: data.conductorName || "Amit Sharma",
        conductorPhone: data.conductorPhone || "+91 94567 88990",
        routeId: data.routeId || routes[0]?.id || "",
        routeName: data.routeName || "Route A – Indirapuram",
        currentLocation: data.currentLocation || "Depot Parking",
        gpsStatus: data.gpsStatus || "ONLINE",
        cameraStatus: data.cameraStatus || "ONLINE",
        status: data.status || "IDLE",
        currentSpeed: 0,
        batteryFuel: 100,
        nextStop: "School Terminal",
        eta: "Scheduled",
        latitude: 28.6139,
        longitude: 77.2090,
      };
      onAddBus(newBus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner for Active Emergency Transfer */}
      {transferAlertMsg && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500 text-white font-bold animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <p className="text-xs font-bold text-slate-900">{transferAlertMsg}</p>
          </div>
          <button
            onClick={() => setTransferAlertMsg(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1 rounded-lg hover:bg-slate-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-slate-900" />
            School Bus Fleet &amp; Telematics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage school buses, registration plates, crew allocations, GPS/CCTV status, and emergency bus transfer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Emergency Fleet Transfer Button */}
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Fleet Transfer</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fleet Vehicle</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="clean-card rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bus number, plate, driver, conductor, route..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
          Total: <strong className="text-slate-900">{buses.length}</strong> Registered Fleet Buses
        </span>
      </div>

      {/* Table */}
      <div className="clean-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 min-w-[160px]">Bus &amp; Plate</th>
                <th className="px-5 py-3.5 min-w-[200px]">Assigned Route &amp; Location</th>
                <th className="px-5 py-3.5 min-w-[180px]">Crew (Driver &amp; Conductor)</th>
                <th className="px-5 py-3.5 min-w-[150px]">Students Assigned</th>
                <th className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">GPS &amp; CCTV Devices</th>
                <th className="px-5 py-3.5 min-w-[130px] whitespace-nowrap">Trip Status</th>
                <th className="px-5 py-3.5 min-w-[110px] text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Bus & Plate */}
                  <td className="px-5 py-3.5 min-w-[160px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <BusIcon className="w-4 h-4 text-slate-800" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{bus.busNumber}</p>
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                          {bus.licensePlate}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Route & Live Location */}
                  <td className="px-5 py-3.5 min-w-[200px]">
                    <p className="font-bold text-slate-900 text-xs">{bus.routeName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Navigation className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {bus.currentLocation || bus.nextStop}
                      </span>
                    </p>
                  </td>

                  {/* Crew: Driver & Conductor */}
                  <td className="px-5 py-3.5 min-w-[180px]">
                    <p className="font-bold text-slate-900 flex items-center gap-1 text-xs">
                      <span>{bus.driverName}</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        Driver
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5 text-slate-400" />
                      <span>{bus.driverPhone}</span>
                    </p>
                    {bus.conductorName && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-2.5 h-2.5 text-slate-400" />
                        <span>Conductor: {bus.conductorName}</span>
                      </p>
                    )}
                  </td>

                  {/* Capacity & Assigned Students Meter */}
                  <td className="px-5 py-3.5 min-w-[150px]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">
                        {bus.totalAssignedStudents || bus.insideBusCount || 0}
                      </span>
                      <span className="text-slate-400">/ {bus.capacity} Seats</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((bus.totalAssignedStudents || bus.insideBusCount || 0) / bus.capacity) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* GPS & Camera Statuses */}
                  <td className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          bus.gpsStatus === "ONLINE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <Radio className="w-2.5 h-2.5" />
                        GPS {bus.gpsStatus || "ONLINE"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          bus.cameraStatus === "ONLINE"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <Video className="w-2.5 h-2.5" />
                        CCTV {bus.cameraStatus || "ONLINE"}
                      </span>
                    </div>
                  </td>

                  {/* Trip Status */}
                  <td className="px-5 py-3.5 min-w-[130px] whitespace-nowrap">
                    <Badge
                      variant={
                        bus.status === "ON_ROUTE"
                          ? "success"
                          : bus.status === "IDLE"
                          ? "neutral"
                          : bus.status === "DELAYED"
                          ? "warning"
                          : "error"
                      }
                      pulse={bus.status === "ON_ROUTE"}
                    >
                      {bus.status === "ON_ROUTE"
                        ? "On Trip"
                        : bus.status === "IDLE"
                        ? "Idle Stationed"
                        : bus.status === "DELAYED"
                        ? "Route Deviated"
                        : bus.status === "UNSERVICEABLE"
                        ? "Unserviceable"
                        : "Maintenance"}
                    </Badge>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-3.5 text-right min-w-[140px] whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Route Deviation Test Trigger */}
                      <button
                        onClick={() => handleSimulateRouteDeviation(bus)}
                        title="Simulate Route Deviation Alert (Unknown Route)"
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Deviate Alert</span>
                      </button>

                      <button
                        onClick={() => setIsTransferModalOpen(true)}
                        title="Emergency Transfer Route & Passengers"
                        className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(bus)}
                        title="Edit Bus & Route"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteBus(bus.id)}
                        title="Delete Bus"
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bus Add/Edit Modal */}
      <BusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBus}
        editingBus={editingBus}
        drivers={drivers}
        routes={routes}
      />

      {/* Emergency Transfer Modal */}
      <EmergencyTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        buses={buses}
        students={students}
        onExecuteTransfer={handleExecuteTransfer}
      />
    </div>
  );
};
