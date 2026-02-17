"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WelcomeScreen } from "@/components/screens/welcome-screen";
import { OnboardingPlaceholder, type OnboardingData } from "@/components/screens/onboarding-placeholder";
import { ProfileMenu } from "@/components/profile-menu";
import { type AppUser } from "@/lib/auth";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("finteiy-user");
    if (storedUser) {
      try {
        const user: AppUser = JSON.parse(storedUser);
        setCurrentUser(user);

        // If not onboarding, redirect to dashboard
        if (!isOnboarding) {
          const role = user.role === "parent" ? "parent" : "teen";
          router.push(`/dashboard?role=${role}`);
        }
      } catch {
        sessionStorage.removeItem("finteiy-user");
      }
    }
  }, [router, isOnboarding]);

  // ─── Logout ───────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("finteiy-user");
    router.push("/");
  }, [router]);

  // ─── Onboarding ───────────────────────────────────────────────────────
  const handleOnboardingContinue = useCallback((_data: OnboardingData) => {
    // TODO: store onboarding data for personalisation
    router.push("/dashboard?role=teen");
  }, [router]);

  // ─── Render ───────────────────────────────────────────────────────────

  // Onboarding flow for new child
  if (isOnboarding && currentUser) {
    return (
      <>
        <ProfileMenu
          user={currentUser}
          onProfile={() => {}} // Not used in onboarding
          onLogout={handleLogout}
        />
        <OnboardingPlaceholder
          user={currentUser}
          onContinue={handleOnboardingContinue}
        />
      </>
    );
  }

  // Welcome screen
  return <WelcomeScreen />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeContent />
    </Suspense>
  );
}
