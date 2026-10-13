"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Navigation,
  Bus as BusIcon,
  User,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Sparkles,
  AlertCircle,
  Route as RouteIcon,
  Milestone,
} from "lucide-react";
import { Student, Bus, Route, SEED_ROUTES } from "../../data/enterpriseMockData";
import { LocateBusModal } from "./LocateBusModal";

interface HomeTabProps {
  currentStudent: Student;
  allStudents: Student[];
  onSwitchStudent?: (studentId: string) => void;
  bus: Bus;
  route?: Route;
  allBuses: Bus[];
  allRoutes?: Route[];
}

export const HomeTab: React.FC<HomeTabProps> = ({
  currentStudent,
  allStudents = [],
  onSwitchStudent,
  bus,
  route,
  allBuses = [],
  allRoutes = SEED_ROUTES,
}) => {
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Dynamically resolve the active route for this student and bus
  const activeRoute =
    route ||
    allRoutes.find(
      (r) =>
        r.id === currentStudent.routeId ||
        (currentStudent.busNumber && r.assignedBusNumber?.trim().toLowerCase() === currentStudent.busNumber?.trim().toLowerCase()) ||
        (bus.busNumber && r.assignedBusNumber?.trim().toLowerCase() === bus.busNumber?.trim().toLowerCase()) ||
        r.id === bus.routeId
    ) ||
    SEED_ROUTES.find((r) => r.assignedBusNumber === bus.busNumber) ||
    SEED_ROUTES[0];

  // Dynamically resolve stops from the active route
  const stops =
    activeRoute?.stops && activeRoute.stops.length > 0
      ? activeRoute.stops
      : bus.stops && bus.stops.length > 0
      ? bus.stops
      : SEED_ROUTES[0].stops;

  const isOnboarded = currentStudent.status === "BOARDED";

  return (
    <div className="space-y-4 pb-20">
      {/* 1. MULTI-CHILD QUICK SWITCHER (If Parent has multiple children) */}
      {allStudents.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {allStudents.map((stu) => {
            const isSelected = stu.id === currentStudent.id;
            return (
              <button
                key={stu.id}
                onClick={() => onSwitchStudent && onSwitchStudent(stu.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? "bg-black text-white border-black shadow-md ring-2 ring-black/10"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <img
                  src={stu.avatarUrl}
                  alt={stu.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                />
                <span>{stu.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {stu.grade}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. MAIN CHILD TRANSIT STATUS CARD */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {currentStudent.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentStudent.grade}-{currentStudent.section} • Roll No: <strong className="text-slate-800 font-mono">{currentStudent.rollNo}</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                isOnboarded
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnboarded ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              {isOnboarded ? "Onboarded Bus" : "Waiting for Bus"}
            </span>
          </div>
        </div>

        {/* Bus & Route Summary Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
                <BusIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">{bus.busNumber}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                    {activeRoute.routeName.split("–")[0]?.trim() || "Active Route"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                  {activeRoute.routeName}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMapModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locate Bus</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1 truncate max-w-[220px]">
              <Milestone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{activeRoute.startPoint} ➔ {activeRoute.endPoint}</span>
            </div>
            <span className="font-bold text-slate-800 flex-shrink-0 font-mono">
              {activeRoute.totalDistance} • {activeRoute.estimatedTime}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DIRECT CREW CALL ACTIONS (Driver & Conductor) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Call Driver */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Driver
            </span>
            <strong className="text-xs text-slate-900 truncate block mt-0.5">
              {bus.driverName}
            </strong>
          </div>

          <a
            href={`tel:${bus.driverPhone}`}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call Driver</span>
          </a>
        </div>

        {/* Call Conductor */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Conductor
            </span>
            <strong className="text-xs text-slate-900 truncate block mt-0.5">
              {bus.conductorName || "Amit Sharma"}
            </strong>
          </div>

          <a
            href={`tel:${bus.conductorPhone || "+91 98112 01002"}`}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Call Conductor</span>
          </a>
        </div>
      </div>

      {/* 4. LIVE STOP PROGRESSION TIMELINE */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-slate-900" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Live Route Stops &amp; ETA
            </h3>
          </div>
          <span className="text-xs font-extrabold text-slate-900 font-mono">
            Next: {bus.eta || "3 mins"}
          </span>
        </div>

        {/* Stop Progression */}
        <div className="space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {stops.map((stop, idx) => {
            const isCompleted = idx === 0;
            const isCurrentNext = idx === 1;
            const isDestination = idx === stops.length - 1;
            const isChildAssignedStop =
              (currentStudent.pickupStop && stop.name.toLowerCase().includes(currentStudent.pickupStop.toLowerCase())) ||
              (currentStudent.dropStop && stop.name.toLowerCase().includes(currentStudent.dropStop.toLowerCase())) ||
              idx === 1;

            return (
              <div key={stop.id || idx} className="relative flex items-center justify-between text-xs">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-7 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-slate-900 border-slate-900 text-white"
                      : isCurrentNext
                      ? "bg-black border-black text-white ring-4 ring-slate-200 animate-pulse"
                      : isDestination
                      ? "bg-white border-slate-900 text-slate-900"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-extrabold">{idx + 1}</span>
                  )}
                </div>

                {/* Stop Name & Scheduled Time */}
                <div className="pr-2 flex-1 min-w-0">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span className="truncate">{stop.name}</span>
                    {isCurrentNext && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-black text-white uppercase">
                        Current Stop
                      </span>
                    )}
                    {isChildAssignedStop && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {currentStudent.name}&apos;s Stop
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                    <span>Morning: {stop.morningTime}</span>
                    <span>•</span>
                    <span>Evening: {stop.eveningTime || "03:15 PM"}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <span
                  className={`text-[11px] font-medium flex-shrink-0 ${
                    isCompleted
                      ? "text-slate-400 font-mono"
                      : isCurrentNext
                      ? "text-slate-900 font-bold"
                      : "text-slate-400"
                  }`}
                >
                  {isCompleted ? "Passed" : isCurrentNext ? "Arriving" : "Upcoming"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locate Bus Modal */}
      <LocateBusModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        bus={bus}
        route={activeRoute}
        allBuses={allBuses}
      />
    </div>
  );
};
