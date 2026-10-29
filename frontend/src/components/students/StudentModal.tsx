"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Student, Bus, Parent } from "../../data/enterpriseMockData";
import {
  User,
  Phone,
  MapPin,
  Bus as BusIcon,
  Shield,
  CreditCard,
  Sparkles,
  Camera,
  CheckCircle2,
  Scan,
  Users,
  UserPlus,
  Link as LinkIcon,
  UserX,
  Home,
} from "lucide-react";
import {
  IdCardOcrScannerModal,
  ExtractedIdCardData,
} from "./IdCardOcrScannerModal";
import { FaceEnrollModal } from "./FaceEnrollModal";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Partial<Student>) => void;
  initialData?: Student | null;
  autoFilledOcrData?: ExtractedIdCardData | null;
  buses: Bus[];
  parents: Parent[];
  students: Student[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  autoFilledOcrData,
  buses,
  parents,
  students,
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    rollNo: "",
    grade: "B.Tech",
    section: "CSE(DS)",
    address: "",
    permanentAddress: "",
    currentAddress: "",
    busId: buses[0]?.id || "bus-01",
    busNumber: buses[0]?.busNumber || "Bus #08",
    routeName: buses[0]?.routeName || "Route 8 – Anand Vihar",
    parentId: "",
    parentName: "",
    parentPhone: "",
    faceRegistered: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  });

  const [parentMode, setParentMode] = useState<"NEW" | "EXISTING" | "NONE">("NEW");
  const [parentRelation, setParentRelation] = useState<string>("Father");
  const [isFaceEnrollModalOpen, setIsFaceEnrollModalOpen] = useState(false);
  const [isAutoFilledFromOcr, setIsAutoFilledFromOcr] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(true);

  useEffect(() => {
    if (initialData) {
      // Editing existing student
      const matchedParent = parents.find(
        (p) =>
          p.id === initialData.parentId ||
          (initialData.parentName && p.name.trim().toLowerCase() === initialData.parentName.trim().toLowerCase())
      );

      setFormData({
        ...initialData,
        permanentAddress: initialData.permanentAddress || initialData.address || "",
        currentAddress: initialData.currentAddress || initialData.address || "",
        parentId: matchedParent ? matchedParent.id : initialData.parentId || "",
        parentName: matchedParent ? matchedParent.name : initialData.parentName || "",
        parentPhone: matchedParent ? matchedParent.phone : initialData.parentPhone || "",
      });

      setIsSameAddress(
        !initialData.currentAddress ||
          initialData.currentAddress === initialData.permanentAddress ||
          initialData.currentAddress === initialData.address
      );

      if (matchedParent) {
        setParentMode("EXISTING");
        setParentRelation(matchedParent.relation || "Father");
      } else if (initialData.parentName) {
        setParentMode("NEW");
      } else {
        setParentMode("NONE");
      }
      setIsAutoFilledFromOcr(false);
    } else if (autoFilledOcrData) {
      // Auto-filled from OCR ID card
      const defaultBus = buses[0];
      const permAddr = autoFilledOcrData.permanentAddress || autoFilledOcrData.address || "";
      const currAddr = autoFilledOcrData.currentAddress || permAddr;

      setFormData({
        name: autoFilledOcrData.name || "",
        rollNo: autoFilledOcrData.rollNo || "",
        grade: autoFilledOcrData.grade || "B.Tech",
        section: autoFilledOcrData.section || "CSE(DS)",
        address: permAddr,
        permanentAddress: permAddr,
        currentAddress: currAddr,
        busId: defaultBus?.id || "bus-08",
        busNumber: defaultBus?.busNumber || "Bus #08",
        routeName: defaultBus?.routeName || "Route 8 – Anand Vihar",
        parentId: `par-${Date.now()}`,
        parentName: autoFilledOcrData.parentName || "",
        parentPhone: autoFilledOcrData.parentPhone || "",
        faceRegistered: false,
        avatarUrl: autoFilledOcrData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });
      setIsSameAddress(permAddr === currAddr);
      setParentMode(autoFilledOcrData.parentName ? "NEW" : "NONE");
      setIsAutoFilledFromOcr(true);
    } else {
      // Clean New Student Registration (Completely blank defaults)
      const defaultBus = buses[0];
      setFormData({
        name: "",
        rollNo: "",
        grade: "B.Tech",
        section: "CSE(DS)",
        address: "",
        permanentAddress: "",
        currentAddress: "",
        busId: defaultBus?.id || "bus-08",
        busNumber: defaultBus?.busNumber || "Bus #08",
        routeName: defaultBus?.routeName || "Route 8 – Anand Vihar",
        parentId: `par-${Date.now()}`,
        parentName: "",
        parentPhone: "",
        faceRegistered: false,
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });
      setIsSameAddress(true);
      setParentMode("NEW");
      setParentRelation("Father");
      setIsAutoFilledFromOcr(false);
    }
  }, [initialData, autoFilledOcrData, buses, parents, isOpen]);

  const handleParentModeChange = (mode: "NEW" | "EXISTING" | "NONE") => {
    setParentMode(mode);
    if (mode === "NEW") {
      setFormData((prev) => ({
        ...prev,
        parentId: `par-${Date.now()}`,
        parentName: "",
        parentPhone: "",
      }));
    } else if (mode === "EXISTING") {
      if (parents.length > 0) {
        const firstParent = parents[0];
        setFormData((prev) => ({
          ...prev,
          parentId: firstParent.id,
          parentName: firstParent.name,
          parentPhone: firstParent.phone,
        }));
        setParentRelation(firstParent.relation || "Father");
      }
    } else if (mode === "NONE") {
      setFormData((prev) => ({
        ...prev,
        parentId: "",
        parentName: "No Parent Assigned",
        parentPhone: "N/A",
      }));
    }
  };

  const handleExistingParentSelect = (parentId: string) => {
    const parentObj = parents.find((p) => p.id === parentId);
    if (parentObj) {
      setFormData((prev) => ({
        ...prev,
        parentId: parentObj.id,
        parentName: parentObj.name,
        parentPhone: parentObj.phone,
      }));
      setParentRelation(parentObj.relation || "Father");
    }
  };

  const getFreeSeats = (bus: Bus)=> {
    const assignedStudents = students.filter(
      (student)=> student.busId === bus.id
    ).length;
    return Math.max(0, bus.capacity - assignedStudents);
  };

  const handleBusChange = (busId: string) => {
    const bus = buses.find((b) => b.id === busId);
    if (bus) {
      setFormData((prev) => ({
        ...prev,
        busId: bus.id,
        busNumber: bus.busNumber,
        routeId: bus.routeId,
        routeName: bus.routeName,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      address: formData.permanentAddress || formData.address,
    });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          initialData
            ? "Edit Student Profile"
            : isAutoFilledFromOcr
            ? "Complete Student Registration (ID Card Auto-Filled)"
            : "Register New Student"
        }
        subtitle="Manage student biometric profile, academic grade, assigned bus route, and parent details."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Student Academic Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-700" />
              <span>1. Student Identity &amp; Program</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admission / Roll No. *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rollNo || ""}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="Enter admission / roll number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class / Program *</label>
                <select
                  value={formData.grade || "B.Tech"}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                  <option value="MCA">MCA (Master of Computer Applications)</option>
                  <option value="MBA">MBA (Master of Business Admin)</option>
                  <option value="BBA">BBA (Bachelor of Business Admin)</option>
                  <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                  {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Section *</label>
                <input
                  type="text"
                  required
                  value={formData.section || "CSE(DS)"}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g. CSE(DS) / Section A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parent / Guardian Details (Explicit Mode Selector) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-700" />
                <span>2. Parent / Guardian Details</span>
              </h4>
            </div>

            {/* Mode Selector Tabs: New Parent vs Existing vs Skip */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleParentModeChange("NEW")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  parentMode === "NEW"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-600" />
                <span>+ Create New Parent</span>
              </button>

              <button
                type="button"
                onClick={() => handleParentModeChange("EXISTING")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  parentMode === "EXISTING"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Link Existing ({parents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleParentModeChange("NONE")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  parentMode === "NONE"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserX className="w-3.5 h-3.5 text-slate-400" />
                <span>Skip / No Parent</span>
              </button>
            </div>

            {/* Sub-form A: CREATE NEW PARENT */}
            {parentMode === "NEW" && (
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-900">
                    ➕ Register Brand New Parent in Parents Directory
                  </span>
                  <span className="text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full font-bold">
                    Auto-Creates Parent Profile
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Father / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required={parentMode === "NEW"}
                      value={formData.parentName === "No Parent Assigned" ? "" : formData.parentName || ""}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Enter father or guardian name"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Parent Phone Number (SMS Alerts) *
                    </label>
                    <input
                      type="text"
                      required={parentMode === "NEW"}
                      value={formData.parentPhone === "N/A" ? "" : formData.parentPhone || ""}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-form B: LINK EXISTING PARENT */}
            {parentMode === "EXISTING" && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
                <label className="block text-[11px] font-bold text-purple-900 uppercase mb-1">
                  Select Registered Parent from Directory *
                </label>
                <select
                  value={formData.parentId || (parents[0]?.id || "")}
                  onChange={(e) => handleExistingParentSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relation}) • 📞 {p.phone}
                    </option>
                  ))}
                </select>
                {formData.parentName && (
                  <p className="text-[11px] text-purple-700">
                    Linked to: <strong>{formData.parentName}</strong> ({formData.parentPhone})
                  </p>
                )}
              </div>
            )}

            {/* Sub-form C: NONE */}
            {parentMode === "NONE" && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  No parent will be assigned to this student right now. You can link one later.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Bus Fleet & Residential Addresses (Permanent & Current) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BusIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>3. Assigned Bus Fleet &amp; Residential Addresses</span>
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Bus Fleet *</label>
              <select
                value={formData.busId || buses[0]?.id}
                onChange={(e) => handleBusChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {buses.map((b) => {
                  const freeSeats = getFreeSeats(b);
                  return(
                  <option key={b.id} value={b.id}>
                    {b.busNumber} ({b.driverName}) - {b.routeName}
                    {"| Free Seats: "}{freeSeats}/{b.capacity}
                  </option>
                );
})}
              </select>
            </div>

            <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              {/* Permanent Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-600" />
                  <span>Permanent Address (As on ID Card Back) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.permanentAddress || formData.address || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      permanentAddress: val,
                      address: val,
                      currentAddress: isSameAddress ? val : prev.currentAddress,
                    }));
                  }}
                  placeholder="Enter permanent address (House/Flat No, Sector, City, PIN)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Current Address with Checkbox */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Current / Local Transit Stop Address *</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[10px] text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSameAddress}
                      onChange={(e) => {
                        setIsSameAddress(e.target.checked);
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            currentAddress: prev.permanentAddress || prev.address,
                          }));
                        }
                      }}
                      className="rounded text-cyan-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Same as Permanent Address</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  disabled={isSameAddress}
                  value={formData.currentAddress || formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                  placeholder="Enter transit boarding stop / location"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                    isSameAddress ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200" : "bg-white border-slate-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 4: 3D Multi-Angle Biometric Face Enrollment Trigger */}
          <div className={`p-4 rounded-2xl border transition-all ${
            formData.faceRegistered
              ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200"
              : "bg-gradient-to-r from-sky-50 via-cyan-50 to-indigo-50 border-cyan-200 shadow-sm"
          } flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
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
                    <span>3D Multi-Angle Face Biometrics</span>
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
                    ? "Face registered with 5 spatial angles for instant gate & bus biometric boarding."
                    : "Launch device camera to register student's face from 5 angles."}
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
              <span>{formData.faceRegistered ? "Re-Scan 3D Face" : "Open Camera & Enroll Face"}</span>
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
              <span>{initialData ? "Save Changes" : "Complete Registration"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 3D Multi-Angle Live Camera Face Enroll Modal */}
      {isFaceEnrollModalOpen && (
        <FaceEnrollModal
          isOpen={isFaceEnrollModalOpen}
          onClose={() => setIsFaceEnrollModalOpen(false)}
          student={{
            id: formData.id || "temp-stu",
            name: formData.name || "Student",
            rollNo: formData.rollNo || "STU-001",
            avatarUrl: formData.avatarUrl,
          }}
          onEnrollSuccess={(capturedPhotoUrl) => {
            setFormData((prev) => ({
              ...prev,
              avatarUrl: capturedPhotoUrl || prev.avatarUrl,
              faceRegistered: true,
            }));
            setIsFaceEnrollModalOpen(false);
          }}
        />
      )}
    </>
  );
};
