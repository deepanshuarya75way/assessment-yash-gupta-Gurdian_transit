"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll, hide top header & bottom nav, and pause Lenis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("modal-open");
      document.body.setAttribute("data-modal-open", "true");
      window.dispatchEvent(new CustomEvent("modal-toggle", { detail: { open: true } }));
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.classList.remove("modal-open");
      document.body.removeAttribute("data-modal-open");
      window.dispatchEvent(new CustomEvent("modal-toggle", { detail: { open: false } }));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.classList.remove("modal-open");
      document.body.removeAttribute("data-modal-open");
      window.dispatchEvent(new CustomEvent("modal-toggle", { detail: { open: false } }));
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain"
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          data-lenis-prevent="true"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className={`relative w-full ${widthClasses[maxWidth]} bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 z-10 overflow-hidden my-auto flex flex-col max-h-[90vh]`}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50 flex-shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent="true"
            className="p-5 sm:p-6 overflow-y-auto custom-scrollbar overscroll-contain flex-1"
          >
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
