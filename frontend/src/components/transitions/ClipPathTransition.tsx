"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClipPathTransitionProps {
  currentKey: string;
  children: React.ReactNode;
}

export const ClipPathTransition: React.FC<ClipPathTransitionProps> = ({
  currentKey,
  children,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentKey}
        initial={{ opacity: 0, scale: 0.98, clipPath: "circle(0% at 50% 50%)" }}
        animate={{ opacity: 1, scale: 1, clipPath: "circle(150% at 50% 50%)" }}
        exit={{ opacity: 0, scale: 0.99, transition: { duration: 0.2 } }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
