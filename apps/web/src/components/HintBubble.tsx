export function HintBubble({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50">
      <p className="text-sm font-bold">Helper AI</p>
      <p className="mt-1 leading-6">{text}</p>
    </div>
  );
}
