"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  GraduationCap,
  Bus as BusIcon,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Student, Parent, Bus, Route } from "../../data/enterpriseMockData";

interface BusCommunityTabProps {
  currentStudent: Student;
  allStudents: Student[];
  allParents: Parent[];
  currentBus?: Bus;
  currentRoute?: Route;
}

export const BusCommunityTab: React.FC<BusCommunityTabProps> = ({
  currentStudent,
  allStudents = [],
  allParents = [],
  currentBus,
  currentRoute,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter all fellow students traveling on the same bus
  const sameBusStudents = useMemo(() => {
    const targetBusNumber = currentStudent.busNumber || currentBus?.busNumber || "Bus #08";
    return allStudents.filter(
      (s) => s.busNumber?.trim().toLowerCase() === targetBusNumber.trim().toLowerCase()
    );
  }, [allStudents, currentStudent.busNumber, currentBus]);

  // Map each student with their parent contact details
  const cohortWithParents = useMemo(() => {
    return sameBusStudents.map((stu) => {
      const matchedParent = allParents.find(
        (p) =>
          p.id === stu.parentId ||
          (p.name && stu.parentName && p.name.trim().toLowerCase() === stu.parentName.trim().toLowerCase()) ||
          p.linkedStudentIds?.includes(stu.id)
      );

      const parentName = matchedParent?.name || stu.parentName || "Guardian";
      const parentPhone = matchedParent?.phone || stu.parentPhone || "+91 98112 00100";
      const parentRelation = matchedParent?.relation || "Parent";

      return {
        student: stu,
        parentName,
        parentPhone,
        parentRelation,
        isSelf: stu.id === currentStudent.id,
      };
    });
  }, [sameBusStudents, allParents, currentStudent.id]);

  // Apply search query
  const filteredCohort = useMemo(() => {
    if (!searchQuery.trim()) return cohortWithParents;
    const q = searchQuery.toLowerCase().trim();
    return cohortWithParents.filter(
      (item) =>
        item.student.name.toLowerCase().includes(q) ||
        item.parentName.toLowerCase().includes(q) ||
        item.student.address.toLowerCase().includes(q) ||
        item.parentPhone.includes(q) ||
        item.student.grade.toLowerCase().includes(q)
    );
  }, [cohortWithParents, searchQuery]);

  const busName = currentStudent.busNumber || currentBus?.busNumber || "Bus #08";
  const routeName = currentRoute?.routeName || currentBus?.routeName || "Assigned Transit Route";

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-black text-white p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {busName} Parent Cohort
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
            {sameBusStudents.length} Co-Students
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {routeName} • Fellow parents on your child&apos;s bus for school carpooling and safety coordination.
        </p>
        {currentRoute && (
          <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800 flex items-center justify-between">
            <span>{currentRoute.startPoint} ➔ {currentRoute.endPoint}</span>
            <span>{currentRoute.totalDistance}</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student, parent, or stop..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black shadow-sm"
        />
      </div>

      {/* Cohort List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
            Co-Passengers ({filteredCohort.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Verified School Contacts
          </span>
        </div>

        <AnimatePresence>
          {filteredCohort.map(({ student, parentName, parentPhone, parentRelation, isSelf }, index) => {
            const cleanDigits = parentPhone.replace(/\D/g, "");
            const whatsappUrl = `https://wa.me/${cleanDigits.startsWith("91") ? cleanDigits : "91" + cleanDigits}?text=Hi%20${encodeURIComponent(
              parentName
            )},%20I%20am%20${encodeURIComponent(
              currentStudent.parentName || "a fellow parent"
            )}%20from%20Guardian%20Transit%20(${busName}).`;

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className={`p-3.5 rounded-3xl border transition-all ${
                  isSelf
                    ? "bg-slate-50 border-black ring-1 ring-black shadow-sm"
                    : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Student Avatar & Details */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                      />
                      {isSelf && (
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[8px] font-extrabold bg-black text-white uppercase">
                          You
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {student.name}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-500">
                          ({student.grade})
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Parent: <strong>{parentName}</strong> <span className="text-[10px] text-slate-400">({parentRelation})</span>
                      </div>

                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 truncate max-w-[170px]">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{student.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Call & WhatsApp Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                      href={`tel:${parentPhone}`}
                      title={`Call ${parentName}`}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 flex items-center justify-center transition-all active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`WhatsApp ${parentName}`}
                      className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-black text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredCohort.length === 0 && (
          <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs">
            No co-passengers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
