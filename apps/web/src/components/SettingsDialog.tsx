"use client";

import { Volume2, VolumeX } from "lucide-react";

export function SettingsDialog({
  muted,
  onMutedChange
}: {
  muted: boolean;
  onMutedChange: (value: boolean) => void;
}) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold shadow-sm"
      onClick={() => onMutedChange(!muted)}
      type="button"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      Sound
    </button>
  );
}
