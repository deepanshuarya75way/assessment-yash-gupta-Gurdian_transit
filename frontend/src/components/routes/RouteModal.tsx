"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Route, RouteStop, Bus } from "../../data/enterpriseMockData";
import { Plus, Trash2, MapPin, Bus as BusIcon, Clock, Navigation, UserCheck, Phone } from "lucide-react";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routeData: Partial<Route>) => void;
  editingRoute?: Route | null;
  buses: Bus[];
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRoute,
  buses,
}) => {
  const [formData, setFormData] = useState({
    routeName: "",
    startPoint: "Indirapuram Terminal",
    endPoint: "Apex Academy Central Campus",
    totalDistance: "14.5 km",
    estimatedTime: "35 mins",
    assignedBusNumber: buses[0]?.busNumber || "Bus #12",
    stops: [] as RouteStop[],
  });

  const [newStopName, setNewStopName] = useState("");
  const [newMorningTime, setNewMorningTime] = useState("07:30 AM");

  useEffect(() => {
    if (editingRoute) {
      setFormData({
        routeName: editingRoute.routeName,
        startPoint: editingRoute.startPoint || "Terminal",
        endPoint: editingRoute.endPoint || "Apex Academy Central Campus",
        totalDistance: editingRoute.totalDistance,
        estimatedTime: editingRoute.estimatedTime,
        assignedBusNumber: editingRoute.assignedBusNumber,
        stops: editingRoute.stops || [],
      });
    } else {
      setFormData({
        routeName: "",
        startPoint: "Indirapuram Terminal",
        endPoint: "Apex Academy Central Campus",
        totalDistance: "14.5 km",
        estimatedTime: "35 mins",
        assignedBusNumber: buses[0]?.busNumber || "Bus #12",
        stops: [
          { id: "st-1", name: "First Pickup Terminal", morningTime: "07:15 AM", eveningTime: "02:30 PM", studentCount: 8 },
          { id: "st-2", name: "Central Metro Crossing", morningTime: "07:35 AM", eveningTime: "02:50 PM", studentCount: 12 },
          { id: "st-3", name: "Apex Academy Central Gate", morningTime: "08:00 AM", eveningTime: "03:15 PM", studentCount: 20 },
        ],
      });
    }
  }, [editingRoute, isOpen, buses]);

  const selectedBus = buses.find((b) => b.busNumber === formData.assignedBusNumber) || buses[0];

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopName.trim()) return;
    const newStop: RouteStop = {
      id: `st-${Date.now()}`,
      name: newStopName.trim(),
      morningTime: newMorningTime,
      eveningTime: "02:45 PM",
      studentCount: 5,
    };
    setFormData((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop],
    }));
    setNewStopName("");
  };

  const handleRemoveStop = (stopId: string) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRoute ? `Edit Transit Route (${editingRoute.routeName})` : "Create New Bus Route"}
      subtitle="Configure route name, assigned vehicle, driver contact, and scheduled pickup stops"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Route & Assigned Bus / Driver */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-slate-700" />
            <span>1. Route &amp; Driver Allocation</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Route Name *
              </label>
              <input
                type="text"
                required
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                placeholder="e.g. Route A – Indirapuram"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assign School Bus *
              </label>
              <select
                value={formData.assignedBusNumber}
                onChange={(e) => setFormData({ ...formData, assignedBusNumber: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.busNumber}>
                    {b.busNumber} ({b.licensePlate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned Driver & Phone Preview Card */}
          {selectedBus && (
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Assigned Fleet Driver:
                </span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{selectedBus.driverName}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Driver Phone Number:
                </span>
                <p className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedBus.driverPhone}</span>
                </p>
              </div>
            </div>
          )}

          {/* Distance & Duration */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Distance (km)
              </label>
              <input
                type="text"
                value={formData.totalDistance}
                onChange={(e) => setFormData({ ...formData, totalDistance: e.target.value })}
                placeholder="e.g. 14.2 km"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Transit Duration
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                placeholder="e.g. 35 mins"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Sequential Scheduled Stops */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-700" />
              <span>2. Intermediate Stops &amp; Schedule ({formData.stops.length})</span>
            </h4>
          </div>

          {/* Add Stop Inline Input Row */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Add Intermediate Stop:</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={newStopName}
                onChange={(e) => setNewStopName(e.target.value)}
                placeholder="Stop Name / Landmark..."
                className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <input
                type="text"
                value={newMorningTime}
                onChange={(e) => setNewMorningTime(e.target.value)}
                placeholder="🌅 07:15 AM"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stop</span>
              </button>
            </div>
          </div>

          {/* Stops List */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {formData.stops.map((stop, idx) => (
              <div
                key={stop.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{stop.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    🌅 {stop.morningTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(stop.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
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
            {editingRoute ? "Save Route Changes" : "Create Transit Route"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
