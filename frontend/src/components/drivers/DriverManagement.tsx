"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Shield,
  Star,
  Bus as BusIcon,
  CheckCircle2,
  Camera,
  Scan,
  CreditCard,
  Eye,
  X,
  FileCheck,
} from "lucide-react";
import { Driver, Bus } from "../../data/enterpriseMockData";
import { Badge } from "../ui/Badge";
import { DriverModal } from "./DriverModal";
import { FaceEnrollModal } from "../students/FaceEnrollModal";
import { Modal } from "../ui/Modal";

interface DriverManagementProps {
  drivers: Driver[];
  buses: Bus[];
  onAddDriver: (driver: Driver) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: string) => void;
}

export const DriverManagement: React.FC<DriverManagementProps> = ({
  drivers,
  buses,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
}) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [enrollingDriver, setEnrollingDriver] = useState<Driver | null>(null);
  const [previewingIdCard, setPreviewingIdCard] = useState<Driver | null>(null);

  const filtered = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.assignedBusNumber.toLowerCase().includes(search.toLowerCase()) ||
      (d.driverId && d.driverId.toLowerCase().includes(search.toLowerCase())) ||
      (d.assignedRouteName && d.assignedRouteName.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || d.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleSaveDriver = (data: Partial<Driver>) => {
    if (editingDriver) {
      onUpdateDriver({
        ...editingDriver,
        ...data,
      } as Driver);
    } else {
      const newDriver: Driver = {
        id: `drv-${Date.now()}`,
        driverId: data.driverId || `DRV-00${Math.floor(10 + Math.random() * 89)}`,
        name: data.name || "Driver",
        role: data.role || "Driver",
        profilePhoto:
          data.profilePhoto ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        licenseNumber: data.licenseNumber || "DL-0420000000000",
        phone: data.phone || "+91 94567 11223",
        assignedBusId: data.assignedBusId || buses[0]?.id || "",
        assignedBusNumber: data.assignedBusNumber || "Bus #12",
        assignedRouteName: data.assignedRouteName || "Route A – Indirapuram",
        shift: data.shift || "Morning & Evening",
        experience: data.experience || "5 Years",
        status: data.status || "ACTIVE",
        rating: 4.8,
        faceRegistered: data.faceRegistered || false,
        idCardUrl: data.idCardUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80",
      };
      onAddDriver(newDriver);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-900" />
            Drivers &amp; Transit Crew Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage certified drivers, bus conductors, commercial licenses, verified ID card photos, 3D facial biometrics &amp; assigned routes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Crew / Driver</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="clean-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, driver ID, bus or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "Driver", "Conductor"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === role
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {role === "ALL" ? "All Crew" : role === "Driver" ? "Drivers Only" : "Conductors"}
            </button>
          ))}
        </div>
      </div>

      {/* Crew Table */}
      <div className="clean-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Driver / Crew Name</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">3D Face Biometrics</th>
                <th className="px-5 py-3.5">ID Card / License</th>
                <th className="px-5 py-3.5">Contact Phone</th>
                <th className="px-5 py-3.5">Assigned Bus &amp; Route</th>
                <th className="px-5 py-3.5">Duty Shift &amp; Exp</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Photo & Name */}
                  <td className="px-5 py-3.5 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            driver.profilePhoto ||
                            driver.avatarUrl ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                          }
                          alt={driver.name}
                          className={`w-10 h-10 rounded-xl object-cover border-2 shadow-xs ${
                            driver.faceRegistered ? "border-emerald-400" : "border-slate-200"
                          }`}
                        />
                        {driver.faceRegistered && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{driver.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">{driver.driverId || "DRV-001"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5 min-w-[110px] whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        driver.role === "Conductor"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}
                    >
                      {driver.role || "Driver"}
                    </span>
                  </td>

                  {/* 3D Face Biometric Status */}
                  <td className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">
                    {driver.faceRegistered ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Enrolled (512-D)</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setEnrollingDriver(driver)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all active:scale-95"
                        title="Click to register live 3D face biometric"
                      >
                        <Camera className="w-3 h-3 text-amber-600" />
                        <span>Scan Face</span>
                      </button>
                    )}
                  </td>

                  {/* ID Card / Commercial DL with Preview Trigger */}
                  <td className="px-5 py-3.5 min-w-[180px] whitespace-nowrap">
                    <button
                      onClick={() => setPreviewingIdCard(driver)}
                      className="group flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-all text-left"
                      title="Click to inspect Driver ID Card & Commercial DL"
                    >
                      <div className="w-8 h-6 rounded bg-slate-300 overflow-hidden flex-shrink-0 border border-slate-400/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={driver.idCardUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80"}
                          alt="ID Card"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-slate-900 font-bold block leading-tight">
                          {driver.licenseNumber}
                        </span>
                        <span className="text-[9px] font-extrabold text-cyan-700 flex items-center gap-0.5">
                          <Eye className="w-2.5 h-2.5" />
                          <span>View ID Card</span>
                        </span>
                      </div>
                    </button>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{driver.phone}</span>
                    </p>
                  </td>

                  {/* Assigned Bus & Route */}
                  <td className="px-5 py-3.5 min-w-[180px]">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <BusIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{driver.assignedBusNumber}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[180px] mt-0.5">
                      {driver.assignedRouteName || "Assigned Corridor"}
                    </span>
                  </td>

                  {/* Shift & Exp */}
                  <td className="px-5 py-3.5 min-w-[140px]">
                    <p className="font-bold text-slate-800 text-xs">{driver.shift}</p>
                    <p className="text-[10px] text-slate-400">{driver.experience}</p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5 min-w-[110px] whitespace-nowrap">
                    <Badge
                      variant={
                        driver.status === "ACTIVE"
                          ? "success"
                          : driver.status === "OFF_DUTY"
                          ? "neutral"
                          : "warning"
                      }
                      pulse={driver.status === "ACTIVE"}
                    >
                      {driver.status === "ACTIVE"
                        ? "Active"
                        : driver.status === "OFF_DUTY"
                        ? "Off Duty"
                        : "On Leave"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right min-w-[110px] whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEnrollingDriver(driver)}
                        title="Scan 3D Face Biometrics"
                        className="p-1.5 hover:bg-cyan-50 rounded-lg text-slate-500 hover:text-cyan-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(driver)}
                        title="Edit Crew Member"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDriver(driver.id)}
                        title="Delete Profile"
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Add/Edit Modal */}
      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDriver}
        editingDriver={editingDriver}
        buses={buses}
      />

      {/* Driver Live Camera 3D Face Enroll Modal */}
      {enrollingDriver && (
        <FaceEnrollModal
          isOpen={!!enrollingDriver}
          onClose={() => setEnrollingDriver(null)}
          student={{
            id: enrollingDriver.driverId || enrollingDriver.id,
            name: enrollingDriver.name,
            rollNo: enrollingDriver.licenseNumber,
            avatarUrl: enrollingDriver.profilePhoto || enrollingDriver.avatarUrl,
          }}
          onEnrollSuccess={(capturedPhotoUrl) => {
            onUpdateDriver({
              ...enrollingDriver,
              profilePhoto: capturedPhotoUrl || enrollingDriver.profilePhoto,
              avatarUrl: capturedPhotoUrl || enrollingDriver.avatarUrl,
              faceRegistered: true,
            });
            setEnrollingDriver(null);
          }}
        />
      )}

      {/* Driver ID Card Full Screen / Document Inspector Modal */}
      {previewingIdCard && (
        <Modal
          isOpen={!!previewingIdCard}
          onClose={() => setPreviewingIdCard(null)}
          title={`Driver Commercial Badge: ${previewingIdCard.name}`}
          subtitle={`License No: ${previewingIdCard.licenseNumber} • ${previewingIdCard.assignedBusNumber}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 aspect-[16/10] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewingIdCard.idCardUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"}
                alt="Driver License / ID Badge"
                className="w-full h-full object-cover"
              />
              {/* Card Hologram & Watermark Overlay */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-white/20 text-white font-mono text-[10px] font-bold">
                COMMERCIAL BADGE: UP14
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-emerald-900/80 backdrop-blur-sm border border-emerald-400 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-emerald-400" />
                <span>STATE TRANSPORT VERIFIED</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p><strong>Crew Name:</strong> {previewingIdCard.name} ({previewingIdCard.role || "Driver"})</p>
              <p><strong>Commercial DL Number:</strong> <span className="font-mono font-bold text-slate-900">{previewingIdCard.licenseNumber}</span></p>
              <p><strong>Duty Allocation:</strong> {previewingIdCard.assignedBusNumber} ({previewingIdCard.assignedRouteName || "Corridor"})</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewingIdCard(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
