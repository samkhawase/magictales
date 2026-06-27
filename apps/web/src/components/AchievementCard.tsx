import { Trophy } from "lucide-react";

export function AchievementCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
      <Trophy className="mb-3 text-yellow-500" />
      <h3 className="font-black">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </article>
  );
}
