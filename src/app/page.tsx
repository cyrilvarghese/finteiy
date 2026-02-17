"use client";

import { useState, useCallback } from "react";
import { WelcomeScreen, type Persona } from "@/components/screens/welcome-screen";
import { LoginScreen } from "@/components/screens/login-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { GameScreen } from "@/components/screens/game-screen";
import { ReportCard } from "@/components/screens/report-card";
import { ParentDashboard } from "@/components/screens/parent-dashboard";
import { OnboardingPlaceholder } from "@/components/screens/onboarding-placeholder";
import { useCollection } from "@/hooks/use-collection";
import { type AppUser } from "@/lib/auth";
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

type Screen =
  | "welcome"
  | "login"
  | "home"
  | "game"
  | "report"
  | "onboarding"
  | "parent-dashboard";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [endState, setEndState] = useState<GameState | null>(null);
  const [gameKey, setGameKey] = useState(0);

  // Per-user collection: existing child gets sample data, new child gets empty
  const defaultCollection =
    currentUser && currentUser.role === "child" && !currentUser.isNew
      ? SAMPLE_COLLECTIBLES
      : [];
  const { collection, addToCollection } = useCollection(
    currentUser?.id ?? "__anonymous__",
    defaultCollection,
  );

  // ─── Welcome ──────────────────────────────────────────────────────────
  const handlePersonaSelect = useCallback((p: Persona) => {
    setPersona(p);
    setScreen("login");
  }, []);

  const handleSignIn = useCallback(() => {
    setPersona(null);
    setScreen("login");
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────
  const handleLogin = useCallback((user: AppUser) => {
    setCurrentUser(user);
    // Derive persona from user role if coming via "Sign In" link
    if (user.role === "parent") {
      setPersona("parent");
      setScreen("parent-dashboard");
    } else if (user.isNew) {
      setPersona("teen");
      setScreen("onboarding");
    } else {
      setPersona("teen");
      setScreen("home");
    }
  }, []);

  const handleLoginBack = useCallback(() => {
    setPersona(null);
    setScreen("welcome");
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setPersona(null);
    setGoal(null);
    setEndState(null);
    setScreen("welcome");
  }, []);

  // ─── Onboarding ───────────────────────────────────────────────────────
  const handleOnboardingContinue = useCallback(() => {
    setScreen("home");
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

  // ─── Render ───────────────────────────────────────────────────────────

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onSelect={handlePersonaSelect}
        onSignIn={handleSignIn}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        persona={persona}
        onLogin={handleLogin}
        onBack={handleLoginBack}
      />
    );
  }

  if (screen === "parent-dashboard" && currentUser) {
    return <ParentDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (screen === "onboarding" && currentUser) {
    return (
      <OnboardingPlaceholder
        user={currentUser}
        onContinue={handleOnboardingContinue}
      />
    );
  }

  if (screen === "game" && goal) {
    return <GameScreen key={gameKey} goal={goal} onEnd={handleGameEnd} />;
  }

  if (screen === "report" && endState && goal) {
    return (
      <ReportCard
        gameState={endState}
        goal={goal}
        onRestart={handleRestart}
        onNewGoal={handleNewGoal}
      />
    );
  }

  return <HomeScreen collection={collection} onSelectGoal={handleGoalSelect} />;
}
