"use client";

import { useState, useEffect } from "react";
import { RepBadge } from "@/components/rep-badge";
import { GoalCard } from "@/components/goal-card";
import { CollectibleCard } from "@/components/collectible-card";
import {
  GOALS,
  TIERS,
  TIER_LABELS,
  TIER_DIFFICULTY,
  TIER_DIFFICULTY_COLOR,
  type Goal,
  type Collectible,
} from "@/lib/constants";

interface HomeScreenProps {
  collection: Collectible[];
  onSelectGoal: (goal: Goal) => void;
  userId?: string; // Optional userId to check for nudges
}

export function HomeScreen({ collection, onSelectGoal, userId }: HomeScreenProps) {
  const [tab, setTab] = useState<"goals" | "collection">("goals");
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
            {tab === "goals" ? "Pick Your Goal" : "Your Collection"}
          </h1>
          <p className="text-xs text-text-muted mt-1.5">
            {tab === "goals"
              ? "What are you saving for? Higher goals = harder game."
              : `${collection.length} card${collection.length !== 1 ? "s" : ""} collected. Tap to flip!`}
          </p>
        </div>

        {/* Rep Badge */}
        <RepBadge collection={collection} />

        {/* Tabs */}
        <div
          className="flex gap-2 mb-5 rounded-lg p-[3px]"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {(["goals", "collection"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-all duration-200 font-dm-sans"
              style={{
                background: tab === t ? "rgba(255,255,255,0.08)" : "transparent",
                color: tab === t ? "#f1f5f9" : "#64748b",
              }}
            >
              {t === "goals" ? "\u{1F3AF} Goals" : "\u{1F3C6} Collection"}
              {t === "collection" && collection.length > 0 && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md bg-energy/[0.15] text-energy font-space-mono">
                  {collection.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Goals Tab */}
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

        {/* Collection Tab */}
        {tab === "collection" && (
          <>
            {collection.length === 0 ? (
              <div className="text-center py-16 px-5">
                <div className="text-5xl mb-4 opacity-30">{"\u{1F3C6}"}</div>
                <div className="text-base font-semibold text-zinc-600 font-sora mb-2">
                  No cards yet
                </div>
                <p className="text-[13px] text-zinc-600 leading-relaxed">
                  Achieve goals to unlock collectible cards!
                </p>
                <button
                  onClick={() => setTab("goals")}
                  className="mt-4 px-6 py-2.5 rounded-lg cursor-pointer text-text-secondary text-[13px] font-semibold transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Start Playing {"\u2192"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-8">
                {collection.map((item, i) => (
                  <CollectibleCard key={i} item={item} index={i} flippable />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
