"use client";

import { useState } from "react";
import {
  GOALS,
  TIER_RARITY,
  RARITY_GLOW,
  GRADE_COLORS,
  type Collectible,
  type Grade,
} from "@/lib/constants";

interface CollectibleCardProps {
  item: Collectible;
  index: number;
  flippable?: boolean;
}

export function CollectibleCard({ item, index, flippable = false }: CollectibleCardProps) {
  const [flipped, setFlipped] = useState(false);
  const goal = GOALS.find((g) => g.id === item.goalId);
  if (!goal) return null;

  const rarity = TIER_RARITY[goal.tier];
  const glow = RARITY_GLOW[rarity];
  const [g1, g2, g3] = goal.gradient;
  const gradeColor = item.grade ? GRADE_COLORS[item.grade as Grade] || "#94a3b8" : "#94a3b8";

  return (
    <div
      onClick={() => flippable && setFlipped(!flipped)}
      className="rounded-2xl relative overflow-hidden transition-transform duration-150 ease-in-out"
      style={{
        cursor: flippable ? "pointer" : "default",
        animation: `fadeIn 0.5s ease ${index * 0.1}s both, glowPulse 3s ease-in-out infinite`,
        ["--glow-1" as string]: glow + "44",
        ["--glow-2" as string]: glow + "22",
        ["--glow-3" as string]: glow + "11",
      }}
    >
      {/* FRONT */}
      {!flipped && (
        <div
          className="rounded-2xl p-0 relative overflow-hidden"
          style={{
            background: `linear-gradient(165deg, ${g1}18 0%, ${g2}0d 40%, ${g3}08 100%)`,
            border: `1px solid ${glow}40`,
          }}
        >
          {/* Holographic stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] animate-holo-shift"
            style={{
              background: `linear-gradient(90deg, ${g1}, ${g2}, ${g3}, ${g1})`,
              backgroundSize: "200% 100%",
            }}
          />

          {/* Corner serial */}
          <div
            className="absolute top-2.5 left-2.5 text-[8px] font-space-mono tracking-[0.08em]"
            style={{ color: glow + "66" }}
          >
            #FNT-{String(index + 1).padStart(3, "0")}
          </div>

          {/* Rarity badge */}
          <div
            className="absolute top-2 right-2 text-[8px] font-bold px-2 py-[3px] rounded-md font-space-mono uppercase tracking-[0.08em]"
            style={{
              background: `linear-gradient(135deg, ${glow}33, ${glow}11)`,
              color: glow,
              border: `1px solid ${glow}22`,
            }}
          >
            {rarity}
          </div>

          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 pointer-events-none animate-shimmer"
            style={{
              background: `linear-gradient(115deg, transparent 20%, ${glow}08 45%, transparent 55%, ${glow}05 75%, transparent 90%)`,
              backgroundSize: "200% 100%",
            }}
          />

          {/* Main content */}
          <div className="pt-7 px-3.5 pb-3.5 text-center">
            {/* Emoji with glow ring */}
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2.5"
              style={{
                background: `radial-gradient(circle, ${glow}15 0%, transparent 70%)`,
                boxShadow: `0 0 20px ${glow}22, inset 0 0 15px ${glow}11`,
              }}
            >
              <span
                className="text-4xl"
                style={{ filter: `drop-shadow(0 0 10px ${glow}55)` }}
              >
                {goal.emoji}
              </span>
            </div>

            <div className="text-sm font-bold text-text-primary font-sora mb-0.5">
              {goal.name}
            </div>
            <div className="text-[11px] text-text-muted font-space-mono mb-2.5">
              ${goal.amount} Goal
            </div>

            {/* Grade badge */}
            {item.grade && (
              <div
                className="inline-flex items-center gap-1 mb-2.5 px-2.5 py-[3px] rounded-md"
                style={{
                  background: `${gradeColor}15`,
                  border: `1px solid ${gradeColor}25`,
                }}
              >
                <span className="text-[10px] text-text-secondary font-space-mono">
                  Grade
                </span>
                <span
                  className="text-sm font-extrabold font-sora"
                  style={{ color: gradeColor }}
                >
                  {item.grade}
                </span>
              </div>
            )}

            {/* Stats row */}
            <div
              className="flex justify-center gap-3 pt-2 text-[10px] text-text-secondary font-space-mono"
              style={{ borderTop: `1px solid ${glow}15` }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-text-muted">Days</span>
                <span className="text-slate-200 font-bold text-xs">{item.days}</span>
              </div>
              <div style={{ width: 1, background: `${glow}15` }} />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-text-muted">Cash</span>
                <span className="text-cash font-bold text-xs">${item.cashLeft}</span>
              </div>
              <div style={{ width: 1, background: `${glow}15` }} />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-text-muted">Social</span>
                <span className="text-social font-bold text-xs">{item.social}</span>
              </div>
            </div>
          </div>

          {/* Bottom holographic bar */}
          <div
            className="h-0.5"
            style={{
              background: `linear-gradient(90deg, transparent, ${g1}66, ${g2}66, ${g3}66, transparent)`,
            }}
          />
        </div>
      )}

      {/* BACK */}
      {flipped && (
        <div
          className="rounded-2xl py-5 px-3.5 min-h-[180px] flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(165deg, ${g1}11 0%, #0f1019 50%, ${g3}08 100%)`,
            border: `1px solid ${glow}30`,
          }}
        >
          <div
            className="text-[10px] font-space-mono tracking-[0.15em] uppercase mb-3"
            style={{ color: glow }}
          >
            {"\u2605"} Card Details {"\u2605"}
          </div>
          <div className="text-2xl mb-2">{goal.emoji}</div>
          <div className="text-[13px] font-bold text-slate-200 font-sora mb-1">
            {goal.name}
          </div>
          <div className="text-[11px] text-text-muted font-space-mono mb-3">
            {rarity} {"\u00B7"} {goal.tier} Tier
          </div>
          <div className="text-[10px] text-slate-600 text-center leading-relaxed max-w-[160px]">
            Achieved in {item.days} days with ${item.cashLeft} remaining and{" "}
            {item.social} social score.
          </div>
          <div
            className="mt-2.5 text-[9px] font-space-mono"
            style={{ color: glow + "66" }}
          >
            TAP TO FLIP BACK
          </div>
        </div>
      )}
    </div>
  );
}
