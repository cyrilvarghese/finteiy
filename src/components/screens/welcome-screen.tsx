"use client";

import { useRouter } from "next/navigation";

export type Persona = "teen" | "parent";

interface WelcomeScreenProps {
  onSelect?: (persona: Persona) => void;
  onSignIn?: () => void;
}

export function WelcomeScreen({ onSelect, onSignIn }: WelcomeScreenProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
      <div className="max-w-game w-full flex flex-col items-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Finteiy mascot"
          className="w-20 h-20 mb-6"
          style={{ filter: "drop-shadow(0 0 20px rgba(0,245,255,0.15))" }}
        />

        {/* Title */}
        <h1 className="text-[28px] font-extrabold font-sora text-text-primary mb-2 text-center">
          Finteiy
        </h1>
        <p className="text-sm text-text-secondary text-center mb-1 max-w-[280px] leading-relaxed">
          Teach teens about money before money teaches them.
        </p>
        <p className="text-[11px] text-text-muted font-space-mono tracking-[0.08em] uppercase mb-10">
          Financial literacy made fun
        </p>

        {/* Persona cards */}
        <div className="w-full flex flex-col gap-3 mb-8">
          {/* Parent */}
          <button
            onClick={() => router.push("/login/parent")}
            className="w-full rounded-2xl px-5 py-4 text-left cursor-pointer transition-all duration-200 group"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,170,0,0.04))",
              border: "1px solid rgba(255,215,0,0.15)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: "linear-gradient(145deg, rgba(255,215,0,0.2), rgba(255,215,0,0.08))",
                  border: "1px solid rgba(255,215,0,0.2)",
                }}
              >
                {"\u{1F46A}"}
              </div>
              <div>
                <div className="text-[15px] font-bold text-text-primary font-sora mb-0.5">
                  I&apos;m a Parent
                </div>
                <div className="text-[11px] text-text-muted leading-snug">
                  Track your teen&apos;s progress and set goals together
                </div>
              </div>
              <div className="ml-auto text-text-muted opacity-40 group-hover:opacity-100 transition-opacity text-sm">
                {"\u2192"}
              </div>
            </div>
          </button>

          {/* Teen */}
          <button
            onClick={() => router.push("/login/teen")}
            className="w-full rounded-2xl px-5 py-4 text-left cursor-pointer transition-all duration-200 group"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(56,189,248,0.04))",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: "linear-gradient(145deg, rgba(0,245,255,0.2), rgba(0,245,255,0.08))",
                  border: "1px solid rgba(0,245,255,0.2)",
                }}
              >
                {"\u2728"}
              </div>
              <div>
                <div className="text-[15px] font-bold text-text-primary font-sora mb-0.5">
                  I&apos;m a Teen
                </div>
                <div className="text-[11px] text-text-muted leading-snug">
                  Learn money skills by playing the savings game
                </div>
              </div>
              <div className="ml-auto text-text-muted opacity-40 group-hover:opacity-100 transition-opacity text-sm">
                {"\u2192"}
              </div>
            </div>
          </button>
        </div>

        {/* Sign in link */}
        <div className="text-[11px] text-text-muted">
          Already have an account?{" "}
          <button
            onClick={onSignIn}
            className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
          >
            Sign In {"\u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}
