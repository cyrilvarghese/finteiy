"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type AppUser } from "@/lib/auth";
import { ParentDashboard } from "@/components/screens/parent-dashboard";
import { HomeScreen } from "@/components/screens/home-screen";
import { GameScreen } from "@/components/screens/game-screen";
import { ReportCard } from "@/components/screens/report-card";
import { ProfileMenu } from "@/components/profile-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollection } from "@/hooks/use-collection";
import {
  type Goal,
  type Grade,
  type Collectible,
  type GameState,
  type GradeStats,
  type ConceptNumber,
  SAMPLE_COLLECTIBLES,
  clamp,
  getGrade,
  GRADE_TO_NUM,
} from "@/lib/constants";

type Screen = "home" | "game" | "report" | "profile";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [endState, setEndState] = useState<GameState | null>(null);
  const [gameKey, setGameKey] = useState(0);

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("finteiy-user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const user: AppUser = JSON.parse(storedUser);
      setCurrentUser(user);

      // Verify role matches
      const expectedRole = role === "parent" ? "parent" : "child";
      if (user.role !== expectedRole) {
        router.push("/");
      }
    } catch {
      sessionStorage.removeItem("finteiy-user");
      router.push("/");
    }
  }, [router, role]);

  // Per-user collection
  const defaultCollection =
    currentUser && currentUser.role === "child" && !currentUser.isNew
      ? SAMPLE_COLLECTIBLES
      : [];
  const { collection, addToCollection } = useCollection(
    currentUser?.id ?? "__anonymous__",
    defaultCollection,
  );

  // ─── Logout ───────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("finteiy-user");
    router.push("/");
  }, [router]);

  // ─── Profile ──────────────────────────────────────────────────────────
  const handleProfile = useCallback(() => {
    setScreen("profile");
  }, []);

  // ─── Game flow ────────────────────────────────────────────────────────
  const handleGoalSelect = useCallback((g: Goal) => {
    setGoal(g);
    setScreen("game");
    setGameKey((k) => k + 1);
  }, []);

  const handleGameEnd = useCallback(
    (state: GameState) => {
      setEndState(state);
      if (state.won && goal) {
        const goalProgress = clamp((state.cash / goal.amount) * 100, 0, 100);
        const sg: GradeStats = {
          ...state.stats,
          social: state.social,
          goalProgress,
        };
        const grades = ([1, 2, 3, 4, 5] as ConceptNumber[]).map((c) =>
          getGrade(c, sg),
        );
        const avg = grades.reduce((s, g) => s + GRADE_TO_NUM[g], 0) / 5;
        const overall: Grade =
          avg >= 3.5
            ? "A"
            : avg >= 2.5
              ? "B"
              : avg >= 1.5
                ? "C"
                : avg >= 0.5
                  ? "D"
                  : "F";
        const entry: Collectible = {
          goalId: goal.id,
          days: state.day,
          cashLeft: state.cash,
          social: state.social,
          date: Date.now(),
          grade: overall,
        };
        addToCollection(entry);
      }
      setScreen("report");
    },
    [goal, addToCollection],
  );

  const handleRestart = useCallback(() => {
    setScreen("game");
    setGameKey((k) => k + 1);
  }, []);

  const handleNewGoal = useCallback(() => {
    setScreen("home");
  }, []);

  if (!currentUser) {
    return null; // Loading or redirecting
  }

  // ─── Profile menu overlay ─────────────────────────────────────────────
  const profileOverlay = (
    <ProfileMenu
      user={currentUser}
      onProfile={handleProfile}
      onLogout={handleLogout}
    />
  );

  // ─── Parent Dashboard ─────────────────────────────────────────────────
  if (role === "parent") {
    if (screen === "profile") {
      return (
        <>
          {profileOverlay}
          <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
            <div className="max-w-game w-full flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-4 border border-white/10">
                <AvatarFallback className="bg-white/5 text-xl font-bold text-text-secondary font-space-mono">
                  {currentUser.displayName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-1">
                {currentUser.displayName}
              </h1>
              <p className="text-xs text-text-muted font-space-mono mb-1">
                @{currentUser.username}
              </p>
              <p className="text-xs text-text-muted mb-8 capitalize">
                {currentUser.role}
              </p>
              <button
                onClick={() => setScreen("home")}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {"\u2190"} Back
              </button>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {profileOverlay}
        <ParentDashboard user={currentUser} onLogout={handleLogout} />
      </>
    );
  }

  // ─── Teen/Child Dashboard ────────────────────────────────────────────
  if (screen === "profile") {
    return (
      <>
        {profileOverlay}
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
          <div className="max-w-game w-full flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-4 border border-white/10">
              <AvatarFallback className="bg-white/5 text-xl font-bold text-text-secondary font-space-mono">
                {currentUser.displayName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-1">
              {currentUser.displayName}
            </h1>
            <p className="text-xs text-text-muted font-space-mono mb-1">
              @{currentUser.username}
            </p>
            <p className="text-xs text-text-muted mb-8 capitalize">
              {currentUser.role}
            </p>
            <button
              onClick={() => setScreen("home")}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {"\u2190"} Back
            </button>
          </div>
        </div>
      </>
    );
  }

  if (screen === "game" && goal) {
    return (
      <>
        {profileOverlay}
        <GameScreen key={gameKey} goal={goal} onEnd={handleGameEnd} />
      </>
    );
  }

  if (screen === "report" && endState && goal) {
    return (
      <>
        {profileOverlay}
        <ReportCard
          gameState={endState}
          goal={goal}
          onRestart={handleRestart}
          onNewGoal={handleNewGoal}
        />
      </>
    );
  }

  return (
    <>
      {profileOverlay}
      <HomeScreen
        collection={collection}
        onSelectGoal={handleGoalSelect}
        userId={currentUser?.id}
      />
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DashboardContent />
    </Suspense>
  );
}
