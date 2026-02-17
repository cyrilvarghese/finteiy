"use client";

import { GradeBadge } from "@/components/grade-badge";
import { ConceptCard } from "@/components/concept-card";
import {
  type Goal,
  type Grade,
  type GameState,
  type GradeStats,
  type ConceptNumber,
  GRADE_COLORS,
  GRADE_TO_NUM,
  TIER_RARITY,
  RARITY_GLOW,
  getGrade,
  clamp,
} from "@/lib/constants";

interface ReportCardProps {
  gameState: GameState;
  goal: Goal;
  onRestart: () => void;
  onNewGoal: () => void;
}

export function ReportCard({ gameState, goal, onRestart, onNewGoal }: ReportCardProps) {
  const s = gameState.stats;
  const goalProg = clamp((gameState.cash / goal.amount) * 100, 0, 100);
  const skipRate = s.totalInvites > 0 ? Math.round((s.skips / s.totalInvites) * 100) : 0;
  const savRate = s.totalEarned > 0 ? Math.round(((s.totalEarned - s.totalSpent) / s.totalEarned) * 100) : 0;
  const hRatio = s.borrowCount > 0
    ? (s.hustleCount / s.borrowCount).toFixed(1)
    : s.hustleCount > 0 ? "\u221E" : "\u2014";

  const sg: GradeStats = {
    ...s,
    social: gameState.social,
    goalProgress: goalProg,
  };

  const concepts = [
    {
      icon: "\u{1F4CA}",
      title: "Overborrowing",
      grade: getGrade(1 as ConceptNumber, sg),
      details: [`Borrowed: ${s.borrowCount}/3`, `Interest: $${gameState.totalInterest}`],
      lesson: s.borrowCount === 0
        ? "Zero debt \u2014 masterful!"
        : s.borrowCount <= 1
          ? "Minimal borrowing."
          : "Debt spiraled.",
    },
    {
      icon: "\u23F1\uFE0F",
      title: "Delayed Gratification",
      grade: getGrade(2 as ConceptNumber, sg),
      details: [`Joined: ${s.joins} | Skipped: ${s.skips} (${skipRate}%)`, `${gameState.day} days`],
      lesson: skipRate >= 50
        ? "Great discipline!"
        : skipRate >= 25
          ? "Could skip more."
          : "Saying yes too much.",
    },
    {
      icon: "\u{1F4B0}",
      title: "Opportunity Cost",
      grade: getGrade(3 as ConceptNumber, sg),
      details: [`Earned: $${s.totalEarned} | Spent: $${s.totalSpent}`, `Savings: ${savRate}%`],
      lesson: savRate >= 30
        ? "Great saving!"
        : savRate >= 0
          ? "Spent almost everything."
          : "Overspent.",
    },
    {
      icon: "\u{1F4AA}",
      title: "Earning vs Borrowing",
      grade: getGrade(4 as ConceptNumber, sg),
      details: [`Hustled: ${s.hustleCount} | Borrowed: ${s.borrowCount}`, `Ratio: ${hRatio}`],
      lesson: s.hustleCount > s.borrowCount
        ? "Earned more than borrowed!"
        : "Need more hustling.",
    },
    {
      icon: "\u{1F465}",
      title: "Social vs Financial",
      grade: getGrade(5 as ConceptNumber, sg),
      details: [`Social: ${gameState.social}`, `Goal: ${Math.round(goalProg)}%`],
      lesson: gameState.social >= 40 && goalProg >= 100
        ? "Perfect balance!"
        : gameState.social >= 40
          ? "Popular but broke."
          : "Focused but lonely.",
    },
  ];

  const avg = concepts.reduce((sum, c) => sum + GRADE_TO_NUM[c.grade], 0) / concepts.length;
  const overall: Grade =
    avg >= 3.5 ? "A" : avg >= 2.5 ? "B" : avg >= 1.5 ? "C" : avg >= 0.5 ? "D" : "F";

  const rarity = TIER_RARITY[goal.tier];
  const glow = RARITY_GLOW[rarity];

  return (
    <div className="min-h-screen p-6 font-dm-sans">
      <div className="max-w-game mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="text-[10px] text-text-muted tracking-[0.2em] uppercase font-space-mono mb-3">
            Financial Report Card
          </div>
          <div className="text-[40px] mb-2">
            {gameState.won ? "\u{1F389}" : "\u{1F4B3}"}
          </div>
          <h1
            className="text-[22px] font-extrabold font-sora m-0"
            style={{ color: gameState.won ? "#22c55e" : "#ef4444" }}
          >
            {gameState.won ? "GOAL ACHIEVED!" : "DEBT TRAP \u2014 GAME OVER"}
          </h1>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-xs text-text-secondary font-space-mono">
              {"\u{1F4C5}"} {gameState.day}d
            </span>
            <span className="text-xs text-text-secondary font-space-mono">
              {"\u{1F4B5}"} ${gameState.cash}
            </span>
            <span className="text-xs text-text-secondary font-space-mono">
              {"\u{1F465}"} {gameState.social}
            </span>
          </div>

          {/* Overall grade */}
          <div
            className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-xl"
            style={{
              background: `${GRADE_COLORS[overall]}11`,
              border: `1px solid ${GRADE_COLORS[overall]}33`,
            }}
          >
            <span className="text-xs text-text-secondary">Overall:</span>
            <GradeBadge grade={overall} size="lg" />
          </div>
        </div>

        {/* 5 concept cards */}
        <div className="flex flex-col gap-3">
          {concepts.map((c, i) => (
            <ConceptCard
              key={i}
              icon={c.icon}
              title={c.title}
              grade={c.grade}
              details={c.details}
              lesson={c.lesson}
              index={i}
            />
          ))}
        </div>

        {/* Collectible unlock (win only) */}
        {gameState.won && (
          <div
            className="mt-4 p-4 rounded-[14px] text-center"
            style={{
              background: `linear-gradient(145deg, ${goal.gradient[0]}11, ${goal.gradient[1]}08)`,
              border: `1px solid ${glow}33`,
              animation: "fadeIn 0.5s ease 0.8s both",
            }}
          >
            <div
              className="text-[10px] font-space-mono tracking-[0.15em] uppercase mb-2"
              style={{ color: glow }}
            >
              {"\u2605"} {rarity} Card Unlocked {"\u2605"}
            </div>
            <div className="text-4xl mb-1">{goal.emoji}</div>
            <div className="text-sm font-bold text-slate-200 font-sora">
              {goal.name}
            </div>
            <div className="text-[11px] text-text-muted font-space-mono mt-1">
              Added to your collection!
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6 pb-8">
          <button
            onClick={onRestart}
            className="flex-1 py-3.5 px-4 rounded-xl cursor-pointer text-[13px] font-bold btn-game"
            style={{
              background: `linear-gradient(135deg, ${goal.color}22, ${goal.color}11)`,
              border: `1px solid ${goal.color}33`,
              color: goal.color,
            }}
          >
            {"\u{1F504}"} Try Again
          </button>
          <button
            onClick={onNewGoal}
            className="flex-1 py-3.5 px-4 rounded-xl cursor-pointer text-[13px] font-bold text-text-secondary btn-game"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {"\u{1F3AF}"} New Goal
          </button>
        </div>
      </div>
    </div>
  );
}
