"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import {
  Smartphone,
  Wifi,
  Copy,
  Check,
  ExternalLink,
  Bus as BusIcon,
  Scan,
  ShieldCheck,
  QrCode,
  Zap,
} from "lucide-react";

interface MobileDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  localIp?: string;
}

export const MobileDemoModal: React.FC<MobileDemoModalProps> = ({
  isOpen,
  onClose,
  localIp = "192.168.1.12",
}) => {
  const [copied, setCopied] = useState(false);

  const terminalUrl = `http://${localIp}:3000/bus-terminal`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    terminalUrl
  )}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(terminalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📱 Live Bus Terminal on Mobile Phone / Same Wi-Fi"
      subtitle="Open the Live Face Recognition Terminal on your phone camera for live presentation demos."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Banner with Wi-Fi Indicator */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-200/80 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-400 flex-shrink-0 shadow-sm">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <span>Same Local Wi-Fi Connection Active</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                LAN ONLINE
              </span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Make sure your phone and this laptop are connected to the <strong>same Wi-Fi network</strong>. You can scan the QR code with your phone camera or type the URL directly in Chrome/Safari!
            </p>
          </div>
        </div>

        {/* QR Code & Direct URL Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* QR Code Container */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2.5">
            <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Bus Terminal QR Code"
                className="w-40 h-40 object-contain rounded-xl"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <QrCode className="w-3.5 h-3.5 text-cyan-600" />
              <span>Scan with Phone Camera</span>
            </div>
          </div>

          {/* Connection URL & Copy */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Local Mobile Terminal URL
              </label>
              <div className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs break-all flex items-center justify-between gap-2 shadow-inner border border-slate-800">
                <span>{terminalUrl}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex-shrink-0"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick 3-Step Demo Guide */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>Open URL on Phone &amp; allow Camera permission.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>Show enrolled student face (e.g. Yash Gupta).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>Phone shows <strong>Authorized</strong> + Admin sees live boarding!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <a
            href="/bus-terminal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
          >
            <span>Launch on this Laptop (New Tab)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all active:scale-95"
          >
            Got It, Ready to Demo
          </button>
        </div>
      </div>
    </Modal>
  );
};
