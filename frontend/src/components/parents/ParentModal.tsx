"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Parent, Student } from "../../data/enterpriseMockData";
import {
  User,
  HeartHandshake,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Search,
  CheckCircle2,
  X,
  Plus,
  GraduationCap,
} from "lucide-react";

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (parentData: Partial<Parent>) => void;
  initialData?: Parent | null;
  students: Student[];
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  students,
}) => {
  const [formData, setFormData] = useState<Partial<Parent>>({
    name: "",
    relation: "Father",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    occupation: "",
    linkedStudentIds: [],
    linkedStudentNames: [],
  });

  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    if (initialData) {
      // Resolve all students currently assigned to this parent
      const actuallyLinkedStudents = students.filter(
        (s) =>
          s.parentId === initialData.id ||
          (s.parentName && s.parentName.trim().toLowerCase() === initialData.name.trim().toLowerCase()) ||
          (initialData.linkedStudentIds && initialData.linkedStudentIds.includes(s.id))
      );

      setFormData({
        ...initialData,
        linkedStudentIds: actuallyLinkedStudents.map((s) => s.id),
        linkedStudentNames: actuallyLinkedStudents.map((s) => s.name),
      });
    } else {
      setFormData({
        name: "",
        relation: "Father",
        phone: "",
        email: "",
        address: "",
        emergencyContact: "",
        occupation: "",
        linkedStudentIds: [],
        linkedStudentNames: [],
      });
    }
    setStudentSearch("");
  }, [initialData, isOpen, students]);

  // Toggle link / unlink student
  const handleToggleStudent = (student: Student) => {
    const currentIds = formData.linkedStudentIds || [];
    const isLinked = currentIds.includes(student.id);

    if (isLinked) {
      setFormData((prev) => ({
        ...prev,
        linkedStudentIds: (prev.linkedStudentIds || []).filter((id) => id !== student.id),
        linkedStudentNames: (prev.linkedStudentNames || []).filter((name) => name !== student.name),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        linkedStudentIds: [...(prev.linkedStudentIds || []), student.id],
        linkedStudentNames: [...(prev.linkedStudentNames || []), student.name],
        // If address is empty, borrow child address
        address: prev.address ? prev.address : student.address,
      }));
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.grade.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Parent Details" : "Add New Parent / Guardian"}
      subtitle="Register parent contact details, emergency phone, address, and link their student(s) from the registered database."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Parent Identity & Relation */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-700" />
            <span>1. Parent Profile &amp; Relation</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent / Guardian Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Relation with Student *
              </label>
              <select
                value={formData.relation || "Father"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relation: e.target.value as "Father" | "Mother" | "Legal Guardian" | "Relative",
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Relative">Relative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation || ""}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Senior Software Architect"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Mobile Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98112 34567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact, Email & Address */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-700" />
            <span>2. Communication &amp; Emergency Details</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rajesh.sharma@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Hotline Contact *
              </label>
              <input
                type="text"
                required
                value={formData.emergencyContact || ""}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="e.g. +91 98112 99999"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Residential Home Address *
              </label>
              <input
                type="text"
                required
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Tower 4, Flat 502, Shipra Sun City, Indirapuram"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Link Student from Database */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
              <span>3. Link Enrolled Student(s)</span>
            </h4>
            <span className="text-[11px] font-bold text-slate-500">
              {formData.linkedStudentIds?.length || 0} Student(s) Linked
            </span>
          </div>

          {/* Currently Linked Badges */}
          {formData.linkedStudentNames && formData.linkedStudentNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {formData.linkedStudentNames.map((name, idx) => {
                const sId = formData.linkedStudentIds?.[idx];
                const studentObj = students.find((s) => s.id === sId || s.name === name);
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{name}</span>
                    {studentObj && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({studentObj.grade} • {studentObj.busNumber})
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (studentObj) handleToggleStudent(studentObj);
                      }}
                      className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search student by name, roll number, or grade to link..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Student Picker List */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50/50 divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const isLinked = (formData.linkedStudentIds || []).includes(student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => handleToggleStudent(student)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isLinked
                      ? "bg-slate-900 text-white font-bold"
                      : "hover:bg-white text-slate-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={student.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{student.name}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isLinked ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {student.rollNo}
                        </span>
                      </div>
                      <p
                        className={`text-[10px] ${
                          isLinked ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {student.grade} • {student.busNumber} • {student.routeName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isLinked ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>LINKED</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <p className="text-center py-4 text-xs text-slate-400">
                No matching student found.
              </p>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{initialData ? "Update Parent Profile" : "Register Parent"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
