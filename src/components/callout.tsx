"use client";

interface CalloutProps {
  text: string;
  /** Duration in ms before callout disappears (matches invite delay) */
  duration?: number;
}

export function Callout({ text, duration = 3500 }: CalloutProps) {
  return (
    <div
      className="rounded-lg px-3.5 pt-2.5 pb-1.5 text-xs text-callout leading-relaxed animate-fade-in overflow-hidden"
      style={{
        background: "rgba(56,189,248,0.06)",
        border: "1px solid rgba(56,189,248,0.12)",
      }}
    >
      <div>{"\u{1F4A1}"} {text}</div>
      {/* Countdown progress bar */}
      <div className="mt-2 h-[2px] rounded-sm bg-white/[0.04]">
        <div
          className="h-full rounded-sm"
          style={{
            background: "linear-gradient(90deg, rgba(56,189,248,0.4), rgba(56,189,248,0.15))",
            animation: `calloutDrain ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
