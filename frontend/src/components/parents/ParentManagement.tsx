"use client";

import React, { useState } from "react";
import { Parent, Student } from "../../data/enterpriseMockData";
import {
  HeartHandshake,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Users,
  GraduationCap,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

import { Badge } from "../ui/Badge";
import { ParentModal } from "./ParentModal";

interface ParentManagementProps {
  parents: Parent[];
  students: Student[];
  onAddParent: (parent: Parent) => void;
  onUpdateParent: (parent: Parent) => void;
  onDeleteParent: (id: string) => void;
}

export const ParentManagement: React.FC<ParentManagementProps> = ({
  parents,
  students,
  onAddParent,
  onUpdateParent,
  onDeleteParent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [copiedParentId, setCopiedParentId] = useState<string | null>(null);

  const getLinkedStudents = (parent: Parent) => {
    return students.filter(
      (s) =>
        s.parentId === parent.id ||
        (s.parentName && s.parentName.trim().toLowerCase() === parent.name.trim().toLowerCase()) ||
        (parent.linkedStudentIds && parent.linkedStudentIds.includes(s.id))
    );
  };

  const handleCopyParentCredentials = (parent: Parent) => {
    const userIdentifier = parent.email || parent.phone;
    const pass = parent.password || "parent123";
    const textToCopy = `*Guardian Transit AI - Parent Portal Credentials*\n👤 Login User: ${userIdentifier}\n🔑 Password/PIN: ${pass}\n🔗 Portal: http://localhost:3000/login`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedParentId(parent.id);
    setTimeout(() => setCopiedParentId(null), 2000);
  };

  const filteredParents = parents.filter((p) => {
    const linkedStudents = getLinkedStudents(p);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linkedStudents.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRelation = selectedRelation === "ALL" ? true : p.relation === selectedRelation;

    return matchesSearch && matchesRelation;
  });

  const handleOpenAdd = () => {
    setEditingParent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (parent: Parent) => {
    setEditingParent(parent);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">
              Parents &amp; Guardians Directory
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
              {parents.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage guardian portal credentials, SMS alert phone numbers, and linked students from the school database
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span>Add New Parent</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="clean-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parent name, phone, linked student name, or address..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRelation}
            onChange={(e) => setSelectedRelation(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Relations</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
          </select>
        </div>
      </div>

      {/* Parents Table */}
      <div className="clean-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 min-w-[180px]">Parent Profile</th>
                <th className="px-5 py-3.5 min-w-[120px] whitespace-nowrap">Relation</th>
                <th className="px-5 py-3.5 min-w-[200px]">Linked Student(s)</th>
                <th className="px-5 py-3.5 min-w-[180px] whitespace-nowrap">Primary Phone &amp; Email</th>
                <th className="px-5 py-3.5 min-w-[180px]">Residential Address</th>
                <th className="px-5 py-3.5 min-w-[190px] whitespace-nowrap">Portal Credentials</th>
                <th className="px-5 py-3.5 min-w-[90px] text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-xs">
              {filteredParents.map((parent) => {
                const linkedStudents = getLinkedStudents(parent);
                return (
                  <tr key={parent.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="px-5 py-3.5 min-w-[180px]">
                      <p className="font-bold text-slate-900 text-xs">{parent.name}</p>
                      {parent.occupation && (
                        <span className="text-[11px] text-slate-400 block mt-0.5">{parent.occupation}</span>
                      )}
                    </td>

                    {/* Relation Badge */}
                    <td className="px-5 py-3.5 min-w-[120px] whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                          parent.relation === "Mother"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : parent.relation === "Father"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {parent.relation || "Guardian"}
                      </span>
                    </td>

                    {/* Linked Students Tags */}
                    <td className="px-5 py-3.5 min-w-[200px]">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {linkedStudents.length > 0 ? (
                          linkedStudents.map((s) => (
                            <span
                              key={s.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold"
                            >
                              <GraduationCap className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                              <span>{s.name}</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({s.grade})
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No linked student</span>
                        )}
                      </div>
                    </td>

                    {/* Primary Phone & Email */}
                    <td className="px-5 py-3.5 min-w-[180px] whitespace-nowrap">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {parent.phone}
                      </p>
                      {parent.email && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {parent.email}
                        </p>
                      )}
                    </td>

                    {/* Address */}
                    <td className="px-5 py-3.5 min-w-[180px] text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{parent.address}</span>
                      </span>
                    </td>

                    {/* Portal Credentials (Replaces Emergency Number on Main View) */}
                    <td className="px-5 py-3.5 min-w-[190px] whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 max-w-[190px]">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <KeyRound className="w-3 h-3 text-cyan-600 flex-shrink-0" />
                            <span className="font-mono text-[11px] font-bold text-slate-800">
                              {parent.password || "parent123"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[120px] mt-0.5">
                            User: {parent.email ? parent.email.split("@")[0] : parent.phone}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyParentCredentials(parent)}
                          title="Copy Login Credentials for Parent"
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs"
                        >
                          {copiedParentId === parent.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right min-w-[90px] whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(parent)}
                          title="Edit Parent & Credentials"
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteParent(parent.id)}
                          title="Delete Parent"
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredParents.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No parents found matching your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Parent Modal with DB Student Picker & Credentials Generator */}
      <ParentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (editingParent) {
            onUpdateParent({ ...editingParent, ...data } as Parent);
          } else {
            const newParent: Parent = {
              id: `par-${Date.now()}`,
              name: data.name || "Parent",
              relation: data.relation || "Father",
              email: data.email || "",
              phone: data.phone || "+91 98765 43210",
              address: data.address || "Address",
              emergencyContact: data.emergencyContact || "+91 98765 43211",
              occupation: data.occupation || "",
              linkedStudentIds: data.linkedStudentIds || [],
              linkedStudentNames: data.linkedStudentNames || [],
              password: data.password || "parent123",
            };
            onAddParent(newParent);
          }
        }}
        initialData={editingParent}
        students={students}
      />
    </div>
  );
};

