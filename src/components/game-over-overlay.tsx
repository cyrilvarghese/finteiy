"use client";

interface GameOverOverlayProps {
  won: boolean;
}

export function GameOverOverlay({ won }: GameOverOverlayProps) {
  return (
    <div className="text-center py-10 animate-slide-up">
      <div className="text-5xl mb-3">
        {won ? "\u{1F389}" : "\u{1F4B3}"}
      </div>
      <div
        className="text-[22px] font-extrabold font-sora mb-3"
        style={{ color: won ? "#22c55e" : "#ef4444" }}
      >
        {won ? "GOAL ACHIEVED!" : "DEBT TRAP \u2014 GAME OVER"}
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: won ? "#22c55e" : "#ef4444",
              animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-xs text-text-muted mt-3">
        Building your report card...
      </p>
    </div>
  );
}
