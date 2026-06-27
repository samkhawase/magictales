import type { PlayerState } from "@storyfox/types";

export function ParentDashboard({ state }: { state: PlayerState }) {
  return (
    <aside className="rounded-[24px] border border-border bg-card/80 p-4">
      <h2 className="text-lg font-black">Parent Dashboard</h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Progress</dt>
          <dd className="font-bold">{state.progress}%</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Stars</dt>
          <dd className="font-bold">{state.stars}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Companion</dt>
          <dd className="font-bold">{state.companion}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Inventory</dt>
          <dd className="font-bold">{state.inventory.join(", ")}</dd>
        </div>
      </dl>
    </aside>
  );
}
