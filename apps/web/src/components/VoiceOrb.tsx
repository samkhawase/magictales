"use client";

import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

export function VoiceOrb({ active, muted }: { active: boolean; muted: boolean }) {
  return (
    <motion.div
      className="relative grid size-36 place-items-center rounded-full bg-primary text-primary-foreground shadow-story"
      animate={{ scale: active ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
      aria-label={active ? "Voice is listening" : "Voice is waiting"}
    >
      <div className="absolute inset-[-18px] rounded-full border border-white/40" />
      <div className="absolute inset-[-34px] rounded-full border border-white/20" />
      {muted ? <MicOff size={44} /> : <Mic size={44} />}
    </motion.div>
  );
}
