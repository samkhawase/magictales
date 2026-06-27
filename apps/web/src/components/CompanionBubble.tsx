export function CompanionBubble({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-cyan-200 bg-cyan-50 p-4 text-cyan-950 shadow-sm dark:border-cyan-700 dark:bg-cyan-950 dark:text-cyan-50">
      <p className="text-sm font-bold">Milo</p>
      <p className="mt-1 leading-6">{text}</p>
    </div>
  );
}
