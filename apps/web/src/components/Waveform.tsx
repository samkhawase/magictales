"use client";

import { motion } from "framer-motion";

export function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-12 items-center justify-center gap-1" aria-hidden>
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          className="w-2 rounded-full bg-primary/80"
          key={index}
          animate={{ height: active ? [10, 22 + ((index * 7) % 18), 10] : 10 }}
          transition={{ duration: 0.7, repeat: Infinity, delay: index * 0.03 }}
        />
      ))}
    </div>
  );
}
