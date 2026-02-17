"use client";

import { MeterBar } from "@/components/meter-bar";
import { EnergyDots } from "@/components/energy-dots";
import { GradeBadge } from "@/components/grade-badge";
import { ActionButton } from "@/components/action-button";
import { InviteCard } from "@/components/invite-card";
import { Callout } from "@/components/callout";
import { SurpriseEvent } from "@/components/surprise-event";
import { GoalProgressBar } from "@/components/goal-progress-bar";
import { CollectibleCard } from "@/components/collectible-card";
import { RepBadge } from "@/components/rep-badge";
import {
  SAMPLE_COLLECTIBLES,
  INVITES,
  SURPRISE_EVENTS,
  CALLOUTS,
  type Grade,
} from "@/lib/constants";

/* ── Section wrapper ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16 scroll-mt-8">
      <h2 className="text-2xl md:text-3xl font-extrabold font-sora text-text-primary mb-3 tracking-tight">
        {title}
      </h2>
      <div className="h-0.5 bg-white/10 mb-8 rounded-full" />
      {children}
    </section>
  );
}

/* ── Subsection (group within a section) ── */
function SubSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-8 last:mb-0 ${className}`}>
      <h3 className="text-sm md:text-base font-bold text-text-secondary font-space-mono uppercase tracking-widest mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Swatch({ name, value, className }: { name: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border border-white/10 shadow-lg ${className || ""}`}
        style={{ background: value }}
      />
      <span className="text-xs font-medium text-text-primary font-dm-sans text-center">
        {name}
      </span>
      <span className="text-xs text-text-muted font-space-mono select-all">{value}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-game mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-sm text-text-muted tracking-[0.2em] uppercase font-space-mono mb-3">
            FINTEIY
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-sora text-text-primary mb-3 tracking-tight">
            Design System
          </h1>
          <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            Colors, typography, animations, and components extracted from the prototype.
          </p>
        </div>

        {/* ═══════ COLORS ═══════ */}
        <Section title="Colors">
          <SubSection title="Game Colors">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              <Swatch name="Cash" value="#22C55E" />
              <Swatch name="Danger" value="#EF4444" />
              <Swatch name="Social" value="#38BDF8" />
              <Swatch name="Energy" value="#FACC15" />
              <Swatch name="Split" value="#FB923C" />
              <Swatch name="Callout" value="#7DD3FC" />
            </div>
          </SubSection>

          <SubSection title="Text Scale">
            <div className="grid grid-cols-3 gap-6">
              <Swatch name="Primary" value="#F1F5F9" />
              <Swatch name="Secondary" value="#94A3B8" />
              <Swatch name="Muted" value="#64748B" />
            </div>
          </SubSection>

          <SubSection title="Grades">
            <div className="grid grid-cols-5 gap-6">
              <Swatch name="A" value="#22c55e" />
              <Swatch name="B" value="#86efac" />
              <Swatch name="C" value="#facc15" />
              <Swatch name="D" value="#fb923c" />
              <Swatch name="F" value="#ef4444" />
            </div>
          </SubSection>

          <SubSection title="Rarity">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Swatch name="Epic" value="#00f5ff" />
              <Swatch name="Rare" value="#b866ff" />
              <Swatch name="Legendary" value="#ff6600" />
              <Swatch name="Mythic" value="#ffd700" />
            </div>
          </SubSection>

          <SubSection title="Surfaces">
            <div className="grid grid-cols-3 gap-6">
              <Swatch name="Card BG" value="rgba(255,255,255,0.03)" className="border-white/10" />
              <Swatch name="Card Border" value="rgba(255,255,255,0.06)" className="border-white/10" />
              <Swatch name="Card Hover" value="rgba(255,255,255,0.06)" className="border-white/10" />
            </div>
          </SubSection>
        </Section>

        {/* ═══════ TYPOGRAPHY ═══════ */}
        <Section title="Typography">
          <SubSection title="Sora — Headings, titles, grade letters">
            <div className="space-y-3">
              <div>
                <p className="font-sora font-semibold text-xl md:text-2xl text-text-primary">
                  Pick Your Goal
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 600</p>
              </div>
              <div>
                <p className="font-sora font-extrabold text-xl md:text-2xl text-text-primary uppercase">
                  GOAL ACHIEVED!
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 800</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="DM Sans — Body, descriptions, buttons">
            <div className="space-y-4">
              <div>
                <p className="font-dm-sans font-normal text-base md:text-lg text-text-secondary">
                  Everyone&apos;s hitting the mall after school
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 400</p>
              </div>
              <div>
                <p className="font-dm-sans font-medium text-base md:text-lg text-text-secondary">
                  Spending slows your goal unless it&apos;s planned.
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 500</p>
              </div>
              <div>
                <p className="font-dm-sans font-bold text-base md:text-lg text-text-primary">
                  Skip $0 &middot; Join &middot; Earn First
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 700</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="Space Mono — Numbers, stats, prices">
            <div className="space-y-4">
              <div>
                <p className="font-space-mono text-base md:text-lg text-text-secondary">
                  $50 &middot; DAY 1 &middot; 3/3
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 400</p>
              </div>
              <div>
                <p className="font-space-mono font-bold text-base md:text-lg text-cash">
                  $162 &middot; 44% &middot; #FNT-001
                </p>
                <p className="text-sm text-text-muted font-space-mono mt-1">font-weight: 700</p>
              </div>
            </div>
          </SubSection>
        </Section>

        {/* ═══════ ANIMATIONS ═══════ */}
        <Section title="Animations">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-surface-card border border-white/10 p-5 text-center">
              <div
                className="w-12 h-12 rounded-lg bg-cash/20 mx-auto mb-3"
                style={{ animation: "fadeIn 1.5s ease infinite" }}
              />
              <span className="text-sm font-medium text-text-primary font-dm-sans block">fadeIn</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-white/10 p-5 text-center">
              <div
                className="w-12 h-12 rounded-lg bg-social/20 mx-auto mb-3"
                style={{ animation: "slideUp 1.5s ease infinite" }}
              />
              <span className="text-sm font-medium text-text-primary font-dm-sans block">slideUp</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-white/10 p-5 text-center">
              <div
                className="w-12 h-12 rounded-lg bg-danger/20 mx-auto mb-3"
                style={{ animation: "pulse 1s ease-in-out infinite" }}
              />
              <span className="text-sm font-medium text-text-primary font-dm-sans block">pulse</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-white/10 p-5 text-center">
              <div
                className="w-12 h-12 rounded-lg mx-auto mb-3"
                style={{
                  background: "linear-gradient(115deg, transparent 20%, #00f5ff22 45%, transparent 55%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
              <span className="text-sm font-medium text-text-primary font-dm-sans block">shimmer</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-white/10 p-5 text-center">
              <div
                className="w-12 h-3 rounded mx-auto mb-3"
                style={{
                  background: "linear-gradient(90deg, #00ff88, #b866ff, #ffd700, #00ff88)",
                  backgroundSize: "200% 100%",
                  animation: "holoShift 3s ease-in-out infinite",
                }}
              />
              <span className="text-sm font-medium text-text-primary font-dm-sans block">holoShift</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-white/10 p-5 text-center">
              <div
                className="w-12 h-12 rounded-lg bg-energy/10 border border-energy/30 mx-auto mb-3"
                style={{
                  ["--glow-1" as string]: "#facc1544",
                  ["--glow-2" as string]: "#facc1522",
                  ["--glow-3" as string]: "#facc1511",
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
              />
              <span className="text-sm font-medium text-text-primary font-dm-sans block">glowPulse</span>
            </div>
          </div>
        </Section>

        {/* ═══════ COMPONENTS ═══════ */}
        <Section title="Components">
          <SubSection title="MeterBar">
            <div className="grid grid-cols-2 gap-4">
              <MeterBar label="Cash" value={127} max={200} color="#22C55E" icon={"\u{1F4B5}"} prefix="$" />
              <MeterBar label="Social" value={65} max={100} color="#38BDF8" icon={"\u{1F465}"} />
              <MeterBar label="Goal" value={80} max={200} color="#00f5ff" icon={"\u{1F3AF}"} prefix="$" />
              <MeterBar label="Low" value={12} max={200} color="#EF4444" icon={"\u{1F4B5}"} prefix="$" />
            </div>
          </SubSection>

          <SubSection title="EnergyDots">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <EnergyDots energy={3} />
              <EnergyDots energy={2} />
              <EnergyDots energy={1} />
              <EnergyDots energy={0} />
            </div>
          </SubSection>

          <SubSection title="GradeBadge">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-text-muted font-space-mono mb-2">Default</p>
                <div className="flex flex-wrap gap-3">
                  {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
                    <GradeBadge key={g} grade={g} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted font-space-mono mb-2">Small</p>
                <div className="flex flex-wrap gap-3">
                  {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
                    <GradeBadge key={g} grade={g} size="sm" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted font-space-mono mb-2">Large</p>
                <div className="flex flex-wrap gap-3">
                  <GradeBadge grade="A" size="lg" />
                  <GradeBadge grade="F" size="lg" />
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection title="GoalProgressBar">
            <div className="space-y-4">
              <GoalProgressBar name="Limited Sneakers" cash={95} goalAmount={150} color="#00ff88" />
              <GoalProgressBar name="Concert VIP" cash={120} goalAmount={300} color="#ff6b9d" />
              <GoalProgressBar name="College Savings" cash={50} goalAmount={1000} color="#ffd700" />
            </div>
          </SubSection>

          <SubSection title="ActionButton">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-text-muted font-space-mono mb-2">States</p>
                <div className="grid grid-cols-2 gap-3">
                  <ActionButton action="join" cost={18} />
                  <ActionButton action="split" cost={18} />
                  <ActionButton action="skip" />
                  <ActionButton action="earn" />
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted font-space-mono mb-2">Disabled</p>
                <div className="grid grid-cols-2 gap-3">
                  <ActionButton action="join" cost={18} disabled />
                  <ActionButton action="earn" disabled />
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection title="InviteCard">
            <div className="space-y-4">
              <InviteCard invite={INVITES[0]} />
              <InviteCard invite={INVITES[11]} cash={10} />
            </div>
          </SubSection>

          <SubSection title="Callout">
            <div className="space-y-4">
              <Callout text={CALLOUTS.spend_tradeoff} />
              <Callout text={CALLOUTS.borrow_interest} />
            </div>
          </SubSection>

          <SubSection title="SurpriseEvent">
            <div className="space-y-4">
              <SurpriseEvent event={SURPRISE_EVENTS[0]} />
              <SurpriseEvent event={SURPRISE_EVENTS[6]} />
            </div>
          </SubSection>

          <SubSection title="RepBadge">
            <RepBadge collection={SAMPLE_COLLECTIBLES} />
          </SubSection>

          <SubSection title="CollectibleCard (tap to flip)">
            <div className="grid grid-cols-2 gap-4 pb-4">
              {SAMPLE_COLLECTIBLES.map((item, i) => (
                <CollectibleCard key={i} item={item} index={i} flippable />
              ))}
            </div>
          </SubSection>
        </Section>
      </div>
    </div>
  );
}
