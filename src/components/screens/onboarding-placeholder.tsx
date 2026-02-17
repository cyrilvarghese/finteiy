"use client";

import type { AppUser } from "@/lib/auth";

interface OnboardingPlaceholderProps {
  user: AppUser;
  onContinue: () => void;
}

export function OnboardingPlaceholder({ user, onContinue }: OnboardingPlaceholderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
      <div className="max-w-game w-full flex flex-col items-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(145deg, rgba(0,245,255,0.15), rgba(0,245,255,0.05))",
            border: "1px solid rgba(0,245,255,0.2)",
            boxShadow: "0 0 30px rgba(0,245,255,0.1)",
          }}
        >
          <span className="text-3xl">{"\u{1F3AE}"}</span>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-extrabold font-sora text-text-primary mb-2 text-center">
          Welcome, {user.displayName}!
        </h1>
        <p className="text-sm text-text-secondary text-center mb-2">
          You&apos;re new here &mdash; let&apos;s get you started.
        </p>
        <p className="text-xs text-text-muted text-center mb-8 max-w-[280px] leading-relaxed">
          The onboarding experience is being designed. For now, jump straight
          into the game!
        </p>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="px-8 py-3.5 rounded-xl text-[15px] font-bold font-sora cursor-pointer transition-all duration-200 btn-game"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(56,189,248,0.1))",
            border: "1px solid rgba(0,245,255,0.3)",
            color: "#f1f5f9",
          }}
        >
          Start Playing {"\u2192"}
        </button>
      </div>
    </div>
  );
}
