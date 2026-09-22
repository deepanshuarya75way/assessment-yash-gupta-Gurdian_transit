"use client";

import React from "react";
import { Filter, Search, RotateCcw, Bus, School, MapPin } from "lucide-react";
import { Bus as BusType, Route } from "../../data/enterpriseMockData";

interface MultiFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGrade: string;
  setSelectedGrade: (g: string) => void;
  selectedBus: string;
  setSelectedBus: (b: string) => void;
  selectedRoute: string;
  setSelectedRoute: (r: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  buses: BusType[];
  routes: Route[];
  onResetFilters: () => void;
}

export const MultiFilterBar: React.FC<MultiFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGrade,
  setSelectedGrade,
  selectedBus,
  setSelectedBus,
  selectedRoute,
  setSelectedRoute,
  selectedStatus,
  setSelectedStatus,
  buses,
  routes,
  onResetFilters,
}) => {
  return (
    <div className="clean-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Multi-Dimensional Live Transit Filters
          </span>
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Global Keyword Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, address..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />
        </div>

        {/* Class/Grade Selector */}
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="ALL">All Classes (Grade 1-12)</option>
          {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Bus Selector */}
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="ALL">All Fleet Buses</option>
          {buses.map((b) => (
            <option key={b.id} value={b.busNumber}>
              {b.busNumber} ({b.insideBusCount || b.totalAssignedStudents || 0} pax)
            </option>
          ))}
        </select>

        {/* Route Selector */}
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="ALL">All Corridors &amp; Routes</option>
          {routes.map((r) => (
            <option key={r.id} value={r.routeName}>
              {r.routeName}
            </option>
          ))}
        </select>

        {/* Status: Inside Bus / Waiting / Offboarded */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="ALL">All Transit Status</option>
          <option value="BOARDED">Inside Bus Now (Boarded)</option>
          <option value="WAITING">Waiting at Bus Stop</option>
          <option value="OFFBOARDED">Offboarded at School</option>
        </select>
      </div>
    </div>
  );
};
