"use client";

interface CalloutProps {
  text: string;
  /** Duration in ms before callout disappears (matches invite delay) */
  duration?: number;
}

export function Callout({ text, duration = 4500 }: CalloutProps) {
  return (
    <div
      className="rounded-xl px-5 pt-4 pb-3 text-sm text-callout leading-relaxed overflow-hidden"
      style={{
        background: "rgba(56,189,248,0.08)",
        border: "1.5px solid rgba(56,189,248,0.2)",
        boxShadow: "0 0 20px rgba(56,189,248,0.12)",
        animation: "calloutPop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0 mt-0.5">{"\u{1F4A1}"}</div>
        <div className="text-[15px] font-medium leading-relaxed">{text}</div>
      </div>
      {/* Countdown progress bar */}
      <div className="mt-3 h-[3px] rounded-sm bg-white/[0.06]">
        <div
          className="h-full rounded-sm"
          style={{
            background: "linear-gradient(90deg, rgba(56,189,248,0.5), rgba(56,189,248,0.2))",
            animation: `calloutDrain ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
