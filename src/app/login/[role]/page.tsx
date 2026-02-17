"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authenticate, type AppUser, type UserRole } from "@/lib/auth";
import { type Persona } from "@/components/screens/welcome-screen";

// Pre-fill credentials based on role for demo convenience
const PREFILL: Record<string, { username: string; password: string }> = {
  parent: { username: "parent", password: "finteiy2024" },
  teen: { username: "jordan", password: "goal456" },
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const role = params.role as Persona;

  const prefill = role && PREFILL[role] ? PREFILL[role] : undefined;
  const [username, setUsername] = useState(prefill?.username ?? "");
  const [password, setPassword] = useState(prefill?.password ?? "");
  const [error, setError] = useState<string | null>(null);

  const isParent = role === "parent";
  const accent = isParent
    ? { r: 255, g: 215, b: 0 } // gold
    : { r: 0, g: 245, b: 255 }; // cyan

  const accentRgb = `${accent.r},${accent.g},${accent.b}`;

  const expectedRole: UserRole | undefined =
    role === "parent" ? "parent" : role === "teen" ? "child" : undefined;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    const user = authenticate(username.trim(), password, expectedRole);
    if (user) {
      // Store user in sessionStorage and redirect to appropriate dashboard
      sessionStorage.setItem("finteiy-user", JSON.stringify(user));

      if (user.role === "parent") {
        router.push("/dashboard?role=parent");
      } else if (user.isNew) {
        // New child goes to onboarding
        router.push("/?onboarding=true");
      } else {
        // Existing child goes to their dashboard
        router.push("/dashboard?role=teen");
      }
    } else {
      setError("Invalid username or password");
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
      <div className="max-w-game w-full flex flex-col items-center">
        {/* Back link */}
        <button
          onClick={handleBack}
          className="self-start mb-8 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>{"\u2190"}</span> Back
        </button>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `linear-gradient(145deg, rgba(${accentRgb},0.15), rgba(${accentRgb},0.05))`,
            border: `1px solid rgba(${accentRgb},0.2)`,
            boxShadow: `0 0 30px rgba(${accentRgb},0.1)`,
          }}
        >
          <span className="text-3xl">{isParent ? "\u{1F46A}" : "\u{1F512}"}</span>
        </div>

        {/* Title */}
        <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-1 text-center">
          {role === "parent" ? "Parent Sign In" : role === "teen" ? "Teen Sign In" : "Sign In"}
        </h1>
        <p className="text-xs text-text-muted text-center mb-8">
          Enter your credentials to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {/* Username */}
          <div>
            <label className="block text-[11px] text-text-muted font-space-mono tracking-[0.08em] uppercase mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted font-dm-sans outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `rgba(${accentRgb},0.4)`;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(${accentRgb},0.08)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error
                  ? "rgba(239,68,68,0.4)"
                  : "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] text-text-muted font-space-mono tracking-[0.08em] uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted font-dm-sans outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `rgba(${accentRgb},0.4)`;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(${accentRgb},0.08)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error
                  ? "rgba(239,68,68,0.4)"
                  : "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 rounded-xl text-[15px] font-bold font-sora cursor-pointer transition-all duration-200 btn-game"
            style={{
              background: `linear-gradient(135deg, rgba(${accentRgb},0.2), rgba(${accentRgb},0.1))`,
              border: `1px solid rgba(${accentRgb},0.3)`,
              color: "#f1f5f9",
            }}
          >
            Sign In {"\u2192"}
          </button>
        </form>
      </div>
    </div>
  );
}
