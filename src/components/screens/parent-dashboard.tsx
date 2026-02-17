"use client";

import type { AppUser } from "@/lib/auth";

interface ParentDashboardProps {
  user: AppUser;
  onLogout: () => void;
}

export function ParentDashboard({ user, onLogout }: ParentDashboardProps) {
  const features = ["Teen Progress Tracking", "Goal History", "Learning Insights"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
      <div className="max-w-game w-full flex flex-col items-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(145deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))",
            border: "1px solid rgba(255,215,0,0.2)",
            boxShadow: "0 0 30px rgba(255,215,0,0.1)",
          }}
        >
          <span className="text-3xl">{"\u{1F46A}"}</span>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-extrabold font-sora text-text-primary mb-2 text-center">
          Parent Dashboard
        </h1>
        <p className="text-sm text-text-secondary text-center mb-2">
          Welcome, {user.displayName}
        </p>
        <p className="text-xs text-text-muted text-center mb-8 max-w-[280px] leading-relaxed">
          Your dashboard is coming soon. You&apos;ll be able to track your
          teen&apos;s financial literacy progress here.
        </p>

        {/* Placeholder feature cards */}
        <div className="w-full flex flex-col gap-3 mb-8">
          {features.map((feature) => (
            <div
              key={feature}
              className="w-full rounded-2xl px-5 py-4 text-left"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-sm text-text-secondary">{feature}</div>
              <div className="text-[11px] text-text-muted opacity-50 mt-1">
                Coming soon
              </div>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={onLogout}
          className="text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          Sign Out {"\u2192"}
        </button>
      </div>
    </div>
  );
}
