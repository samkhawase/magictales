import type { StoryChoice } from "@storyfox/types";

export function ChoiceCard({ choice, onSelect }: { choice: StoryChoice; onSelect: (choice: StoryChoice) => void }) {
  return (
    <button
      className="rounded-[22px] border border-border bg-card p-4 text-left font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-story focus:outline-none focus:ring-4 focus:ring-primary/30"
      onClick={() => onSelect(choice)}
      type="button"
    >
      {choice.label}
    </button>
  );
}
