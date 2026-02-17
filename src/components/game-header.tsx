"use client";

import type { Goal } from "@/lib/constants";

interface GameHeaderProps {
  day: number;
  borrowCount: number;
  showBorrowWarning: boolean;
  goal: Goal;
}

export function GameHeader({ day, borrowCount, showBorrowWarning, goal }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-text-muted font-space-mono tracking-[0.1em]">
        DAY {day}
      </span>
      <div className="flex items-center gap-2">
        {borrowCount > 0 && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-md font-space-mono"
            style={{
              background: borrowCount >= 2 ? "rgba(239,68,68,0.15)" : "rgba(251,146,60,0.15)",
              color: borrowCount >= 2 ? "#ef4444" : "#fb923c",
              border: `1px solid ${borrowCount >= 2 ? "#ef444433" : "#fb923c33"}`,
              animation: showBorrowWarning ? "pulse 1s infinite" : "none",
            }}
          >
            {"\u{1F4B3}"} {borrowCount}/3
          </span>
        )}
        <span className="text-xs text-text-muted font-space-mono">
          {goal.emoji} ${goal.amount}
        </span>
      </div>
    </div>
  );
}
