"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  Sparkles,
  CheckCircle2,
  Scan,
  Upload,
  RefreshCw,
  User,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Student } from "../../data/mockData";

interface RegisterFaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentId: string) => void;
  students: Student[];
}

export const RegisterFaceModal: React.FC<RegisterFaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  students,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ""
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          onSuccess(selectedStudentId);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleReset = () => {
    setIsScanning(false);
    setScanProgress(0);
    setScanComplete(false);
  };

  if (!isOpen) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-panel rounded-3xl p-8 max-w-xl w-full relative border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow text-white">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Register Student Biometrics
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Extract 512-d ArcFace facial vector and commit to pgvector database
            </p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Select Student Profile
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              handleReset();
            }}
            className="w-full bg-slate-900/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.name} ({s.studentIdNumber} • {s.grade})
              </option>
            ))}
          </select>
        </div>

        {/* Live Biometric Camera Preview Canvas */}
        <div className="relative w-full h-64 rounded-2xl bg-slate-950 border-2 border-dashed border-white/20 overflow-hidden flex flex-col items-center justify-center mb-6">
          {/* Animated Laser Scanning Line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scanline z-30" />
          )}

          {/* Student Selected Picture Preview */}
          {selectedStudent && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.name}
                  className="w-full h-full object-cover"
                />

                {/* AI Facial Keypoints Simulation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-cyan-400 rounded-lg animate-ping opacity-60" />
                  </div>
                )}
              </div>

              <span className="mt-2 text-xs font-bold text-white">
                {selectedStudent.name}
              </span>
            </div>
          )}

          {/* Scanning Progress Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
              <p className="text-sm font-bold text-white">
                Computing 512-d ArcFace Embedding...
              </p>
              <div className="w-48 bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="text-xs text-cyan-300 font-mono mt-1 font-bold">
                {scanProgress}%
              </span>
            </div>
          )}

          {/* Success State */}
          {scanComplete && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 mb-2 shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-base">Face Vector Registered!</h4>
              <p className="text-xs text-emerald-300 mt-1">
                Vector stored in pgvector database with Cosine metric index.
              </p>
            </motion.div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-all"
          >
            Cancel
          </button>

          {!scanComplete ? (
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow transition-all active:scale-95 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>{isScanning ? "Scanning Face..." : "Capture & Register Face"}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-glowEmerald transition-all"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
