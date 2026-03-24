"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="brand-card w-full max-w-md p-6 text-center"
      >
        <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-full bg-brandYellow/80" />
        <p className="text-sm text-white/80">Loading…</p>
      </motion.div>
    </div>
  );
}
