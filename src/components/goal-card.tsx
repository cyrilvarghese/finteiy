"use client";

import { useState } from "react";
import type { Goal } from "@/lib/constants";

interface GoalCardProps {
  goal: Goal;
  achieved: boolean;
  onSelect: () => void;
}

export function GoalCard({ goal, achieved, onSelect }: GoalCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 w-full text-left rounded-xl px-3.5 py-3 transition-all duration-200 cursor-pointer"
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? goal.color + "44" : "rgba(255,255,255,0.05)"}`,
        boxShadow: hovered ? `0 0 20px ${goal.color}11` : "none",
      }}
    >
      <span className="text-[26px]">{goal.emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-200">
            {goal.name}
          </span>
          {achieved && (
            <span className="text-[9px] text-cash bg-cash/[0.12] px-1.5 py-0.5 rounded font-bold">
              {"\u2713"} WON
            </span>
          )}
        </div>
        <div className="text-[11px] text-text-muted font-space-mono">
          ${goal.amount}
        </div>
      </div>
      <div
        className="text-base transition-opacity duration-200"
        style={{
          color: goal.color,
          opacity: hovered ? 1 : 0.3,
        }}
      >
        {"\u2192"}
      </div>
    </button>
  );
}
