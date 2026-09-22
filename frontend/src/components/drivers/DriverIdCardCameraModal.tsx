"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui/Modal";
import {
  Camera,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface DriverIdCardCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  onCapture: (idCardPhotoUrl: string) => void;
}

export const DriverIdCardCameraModal: React.FC<DriverIdCardCameraModalProps> = ({
  isOpen,
  onClose,
  driverName,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Play synthetic camera shutter sound
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // AudioCtx not allowed
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer rear camera if on phone/tablet, or fallback to webcam
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCameraAccess(true);
    } catch (err: any) {
      console.warn("Camera access failed, falling back to user webcam:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
        setHasCameraAccess(true);
      } catch (e: any) {
        setHasCameraAccess(false);
        setCameraError(e?.message || "Please allow camera access in your browser to capture Driver ID card.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      setIsFlashing(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      // Fallback sample image if no physical camera
      const sample = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80";
      setCapturedPhoto(sample);
      return;
    }

    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    if (!streamRef.current) {
      startCamera();
    }
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      stopCamera();
      onClose();
    }
  };

  const handleModalClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Capture Driver ID Card / License Photo"
      subtitle={driverName ? `Crew Member: ${driverName}` : "Position the physical ID card or driving license inside the frame"}
      maxWidth="lg"
    >
      <div className="space-y-4 select-none">
        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 1. Camera Viewport Box */}
        <div className="relative w-full h-80 rounded-3xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800 shadow-2xl">
          {/* Live Video */}
          {!capturedPhoto && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-95"
            />
          )}

          {/* Captured Still Preview */}
          {capturedPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedPhoto}
              alt="Captured Driver ID"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}

          {/* Shutter Flash Animation */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200" />
          )}

          {/* Camera Error Fallback */}
          {hasCameraAccess === false && !capturedPhoto && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-center p-6 z-20">
              <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
              <p className="text-white font-bold text-sm">Camera Access Needed</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">{cameraError}</p>
              <button
                type="button"
                onClick={handleCapture}
                className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Use Sample Driver License
              </button>
            </div>
          )}

          {/* ID Card Framing Guide / Reticle (Aspect Ratio 16:10) */}
          {!capturedPhoto && (
            <div className="relative w-72 sm:w-96 h-48 rounded-2xl border-2 border-dashed border-cyan-400/80 shadow-2xl z-20 flex flex-col items-center justify-between p-3 pointer-events-none">
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-cyan-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-cyan-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-cyan-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-cyan-400 rounded-br-lg" />

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-400/30">
                <CreditCard className="w-3 h-3" />
                <span>ALIGN DRIVING LICENSE / ID CARD</span>
              </div>

              <div className="w-full text-center">
                <span className="text-[10px] font-medium text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded-md">
                  Keep text sharp &amp; in focus
                </span>
              </div>
            </div>
          )}

          {/* Captured Success Stamp */}
          {capturedPhoto && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 font-bold text-xs z-20 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ID Card Photo Captured</span>
            </div>
          )}
        </div>

        {/* 2. Helper Text */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
          <p>
            Place the commercial driving license or staff ID card flat in front of the camera and press <strong>"Capture Photo"</strong>.
          </p>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleModalClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {capturedPhoto ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This ID Photo</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                <Camera className="w-4 h-4 text-cyan-300" />
                <span>Capture ID Card Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
