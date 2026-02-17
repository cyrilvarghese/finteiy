"use client";

import { useState, useEffect } from "react";
import { RepBadge } from "@/components/rep-badge";
import { GoalCard } from "@/components/goal-card";
import { DashboardCard } from "@/components/dashboard-card";
import { StashSheet } from "@/components/stash-sheet";
import {
  GOALS,
  TIERS,
  TIER_LABELS,
  TIER_DIFFICULTY,
  TIER_DIFFICULTY_COLOR,
  LESSONS,
  type Goal,
  type Collectible,
  type Lesson,
} from "@/lib/constants";

interface HomeScreenProps {
  collection: Collectible[];
  onSelectGoal: (goal: Goal) => void;
  onSelectLesson?: (lesson: Lesson) => void;
  userId?: string; // Optional userId to check for nudges
}

export function HomeScreen({ collection, onSelectGoal, onSelectLesson, userId }: HomeScreenProps) {
  const [tab, setTab] = useState<"learn" | "goals">("learn");
  const [stashOpen, setStashOpen] = useState(false);
  const achievedIds = new Set(collection.map(c => c.goalId));

  // Check for parent nudge
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (userId) {
      const nudgeKey = `finteiy-nudge-${userId}`;
      const nudgeTime = localStorage.getItem(nudgeKey);

      if (nudgeTime) {
        const timeSinceNudge = Date.now() - parseInt(nudgeTime);
        // Show nudge if it's less than 24 hours old
        if (timeSinceNudge < 24 * 60 * 60 * 1000) {
          setShowNudge(true);
        } else {
          localStorage.removeItem(nudgeKey);
        }
      }
    }
  }, [userId]);

  const dismissNudge = () => {
    if (userId) {
      localStorage.removeItem(`finteiy-nudge-${userId}`);
      setShowNudge(false);
    }
  };

  return (
    <div className="min-h-screen p-7 pb-4 font-dm-sans">
      <div className="max-w-game mx-auto">
        {/* Parent Nudge */}
        {showNudge && (
          <div
            className="rounded-xl px-4 py-3 mb-5 flex items-center gap-3"
            style={{
              background: "rgba(255,215,0,0.08)",
              border: "1px solid rgba(255,215,0,0.2)",
              boxShadow: "0 0 16px rgba(255,215,0,0.1)",
            }}
          >
            <span className="text-xl">{"\u{1F44B}"}</span>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-text-primary font-sora">
                Your parent sent you a nudge!
              </div>
              <div className="text-[11px] text-text-muted">
                Time to pick a new goal and start playing
              </div>
            </div>
            <button
              onClick={dismissNudge}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {"\u00D7"}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-[13px] text-text-muted tracking-[0.15em] uppercase mb-1.5 font-space-mono">
            Finteiy
          </div>
          <h1 className="text-[26px] font-extrabold text-text-primary m-0 font-sora leading-tight">
            {tab === "learn" ? "Learn Mode" : "Pick Your Goal"}
          </h1>
          <p className="text-xs text-text-muted mt-1.5">
            {tab === "learn"
              ? "Master financial concepts through guided gameplay"
              : "What are you saving for? Higher goals = harder game."}
          </p>
        </div>

        {/* Rep Badge */}
        <RepBadge collection={collection} onOpenStash={() => setStashOpen(true)} />

        {/* Tabs */}
        <div
          className="flex gap-2 mb-5 rounded-lg p-[3px]"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {(["learn", "goals"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-all duration-200 font-dm-sans"
              style={{
                background: tab === t ? "rgba(255,255,255,0.08)" : "transparent",
                color: tab === t ? "#f1f5f9" : "#64748b",
              }}
            >
              {t === "learn" ? "🧠 Learn Mode" : "🎯 Goal Mode"}
            </button>
          ))}
        </div>

        {/* Learn Mode Tab */}
        {tab === "learn" && (
          <div className="flex flex-col gap-3">
            {LESSONS.map((lesson) => (
              <DashboardCard
                key={lesson.id}
                icon={lesson.icon}
                title={lesson.title}
                subtitle={lesson.subtitle}
                variant="cyan"
                defaultOpen={true}
              >
                <p className="text-[13px] text-text-muted leading-relaxed mb-3">
                  {lesson.explanation}
                </p>
                <button
                  onClick={() => onSelectLesson?.(lesson)}
                  className="w-full px-4 py-2.5 rounded-xl text-[13px] font-bold font-sora cursor-pointer transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.08))",
                    border: "1px solid rgba(56,189,248,0.25)",
                    color: "#38bdf8",
                  }}
                >
                  Start Lesson →
                </button>
              </DashboardCard>
            ))}
          </div>
        )}

        {/* Goal Mode Tab */}
        {tab === "goals" &&
          TIERS.map(tier => (
            <div key={tier} className="mb-4">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] text-text-muted tracking-[0.1em] uppercase font-space-mono">
                  {tier} {TIER_LABELS[tier]}
                </span>
                <span
                  className="text-[10px] font-bold font-space-mono"
                  style={{ color: TIER_DIFFICULTY_COLOR[tier] }}
                >
                  {TIER_DIFFICULTY[tier]}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {GOALS.filter(g => g.tier === tier).map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    achieved={achievedIds.has(goal.id)}
                    onSelect={() => onSelectGoal(goal)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Stash Sheet */}
      <StashSheet
        collection={collection}
        open={stashOpen}
        onOpenChange={setStashOpen}
      />
    </div>
  );
}
