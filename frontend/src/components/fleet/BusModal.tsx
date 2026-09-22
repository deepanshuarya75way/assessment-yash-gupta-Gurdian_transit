"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Bus, Driver, Route } from "../../data/enterpriseMockData";
import { Bus as BusIcon, MapPin, Radio, Video, UserCheck, ShieldAlert } from "lucide-react";

interface BusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (busData: Partial<Bus>) => void;
  editingBus?: Bus | null;
  drivers: Driver[];
  routes: Route[];
}

export const BusModal: React.FC<BusModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBus,
  drivers,
  routes,
}) => {
  const [formData, setFormData] = useState({
    busNumber: "",
    licensePlate: "",
    capacity: 40,
    totalAssignedStudents: 30,
    driverId: drivers[0]?.id || "",
    conductorName: "Amit Sharma",
    conductorPhone: "+91 94567 88990",
    routeId: routes[0]?.id || "",
    currentLocation: "Sector 62 Main Road, Indirapuram",
    status: "ON_ROUTE" as Bus["status"],
    gpsStatus: "ONLINE" as Bus["gpsStatus"],
    cameraStatus: "ONLINE" as Bus["cameraStatus"],
  });

  useEffect(() => {
    if (editingBus) {
      setFormData({
        busNumber: editingBus.busNumber,
        licensePlate: editingBus.licensePlate,
        capacity: editingBus.capacity,
        totalAssignedStudents: editingBus.totalAssignedStudents || 30,
        driverId: editingBus.driverId,
        conductorName: editingBus.conductorName || "Amit Sharma",
        conductorPhone: editingBus.conductorPhone || "+91 94567 88990",
        routeId: editingBus.routeId,
        currentLocation: editingBus.currentLocation || "Sector 62 Main Road, Indirapuram",
        status: editingBus.status,
        gpsStatus: editingBus.gpsStatus || "ONLINE",
        cameraStatus: editingBus.cameraStatus || "ONLINE",
      });
    } else {
      setFormData({
        busNumber: `Bus #${Math.floor(10 + Math.random() * 89)}`,
        licensePlate: `UP14 AB ${Math.floor(1000 + Math.random() * 8999)}`,
        capacity: 40,
        totalAssignedStudents: 32,
        driverId: drivers[0]?.id || "",
        conductorName: "Amit Sharma",
        conductorPhone: "+91 94567 88990",
        routeId: routes[0]?.id || "",
        currentLocation: "School Hub Depot, Gate 3",
        status: "ON_ROUTE",
        gpsStatus: "ONLINE",
        cameraStatus: "ONLINE",
      });
    }
  }, [editingBus, isOpen, drivers, routes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDriver = drivers.find((d) => d.id === formData.driverId);
    const selectedRoute = routes.find((r) => r.id === formData.routeId);

    onSave({
      ...formData,
      driverName: selectedDriver ? selectedDriver.name : "Driver",
      driverPhone: selectedDriver ? selectedDriver.phone : "+91 94567 11223",
      routeName: selectedRoute ? selectedRoute.routeName : "Route A – Indirapuram",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBus ? `Edit Fleet Vehicle (${editingBus.busNumber})` : "Register New Fleet Bus"}
      subtitle="Configure bus call sign, registration plate, crew, and live telematics status"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Identification & Capacity */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BusIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>1. Vehicle Identification &amp; Capacity</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bus Number *
              </label>
              <input
                type="text"
                required
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                placeholder="e.g. Bus #12"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registration No. *
              </label>
              <input
                type="text"
                required
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="e.g. UP14 AB 1234"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Passenger Capacity *
              </label>
              <input
                type="number"
                min={10}
                max={80}
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Assigned Route & Location */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-700" />
            <span>2. Assigned Route &amp; Live Location</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Route Corridor *
              </label>
              <select
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.routeName} ({r.startPoint} ➔ {r.endPoint})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Location Address *
              </label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                placeholder="e.g. Sector 62 Main Road, Indirapuram"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Driver & Conductor Crew */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>3. Assigned Crew (Driver &amp; Conductor)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Driver *
              </label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Conductor Name *
              </label>
              <input
                type="text"
                value={formData.conductorName}
                onChange={(e) => setFormData({ ...formData, conductorName: e.target.value })}
                placeholder="e.g. Amit Sharma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Conductor Phone
              </label>
              <input
                type="text"
                value={formData.conductorPhone}
                onChange={(e) => setFormData({ ...formData, conductorPhone: e.target.value })}
                placeholder="e.g. +91 94567 88990"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Operational, GPS & Camera Statuses */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-slate-700" />
            <span>4. Current Trip &amp; Telematics Status</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Trip Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Bus["status"] })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="ON_ROUTE">On Trip (Active)</option>
                <option value="IDLE">Idle (Stationed)</option>
                <option value="DELAYED">Delayed (Traffic)</option>
                <option value="MAINTENANCE">Maintenance (Workshop)</option>
                <option value="UNSERVICEABLE">Unserviceable (Breakdown)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GPS Tracker *
              </label>
              <select
                value={formData.gpsStatus}
                onChange={(e) => setFormData({ ...formData, gpsStatus: e.target.value as Bus["gpsStatus"] })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="ONLINE">Online (Live Feed)</option>
                <option value="OFFLINE">Offline (Signal Lost)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                AI CCTV Biometric Camera *
              </label>
              <select
                value={formData.cameraStatus}
                onChange={(e) => setFormData({ ...formData, cameraStatus: e.target.value as Bus["cameraStatus"] })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="ONLINE">Online (1080p Stream)</option>
                <option value="OFFLINE">Offline (No Video)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
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
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95"
          >
            {editingBus ? "Save Bus Telematics" : "Register Fleet Bus"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
