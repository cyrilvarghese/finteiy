"use client";

import { getRepLevel, REP_LEVELS, type Collectible } from "@/lib/constants";

interface RepBadgeProps {
  collection: Collectible[];
  onOpenStash?: () => void;
}

export function RepBadge({ collection, onOpenStash }: RepBadgeProps) {
  const rep = getRepLevel(collection);
  const next = rep.nextLevel;
  const progressToNext =
    next.min > rep.min
      ? Math.min(100, ((rep.points - rep.min) / (next.min - rep.min)) * 100)
      : 100;

  return (
    <div
      className="rounded-2xl px-[18px] py-4 relative overflow-hidden mb-5 animate-fade-in"
      style={{
        ["--rep-glow" as string]: rep.color + "55",
        ["--rep-glow-2" as string]: rep.color + "22",
        background: `linear-gradient(135deg, ${rep.color}0a, ${rep.color}05, transparent)`,
        border: `1px solid ${rep.color}25`,
      }}
    >
      {/* Shine sweep */}
      <div
        className="absolute top-0 bottom-0 w-[60px] opacity-[0.06] animate-badge-shine"
        style={{
          background: "linear-gradient(90deg, transparent, white, transparent)",
        }}
      />

      <div className="flex items-center gap-3">
        {/* Level icon */}
        <div
          className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px]"
          style={{
            background: `linear-gradient(145deg, ${rep.color}22, ${rep.color}08)`,
            border: `1px solid ${rep.color}30`,
            boxShadow: `0 0 15px ${rep.color}15, inset 0 0 10px ${rep.color}08`,
          }}
        >
          {rep.emoji}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[15px] font-extrabold font-sora animate-rep-glow"
              style={{ color: rep.color }}
            >
              {rep.name}
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-space-mono font-bold tracking-[0.05em]"
              style={{
                background: `${rep.color}15`,
                color: rep.color,
              }}
            >
              LVL {rep.tier}
            </span>
          </div>
          <div className="text-[11px] text-text-muted font-dm-sans mb-1.5">
            {rep.tag}
          </div>

          {/* XP progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-sm bg-white/[0.06]">
              <div
                className="h-full rounded-sm transition-[width] duration-600 ease-in-out"
                style={{
                  background: `linear-gradient(90deg, ${rep.color}88, ${rep.color})`,
                  width: `${progressToNext}%`,
                  boxShadow: `0 0 6px ${rep.color}44`,
                }}
              />
            </div>
            <span className="text-[9px] text-slate-700 font-space-mono whitespace-nowrap">
              {rep.points}/{next.min} XP
            </span>
          </div>
        </div>
      </div>

      {/* Next level hint */}
      {rep.tier < REP_LEVELS.length - 1 && (
        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[10px] text-slate-600 flex items-center gap-1.5">
          <span>
            Next: {next.emoji}{" "}
            <span style={{ color: next.color }} className="font-semibold">
              {next.name}
            </span>
          </span>
          <span className="ml-auto text-zinc-700 font-space-mono">
            {next.min - rep.points} XP to go
          </span>
        </div>
      )}

      {/* Your Stash button */}
      {onOpenStash && (
        <button
          onClick={onOpenStash}
          className="mt-2.5 w-full px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-all hover:bg-white/[0.04]"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🎁</span>
            <span className="text-[12px] font-semibold text-text-secondary">Your Stash</span>
          </div>
          {collection.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-energy/[0.15] text-energy font-space-mono font-bold">
              {collection.length}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
