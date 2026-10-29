"use client";

import React, { useState } from "react";
import {
  Student,
  Bus,
  Parent,
} from "../../data/enterpriseMockData";
import {
  Users,
  UserPlus,
  Search,
  Scan,
  Edit2,
  Trash2,
  Phone,
  Camera,
  CheckCircle2,
  CreditCard,
  Sparkles,
  History,
  X,
  Bus as BusIcon,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { StudentModal } from "./StudentModal";
import { FaceEnrollModal } from "./FaceEnrollModal";
import {
  IdCardOcrScannerModal,
  ExtractedIdCardData,
} from "./IdCardOcrScannerModal";

interface StudentManagementProps {
  students: Student[];
  buses: Bus[];
  parents: Parent[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onEnrollFaceSuccess: (id: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  buses,
  parents,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onEnrollFaceSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [selectedBus, setSelectedBus] = useState("ALL");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [autoFilledOcrData, setAutoFilledOcrData] = useState<ExtractedIdCardData | null>(null);
  const [enrollingStudent, setEnrollingStudent] = useState<Student | null>(null);
  const [isOcrScannerOpen, setIsOcrScannerOpen] = useState(false);
  const [timelineStudent, setTimelineStudent] = useState<Student | null>(null);

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === "ALL" ? true : s.grade === selectedGrade;
    const matchesBus = selectedBus === "ALL" ? true : s.busNumber === selectedBus;

    return matchesSearch && matchesGrade && matchesBus;
  });

  // Flow 1: Manual Registration
  const handleOpenManualRegister = () => {
    setEditingStudent(null);
    setAutoFilledOcrData(null);
    setIsFormModalOpen(true);
  };

  // Flow 2: Camera Scan ID Card Auto-Fill
  const handleOcrScanComplete = (extracted: ExtractedIdCardData) => {
    setEditingStudent(null);
    setAutoFilledOcrData(extracted);
    setIsFormModalOpen(true); // Opens form pre-filled with ID Card data!
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setAutoFilledOcrData(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">
              Student Directory &amp; Biometrics
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
              {students.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-fill from camera ID Card OCR or register manually with bus route and facial biometrics
          </p>
        </div>

        {/* The Two Distinct Registration Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Button 1: Camera ID Card Scanner */}
          <button
            onClick={() => setIsOcrScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 text-cyan-600" />
            <span>Scan ID Card (Auto-Fill)</span>
          </button>

          {/* Button 2: Manual Registration */}
          <button
            onClick={handleOpenManualRegister}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>Manual Registration</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="clean-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, address, or parent..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Grades</option>
            {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Buses</option>
            {buses.map((b) => (
              <option key={b.id} value={b.busNumber}>
                {b.busNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="clean-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 min-w-[220px]">Student Profile</th>
                <th className="px-5 py-3.5 min-w-[120px] whitespace-nowrap">Class &amp; Roll</th>
                <th className="px-5 py-3.5 min-w-[180px]">Bus &amp; Route</th>
                <th className="px-5 py-3.5 min-w-[180px]">Parent &amp; Contact</th>
                <th className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">Biometrics</th>
                <th className="px-5 py-3.5 min-w-[120px] text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-xs">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Name & Avatar */}
                  <td className="px-5 py-3.5 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">{student.name}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {student.address}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Class & Roll */}
                  <td className="px-5 py-3.5 min-w-[120px] whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">
                      {student.grade} - {student.section}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {student.rollNo}
                    </span>
                  </td>

                  {/* Bus & Route */}
                  <td className="px-5 py-3.5 min-w-[180px]">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <BusIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{student.busNumber}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                      {student.routeName}
                    </span>
                  </td>

                  {/* Parent */}
                  <td className="px-5 py-3.5 min-w-[180px]">
                    <p className="font-bold text-slate-900">{student.parentName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {student.parentPhone}
                    </p>
                  </td>

                  {/* Biometric Status */}
                  <td className="px-5 py-3.5 min-w-[160px] whitespace-nowrap">
                    {student.faceRegistered ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ArcFace Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => setEnrollingStudent(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-sky-600" />
                        Enroll Face
                      </button>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-3.5 text-right min-w-[120px] whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEnrollingStudent(student)}
                        title="Biometric Face Scanner"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Scan className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(student)}
                        title="Edit Student"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        title="Delete Student"
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setTimelineStudent(student)}
                        title="View Bus Transfer History"
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

          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No students found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setAutoFilledOcrData(null);
        }}
        onSave={(data) => {
          if (editingStudent) {
            onUpdateStudent({ ...editingStudent, ...data } as Student);
          } else {
            const newStudent: Student = {
              id: `stu-${Date.now()}`,
              name: data.name || "Student",
              rollNo: data.rollNo || "STU-000",
              grade: data.grade || "Grade 10",
              section: data.section || "A",
              address: data.address || "Address",
              busId: data.busId || buses[0]?.id || "",
              busNumber: data.busNumber || "Bus #14",
              routeName: data.routeName || "Route",
              parentId: data.parentId || parents[0]?.id || "",
              parentName: data.parentName || "Parent",
              parentPhone: data.parentPhone || "+91 98765 43210",
              status: "WAITING",
              lastCheckin: "Registered",
              avatarUrl:
                data.avatarUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              faceRegistered: data.faceRegistered || false,
            };
            onAddStudent(newStudent);
          }
        }}
        initialData={editingStudent}
        autoFilledOcrData={autoFilledOcrData}
        buses={buses}
        parents={parents}
        students = {students}
      />

      {/* Biometric Face Scanner Modal */}
      <FaceEnrollModal
        isOpen={!!enrollingStudent}
        onClose={() => setEnrollingStudent(null)}
        student={enrollingStudent}
        onEnrollSuccess={(capturedPhotoUrl) => {
          if (enrollingStudent) {
            onUpdateStudent({
              ...enrollingStudent,
              avatarUrl: capturedPhotoUrl || enrollingStudent.avatarUrl,
              faceRegistered: true,
            });
            onEnrollFaceSuccess(enrollingStudent.id);
          }
        }}
      />

      {/* Live ID Card Camera Scanner Popup */}
      <IdCardOcrScannerModal
        isOpen={isOcrScannerOpen}
        onClose={() => setIsOcrScannerOpen(false)}
        onScanComplete={handleOcrScanComplete}
      />
    </div>
  );
};
