"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      prevent: (node) => {
        return (
          document.body.classList.contains("modal-open") ||
          node.hasAttribute("data-lenis-prevent") ||
          Boolean(node.closest("[data-lenis-prevent]")) ||
          Boolean(node.closest("[role='dialog']")) ||
          Boolean(node.closest(".custom-scrollbar"))
        );
      },
    });

    // Pause Lenis when ANY modal is open so popup scrolls natively without background movement
    const handleModalToggle = (e: any) => {
      if (e?.detail?.open) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    window.addEventListener("modal-toggle", handleModalToggle);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("modal-toggle", handleModalToggle);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
