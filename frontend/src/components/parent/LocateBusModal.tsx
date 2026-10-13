"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Navigation,
  Bus as BusIcon,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { Bus, Route } from "../../data/enterpriseMockData";

// Dynamic import LeafletLiveMap with Mapbox HD tiles
const LeafletLiveMap = dynamic(() => import("../tracking/LeafletLiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping" />
        <span>Loading Mapbox Radar...</span>
      </div>
    </div>
  ),
});

interface LocateBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: Bus;
  route?: Route;
  allBuses: Bus[];
}

export const LocateBusModal: React.FC<LocateBusModalProps> = ({
  isOpen,
  onClose,
  bus,
  route,
  allBuses = [],
}) => {
  if (!isOpen) return null;

  const nextStopName =
    route?.stops?.[1]?.name ||
    route?.stops?.[0]?.name ||
    bus.nextStop ||
    "Main Transit Corridor";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <BusIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Locate {bus.busNumber}
                  </h3>
                  {route && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                      {route.routeName.split("–")[0]?.trim() || "Active Route"}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                  {route?.routeName || bus.currentLocation}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mapbox Map Canvas */}
          <div className="h-[360px] w-full relative bg-slate-100">
            <LeafletLiveMap
              buses={allBuses.length > 0 ? allBuses : [bus]}
              selectedBusId={bus.id}
              onSelectBus={() => {}}
            />
          </div>

          {/* Footer details */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 truncate max-w-[230px]">
              <MapPin className="w-4 h-4 text-slate-900 flex-shrink-0" />
              <span className="truncate">Next Stop: <strong>{nextStopName}</strong></span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[11px] font-bold flex-shrink-0">
              ETA: {bus.eta || route?.estimatedTime || "3 mins"}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
