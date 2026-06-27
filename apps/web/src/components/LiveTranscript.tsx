import type { AiTurn } from "@storyfox/types";

export function LiveTranscript({ turns }: { turns: AiTurn[] }) {
  return (
    <section className="max-h-64 overflow-y-auto rounded-[24px] border border-border bg-card/90 p-4">
      <h2 className="mb-3 text-lg font-bold">Captions</h2>
      <div className="space-y-3">
        {turns.map((turn, index) => (
          <p key={`${turn.role}-${index}`} className="text-sm leading-6 text-muted-foreground">
            <span className="font-bold capitalize text-foreground">{turn.role}: </span>
            {turn.text}
          </p>
        ))}
      </div>
    </section>
  );
}
