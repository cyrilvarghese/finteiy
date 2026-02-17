"use client";

import { useState } from "react";
import type { AppUser } from "@/lib/auth";
import { useCollection } from "@/hooks/use-collection";
import { useRewards } from "@/hooks/use-rewards";
import { DashboardCard } from "@/components/dashboard-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Nudge state
  const [nudgeSent, setNudgeSent] = useState(false);

  const handleSendNudge = () => {
    // Store nudge timestamp in localStorage
    const nudgeKey = `finteiy-nudge-${childId}`;
    localStorage.setItem(nudgeKey, Date.now().toString());
    setNudgeSent(true);

    // Reset nudge sent state after 3 seconds
    setTimeout(() => setNudgeSent(false), 3000);
  };

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
          <DashboardCard icon={"\u{1F3AF}"} title="Current Goal" variant="gold">
            <div className="text-xs text-text-muted mb-4">
              No active goal • Encourage them to start playing!
            </div>

            <button
              onClick={handleSendNudge}
              disabled={nudgeSent}
              className="w-full px-4 py-3 rounded-xl text-[14px] font-bold font-sora cursor-pointer transition-all disabled:opacity-50"
              style={{
                background: nudgeSent
                  ? "rgba(34,197,94,0.12)"
                  : "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))",
                border: nudgeSent
                  ? "1px solid rgba(34,197,94,0.25)"
                  : "1px solid rgba(255,215,0,0.3)",
                color: nudgeSent ? "#22c55e" : "#fbbf24",
              }}
            >
              {nudgeSent ? "✓ Nudge Sent!" : "📱 Send Nudge"}
            </button>
          </DashboardCard>

          {/* 2. Recent Achievements Card */}
          <DashboardCard icon={"\u{1F3C6}"} title="Recent Achievements" variant="dark">
            {recentAchievements.length === 0 ? (
              <div className="text-xs text-text-muted">No completed goals yet</div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentAchievements.map((achievement, idx) => {
                  const goal = GOALS.find((g) => g.id === achievement.goalId);
                  const reward = getReward(achievement.goalId);

                  return (
                    <div
                      key={achievement.date}
                      className="flex items-center gap-3"
                      style={{
                        paddingBottom: idx < recentAchievements.length - 1 ? "12px" : "0",
                        borderBottom: idx < recentAchievements.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}
                    >
                      <div className="text-2xl">{goal?.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold text-text-primary font-sora mb-0.5">
                          {goal?.name}
                        </div>
                        <div className="text-[11px] text-text-muted font-space-mono">
                          {achievement.days} days
                          {reward && ` • 🎁 ${reward}`}
                        </div>
                      </div>
                      <div
                        className="px-2.5 py-1 rounded-lg text-[13px] font-extrabold font-sora"
                        style={{
                          background: achievement.grade === "A" || achievement.grade === "B"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(251,191,36,0.15)",
                          color: achievement.grade === "A" || achievement.grade === "B"
                            ? "#22c55e"
                            : "#fbbf24",
                          boxShadow: achievement.grade === "A" || achievement.grade === "B"
                            ? "0 0 8px rgba(34,197,94,0.1)"
                            : "0 0 8px rgba(251,191,36,0.1)",
                        }}
                      >
                        {achievement.grade}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardCard>

          {/* 3. Learning Insights Card */}
          <DashboardCard icon={"\u{1F4A1}"} title="Learning Insights" variant="cyan" defaultOpen={false}>
            <div className="grid grid-cols-1 gap-2.5">
              {CONCEPTS.map((concept) => {
                const { grade, status } = getConceptStatus(concept.id as ConceptNumber);

                return (
                  <div
                    key={concept.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "none",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{concept.icon}</span>
                      <span className="text-[12px] text-text-secondary font-medium">{concept.title}</span>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-md text-[10px] font-extrabold font-space-mono tracking-wide"
                      style={{
                        background: status === "Good"
                          ? "rgba(34,197,94,0.15)"
                          : status === "Needs Work"
                            ? "rgba(251,191,36,0.15)"
                            : "rgba(148,163,184,0.15)",
                        color: status === "Good"
                          ? "#22c55e"
                          : status === "Needs Work"
                            ? "#fbbf24"
                            : "#94a3b8",
                      }}
                    >
                      {status.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>

          {/* 4. Custom Rewards Card */}
          <DashboardCard
            icon={"\u{1F381}"}
            title="Custom Rewards"
            subtitle="Attach real-world surprises to goals"
            variant="gold"
            defaultOpen={false}
          >

            {/* Add reward form */}
            <div className="flex flex-col gap-2 mb-4">
              <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a goal..." />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.filter((g) => g.tier === "Starter" || g.tier === "Medium").map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.emoji} {goal.name} (${goal.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  className="px-5 py-2 rounded-xl text-[13px] font-extrabold font-sora cursor-pointer transition-all disabled:opacity-30 btn-game"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,170,0,0.12))",
                    border: "1.5px solid rgba(255,215,0,0.35)",
                    color: "#fbbf24",
                    boxShadow: "0 0 12px rgba(255,215,0,0.15)",
                  }}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Current rewards list */}
            {rewards.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-4">
                {rewards.map((r) => {
                  const goal = GOALS.find((g) => g.id === r.goalId);
                  return (
                    <div
                      key={r.goalId}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,215,0,0.03))",
                        border: "1px solid rgba(255,215,0,0.15)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: "rgba(255,215,0,0.12)",
                        }}
                      >
                        <span className="text-base">{goal?.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-text-primary font-sora">
                          {goal?.name}
                        </div>
                        <div className="text-[11px] text-text-muted">{r.reward}</div>
                      </div>
                      <button
                        onClick={() => removeReward(r.goalId)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        {"\u00D7"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
