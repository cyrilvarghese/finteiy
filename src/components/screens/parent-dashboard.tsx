"use client";

import { useState } from "react";
import type { AppUser } from "@/lib/auth";
import { useCollection } from "@/hooks/use-collection";
import { useRewards } from "@/hooks/use-rewards";
import {
  GOALS,
  SAMPLE_COLLECTIBLES,
  getGrade,
  type ConceptNumber,
  type GradeStats,
  type Grade,
} from "@/lib/constants";

interface ParentDashboardProps {
  user: AppUser;
  onLogout: () => void;
}

// Concept definitions matching report card
const CONCEPTS = [
  { id: 1, icon: "\u{1F4CA}", title: "Avoid Overborrowing" },
  { id: 2, icon: "\u23F1\uFE0F", title: "Delayed Gratification" },
  { id: 3, icon: "\u{1F4B0}", title: "Opportunity Cost" },
  { id: 4, icon: "\u{1F4AA}", title: "Earning vs Borrowing" },
  { id: 5, icon: "\u{1F465}", title: "Balance Social & Financial" },
];

export function ParentDashboard({ user, onLogout }: ParentDashboardProps) {
  // Hardcoded to Maya (child-1) for demo
  const childId = "child-1";
  const childName = "Maya";
  const { collection } = useCollection(childId, SAMPLE_COLLECTIBLES);
  const { rewards, addReward, removeReward, getReward } = useRewards(childId);

  // Custom reward form state
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [rewardText, setRewardText] = useState("");

  // Get most recent 3 achievements
  const recentAchievements = [...collection]
    .sort((a, b) => b.date - a.date)
    .slice(0, 3);

  // Calculate learning insights from collection
  const getConceptStatus = (conceptId: ConceptNumber): { grade: Grade; status: string } => {
    if (collection.length === 0) return { grade: "F", status: "Not Started" };

    // Get average grade for this concept across all games
    const grades = collection.map((c) => {
      const stats: GradeStats = {
        borrowCount: 0, // Simplified for demo
        joins: 0,
        splits: 0,
        skips: 0,
        hustleCount: 0,
        totalEarned: 100,
        totalSpent: 50,
        totalInvites: 10,
        social: c.social,
        goalProgress: 100,
      };
      return getGrade(conceptId, stats);
    });

    const avgGrade = grades[0]; // Simplified: use most recent
    const status = avgGrade === "A" || avgGrade === "B"
      ? "Good"
      : avgGrade === "C" || avgGrade === "D"
        ? "Needs Work"
        : "Struggling";

    return { grade: avgGrade, status };
  };

  const handleAddReward = () => {
    if (selectedGoalId && rewardText.trim()) {
      addReward(selectedGoalId, rewardText.trim());
      setSelectedGoalId("");
      setRewardText("");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 font-dm-sans">
      <div className="max-w-game mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[24px] font-extrabold font-sora text-text-primary mb-1">
            {childName}'s Progress
          </h1>
          <p className="text-xs text-text-muted">Track and support their financial literacy journey</p>
        </div>

        {/* Dashboard cards */}
        <div className="flex flex-col gap-4">
          {/* 1. Active Goal Card */}
          <div
            className="rounded-xl px-5 py-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{"\u{1F3AF}"}</span>
              <h2 className="text-[15px] font-bold font-sora text-text-primary">Current Goal</h2>
            </div>
            <div className="text-xs text-text-muted">
              No active goal • Encourage them to start playing!
            </div>
          </div>

          {/* 2. Recent Achievements Card */}
          <div
            className="rounded-xl px-5 py-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{"\u{1F3C6}"}</span>
              <h2 className="text-[15px] font-bold font-sora text-text-primary">Recent Achievements</h2>
            </div>

            {recentAchievements.length === 0 ? (
              <div className="text-xs text-text-muted">No completed goals yet</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {recentAchievements.map((achievement) => {
                  const goal = GOALS.find((g) => g.id === achievement.goalId);
                  const reward = getReward(achievement.goalId);

                  return (
                    <div
                      key={achievement.date}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="text-xl">{goal?.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-text-primary font-sora">
                          {goal?.name}
                        </div>
                        <div className="text-[11px] text-text-muted font-space-mono">
                          Grade: {achievement.grade} • {achievement.days} days
                          {reward && ` • 🎁 ${reward}`}
                        </div>
                      </div>
                      <div
                        className="px-2 py-0.5 rounded text-[11px] font-bold font-space-mono"
                        style={{
                          background: achievement.grade === "A" || achievement.grade === "B"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(251,191,36,0.1)",
                          color: achievement.grade === "A" || achievement.grade === "B"
                            ? "#22c55e"
                            : "#fbbf24",
                        }}
                      >
                        {achievement.grade}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Learning Insights Card */}
          <div
            className="rounded-xl px-5 py-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{"\u{1F4A1}"}</span>
              <h2 className="text-[15px] font-bold font-sora text-text-primary">Learning Insights</h2>
            </div>

            <div className="flex flex-col gap-2">
              {CONCEPTS.map((concept) => {
                const { grade, status } = getConceptStatus(concept.id as ConceptNumber);

                return (
                  <div
                    key={concept.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{concept.icon}</span>
                      <span className="text-[12px] text-text-secondary">{concept.title}</span>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-space-mono"
                      style={{
                        background: status === "Good"
                          ? "rgba(34,197,94,0.1)"
                          : status === "Needs Work"
                            ? "rgba(251,191,36,0.1)"
                            : "rgba(148,163,184,0.1)",
                        color: status === "Good"
                          ? "#22c55e"
                          : status === "Needs Work"
                            ? "#fbbf24"
                            : "#94a3b8",
                      }}
                    >
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Custom Rewards Card */}
          <div
            className="rounded-xl px-5 py-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{"\u{1F381}"}</span>
              <h2 className="text-[15px] font-bold font-sora text-text-primary">Custom Rewards</h2>
            </div>

            <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
              Attach real-world rewards to goals. When {childName} wins, surprise them!
            </p>

            {/* Add reward form */}
            <div className="flex flex-col gap-2 mb-4">
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[13px] text-text-primary font-dm-sans outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <option value="">Select a goal...</option>
                {GOALS.filter((g) => g.tier === "Starter" || g.tier === "Medium").map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.emoji} {goal.name} (${goal.amount})
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={rewardText}
                  onChange={(e) => setRewardText(e.target.value)}
                  placeholder="e.g., Pizza night, extra screen time..."
                  className="flex-1 px-3 py-2 rounded-lg text-[13px] text-text-primary placeholder:text-text-muted font-dm-sans outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <button
                  onClick={handleAddReward}
                  disabled={!selectedGoalId || !rewardText.trim()}
                  className="px-4 py-2 rounded-lg text-[13px] font-bold font-sora cursor-pointer transition-all disabled:opacity-30"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))",
                    border: "1px solid rgba(255,215,0,0.3)",
                    color: "#fbbf24",
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Current rewards list */}
            {rewards.length > 0 && (
              <div className="flex flex-col gap-2">
                {rewards.map((r) => {
                  const goal = GOALS.find((g) => g.id === r.goalId);
                  return (
                    <div
                      key={r.goalId}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{
                        background: "rgba(255,215,0,0.05)",
                        border: "1px solid rgba(255,215,0,0.1)",
                      }}
                    >
                      <span className="text-sm">{goal?.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-text-primary">
                          {goal?.name}
                        </div>
                        <div className="text-[11px] text-text-muted">{r.reward}</div>
                      </div>
                      <button
                        onClick={() => removeReward(r.goalId)}
                        className="text-xs text-text-muted hover:text-red-400 transition-colors"
                      >
                        {"\u00D7"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
