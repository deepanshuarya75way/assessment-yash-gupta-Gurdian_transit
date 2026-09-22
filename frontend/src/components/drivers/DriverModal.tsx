"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Driver, Bus } from "../../data/enterpriseMockData";
import {
  UserCheck,
  Shield,
  Phone,
  Bus as BusIcon,
  Camera,
  CheckCircle2,
  Scan,
  Sparkles,
  CreditCard,
  Eye,
  FileCheck,
} from "lucide-react";
import { FaceEnrollModal } from "../students/FaceEnrollModal";
import { DriverIdCardCameraModal } from "./DriverIdCardCameraModal";

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driverData: Partial<Driver>) => void;
  editingDriver?: Driver | null;
  buses: Bus[];
}

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDriver,
  buses,
}) => {
  const [formData, setFormData] = useState({
    driverId: "DRV-001",
    name: "",
    role: "Driver" as Driver["role"],
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "",
    phone: "",
    assignedBusId: buses[0]?.id || "",
    shift: "Morning & Evening" as Driver["shift"],
    experience: "8 Years",
    status: "ACTIVE" as Driver["status"],
    faceRegistered: false,
    idCardUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80",
  });

  const [isFaceEnrollModalOpen, setIsFaceEnrollModalOpen] = useState(false);
  const [isIdCameraModalOpen, setIsIdCameraModalOpen] = useState(false);

  useEffect(() => {
    if (editingDriver) {
      setFormData({
        driverId: editingDriver.driverId || `DRV-00${Math.floor(1 + Math.random() * 9)}`,
        name: editingDriver.name,
        role: editingDriver.role || "Driver",
        profilePhoto: editingDriver.profilePhoto || editingDriver.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        licenseNumber: editingDriver.licenseNumber,
        phone: editingDriver.phone,
        assignedBusId: editingDriver.assignedBusId || buses[0]?.id || "",
        shift: editingDriver.shift || "Morning & Evening",
        experience: editingDriver.experience || "8 Years",
        status: editingDriver.status || "ACTIVE",
        faceRegistered: editingDriver.faceRegistered || false,
        idCardUrl: editingDriver.idCardUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80",
      });
    } else {
      setFormData({
        driverId: `DRV-00${Math.floor(10 + Math.random() * 89)}`,
        name: "",
        role: "Driver",
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        licenseNumber: `DL-0420${Math.floor(100000000 + Math.random() * 900000000)}`,
        phone: "+91 94567 ",
        assignedBusId: buses[0]?.id || "",
        shift: "Morning & Evening",
        experience: "6 Years",
        status: "ACTIVE",
        faceRegistered: false,
        idCardUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80",
      });
    }
  }, [editingDriver, isOpen, buses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBus = buses.find((b) => b.id === formData.assignedBusId);

    onSave({
      ...formData,
      avatarUrl: formData.profilePhoto,
      assignedBusNumber: selectedBus ? selectedBus.busNumber : "Bus #12",
      assignedRouteName: selectedBus ? selectedBus.routeName : "Route 1 – Indirapuram",
    });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingDriver ? `Edit Crew Profile (${editingDriver.name})` : "Register New Crew / Driver"}
        subtitle="Enter driver credentials, commercial badge, camera ID photo & live biometric face profile"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity & Role */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>1. Identity &amp; Role Designation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Crew ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  placeholder="DRV-001"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajeshwar Singh"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Driver["role"] })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Driver">Bus Driver</option>
                  <option value="Conductor">Bus Conductor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Credentials & Contact */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>2. Commercial Driving License &amp; Contact</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Commercial DL No. *
                </label>
                <input
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="UP14-DL-01-2022"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98112 01001"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driving Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="8 Years"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 3. Driver ID Card / License Photo Captured via Device Camera */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-700" />
                <span>3. Driver ID Card / Commercial License Photo</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                Camera Verified Photo
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
              {/* ID Card Thumbnail Preview */}
              <div className="relative w-36 h-22 rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-100 flex-shrink-0 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.idCardUrl}
                  alt="Driver ID Card"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-slate-900/80 text-[8px] font-mono text-white font-bold">
                  DL PHOTO
                </div>
              </div>

              {/* Camera Photo Click Trigger */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-xs font-bold text-slate-900">
                  Click Physical License Photo with Camera
                </p>
                <p className="text-[11px] text-slate-500">
                  Open device camera to click a single clear photo of the physical driving license or crew ID badge.
                </p>

                <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                  <button
                    type="button"
                    onClick={() => setIsIdCameraModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Click ID Card Photo (Camera)</span>
                  </button>

                  <a
                    href={formData.idCardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Photo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bus Allocation & Status */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BusIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>4. Bus Allocation, Shift &amp; Status</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Bus *
                </label>
                <select
                  value={formData.assignedBusId}
                  onChange={(e) => setFormData({ ...formData, assignedBusId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} ({b.licensePlate}) - {b.routeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duty Shift
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value as Driver["shift"] })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Morning & Evening">Morning &amp; Evening</option>
                  <option value="Morning Pickup Only">Morning Pickup Only</option>
                  <option value="Evening Dropoff Only">Evening Dropoff Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver["status"] })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ACTIVE">Active On Duty</option>
                  <option value="OFF_DUTY">Off Duty</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. 3D Multi-Angle Live Camera Face Biometric Registration */}
          <div className={`p-4 rounded-2xl border transition-all ${
            formData.faceRegistered
              ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200"
              : "bg-gradient-to-r from-sky-50 via-cyan-50 to-indigo-50 border-cyan-200 shadow-sm"
          } flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                  alt=""
                  className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-md ${
                    formData.faceRegistered ? "border-emerald-400 ring-2 ring-emerald-400/20" : "border-white"
                  }`}
                />
                {formData.faceRegistered && (
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Crew 3D Multi-Angle Face Biometrics</span>
                  </span>
                  {formData.faceRegistered ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      5-ANGLES ENROLLED (512-D)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                      CAMERA SCAN PENDING
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {formData.faceRegistered
                    ? "Driver face registered with 5-angle 3D spatial mesh for automated bus ignition & driver identity lock."
                    : "Launch device camera to register driver's face from 5 angles for biometric authentication."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFaceEnrollModalOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap ${
                formData.faceRegistered
                  ? "bg-slate-900 hover:bg-slate-800 text-white"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 ring-2 ring-cyan-400/40"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{formData.faceRegistered ? "Re-Scan Driver Face" : "Open Camera & Enroll Face"}</span>
            </button>
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{editingDriver ? "Save Profile" : "Register Crew"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 1. Live Camera Single-Shot ID Card Click Modal */}
      {isIdCameraModalOpen && (
        <DriverIdCardCameraModal
          isOpen={isIdCameraModalOpen}
          onClose={() => setIsIdCameraModalOpen(false)}
          driverName={formData.name}
          onCapture={(capturedIdUrl) => {
            setFormData((prev) => ({
              ...prev,
              idCardUrl: capturedIdUrl,
            }));
          }}
        />
      )}

      {/* 2. 3D Multi-Angle Live Camera Face Enroll Modal for Driver */}
      {isFaceEnrollModalOpen && (
        <FaceEnrollModal
          isOpen={isFaceEnrollModalOpen}
          onClose={() => setIsFaceEnrollModalOpen(false)}
          student={{
            id: formData.driverId,
            name: formData.name || "Driver",
            rollNo: formData.licenseNumber || "Commercial DL",
            avatarUrl: formData.profilePhoto,
          }}
          onEnrollSuccess={(capturedPhotoUrl) => {
            setFormData((prev) => ({
              ...prev,
              profilePhoto: capturedPhotoUrl || prev.profilePhoto,
              faceRegistered: true,
            }));
            setIsFaceEnrollModalOpen(false);
          }}
        />
      )}
    </>
  );
};
