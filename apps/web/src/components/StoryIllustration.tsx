"use client";

import { motion } from "framer-motion";

export function StoryIllustration({ progress }: { progress: number }) {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-border bg-sky-200 shadow-story dark:bg-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.8),transparent_22%),linear-gradient(180deg,#90d8ff_0%,#f7f1a8_55%,#72c97b_56%)] dark:bg-[linear-gradient(180deg,#1b3354_0%,#244d5f_55%,#2f6b55_56%)]" />
      <div className="absolute bottom-16 left-0 h-10 w-full bg-amber-700/40" />
      <div className="absolute bottom-20 left-0 h-3 w-full bg-stone-700" />
      <div className="absolute bottom-24 left-[64%] h-36 w-28 rounded-t-full bg-emerald-700/70" />
      <div className="absolute bottom-24 left-[72%] h-32 w-28 rounded-t-full bg-emerald-800/70" />
      <div className="absolute bottom-24 left-[80%] h-40 w-32 rounded-t-full bg-emerald-600/70" />
      <motion.div
        className="absolute bottom-[78px] left-10"
        animate={{ x: `${progress * 2.4}px` }}
        transition={{ type: "spring", stiffness: 45, damping: 16 }}
      >
        <div className="relative h-20 w-32 rounded-b-3xl rounded-t-xl bg-red-400 shadow-lg">
          <div className="absolute -top-10 left-5 size-12 rounded-full bg-amber-200" />
          <div className="absolute -top-8 right-5 size-10 rounded-full bg-cyan-200" />
          <div className="absolute -bottom-3 left-4 size-7 rounded-full bg-slate-800" />
          <div className="absolute -bottom-3 right-4 size-7 rounded-full bg-slate-800" />
        </div>
      </motion.div>
      <motion.div
        className="absolute right-12 top-20 rounded-full bg-orange-400 px-5 py-3 text-sm font-bold text-white shadow-lg"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        Fox
      </motion.div>
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute size-2 rounded-full bg-yellow-200"
          style={{ left: `${10 + index * 6}%`, top: `${20 + ((index * 13) % 40)}%` }}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.1 }}
        />
      ))}
    </div>
  );
}
