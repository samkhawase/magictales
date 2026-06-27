import type { StorySummary } from "@storyfox/types";
import { Star } from "lucide-react";

export function AdventureSummary({ summary }: { summary: StorySummary }) {
  return (
    <section className="rounded-[28px] border border-border bg-card p-6 shadow-story">
      <div className="flex items-center gap-3">
        <Star className="fill-yellow-300 text-yellow-500" />
        <h2 className="text-2xl font-black">Adventure Complete</h2>
      </div>
      <p className="mt-3 text-muted-foreground">{summary.title}</p>
      <p className="mt-4 text-4xl font-black">{summary.stars} Star</p>
      <ul className="mt-4 space-y-2 text-sm leading-6">
        {summary.learned.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
