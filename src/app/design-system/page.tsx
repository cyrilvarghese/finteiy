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
    <section className="mb-12">
      <h2 className="text-lg font-extrabold font-sora text-text-primary mb-1">{title}</h2>
      <div className="h-px bg-white/[0.06] mb-6" />
      {children}
    </section>
  );
}

function Swatch({ name, value, className }: { name: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-12 h-12 rounded-lg border border-white/10 ${className || ""}`}
        style={{ background: value }}
      />
      <span className="text-[9px] text-text-muted font-space-mono text-center leading-tight">
        {name}
      </span>
      <span className="text-[8px] text-slate-700 font-space-mono">{value}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-game mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-[11px] text-text-muted tracking-[0.2em] uppercase font-space-mono mb-2">
            FINTEIY
          </div>
          <h1 className="text-2xl font-extrabold font-sora text-text-primary mb-2">
            Design System
          </h1>
          <p className="text-sm text-text-muted">
            Colors, typography, animations, and components extracted from the prototype.
          </p>
        </div>

        {/* ═══════ COLORS ═══════ */}
        <Section title="Colors">
          {/* Game Colors */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            Game Colors
          </h3>
          <div className="grid grid-cols-6 gap-3 mb-6">
            <Swatch name="Cash" value="#22C55E" />
            <Swatch name="Danger" value="#EF4444" />
            <Swatch name="Social" value="#38BDF8" />
            <Swatch name="Energy" value="#FACC15" />
            <Swatch name="Split" value="#FB923C" />
            <Swatch name="Callout" value="#7DD3FC" />
          </div>

          {/* Text Colors */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            Text Scale
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Swatch name="Primary" value="#F1F5F9" />
            <Swatch name="Secondary" value="#94A3B8" />
            <Swatch name="Muted" value="#64748B" />
          </div>

          {/* Grade Colors */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            Grades
          </h3>
          <div className="grid grid-cols-5 gap-3 mb-6">
            <Swatch name="A" value="#22c55e" />
            <Swatch name="B" value="#86efac" />
            <Swatch name="C" value="#facc15" />
            <Swatch name="D" value="#fb923c" />
            <Swatch name="F" value="#ef4444" />
          </div>

          {/* Rarity Colors */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            Rarity
          </h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Swatch name="Epic" value="#00f5ff" />
            <Swatch name="Rare" value="#b866ff" />
            <Swatch name="Legendary" value="#ff6600" />
            <Swatch name="Mythic" value="#ffd700" />
          </div>

          {/* Surface Colors */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            Surfaces
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Swatch name="Card BG" value="rgba(255,255,255,0.03)" className="border-white/10" />
            <Swatch name="Card Border" value="rgba(255,255,255,0.06)" className="border-white/10" />
            <Swatch name="Card Hover" value="rgba(255,255,255,0.06)" className="border-white/10" />
          </div>
        </Section>

        {/* ═══════ TYPOGRAPHY ═══════ */}
        <Section title="Typography">
          {/* Sora */}
          <div className="mb-6">
            <div className="text-[10px] text-text-muted font-space-mono uppercase tracking-wider mb-2">
              Sora &mdash; Headings, titles, grade letters
            </div>
            <div className="font-sora font-semibold text-2xl text-text-primary mb-1">
              Pick Your Goal (600)
            </div>
            <div className="font-sora font-extrabold text-2xl text-text-primary">
              GOAL ACHIEVED! (800)
            </div>
          </div>

          {/* DM Sans */}
          <div className="mb-6">
            <div className="text-[10px] text-text-muted font-space-mono uppercase tracking-wider mb-2">
              DM Sans &mdash; Body, descriptions, buttons
            </div>
            <div className="font-dm-sans font-normal text-sm text-text-secondary mb-1">
              Everyone&apos;s hitting the mall after school (400)
            </div>
            <div className="font-dm-sans font-medium text-sm text-text-secondary mb-1">
              Spending slows your goal unless it&apos;s planned. (500)
            </div>
            <div className="font-dm-sans font-bold text-sm text-text-primary">
              Skip $0 &middot; Join &middot; Earn First (700)
            </div>
          </div>

          {/* Space Mono */}
          <div>
            <div className="text-[10px] text-text-muted font-space-mono uppercase tracking-wider mb-2">
              Space Mono &mdash; Numbers, stats, prices
            </div>
            <div className="font-space-mono text-sm text-text-secondary mb-1">
              $50 &middot; DAY 1 &middot; 3/3 (400)
            </div>
            <div className="font-space-mono font-bold text-sm text-cash">
              $162 &middot; 44% &middot; #FNT-001 (700)
            </div>
          </div>
        </Section>

        {/* ═══════ ANIMATIONS ═══════ */}
        <Section title="Animations">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
              <div
                className="w-10 h-10 rounded-lg bg-cash/20 mx-auto mb-2"
                style={{ animation: "fadeIn 1.5s ease infinite" }}
              />
              <span className="text-[10px] text-text-muted font-space-mono">fadeIn</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
              <div
                className="w-10 h-10 rounded-lg bg-social/20 mx-auto mb-2"
                style={{ animation: "slideUp 1.5s ease infinite" }}
              />
              <span className="text-[10px] text-text-muted font-space-mono">slideUp</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
              <div
                className="w-10 h-10 rounded-lg bg-danger/20 mx-auto mb-2"
                style={{ animation: "pulse 1s ease-in-out infinite" }}
              />
              <span className="text-[10px] text-text-muted font-space-mono">pulse</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
              <div
                className="w-10 h-10 rounded-lg mx-auto mb-2"
                style={{
                  background: "linear-gradient(115deg, transparent 20%, #00f5ff22 45%, transparent 55%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
              <span className="text-[10px] text-text-muted font-space-mono">shimmer</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
              <div
                className="w-10 h-3 rounded mx-auto mb-2"
                style={{
                  background: "linear-gradient(90deg, #00ff88, #b866ff, #ffd700, #00ff88)",
                  backgroundSize: "200% 100%",
                  animation: "holoShift 3s ease-in-out infinite",
                }}
              />
              <span className="text-[10px] text-text-muted font-space-mono">holoShift</span>
            </div>
            <div className="rounded-xl bg-surface-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
              <div
                className="w-10 h-10 rounded-lg bg-energy/10 border border-energy/30 mx-auto mb-2"
                style={{
                  ["--glow-1" as string]: "#facc1544",
                  ["--glow-2" as string]: "#facc1522",
                  ["--glow-3" as string]: "#facc1511",
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
              />
              <span className="text-[10px] text-text-muted font-space-mono">glowPulse</span>
            </div>
          </div>
        </Section>

        {/* ═══════ COMPONENTS ═══════ */}
        <Section title="Components">
          {/* Meters */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            MeterBar
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <MeterBar label="Cash" value={127} max={200} color="#22C55E" icon={"\u{1F4B5}"} prefix="$" />
            <MeterBar label="Social" value={65} max={100} color="#38BDF8" icon={"\u{1F465}"} />
            <MeterBar label="Goal" value={80} max={200} color="#00f5ff" icon={"\u{1F3AF}"} prefix="$" />
            <MeterBar label="Low" value={12} max={200} color="#EF4444" icon={"\u{1F4B5}"} prefix="$" />
          </div>

          {/* Energy Dots */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            EnergyDots
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <EnergyDots energy={3} />
            <EnergyDots energy={2} />
            <EnergyDots energy={1} />
            <EnergyDots energy={0} />
          </div>

          {/* Grade Badges */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            GradeBadge
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
              <GradeBadge key={g} grade={g} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
              <GradeBadge key={g} grade={g} size="sm" />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            <GradeBadge grade="A" size="lg" />
            <GradeBadge grade="F" size="lg" />
          </div>

          {/* Goal Progress */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            GoalProgressBar
          </h3>
          <div className="space-y-3 mb-6">
            <GoalProgressBar name="Limited Sneakers" cash={95} goalAmount={150} color="#00ff88" />
            <GoalProgressBar name="Concert VIP" cash={120} goalAmount={300} color="#ff6b9d" />
            <GoalProgressBar name="College Savings" cash={50} goalAmount={1000} color="#ffd700" />
          </div>

          {/* Action Buttons */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            ActionButton
          </h3>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <ActionButton action="join" cost={18} />
            <ActionButton action="split" cost={18} />
            <ActionButton action="skip" />
            <ActionButton action="earn" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <ActionButton action="join" cost={18} disabled />
            <ActionButton action="earn" disabled />
          </div>

          {/* Invite Cards */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            InviteCard
          </h3>
          <div className="space-y-3 mb-6">
            <InviteCard invite={INVITES[0]} />
            <InviteCard invite={INVITES[11]} cash={10} />
          </div>

          {/* Callout */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            Callout
          </h3>
          <div className="space-y-3 mb-6">
            <Callout text={CALLOUTS.spend_tradeoff} />
            <Callout text={CALLOUTS.borrow_interest} />
          </div>

          {/* Surprise Event */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            SurpriseEvent
          </h3>
          <div className="space-y-3 mb-6">
            <SurpriseEvent event={SURPRISE_EVENTS[0]} />
            <SurpriseEvent event={SURPRISE_EVENTS[6]} />
          </div>

          {/* Rep Badge */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            RepBadge
          </h3>
          <div className="mb-6">
            <RepBadge collection={SAMPLE_COLLECTIBLES} />
          </div>

          {/* Collectible Cards */}
          <h3 className="text-xs font-bold text-text-secondary mb-3 font-space-mono uppercase tracking-wider">
            CollectibleCard (tap to flip)
          </h3>
          <div className="grid grid-cols-2 gap-3 pb-8">
            {SAMPLE_COLLECTIBLES.map((item, i) => (
              <CollectibleCard key={i} item={item} index={i} flippable />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
