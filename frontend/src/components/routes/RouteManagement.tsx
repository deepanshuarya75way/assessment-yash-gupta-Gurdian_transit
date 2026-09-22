"use client";

import React, { useState } from "react";
import {
  Navigation,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Bus as BusIcon,
  Phone,
  UserCheck,
  LayoutGrid,
  List,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Route, Bus, Student } from "../../data/enterpriseMockData";
import { RouteModal } from "./RouteModal";
import { Badge } from "../ui/Badge";

interface RouteManagementProps {
  routes: Route[];
  buses: Bus[];
  students: Student[];
  onAddRoute: (route: Route) => void;
  onUpdateRoute: (route: Route) => void;
  onDeleteRoute: (routeId: string) => void;
}

export const RouteManagement: React.FC<RouteManagementProps> = ({
  routes = [],
  buses = [],
  students = [],
  onAddRoute,
  onUpdateRoute,
  onDeleteRoute,
}) => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  // Safe normalized routes list
  const safeRoutes: Route[] = (routes || []).map((r) => ({
    id: r.id || `rt-${Math.random()}`,
    routeName: r.routeName || (r as any).name || "Transit Route",
    startPoint: r.startPoint || (r as any).startDestination || "Indirapuram",
    endPoint: r.endPoint || "Apex Central Campus",
    totalDistance: r.totalDistance || "14.5 km",
    estimatedTime: r.estimatedTime || "35 mins",
    assignedBusNumber: r.assignedBusNumber || (r as any).assigned_bus_number || "Bus #12",
    stops: (r.stops || []).map((s: any, idx: number) => ({
      id: s.id || `st-${idx}`,
      name: s.name || `Stop ${idx + 1}`,
      morningTime: s.morningTime || s.time || "07:30 AM",
      eveningTime: s.eveningTime || "02:30 PM",
      studentCount: typeof s.studentCount === "number" ? s.studentCount : 8,
    })),
  }));

  const filtered = safeRoutes.filter((r) => {
    const assignedBus = (buses || []).find((b) => b.busNumber === r.assignedBusNumber);
    const driverName = assignedBus?.driverName || "";
    const driverPhone = assignedBus?.driverPhone || "";

    const q = (search || "").toLowerCase();
    return (
      (r.routeName || "").toLowerCase().includes(q) ||
      (r.assignedBusNumber || "").toLowerCase().includes(q) ||
      driverName.toLowerCase().includes(q) ||
      driverPhone.includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: Route) => {
    setEditingRoute(route);
    setIsModalOpen(true);
  };

  const handleSaveRoute = (data: Partial<Route>) => {
    if (editingRoute) {
      onUpdateRoute({
        ...editingRoute,
        ...data,
      } as Route);
    } else {
      const newRoute: Route = {
        id: `rt-${Date.now()}`,
        routeName: data.routeName || "New Transit Route",
        startPoint: data.startPoint || "Indirapuram Terminal",
        endPoint: data.endPoint || "Apex Central Campus Hub",
        totalDistance: data.totalDistance || "14.5 km",
        estimatedTime: data.estimatedTime || "35 mins",
        assignedBusNumber: data.assignedBusNumber || buses[0]?.busNumber || "Bus #12",
        stops: data.stops || [],
      };
      onAddRoute(newRoute);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="clean-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-slate-900" />
            Transit Routes &amp; Stops Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage school bus transit routes, intermediate scheduled stops, and assigned crew contacts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Interactive Timeline Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Route</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="clean-card rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by route name, driver name, phone, or bus..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
          Total: <strong className="text-slate-900">{safeRoutes.length}</strong> Active Transit Routes
        </span>
      </div>

      {/* VIEW 1: CLEAN TABLE VIEW */}
      {viewMode === "table" && (
        <div className="clean-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 min-w-[200px]">Route Name &amp; Code</th>
                  <th className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">Assigned Bus</th>
                  <th className="px-5 py-3.5 min-w-[200px] whitespace-nowrap">Driver Name &amp; Phone</th>
                  <th className="px-5 py-3.5 min-w-[130px] whitespace-nowrap">Total Stops</th>
                  <th className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">Distance &amp; Time</th>
                  <th className="px-5 py-3.5 min-w-[120px] whitespace-nowrap">Students Assigned</th>
                  <th className="px-5 py-3.5 min-w-[90px] text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((route) => {
                  const isExpanded = expandedRouteId === route.id;
                  const matchingStudents = (students || []).filter(
                    (s) => s.routeName === route.routeName || s.busNumber === route.assignedBusNumber
                  );
                  const assignedBus = (buses || []).find((b) => b.busNumber === route.assignedBusNumber);
                  const driverName = assignedBus?.driverName || "Rajesh Kumar";
                  const driverPhone = assignedBus?.driverPhone || "+91 94567 11223";

                  return (
                    <React.Fragment key={route.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        {/* Name */}
                        <td className="px-5 py-3.5 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                              <Navigation className="w-4 h-4 text-slate-800" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{route.routeName}</p>
                              <span className="font-mono text-[10px] text-slate-400 font-bold block">
                                {route.id.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Bus */}
                        <td className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <BusIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>{route.assignedBusNumber}</span>
                          </div>
                        </td>

                        {/* Driver Name & Phone Number */}
                        <td className="px-5 py-3.5 min-w-[200px] whitespace-nowrap">
                          <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{driverName}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{driverPhone}</span>
                          </p>
                        </td>

                        {/* Stops Count with Quick Expand Trigger */}
                        <td className="px-5 py-3.5 min-w-[130px] whitespace-nowrap">
                          <button
                            onClick={() => setExpandedRouteId(isExpanded ? null : route.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors"
                          >
                            <MapPin className="w-3 h-3 text-cyan-600" />
                            <span>{(route.stops || []).length} Stops</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-slate-500" />
                            )}
                          </button>
                        </td>

                        {/* Distance & Time */}
                        <td className="px-5 py-3.5 min-w-[140px] whitespace-nowrap">
                          <p className="font-bold text-slate-900">{route.totalDistance}</p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {route.estimatedTime}
                          </span>
                        </td>

                        {/* Students Assigned */}
                        <td className="px-5 py-3.5 min-w-[120px] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                            <Users className="w-3 h-3" />
                            <span>{matchingStudents.length} Students</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right min-w-[90px] whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(route)}
                              title="Edit Route"
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteRoute(route.id)}
                              title="Delete Route"
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Stops Sequence */}
                      {isExpanded && (
                        <tr className="bg-slate-50/60">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                                <span>Sequential Intermediate Stops &amp; Schedule</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {(route.stops || []).map((stop, idx) => (
                                  <div
                                    key={stop.id || idx}
                                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 relative"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                                        Stop #{idx + 1}
                                      </span>
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                                        {stop.studentCount || 8} Students
                                      </span>
                                    </div>
                                    <p className="font-bold text-slate-900 text-xs truncate">
                                      {stop.name}
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                      <span>Pickup: <strong>{stop.morningTime || "07:30 AM"}</strong></span>
                                      <span>Drop: <strong>{stop.eveningTime || "02:30 PM"}</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs">
                No transit routes found matching your query.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE CARDS & SUBWAY VISUAL TIMELINE */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((route) => {
            const matchingStudents = (students || []).filter(
              (s) => s.routeName === route.routeName || s.busNumber === route.assignedBusNumber
            );
            const assignedBus = (buses || []).find((b) => b.busNumber === route.assignedBusNumber);
            const driverName = assignedBus?.driverName || "Rajesh Kumar";
            const driverPhone = assignedBus?.driverPhone || "+91 94567 11223";

            return (
              <div
                key={route.id}
                className="clean-card rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{route.routeName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <BusIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{route.assignedBusNumber}</span>
                        <span>•</span>
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{driverName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(route)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRoute(route.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Distance</span>
                    <span className="text-xs font-bold text-slate-900">{route.totalDistance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Est. Duration</span>
                    <span className="text-xs font-bold text-slate-900">{route.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Passengers</span>
                    <span className="text-xs font-bold text-emerald-600">{matchingStudents.length} Students</span>
                  </div>
                </div>

                {/* Visual Subway Timeline */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Transit Stops Timeline
                  </span>
                  <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(route.stops || []).map((stop, idx) => (
                      <div key={stop.id || idx} className="relative flex items-center justify-between text-xs">
                        <div className="absolute -left-6 w-5 h-5 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                        </div>
                        <span className="font-bold text-slate-800">{stop.name}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono">{stop.morningTime || "07:30 AM"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Contact Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Emergency Driver Direct:</span>
                  </span>
                  <a
                    href={`tel:${driverPhone}`}
                    className="font-mono font-bold text-slate-900 hover:text-cyan-600 transition-colors"
                  >
                    {driverPhone}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Route Modal */}
      <RouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoute}
        editingRoute={editingRoute}
        buses={buses}
      />
    </div>
  );
};
