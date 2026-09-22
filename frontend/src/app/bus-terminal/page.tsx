"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bus as BusIcon,
  CheckCircle2,
  ShieldAlert,
  Radio,
  Scan,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  FlipHorizontal,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Camera,
  Play,
  ChevronDown,
  UserCheck,
  UserX,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ApiClient } from "../../services/apiClient";
import Link from "next/link";

interface VerificationResult {
  status: "AUTHORIZED" | "WRONG_BUS" | "UNAUTHORIZED";
  studentName: string;
  rollNo: string;
  grade: string;
  section: string;
  avatarUrl: string;
  assignedBus: string;
  currentBus: string;
  confidence: number;
  timestamp: string;
  message: string;
}

export default function MobileBusTerminalPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Selected Demo Persona
  const [activePersona, setActivePersona] = useState<"AUTO" | "WRONG_BUS" | "INTRUDER">("AUTO");

  // Stationed Bus (Bus mounted on)
  const [stationedBusNumber, setStationedBusNumber] = useState("Bus #08");
  const [isBusSelectorOpen, setIsBusSelectorOpen] = useState(false);

  // Active Verification Card Overlay
  const [activeResult, setActiveResult] = useState<VerificationResult | null>(null);

  // Live HUD Status Text
  const [hudScanText, setHudScanText] = useState("Scanning for Face...");

  // Debounce maps to prevent alert spamming
  const lastScannedRef = useRef<{ [key: string]: number }>({});
  const isProcessingRef = useRef(false);

  // Live Boarding Feed
  const [boardedFeed, setBoardedFeed] = useState<
    Array<{
      id: string;
      name: string;
      rollNo: string;
      grade: string;
      time: string;
      avatarUrl: string;
      status: "AUTHORIZED" | "WRONG_BUS" | "UNAUTHORIZED";
      assignedBus?: string;
    }>
  >([]);

  // Text-To-Speech (Speaks aloud on device)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis blocked
    }
  };

  // Sound Synthesizer Chimes
  const playAudioCue = (type: "SUCCESS" | "WRONG_BUS" | "ALARM") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "SUCCESS") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "WRONG_BUS") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio autoplay restrictions
    }
  };

  // Start Real-Time Camera Stream
  const initCamera = async (mode: "user" | "environment") => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setFacingMode(mode);
    } catch (err: any) {
      console.warn("Primary camera access failed:", err);
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = fallback;
        if (videoRef.current) {
          videoRef.current.srcObject = fallback;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (e: any) {
        setCameraActive(false);
        setCameraError(
          "Camera access blocked. Please allow camera permissions in your browser or test directly on localhost."
        );
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    initCamera(nextMode);
  };

  useEffect(() => {
    initCamera("user");
    return () => {
      stopCamera();
    };
  }, []);

  // Continuous Neural Face Verification Logic
  const processSnapshot = async (dataUrl: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsScanning(true);
    setHudScanText("⚡ Analyzing Biometric Embedding (512-D)...");

    try {
      const response = await ApiClient.verifyFaceBiometrics({
        image: dataUrl,
        busNumber: stationedBusNumber,
        persona: activePersona,
        shift: "Morning Pickup",
        stopLocation: "Lal Kuan Gate / On-Board",
      });

      const now = Date.now();
      const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      const isMatched = response && (response.matched === true || response.verified === true);

      if (isMatched) {
        const studentName = response.studentName || response.student?.name || "Yash Gupta";
        const rollNo = response.rollNo || response.student?.rollNo || "2023B1541162";
        const grade = response.grade || response.student?.grade || "B.Tech";
        const section = response.section || response.student?.section || "CSE(DS)";
        const avatarUrl = response.avatarUrl || response.student?.avatarUrl || dataUrl;
        const assignedBus = response.assignedBus || response.student?.busNumber || stationedBusNumber;
        const confidence = response.confidence || 99.2;
        const isCorrectBus = activePersona === "WRONG_BUS" ? false : response.isCorrectBus !== false;

        const studentKey = studentName + rollNo;
        const lastTime = lastScannedRef.current[studentKey] || 0;

        if (now - lastTime > 6000) {
          lastScannedRef.current[studentKey] = now;

          // Haptic Vibration on Phone
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([150, 80, 150]);
          }

          if (isCorrectBus) {
            // CASE 1: ✅ AUTHORIZED (CORRECT BUS)
            const resultObj: VerificationResult = {
              status: "AUTHORIZED",
              studentName: studentName,
              rollNo: rollNo,
              grade: grade,
              section: section,
              avatarUrl: avatarUrl,
              assignedBus: assignedBus,
              currentBus: stationedBusNumber,
              confidence: confidence,
              timestamp: nowStr,
              message: "Biometric Verified • Assigned Bus Match",
            };

            setActiveResult(resultObj);
            playAudioCue("SUCCESS");
            speakText(`Verified: ${studentName}. Boarding approved for ${stationedBusNumber}.`);

            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 },
            });

            setBoardedFeed((prev) => [
              {
                id: `feed-${Date.now()}`,
                name: resultObj.studentName,
                rollNo: resultObj.rollNo,
                grade: `${resultObj.grade} (${resultObj.section})`,
                time: nowStr,
                avatarUrl: resultObj.avatarUrl,
                status: "AUTHORIZED",
              },
              ...prev,
            ]);

            ApiClient.recordAttendance({
              studentId: response.studentId || "stu-yash-01",
              studentName: resultObj.studentName,
              rollNo: resultObj.rollNo,
              grade: `${resultObj.grade} (${resultObj.section})`,
              busNumber: stationedBusNumber,
              eventType: "BOARD",
              timestamp: nowStr,
              confidence: resultObj.confidence,
              verificationMethod: "AI Face Biometrics",
              status: "VERIFIED",
              photoUrl: resultObj.avatarUrl,
              shift: "Morning Pickup",
              stopLocation: "ABES Lal Kuan Gate",
            });
          } else {
            // CASE 2: ⚠️ WRONG BUS DETECTED
            const wrongAssigned = assignedBus === stationedBusNumber ? "Bus #01" : assignedBus;
            const resultObj: VerificationResult = {
              status: "WRONG_BUS",
              studentName: activePersona === "WRONG_BUS" ? "Aaditya Sharma" : studentName,
              rollNo: activePersona === "WRONG_BUS" ? "2023B1541001" : rollNo,
              grade: grade,
              section: section,
              avatarUrl: avatarUrl,
              assignedBus: wrongAssigned,
              currentBus: stationedBusNumber,
              confidence: confidence,
              timestamp: nowStr,
              message: `Assigned to ${wrongAssigned}, but scanned at ${stationedBusNumber}!`,
            };

            setActiveResult(resultObj);
            playAudioCue("WRONG_BUS");
            speakText(`Warning! ${resultObj.studentName} is assigned to ${wrongAssigned}, but boarded ${stationedBusNumber}.`);

            setBoardedFeed((prev) => [
              {
                id: `feed-${Date.now()}`,
                name: resultObj.studentName,
                rollNo: resultObj.rollNo,
                grade: `${resultObj.grade} (${resultObj.section})`,
                time: nowStr,
                avatarUrl: resultObj.avatarUrl,
                status: "WRONG_BUS",
                assignedBus: wrongAssigned,
              },
              ...prev,
            ]);

            ApiClient.broadcastSos({
              title: "Wrong Bus Boarding Detected",
              busNumber: stationedBusNumber,
              type: "FLEET_TRANSFER",
              severity: "HIGH",
              timestamp: nowStr,
              resolved: false,
              description: `Student ${resultObj.studentName} (${resultObj.rollNo}) is assigned to ${wrongAssigned} but scanned at ${stationedBusNumber}!`,
            });
          }

          setTimeout(() => {
            setActiveResult(null);
            setHudScanText("Scanning for Face...");
          }, 4500);
        }
      } else {
        // CASE 3: 🚨 UNREGISTERED / INTRUDER
        setHudScanText("🔍 Scanning for Enrolled Student Face...");
      }
    } catch (err) {
      console.warn("Face verify loop error:", err);
      setHudScanText("Scanning for Face...");
    } finally {
      setIsScanning(false);
      isProcessingRef.current = false;
    }
  };

  // Continuous Camera Capture Interval (Every 1.4s)
  useEffect(() => {
    if (!cameraActive) return;

    const interval = setInterval(() => {
      if (activeResult || isProcessingRef.current) return;

      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = 320;
          canvas.height = 240;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            processSnapshot(dataUrl);
          }
        }
      }
    }, 1400);

    return () => clearInterval(interval);
  }, [cameraActive, activeResult, activePersona, stationedBusNumber]);

  // Simulate Instant Intruder Alert
  const triggerIntruderAlert = () => {
    const nowStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const intruderResult: VerificationResult = {
      status: "UNAUTHORIZED",
      studentName: "Unregistered Individual",
      rollNo: "UNIDENTIFIED",
      grade: "Unknown Entity",
      section: "N/A",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      assignedBus: "None",
      currentBus: stationedBusNumber,
      confidence: 31.4,
      timestamp: nowStr,
      message: "Face Biometric Not Found in Database • Intrusion Alert!",
    };

    setActiveResult(intruderResult);
    playAudioCue("ALARM");
    speakText(`Security Alert! Unauthorized individual detected at ${stationedBusNumber}. Access denied.`);

    setBoardedFeed((prev) => [
      {
        id: `feed-${Date.now()}`,
        name: "🚨 Unidentified Person",
        rollNo: "UNKNOWN",
        grade: "Intruder Alert",
        time: nowStr,
        avatarUrl: intruderResult.avatarUrl,
        status: "UNAUTHORIZED",
      },
      ...prev,
    ]);

    ApiClient.broadcastSos({
      title: "Unauthorized Boarding Attempt",
      busNumber: stationedBusNumber,
      type: "UNAUTHORIZED_PERSON",
      severity: "CRITICAL",
      timestamp: nowStr,
      resolved: false,
      description: `Unauthorized person attempted to board ${stationedBusNumber}! Immediate security inspection required.`,
    });

    setTimeout(() => {
      setActiveResult(null);
      setHudScanText("Scanning for Face...");
    }, 5000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Hidden Canvas for Frame Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. Sleek Enterprise Header */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 active:scale-95 transition-all"
            title="Back to Admin Console"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="font-bold text-sm tracking-tight text-white">Transit Gate Terminal</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Continuous 512-D ArcFace Scanner</p>
          </div>
        </div>

        {/* Top Controls: Stationed Bus, Sound, Camera Flip */}
        <div className="flex items-center gap-2">
          {/* Stationed Bus Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBusSelectorOpen(!isBusSelectorOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 active:scale-95"
            >
              <BusIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{stationedBusNumber}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isBusSelectorOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                {["Bus #08", "Bus #01", "Bus #02", "Bus #03", "Bus #04", "Bus #05"].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setStationedBusNumber(b);
                      setIsBusSelectorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between ${
                      stationedBusNumber === b ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{b}</span>
                    {stationedBusNumber === b && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
            title="Toggle Voice & Sounds"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Flip Camera */}
          <button
            onClick={toggleFacingMode}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
            title="Switch Front/Back Camera"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Sleek Segmented Presentation Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between z-20 overflow-x-auto gap-2">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">Demo Test:</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActivePersona("AUTO")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activePersona === "AUTO"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            ✅ Yash (Correct Bus)
          </button>
          <button
            onClick={() => setActivePersona("WRONG_BUS")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activePersona === "WRONG_BUS"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            ⚠️ Wrong Bus Test
          </button>
          <button
            onClick={() => setActivePersona("INTRUDER")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activePersona === "INTRUDER"
                ? "bg-rose-600 text-white font-black shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            🚨 Unknown Intruder
          </button>
        </div>
      </div>

      {/* 3. Main Camera Viewport with Slim Laser Reticle */}
      <div className="relative flex-1 w-full bg-black overflow-hidden flex items-center justify-center">
        {/* Live Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />

        {/* Camera Permission / Start Prompt */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400">
              <Camera className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="font-bold text-base text-white">Enable Camera Access</h3>
              <p className="text-xs text-slate-400">
                {cameraError || "Tap the button below to start live continuous neural face scanning."}
              </p>
            </div>
            <button
              onClick={() => initCamera(facingMode)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Camera Scanner</span>
            </button>
          </div>
        )}

        {/* Subtle Laser Scanline */}
        {cameraActive && (
          <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scanline z-10 pointer-events-none" />
        )}

        {/* Minimalist Biometric Face Box */}
        {cameraActive && (
          <div className="relative w-60 sm:w-72 h-72 rounded-3xl border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.25)] z-10 flex flex-col items-center justify-between p-3 pointer-events-none">
            {/* Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-400/30">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{hudScanText}</span>
            </div>

            <div className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/20 font-bold">
              Gate: {stationedBusNumber}
            </div>
          </div>
        )}

        {/* Top-Left Live Radar Status */}
        <div className="absolute top-3 left-3 z-20">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/20 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE GATE RADAR
          </span>
        </div>

        {/* 4. FULL-SCREEN OUTCOMES OVERLAY */}
        {activeResult && (
          <div
            className={`absolute inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center p-5 text-center animate-in fade-in zoom-in-95 duration-200 ${
              activeResult.status === "AUTHORIZED"
                ? "bg-emerald-950/95 border-4 border-emerald-400"
                : activeResult.status === "WRONG_BUS"
                ? "bg-amber-950/95 border-4 border-amber-400"
                : "bg-rose-950/95 border-4 border-rose-500"
            }`}
          >
            {/* Outcome 1: ✅ AUTHORIZED (CORRECT BUS) */}
            {activeResult.status === "AUTHORIZED" && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-2 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>

                <h2 className="text-xl font-black text-white tracking-tight">
                  AUTHORIZED • CORRECT BUS
                </h2>
                <p className="text-emerald-300 text-xs font-bold mt-0.5">
                  Boarding Verified for {activeResult.currentBus} • {activeResult.confidence}% Match
                </p>

                <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-400/40 flex items-center gap-3.5 max-w-xs w-full text-left shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeResult.avatarUrl}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-400 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{activeResult.studentName}</h3>
                    <p className="text-xs font-mono font-bold text-cyan-300">{activeResult.rollNo}</p>
                    <p className="text-[11px] text-slate-300">{activeResult.grade} • {activeResult.section}</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Assigned: {activeResult.assignedBus}</p>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-400/80 mt-3 font-mono">
                  Attendance Marked • Auto-resuming scan in 3s...
                </p>
              </>
            )}

            {/* Outcome 2: ⚠️ WRONG BUS BOARDING DETECTED */}
            {activeResult.status === "WRONG_BUS" && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-2 shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>

                <h2 className="text-xl font-black text-amber-300 tracking-tight">
                  WRONG BUS DETECTED!
                </h2>
                <p className="text-amber-200 text-xs font-bold mt-0.5">
                  Student recognized but assigned to a different bus!
                </p>

                <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/50 max-w-xs w-full text-left space-y-2 shadow-2xl">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeResult.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-white">{activeResult.studentName}</h3>
                      <p className="text-xs font-mono text-cyan-300">{activeResult.rollNo}</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                    <p className="text-amber-300 font-bold">
                      📌 Assigned Bus: <strong className="text-white">{activeResult.assignedBus}</strong>
                    </p>
                    <p className="text-rose-300 font-bold">
                      ❌ Current Bus: <strong className="text-white">{activeResult.currentBus}</strong>
                    </p>
                  </div>
                  <p className="text-[10px] text-amber-400 font-bold">
                    ⚠️ Alert dispatched to Admin Console!
                  </p>
                </div>

                <button
                  onClick={() => setActiveResult(null)}
                  className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg active:scale-95"
                >
                  Dismiss &amp; Guide to {activeResult.assignedBus}
                </button>
              </>
            )}

            {/* Outcome 3: 🚨 UNAUTHORIZED INTRUDER / UNKNOWN PERSON */}
            {activeResult.status === "UNAUTHORIZED" && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-2 shadow-lg">
                  <ShieldAlert className="w-8 h-8 text-rose-400" />
                </div>

                <h2 className="text-xl font-black text-rose-300 tracking-tight">
                  UNAUTHORIZED INTRUSION!
                </h2>
                <p className="text-rose-200 text-xs font-bold mt-0.5">
                  Face not recognized in database • Access Denied!
                </p>

                <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 border border-rose-500/50 max-w-xs w-full text-left space-y-1 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                    <span>STATUS: UNREGISTERED</span>
                    <span>MATCH: 31.4% (LOW)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Emergency Alert dispatched to ABES Transit Security Control Room.
                  </p>
                </div>

                <button
                  onClick={() => setActiveResult(null)}
                  className="mt-4 px-5 py-2 rounded-xl bg-rose-600 text-white font-black text-xs shadow-lg active:scale-95"
                >
                  Silence Siren &amp; Dismiss Alert
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 5. Minimalist Live Boarding Feed Bottom Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 z-30 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Live Boarded Log ({boardedFeed.length})</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Auto-Refreshed</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {boardedFeed.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic py-1">
              Ready for boarding. Students scanning will appear here in real-time.
            </p>
          ) : (
            boardedFeed.map((item) => (
              <div
                key={item.id}
                className={`flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs ${
                  item.status === "AUTHORIZED"
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                    : item.status === "WRONG_BUS"
                    ? "bg-amber-950/40 border-amber-500/30 text-amber-200"
                    : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.avatarUrl} alt="" className="w-6 h-6 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-[11px] leading-tight">{item.name}</p>
                  <p className="text-[9px] font-mono text-slate-400">{item.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
