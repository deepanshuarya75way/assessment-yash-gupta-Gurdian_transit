"use client";

import React from "react";
import { Student } from "../../data/enterpriseMockData";
import { Users, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";

interface FilteredManifestViewProps {
  filteredStudents: Student[];
  totalStudentsCount: number;
  onNavigateToStudents?: () => void;
}

export const FilteredManifestView: React.FC<FilteredManifestViewProps> = ({
  filteredStudents,
  totalStudentsCount,
  onNavigateToStudents,
}) => {
  // Wrap and limit display on home screen to UP TO 8 STUDENTS ONLY as requested
  const displayedStudents = filteredStudents.slice(0, 8);
  const hasMore = filteredStudents.length > 8;

  return (
    <div className="clean-card rounded-2xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            Live Student Manifest
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <strong>{displayedStudents.length}</strong> of <strong>{filteredStudents.length}</strong> matching students (Filtered from {totalStudentsCount} enrolled campus students)
          </p>
        </div>

        {onNavigateToStudents && (
          <button
            onClick={onNavigateToStudents}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all self-start sm:self-auto"
          >
            <span>View Full 112 Students Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 min-w-[180px]">Student</th>
              <th className="px-4 py-3 min-w-[110px] whitespace-nowrap">Class &amp; Roll</th>
              <th className="px-4 py-3 min-w-[160px]">Assigned Bus &amp; Route</th>
              <th className="px-4 py-3 min-w-[180px]">Residential Address</th>
              <th className="px-4 py-3 min-w-[150px] whitespace-nowrap">Parent Contact</th>
              <th className="px-4 py-3 min-w-[120px] whitespace-nowrap">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-xs">
            {displayedStudents.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 min-w-[180px] flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                  <span className="font-bold text-slate-900 truncate">{s.name}</span>
                </td>
                <td className="px-4 py-3 min-w-[110px] whitespace-nowrap">
                  <span className="font-semibold text-slate-800 block">{s.grade} - {s.section}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">{s.rollNo}</span>
                </td>
                <td className="px-4 py-3 min-w-[160px]">
                  <span className="font-bold text-slate-900 block">{s.busNumber}</span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-xs">{s.routeName}</span>
                </td>
                <td className="px-4 py-3 min-w-[180px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate max-w-[180px]">{s.address}</span>
                  </span>
                </td>
                <td className="px-4 py-3 min-w-[150px] whitespace-nowrap">
                  <span className="text-slate-900 font-semibold block">{s.parentName}</span>
                  <span className="text-[10px] text-slate-500 block">{s.parentPhone}</span>
                </td>
                <td className="px-4 py-3 min-w-[120px] whitespace-nowrap">
                  <Badge
                    variant={
                      s.status === "BOARDED"
                        ? "success"
                        : s.status === "WAITING"
                        ? "warning"
                        : "neutral"
                    }
                    pulse={s.status === "BOARDED"}
                  >
                    {s.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No students match the current filter combination. Try resetting filters.
          </div>
        )}
      </div>

      {/* Footer bar if more than 8 students exist */}
      {hasMore && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Showing top 8 students on Home Dashboard preview. {filteredStudents.length - 8} more students available in Student Directory.
          </span>
          {onNavigateToStudents && (
            <button
              onClick={onNavigateToStudents}
              className="text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1"
            >
              <span>Explore All {filteredStudents.length} Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
