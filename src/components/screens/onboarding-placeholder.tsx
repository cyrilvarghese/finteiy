"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { AppUser } from "@/lib/auth";
import { GOALS, type Goal, type Invite } from "@/lib/constants";
import { MeterBar } from "@/components/meter-bar";
import { EnergyDots } from "@/components/energy-dots";
import { ActionCard } from "@/components/action-card";
import { InviteCard } from "@/components/invite-card";
import { Callout } from "@/components/callout";
import { ActionButton } from "@/components/action-button";

// ─── Interest items with hidden gender weight ──────────────────────────────
// weight > 0 leans feminine, weight < 0 leans masculine, 0 = neutral
interface Interest {
  id: string;
  emoji: string;
  label: string;
  weight: number;
}

const INTERESTS: Interest[] = [
  { id: "heels",      emoji: "\u{1F460}", label: "Fashion",       weight: 1 },
  { id: "sneakers",   emoji: "\u{1F45F}", label: "Sneakers",      weight: -1 },
  { id: "gaming",     emoji: "\u{1F3AE}", label: "Gaming",        weight: -1 },
  { id: "jewelry",    emoji: "\u{1F48D}", label: "Jewelry",       weight: 1 },
  { id: "music",      emoji: "\u{1F3B5}", label: "Music",         weight: 0 },
  { id: "sports",     emoji: "\u26BD",    label: "Sports",        weight: -1 },
  { id: "beauty",     emoji: "\u{1F485}", label: "Beauty",        weight: 1 },
  { id: "tech",       emoji: "\u{1F4F1}", label: "Tech",          weight: 0 },
  { id: "skateboard", emoji: "\u{1F6F9}", label: "Skateboarding", weight: -1 },
  { id: "art",        emoji: "\u{1F3A8}", label: "Art",           weight: 0 },
  { id: "cooking",    emoji: "\u{1F373}", label: "Cooking",       weight: 0 },
  { id: "dance",      emoji: "\u{1F483}", label: "Dance",         weight: 1 },
];

export type StyleProfile = "feminine" | "masculine" | "neutral";

export interface OnboardingData {
  interests: string[];
  styleProfile: StyleProfile;
  firstGoal: Goal | null;
}

function deriveProfile(selected: string[]): StyleProfile {
  const score = selected.reduce((sum, id) => {
    const item = INTERESTS.find((i) => i.id === id);
    return sum + (item?.weight ?? 0);
  }, 0);
  if (score >= 2) return "feminine";
  if (score <= -2) return "masculine";
  return "neutral";
}

// Show only 3 goals for onboarding goal intro
const ONBOARDING_GOALS = GOALS.filter(
  (g) => g.tier === "Starter" || g.tier === "Medium",
).slice(0, 3);

// Tutorial invites for step 5
const TUTORIAL_INVITES: Invite[] = [
  { id: "tutorial-movie", type: "hangout", title: "Movie Night", desc: "Squad's going to see the new Marvel movie", cost: 14, energy: 1, social: 4 },
  { id: "tutorial-headphones", type: "buy", title: "Headphones", desc: "New wireless headphones everyone's getting", cost: 25, energy: 0, social: 2 },
];

type Step = "welcome" | "interests" | "goals" | "meters" | "actions" | "tutorial" | "ready";

interface OnboardingPlaceholderProps {
  user: AppUser;
  onContinue: (data: OnboardingData) => void;
}

