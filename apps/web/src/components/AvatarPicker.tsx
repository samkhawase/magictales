"use client";

const avatars = ["Explorer", "Dreamer", "Rider"];

export function AvatarPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {avatars.map((avatar) => (
        <button
          className={`rounded-full border px-4 py-2 text-sm font-bold ${
            value === avatar ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
          }`}
          key={avatar}
          onClick={() => onChange(avatar)}
          type="button"
        >
          {avatar}
        </button>
      ))}
    </div>
  );
}
