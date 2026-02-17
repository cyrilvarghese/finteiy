"use client";

import { clamp } from "@/lib/constants";

interface GoalProgressBarProps {
  name: string;
  cash: number;
  goalAmount: number;
  color: string;
}

export function GoalProgressBar({ name, cash, goalAmount, color }: GoalProgressBarProps) {
  const pct = clamp((cash / goalAmount) * 100, 0, 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-text-secondary">
          {"\u{1F3AF}"} {name}
        </span>
        <span
          className="text-[11px] font-bold font-space-mono"
          style={{ color }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-2 rounded bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded transition-[width] duration-600 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            width: `${pct}%`,
            boxShadow: `0 0 12px ${color}44`,
          }}
        />
      </div>
    </div>
  );
}