// ─── Step indicator ────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <div
          key={s}
          className="h-1 rounded-full transition-all duration-300"
          style={{
            width: s <= current ? 24 : 8,
            background:
              s <= current
                ? "rgba(0,245,255,0.6)"
                : "rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingPlaceholder({ user, onContinue }: OnboardingPlaceholderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize step from URL param or default to "welcome"
  const urlStep = searchParams.get("step") as Step | null;
  const validSteps: Step[] = ["welcome", "interests", "goals", "meters", "actions", "tutorial", "ready"];
  const initialStep = urlStep && validSteps.includes(urlStep) ? urlStep : "welcome";

  const [step, setStep] = useState<Step>(initialStep);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [styleProfile, setStyleProfile] = useState<StyleProfile>("neutral");

  // Tutorial state
  const [tutorialInviteIndex, setTutorialInviteIndex] = useState(0);
  const [tutorialCash, setTutorialCash] = useState(50);
  const [tutorialEnergy, setTutorialEnergy] = useState(3);
  const [tutorialSocial, setTutorialSocial] = useState(50);
  const [showCallout, setShowCallout] = useState(false);
  const [calloutText, setCalloutText] = useState("");

  // Sync step with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [step, router, searchParams]);

  // Auto-transition from "ready" step to dashboard
  useEffect(() => {
    if (step === "ready") {
      const timer = setTimeout(() => {
        onContinue({
          interests: Array.from(selectedInterests),
          styleProfile,
          firstGoal: selectedGoal,
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onContinue, selectedInterests, styleProfile, selectedGoal]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // ─── Step 0: Welcome ─────────────────────────────────────────────────
  if (step === "welcome") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
        <div className="max-w-game w-full flex flex-col items-center">
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

          <h1 className="text-[28px] font-extrabold font-sora text-text-primary mb-2 text-center">
            Welcome, {user.displayName}!
          </h1>
          <p className="text-sm text-text-secondary text-center mb-2">
            You&apos;re new here &mdash; let&apos;s get you started.
          </p>
          <p className="text-xs text-text-muted text-center mb-8 max-w-[280px] leading-relaxed">
            We&apos;ll set up your profile in a few quick steps, then you can
            jump into the game!
          </p>

          <button
            onClick={() => setStep("interests")}
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

  // ─── Step 1: Interest picker ─────────────────────────────────────────
  if (step === "interests") {
    const hasEnough = selectedInterests.size >= 3;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
        <div className="max-w-game w-full flex flex-col items-center">
          <StepIndicator current={1} />

          <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-2 text-center">
            What are you into?
          </h1>
          <p className="text-xs text-text-muted text-center mb-8 max-w-[260px] leading-relaxed">
            Pick at least 3. We&apos;ll use these to personalize your goals and
            rewards.
          </p>

          <div className="grid grid-cols-3 gap-2.5 w-full mb-8">
            {INTERESTS.map((item) => {
              const isSelected = selectedInterests.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-3.5 px-2 cursor-pointer transition-all duration-200"
                  style={{
                    background: isSelected
                      ? "linear-gradient(145deg, rgba(0,245,255,0.1), rgba(56,189,248,0.04))"
                      : "rgba(255,255,255,0.03)",
                    border: isSelected
                      ? "1.5px solid rgba(0,245,255,0.35)"
                      : "1.5px solid rgba(255,255,255,0.06)",
                    boxShadow: isSelected
                      ? "0 0 12px rgba(0,245,255,0.08)"
                      : "none",
                  }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span
                    className="text-[11px] font-medium transition-colors duration-200"
                    style={{
                      color: isSelected
                        ? "rgba(0,245,255,0.85)"
                        : "rgba(148,163,184,0.6)",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p
            className="text-[11px] font-space-mono mb-4 transition-colors duration-200"
            style={{
              color: hasEnough ? "rgba(0,245,255,0.6)" : "rgba(100,116,139,0.6)",
            }}
          >
            {selectedInterests.size}/3 selected{hasEnough && " \u2714"}
          </p>

          <button
            onClick={() => {
              if (hasEnough) {
                const profile = deriveProfile(Array.from(selectedInterests));
                setStyleProfile(profile);
                setStep("goals");
              }
            }}
            disabled={!hasEnough}
            className="w-full max-w-[280px] py-3.5 rounded-xl text-[15px] font-bold font-sora cursor-pointer transition-all duration-200 btn-game disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(56,189,248,0.1))",
              border: "1px solid rgba(0,245,255,0.3)",
              color: "#f1f5f9",
            }}
          >
            Continue {"\u2192"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Step 2: Goal introduction ───────────────────────────────────────
  if (step === "goals") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
        <div className="max-w-game w-full flex flex-col items-center">
          <StepIndicator current={2} />

          {/* Mascot */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "linear-gradient(145deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <span className="text-2xl">{"\u{1F3AF}"}</span>
          </div>

          <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-2 text-center">
            Pick a savings goal
          </h1>
          <p className="text-xs text-text-muted text-center mb-6 max-w-[260px] leading-relaxed">
            You can save up for cool things. Pick one you&apos;d love to own
            &mdash; you&apos;ll work toward it in the game!
          </p>

          {/* Scrollable goal list */}
          <div className="w-full flex flex-col gap-2.5 mb-8 max-h-[320px] overflow-y-auto pr-1">
            {ONBOARDING_GOALS.map((goal) => {
              const isSelected = selectedGoal?.id === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className="w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-left cursor-pointer transition-all duration-200"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${goal.color}15, ${goal.color}08)`
                      : "rgba(255,255,255,0.03)",
                    border: isSelected
                      ? `1.5px solid ${goal.color}55`
                      : "1.5px solid rgba(255,255,255,0.06)",
                    boxShadow: isSelected
                      ? `0 0 16px ${goal.color}15`
                      : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{
                      background: isSelected
                        ? `linear-gradient(145deg, ${goal.color}22, ${goal.color}0a)`
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isSelected ? `${goal.color}33` : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    {goal.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-bold font-sora transition-colors duration-200"
                      style={{
                        color: isSelected ? goal.color : "#e2e8f0",
                      }}
                    >
                      {goal.name}
                    </div>
                    <div className="text-[11px] text-text-muted font-space-mono">
                      ${goal.amount} &middot; {goal.tier}
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="text-xs font-bold shrink-0"
                      style={{ color: goal.color }}
                    >
                      {"\u2713"}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue */}
          <button
            onClick={() => {
              if (selectedGoal) {
                setStep("meters");
              }
            }}
            disabled={!selectedGoal}
            className="w-full max-w-[280px] py-3.5 rounded-xl text-[15px] font-bold font-sora cursor-pointer transition-all duration-200 btn-game disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(56,189,248,0.1))",
              border: "1px solid rgba(0,245,255,0.3)",
              color: "#f1f5f9",
            }}
          >
            Continue {"\u2192"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Step 3: Introduce meters ────────────────────────────────────────
  if (step === "meters") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
        <div className="max-w-game w-full flex flex-col items-center">
          <StepIndicator current={3} />

          <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-2 text-center">
            Track your progress
          </h1>
          <p className="text-xs text-text-muted text-center mb-8 max-w-[280px] leading-relaxed">
            Keep an eye on these 4 meters. They show how you&apos;re doing in the game.
          </p>

          {/* Meter demos in 2x2 grid */}
          <div className="w-full grid grid-cols-2 gap-3 mb-8">
            <MeterBar
              label="Cash"
              value={150}
              max={300}
              color="#22c55e"
              icon={"\u{1F4B5}"}
              prefix="$"
            />
            <EnergyDots energy={2} />
            <MeterBar
              label="Social"
              value={60}
              max={100}
              color="#38bdf8"
              icon={"\u{1F465}"}
            />
            <MeterBar
              label="Goal"
              value={150}
              max={300}
              color={selectedGoal?.color || "#a855f7"}
              icon={"\u{1F3AF}"}
              prefix="$"
            />
          </div>

          {/* Explanations */}
          <div className="w-full flex flex-col gap-2.5 mb-8">
            <div className="flex gap-2.5 text-left">
              <div className="text-lg shrink-0">{"\u{1F4B5}"}</div>
              <div>
                <div className="text-[13px] font-bold text-text-primary font-sora">Cash</div>
                <div className="text-[11px] text-text-muted leading-relaxed">
                  Your money. Earn it, save it, spend it wisely.
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 text-left">
              <div className="text-lg shrink-0">{"\u26A1"}</div>
              <div>
                <div className="text-[13px] font-bold text-text-primary font-sora">Energy</div>
                <div className="text-[11px] text-text-muted leading-relaxed">
                  You get 3 per day. Each action costs energy.
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 text-left">
              <div className="text-lg shrink-0">{"\u{1F465}"}</div>
              <div>
                <div className="text-[13px] font-bold text-text-primary font-sora">Social</div>
                <div className="text-[11px] text-text-muted leading-relaxed">
                  Stay connected. Skipping hangs can hurt your social life.
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 text-left">
              <div className="text-lg shrink-0">{"\u{1F3AF}"}</div>
              <div>
                <div className="text-[13px] font-bold text-text-primary font-sora">Goal Progress</div>
                <div className="text-[11px] text-text-muted leading-relaxed">
                  How close you are to winning your goal.
                </div>
              </div>
            </div>
          </div>

          {/* Continue */}
          <button
            onClick={() => setStep("actions")}
            className="w-full max-w-[280px] py-3.5 rounded-xl text-[15px] font-bold font-sora cursor-pointer transition-all duration-200 btn-game"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(56,189,248,0.1))",
              border: "1px solid rgba(0,245,255,0.3)",
              color: "#f1f5f9",
            }}
          >
            Continue {"\u2192"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Step 4: Introduce actions ───────────────────────────────────────
  if (step === "actions") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
        <div className="max-w-game w-full flex flex-col items-center">
          <StepIndicator current={4} />

          <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-2 text-center">
            Choose your moves
          </h1>
          <p className="text-xs text-text-muted text-center mb-8 max-w-[280px] leading-relaxed">
            Every day you get 3 actions. Here&apos;s what you can do:
          </p>

          {/* Action cards */}
          <div className="w-full flex flex-col gap-3 mb-8">
            <ActionCard
              emoji={"\u{1F64B}"}
              title="Join"
              description="Spend full cost to attend. Boosts your social meter."
              cashImpact={-14}
            />
            <ActionCard
              emoji={"\u{1F91D}"}
              title="Split"
              description="Split the cost with a friend (half price). Still boosts social."
              cashImpact={-7}
            />
            <ActionCard
              emoji={"\u23ED\uFE0F"}
              title="Skip"
              description="Decline the invite. Save money but can hurt your social life."
              cashImpact={0}
            />
            <ActionCard
              emoji={"\u{1F4AA}"}
              title="Earn / Hustle"
              description="Do a side job to earn cash. No social boost, but money matters."
              cashImpact={10}
            />
          </div>

          {/* Continue */}
          <button
            onClick={() => setStep("tutorial")}
            className="w-full max-w-[280px] py-3.5 rounded-xl text-[15px] font-bold font-sora cursor-pointer transition-all duration-200 btn-game"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(56,189,248,0.1))",
              border: "1px solid rgba(0,245,255,0.3)",
              color: "#f1f5f9",
            }}
          >
            Continue {"\u2192"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Step 5: Tutorial (sample invites) ───────────────────────────────
  const currentInvite = TUTORIAL_INVITES[tutorialInviteIndex];

  const handleTutorialAction = (action: "join" | "split" | "skip" | "earn") => {
    let feedback = "";
    let newCash = tutorialCash;
    let newEnergy = tutorialEnergy;
    let newSocial = tutorialSocial;

    if (action === "join") {
      newCash -= currentInvite.cost;
      newEnergy -= currentInvite.energy;
      newSocial += currentInvite.social;

      if (tutorialCash < currentInvite.cost) {
        feedback = "Careful! Joining without enough cash means you'll need to borrow. Try to keep a buffer.";
      } else if (tutorialCash - currentInvite.cost < 20) {
        feedback = "That left you pretty low on cash. Watch your balance!";
      } else {
        feedback = "Nice! You had enough cash and boosted your social meter.";
      }
    } else if (action === "split") {
      const cost = Math.ceil(currentInvite.cost / 2);
      newCash -= cost;
      newEnergy -= currentInvite.energy;
      newSocial += currentInvite.social;

      feedback = "Smart! Splitting saves money while still staying connected.";
    } else if (action === "skip") {
      newEnergy -= 1;
      newSocial -= 2;

      if (tutorialSocial - 2 < 40) {
        feedback = "Skipping saved cash, but your social meter is getting low. Balance is key!";
      } else {
        feedback = "Sometimes skipping is the right move to save money.";
      }
    } else if (action === "earn") {
      if (tutorialEnergy < 1) {
        feedback = "Oops! You don't have enough energy to hustle. Energy matters!";
      } else {
        newCash += 10;
        newEnergy -= 1;
        feedback = "Good hustle! You earned cash without spending on the invite.";
      }
    }

    setTutorialCash(newCash);
    setTutorialEnergy(newEnergy);
    setTutorialSocial(newSocial);
    setCalloutText(feedback);
    setShowCallout(true);

    // Auto-advance after callout
    setTimeout(() => {
      setShowCallout(false);
      if (tutorialInviteIndex < TUTORIAL_INVITES.length - 1) {
        setTutorialInviteIndex(tutorialInviteIndex + 1);
      } else {
        // Tutorial complete - go to ready screen
        setStep("ready");
      }
    }, 4500);
  };

  // ─── Step 6: Ready / Let's Go! ───────────────────────────────────────
  if (step === "ready") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
        <div className="max-w-game w-full flex flex-col items-center">
          <StepIndicator current={6} />

          <div
            className="text-[32px] font-extrabold font-sora text-text-primary text-center"
            style={{
              animation: "fadeIn 600ms ease-out",
            }}
          >
            Let's go!! 🚀
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 5: Tutorial (sample invites) ───────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 font-dm-sans">
      <div className="max-w-game w-full flex flex-col items-center">
        <StepIndicator current={5} />

        <h1 className="text-[22px] font-extrabold font-sora text-text-primary mb-2 text-center">
          {tutorialInviteIndex === 0 ? "Let's practice!" : "One more!"}
        </h1>
        <p className="text-xs text-text-muted text-center mb-6 max-w-[280px] leading-relaxed">
          {tutorialInviteIndex === 0
            ? "Here's an invite. Pick an action and see what happens."
            : "Try another one. Think about your meters before you choose."
          }
        </p>

        {/* Tutorial meters */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-5">
          <MeterBar
            label="Cash"
            value={tutorialCash}
            max={100}
            color="#22c55e"
            icon={"\u{1F4B5}"}
            prefix="$"
          />
          <EnergyDots energy={tutorialEnergy} />
          <MeterBar
            label="Social"
            value={tutorialSocial}
            max={100}
            color="#38bdf8"
            icon={"\u{1F465}"}
          />
        </div>

        {/* Invite card */}
        <div className="w-full mb-5">
          <InviteCard invite={currentInvite} cash={tutorialCash} />
        </div>

        {/* Callout */}
        {showCallout && (
          <div className="w-full mb-5">
            <Callout text={calloutText} duration={4500} />
          </div>
        )}

        {/* Action buttons */}
        {!showCallout && (
          <div className="w-full flex flex-col gap-2">
            <ActionButton
              action="earn"
              onClick={() => handleTutorialAction("earn")}
              disabled={tutorialEnergy < 1}
            />
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                action="join"
                cost={currentInvite.cost}
                onClick={() => handleTutorialAction("join")}
                disabled={tutorialEnergy < currentInvite.energy}
              />
              <ActionButton
                action="split"
                cost={currentInvite.cost}
                onClick={() => handleTutorialAction("split")}
                disabled={tutorialEnergy < currentInvite.energy}
              />
            </div>
            <ActionButton
              action="skip"
              onClick={() => handleTutorialAction("skip")}
              disabled={tutorialEnergy < 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
