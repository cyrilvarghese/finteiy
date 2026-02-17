import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const GOALS = [
  { id: "sneakers", name: "Limited Sneakers", emoji: "👟", amount: 150, tier: "Starter", color: "#00ff88", gradient: ["#00ff88", "#00cc66", "#009944"] },
  { id: "console", name: "Gaming Console", emoji: "🎮", amount: 180, tier: "Starter", color: "#b866ff", gradient: ["#b866ff", "#8844ff", "#6622ff"] },
  { id: "phone", name: "Phone Upgrade", emoji: "📱", amount: 200, tier: "Starter", color: "#00f5ff", gradient: ["#00f5ff", "#0099ff", "#6666ff"] },
  { id: "concert", name: "Concert VIP", emoji: "🎵", amount: 300, tier: "Medium", color: "#ff6b9d", gradient: ["#ff6b9d", "#ff1493", "#9d1466"] },
  { id: "skateboard", name: "Electric Skateboard", emoji: "⚡", amount: 350, tier: "Medium", color: "#ffd700", gradient: ["#ffd700", "#ffaa00", "#ff8800"] },
  { id: "laptop", name: "Laptop", emoji: "💻", amount: 400, tier: "Medium", color: "#4da6ff", gradient: ["#4da6ff", "#1a8cff", "#0066cc"] },
  { id: "camera", name: "Pro Camera", emoji: "📸", amount: 500, tier: "Advanced", color: "#00d4aa", gradient: ["#00d4aa", "#00aa88", "#008866"] },
  { id: "trip", name: "Spring Break Trip", emoji: "✈️", amount: 600, tier: "Advanced", color: "#ff6600", gradient: ["#ff6600", "#ff4400", "#cc2200"] },
  { id: "car", name: "Car Down Payment", emoji: "🚗", amount: 800, tier: "Advanced", color: "#ff4466", gradient: ["#ff4466", "#dd2244", "#bb0022"] },
  { id: "college", name: "College Savings", emoji: "🎓", amount: 1000, tier: "Dream", color: "#ffd700", gradient: ["#ffd700", "#ffaa00", "#ff6600"] },
];

const TIER_RARITY = { Starter: "Epic", Medium: "Rare", Advanced: "Legendary", Dream: "Mythic" };
const RARITY_GLOW = { Epic: "#00f5ff", Rare: "#b866ff", Legendary: "#ff6600", Mythic: "#ffd700" };

// ─── REPUTATION SYSTEM ─────────────────────────────────────────────────────

const REP_LEVELS = [
  { min: 0,  name: "Broke & Clueless",    emoji: "🐣", color: "#94a3b8", tag: "Just hatched", tier: 0 },
  { min: 1,  name: "Penny Pincher",       emoji: "🪙", color: "#a8a29e", tag: "Baby steps", tier: 1 },
  { min: 2,  name: "Budget Rookie",       emoji: "📊", color: "#22c55e", tag: "Getting the hang of it", tier: 2 },
  { min: 4,  name: "Cash Flow Kid",       emoji: "💸", color: "#38bdf8", tag: "Money moves", tier: 3 },
  { min: 6,  name: "Stack Builder",       emoji: "🧱", color: "#a78bfa", tag: "Brick by brick", tier: 4 },
  { min: 9,  name: "Hustle Boss",         emoji: "🔥", color: "#fb923c", tag: "Built different", tier: 5 },
  { min: 12, name: "Money Mogul",         emoji: "👑", color: "#ffd700", tag: "Walking bank account", tier: 6 },
  { min: 16, name: "Finance Demon",       emoji: "😈", color: "#ef4444", tag: "They can't keep up", tier: 7 },
  { min: 20, name: "Generational Wealth", emoji: "💎", color: "#e0f2fe", tag: "Legacy mode activated", tier: 8 },
];

function getRepLevel(collection) {
  // Score: each collectible adds points based on tier difficulty
  const tierPoints = { Starter: 1, Medium: 2, Advanced: 3, Dream: 5 };
  const totalPoints = collection.reduce((sum, item) => {
    const goal = GOALS.find(g => g.id === item.goalId);
    return sum + (goal ? tierPoints[goal.tier] : 1);
  }, 0);
  let level = REP_LEVELS[0];
  for (const l of REP_LEVELS) {
    if (totalPoints >= l.min) level = l;
  }
  return { ...level, points: totalPoints, nextLevel: REP_LEVELS[Math.min(level.tier + 1, REP_LEVELS.length - 1)] };
}

// ─── SAMPLE COLLECTIBLES (pre-loaded for demo) ─────────────────────────────

const SAMPLE_COLLECTIBLES = [
  { goalId: "sneakers", days: 8, cashLeft: 162, social: 44, date: Date.now() - 86400000 * 5, grade: "B" },
  { goalId: "phone", days: 12, cashLeft: 211, social: 38, date: Date.now() - 86400000 * 3, grade: "A" },
  { goalId: "console", days: 10, cashLeft: 185, social: 52, date: Date.now() - 86400000 * 2, grade: "B" },
  { goalId: "concert", days: 18, cashLeft: 312, social: 41, date: Date.now() - 86400000 * 1, grade: "A" },
];

const INVITES = [
  { id: "movie", type: "hangout", title: "Movie Night", desc: "Squad's going to see the new Marvel movie", cost: 14, energy: 1, social: 4 },
  { id: "mall", type: "hangout", title: "Mall Hangout", desc: "Everyone's hitting the mall after school", cost: 18, energy: 1, social: 3 },
  { id: "bowling", type: "hangout", title: "Bowling Night", desc: "Birthday bowling party for Marcus", cost: 12, energy: 1, social: 5 },
  { id: "pizza", type: "hangout", title: "Pizza Run", desc: "Late night pizza with the crew", cost: 8, energy: 1, social: 3 },
  { id: "arcade", type: "hangout", title: "Arcade Day", desc: "New arcade opened downtown", cost: 15, energy: 2, social: 4 },
  { id: "beach", type: "hangout", title: "Beach Trip", desc: "Beach day this weekend, need gas money", cost: 20, energy: 2, social: 5 },
  { id: "bbq", type: "hangout", title: "Backyard BBQ", desc: "Bring drinks and snacks to the cookout", cost: 10, energy: 1, social: 4 },
  { id: "escape", type: "hangout", title: "Escape Room", desc: "Squad booked an escape room", cost: 22, energy: 1, social: 5 },
  { id: "karaoke", type: "hangout", title: "Karaoke Night", desc: "Friday karaoke, it's gonna be fire", cost: 16, energy: 2, social: 4 },
  { id: "boba", type: "hangout", title: "Boba Run", desc: "Quick boba trip after class", cost: 7, energy: 1, social: 3 },
  { id: "sneaker_raffle", type: "buy", title: "Sneaker Raffle", desc: "Limited drop raffle entry", cost: 5, energy: 0, social: 2 },
  { id: "hoodie", type: "buy", title: "New Hoodie", desc: "That hoodie everyone's been wearing", cost: 35, energy: 0, social: 3 },
  { id: "airpods", type: "buy", title: "AirPods Case", desc: "Matching cases with your squad", cost: 12, energy: 0, social: 2 },
  { id: "game", type: "buy", title: "New Game", desc: "Everyone's playing the new release", cost: 25, energy: 0, social: 3 },
  { id: "hat", type: "buy", title: "Snapback Hat", desc: "Clean new hat for the summer", cost: 18, energy: 0, social: 2 },
  { id: "shoes", type: "buy", title: "Running Shoes", desc: "Need new kicks for gym", cost: 40, energy: 0, social: 2 },
  { id: "shirt", type: "buy", title: "Graphic Tee", desc: "Limited collab drop just went live", cost: 28, energy: 0, social: 3 },
  { id: "phone_case", type: "buy", title: "Phone Case", desc: "Custom case everyone's getting", cost: 15, energy: 0, social: 2 },
];

const SURPRISE_EVENTS = [
  { title: "Streaming Auto-Renewed", desc: "Your music subscription charged", cost: 10 },
  { title: "Parking Ticket", desc: "Forgot to pay for parking. Fine!", cost: 15 },
  { title: "Phone Data Overage", desc: "Went over your data limit", cost: 8 },
  { title: "Lost Bet", desc: "Squad fantasy league entry fee", cost: 12 },
  { title: "Birthday Gift", desc: "Friend's bday, chip in for gift", cost: 18 },
  { title: "Uber Home", desc: "Missed last bus, need a ride", cost: 14 },
  { title: "Broken Headphones", desc: "Need replacement for school", cost: 25 },
  { title: "App Purchase", desc: "Accidentally bought premium", cost: 7 },
  { title: "Library Fine", desc: "Late return fees piled up", cost: 9 },
  { title: "Delivery Fee", desc: "Food delivery surprise fees", cost: 6 },
];

const HUSTLES = [
  { name: "Dog Walking", emoji: "🐕", basePay: 10, energy: 1 },
  { name: "Tutoring", emoji: "📚", basePay: 12, energy: 1 },
  { name: "Lawn Mowing", emoji: "🌿", basePay: 15, energy: 2 },
];

const CALLOUTS = {
  spend_tradeoff: "Spending slows your goal unless it's planned.",
  borrow_interest: "Borrowing helps now, but you repay more later. That's interest.",
  debt_stacking: "Borrowing again squeezes your future cash even more.",
  skip_protected: "Skipping saves cash now, but can hurt social later.",
  earn_boosted: "Hustling builds your goal faster than spending slows it.",
  social_tradeoff: "Being included has a cost. Pick which hangs are worth it.",
  surprise_hit: "Unexpected costs are part of life. Keep a cash buffer.",
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function getGrade(concept, stats) {
  switch (concept) {
    case 1: return stats.borrowCount === 0 ? "A" : stats.borrowCount === 1 ? "B" : stats.borrowCount === 2 ? "D" : "F";
    case 2: {
      const r = stats.totalInvites > 0 ? stats.skips / stats.totalInvites : 0;
      return r >= 0.6 ? "A" : r >= 0.4 ? "B" : r >= 0.25 ? "C" : r >= 0.1 ? "D" : "F";
    }
    case 3: {
      const r = stats.totalEarned > 0 ? (stats.totalEarned - stats.totalSpent) / stats.totalEarned : 0;
      return r >= 0.5 ? "A" : r >= 0.3 ? "B" : r >= 0.1 ? "C" : r >= 0 ? "D" : "F";
    }
    case 4: {
      const r = stats.borrowCount > 0 ? stats.hustleCount / stats.borrowCount : stats.hustleCount > 0 ? 10 : 5;
      return r >= 3 ? "A" : r >= 2 ? "B" : r >= 1 ? "C" : r >= 0.5 ? "D" : "F";
    }
    case 5: {
      const p = stats.goalProgress, ok = stats.social >= 40;
      if (p >= 100 && ok) return "A"; if (p >= 75 && ok) return "B";
      if (p >= 50 || ok) return "C"; return p >= 25 ? "D" : "F";
    }
    default: return "C";
  }
}

const GRADE_COLORS = { A: "#22c55e", B: "#86efac", C: "#facc15", D: "#fb923c", F: "#ef4444" };

// ─── STORAGE ────────────────────────────────────────────────────────────────

async function loadCollection() {
  try {
    const result = await window.storage.get("finteiy-collection-v2");
    const data = result ? JSON.parse(result.value) : null;
    if (!data || data.length === 0) return SAMPLE_COLLECTIBLES;
    return data;
  } catch { return SAMPLE_COLLECTIBLES; }
}

async function saveToCollection(entry) {
  try {
    const existing = await loadCollection();
    const updated = [...existing, entry];
    await window.storage.set("finteiy-collection-v2", JSON.stringify(updated));
    return updated;
  } catch { return SAMPLE_COLLECTIBLES; }
}

// ─── SHARED STYLES ──────────────────────────────────────────────────────────

const FONTS = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&family=Sora:wght@600;800&display=swap";
const BG = "linear-gradient(145deg, #0a0a0f 0%, #0f1019 50%, #0a0f1a 100%)";

const CSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes holoShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes cardFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 12px var(--glow1),0 2px 20px var(--glow2)} 50%{box-shadow:0 0 20px var(--glow1),0 4px 30px var(--glow2),0 0 50px var(--glow3)} }
  @keyframes badgeShine { 0%{left:-100%} 100%{left:200%} }
  @keyframes repGlow { 0%,100%{text-shadow:0 0 8px var(--rep-glow)} 50%{text-shadow:0 0 16px var(--rep-glow),0 0 30px var(--rep-glow2)} }
  button:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.1)}
  button:active:not(:disabled){transform:translateY(0);filter:brightness(0.95)}
`;

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function MeterBar({ label, value, max, color, icon }) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em", fontFamily: "'DM Sans'" }}>{icon} {label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Space Mono'" }}>{label === "Cash" ? `$${value}` : value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          width: `${pct}%`, transition: "width 0.6s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

function EnergyDots({ energy }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em", fontFamily: "'DM Sans'" }}>⚡ Energy</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#facc15", fontFamily: "'Space Mono'" }}>{energy}/3</span>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 28, height: 6, borderRadius: 3,
            background: i < energy ? "linear-gradient(90deg, #facc15, #f59e0b)" : "rgba(255,255,255,0.06)",
            transition: "background 0.3s", boxShadow: i < energy ? "0 0 6px #facc1555" : "none" }} />
        ))}
      </div>
    </div>
  );
}

// ─── PREMIUM COLLECTIBLE CARD ───────────────────────────────────────────────

function CollectibleCard({ item, index, flippable = false }) {
  const [flipped, setFlipped] = useState(false);
  const goal = GOALS.find(g => g.id === item.goalId);
  if (!goal) return null;
  const rarity = TIER_RARITY[goal.tier];
  const glow = RARITY_GLOW[rarity];
  const [g1, g2, g3] = goal.gradient;
  const gradeColor = item.grade ? GRADE_COLORS[item.grade] || "#94a3b8" : "#94a3b8";

  const card = (
    <div
      onClick={() => flippable && setFlipped(!flipped)}
      style={{
        "--glow1": glow + "44", "--glow2": glow + "22", "--glow3": glow + "11",
        borderRadius: 16, position: "relative", overflow: "hidden",
        cursor: flippable ? "pointer" : "default",
        animation: `fadeIn 0.5s ease ${index * 0.1}s both, glowPulse 3s ease-in-out infinite`,
        perspective: 1000, transition: "transform 0.15s ease",
      }}
    >
      {/* ── FRONT ── */}
      {!flipped && (
        <div style={{
          background: `linear-gradient(165deg, ${g1}18 0%, ${g2}0d 40%, ${g3}08 100%)`,
          border: `1px solid ${glow}40`,
          borderRadius: 16, padding: 0, position: "relative", overflow: "hidden",
        }}>
          {/* Holographic stripe */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${g1}, ${g2}, ${g3}, ${g1})`,
            backgroundSize: "200% 100%", animation: "holoShift 3s ease-in-out infinite",
          }} />

          {/* Corner serial */}
          <div style={{
            position: "absolute", top: 10, left: 10, fontSize: 8, color: glow + "66",
            fontFamily: "'Space Mono'", letterSpacing: "0.08em"
          }}>#FNT-{String(index + 1).padStart(3, "0")}</div>

          {/* Rarity badge */}
          <div style={{
            position: "absolute", top: 8, right: 8, fontSize: 8, fontWeight: 700,
            padding: "3px 8px", borderRadius: 6, fontFamily: "'Space Mono'",
            background: `linear-gradient(135deg, ${glow}33, ${glow}11)`,
            color: glow, letterSpacing: "0.08em", textTransform: "uppercase",
            border: `1px solid ${glow}22`,
          }}>{rarity}</div>

          {/* Metallic shimmer sweep */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(115deg, transparent 20%, ${glow}08 45%, transparent 55%, ${glow}05 75%, transparent 90%)`,
            backgroundSize: "200% 100%", animation: "shimmer 5s ease-in-out infinite",
          }} />

          {/* Main content */}
          <div style={{ padding: "28px 14px 14px", textAlign: "center" }}>
            {/* Emoji with glow ring */}
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: "50%", marginBottom: 10,
              background: `radial-gradient(circle, ${glow}15 0%, transparent 70%)`,
              boxShadow: `0 0 20px ${glow}22, inset 0 0 15px ${glow}11`,
            }}>
              <span style={{ fontSize: 36, filter: `drop-shadow(0 0 10px ${glow}55)` }}>{goal.emoji}</span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Sora'", marginBottom: 2 }}>{goal.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono'", marginBottom: 10 }}>${goal.amount} Goal</div>

            {/* Grade badge */}
            {item.grade && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 10,
                padding: "3px 10px", borderRadius: 6,
                background: `${gradeColor}15`, border: `1px solid ${gradeColor}25`,
              }}>
                <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'Space Mono'" }}>Grade</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: gradeColor, fontFamily: "'Sora'" }}>{item.grade}</span>
              </div>
            )}

            {/* Stats row */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 12,
              padding: "8px 0", borderTop: `1px solid ${glow}15`,
              fontSize: 10, color: "#94a3b8", fontFamily: "'Space Mono'",
            }}>
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ color: "#64748b" }}>Days</span>
                <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12 }}>{item.days}</span>
              </div>
              <div style={{ width: 1, background: `${glow}15` }} />
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ color: "#64748b" }}>Cash</span>
                <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 12 }}>${item.cashLeft}</span>
              </div>
              <div style={{ width: 1, background: `${glow}15` }} />
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ color: "#64748b" }}>Social</span>
                <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: 12 }}>{item.social}</span>
              </div>
            </div>
          </div>

          {/* Bottom holographic bar */}
          <div style={{
            height: 2, background: `linear-gradient(90deg, transparent, ${g1}66, ${g2}66, ${g3}66, transparent)`,
          }} />
        </div>
      )}

      {/* ── BACK (on flip) ── */}
      {flipped && (
        <div style={{
          background: `linear-gradient(165deg, ${g1}11 0%, #0f1019 50%, ${g3}08 100%)`,
          border: `1px solid ${glow}30`, borderRadius: 16, padding: "20px 14px",
          minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 10, color: glow, fontFamily: "'Space Mono'", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            ★ Card Details ★
          </div>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{goal.emoji}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Sora'", marginBottom: 4 }}>{goal.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono'", marginBottom: 12 }}>
            {rarity} · {goal.tier} Tier
          </div>
          <div style={{ fontSize: 10, color: "#475569", textAlign: "center", lineHeight: 1.5, maxWidth: 160 }}>
            Achieved in {item.days} days with ${item.cashLeft} remaining and {item.social} social score.
          </div>
          <div style={{ marginTop: 10, fontSize: 9, color: glow + "66", fontFamily: "'Space Mono'" }}>
            TAP TO FLIP BACK
          </div>
        </div>
      )}
    </div>
  );

  return card;
}

// ─── REPUTATION BADGE ───────────────────────────────────────────────────────

function RepBadge({ collection }) {
  const rep = getRepLevel(collection);
  const next = rep.nextLevel;
  const progressToNext = next.min > rep.min ? Math.min(100, ((rep.points - rep.min) / (next.min - rep.min)) * 100) : 100;

  return (
    <div style={{
      "--rep-glow": rep.color + "55", "--rep-glow2": rep.color + "22",
      background: `linear-gradient(135deg, ${rep.color}0a, ${rep.color}05, transparent)`,
      border: `1px solid ${rep.color}25`, borderRadius: 16, padding: "16px 18px",
      position: "relative", overflow: "hidden", marginBottom: 20,
      animation: "fadeIn 0.5s ease",
    }}>
      {/* Shine sweep */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: 60, opacity: 0.06,
        background: `linear-gradient(90deg, transparent, white, transparent)`,
        animation: "badgeShine 4s ease-in-out infinite",
      }} />

      <div className="flex items-center gap-3">
        {/* Level icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(145deg, ${rep.color}22, ${rep.color}08)`,
          border: `1px solid ${rep.color}30`,
          boxShadow: `0 0 15px ${rep.color}15, inset 0 0 10px ${rep.color}08`,
          fontSize: 26,
        }}>
          {rep.emoji}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
            <span style={{
              fontSize: 15, fontWeight: 800, fontFamily: "'Sora'",
              color: rep.color, animation: "repGlow 3s ease-in-out infinite",
            }}>{rep.name}</span>
            <span style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 4,
              background: `${rep.color}15`, color: rep.color, fontFamily: "'Space Mono'",
              fontWeight: 700, letterSpacing: "0.05em",
            }}>LVL {rep.tier}</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans'", marginBottom: 6 }}>
            {rep.tag}
          </div>

          {/* XP progress bar */}
          <div className="flex items-center gap-2">
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
              <div style={{
                height: "100%", borderRadius: 2, transition: "width 0.6s ease",
                background: `linear-gradient(90deg, ${rep.color}88, ${rep.color})`,
                width: `${progressToNext}%`, boxShadow: `0 0 6px ${rep.color}44`,
              }} />
            </div>
            <span style={{ fontSize: 9, color: "#475569", fontFamily: "'Space Mono'", whiteSpace: "nowrap" }}>
              {rep.points}/{next.min} XP
            </span>
          </div>
        </div>
      </div>

      {/* Next level hint */}
      {rep.tier < REP_LEVELS.length - 1 && (
        <div style={{
          marginTop: 10, padding: "6px 10px", borderRadius: 8,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
          fontSize: 10, color: "#475569", display: "flex", alignItems: "center", gap: 6
        }}>
          <span>Next: {next.emoji} <span style={{ color: next.color, fontWeight: 600 }}>{next.name}</span></span>
          <span style={{ marginLeft: "auto", color: "#3f3f46", fontFamily: "'Space Mono'" }}>{next.min - rep.points} XP to go</span>
        </div>
      )}
    </div>
  );
}

// ─── SCREENS ────────────────────────────────────────────────────────────────

function HomeScreen({ onSelect, collection }) {
  const [tab, setTab] = useState("goals");
  const [hoveredGoal, setHoveredGoal] = useState(null);
  const tiers = ["Starter", "Medium", "Advanced", "Dream"];
  const tierLabels = { Starter: "$150–200", Medium: "$300–400", Advanced: "$500–800", Dream: "$1000+" };
  const tierDiff = { Starter: "Chill", Medium: "Moderate", Advanced: "Hard", Dream: "Legendary" };
  const tierDiffColor = { Starter: "#22c55e", Medium: "#facc15", Advanced: "#fb923c", Dream: "#ef4444" };
  const achievedIds = new Set(collection.map(c => c.goalId));

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "28px 16px", fontFamily: "'DM Sans'" }}>
      <link href={FONTS} rel="stylesheet" />
      <style>{CSS}</style>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'Space Mono'" }}>Finteiy</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: 0, fontFamily: "'Sora'", lineHeight: 1.2 }}>
            {tab === "goals" ? "Pick Your Goal" : "Your Collection"}
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            {tab === "goals" ? "What are you saving for? Higher goals = harder game." : `${collection.length} card${collection.length !== 1 ? "s" : ""} collected. Tap to flip!`}
          </p>
        </div>

        {/* Rep Badge */}
        <RepBadge collection={collection} />

        {/* Tabs */}
        <div className="flex gap-2" style={{ marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
          {["goals", "collection"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: "none", fontFamily: "'DM Sans'", transition: "all 0.2s",
              background: tab === t ? "rgba(255,255,255,0.08)" : "transparent",
              color: tab === t ? "#f1f5f9" : "#64748b",
            }}>
              {t === "goals" ? "🎯 Goals" : "🏆 Collection"}
              {t === "collection" && collection.length > 0 && (
                <span style={{
                  marginLeft: 6, fontSize: 10, padding: "1px 6px", borderRadius: 6,
                  background: "rgba(250,204,21,0.15)", color: "#facc15", fontFamily: "'Space Mono'"
                }}>{collection.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Goals */}
        {tab === "goals" && tiers.map(tier => (
          <div key={tier} style={{ marginBottom: 18 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6, padding: "0 4px" }}>
              <span style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Mono'" }}>{tier} {tierLabels[tier]}</span>
              <span style={{ fontSize: 10, color: tierDiffColor[tier], fontWeight: 700, fontFamily: "'Space Mono'" }}>{tierDiff[tier]}</span>
            </div>
            <div className="flex flex-col gap-2">
              {GOALS.filter(g => g.tier === tier).map(goal => (
                <button key={goal.id} onClick={() => onSelect(goal)}
                  onMouseEnter={() => setHoveredGoal(goal.id)} onMouseLeave={() => setHoveredGoal(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    background: hoveredGoal === goal.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                    border: `1px solid ${hoveredGoal === goal.id ? goal.color + "44" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 12, cursor: "pointer", transition: "all 0.2s", width: "100%", textAlign: "left",
                    boxShadow: hoveredGoal === goal.id ? `0 0 20px ${goal.color}11` : "none"
                  }}>
                  <span style={{ fontSize: 26 }}>{goal.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{goal.name}</span>
                      {achievedIds.has(goal.id) && (
                        <span style={{ fontSize: 9, color: "#22c55e", background: "rgba(34,197,94,0.12)", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>✓ WON</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono'" }}>${goal.amount}</div>
                  </div>
                  <div style={{ fontSize: 16, color: goal.color, opacity: hoveredGoal === goal.id ? 1 : 0.3, transition: "opacity 0.2s" }}>→</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Collection */}
        {tab === "collection" && (
          <>
            {collection.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🏆</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#475569", fontFamily: "'Sora'", marginBottom: 8 }}>No cards yet</div>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                  Achieve goals to unlock collectible cards!
                </p>
                <button onClick={() => setTab("goals")} style={{
                  marginTop: 16, padding: "10px 24px", borderRadius: 10, cursor: "pointer",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontSize: 13, fontWeight: 600
                }}>Start Playing →</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingBottom: 32 }}>
                {collection.map((item, i) => (
                  <CollectibleCard key={i} item={item} index={i} flippable />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GameScreen({ goal, onEnd }) {
  const [state, setState] = useState({
    cash: 50, energy: 3, social: 50, day: 1,
    borrowCount: 0, totalInterest: 0, debts: [],
    stats: { joins: 0, splits: 0, skips: 0, hustleCount: 0, borrowCount: 0, totalEarned: 50, totalSpent: 0, totalInvites: 0 },
    currentInvite: null, invitesThisDay: 0,
    callout: null, surprise: null, gameOver: false, won: false,
    animatingAction: null, showBorrowWarning: false,
  });

  const pendingEndRef = useRef(false);

  useEffect(() => {
    if (state.gameOver && !pendingEndRef.current) {
      pendingEndRef.current = true;
      const t = setTimeout(() => onEnd(state), 1800);
      return () => clearTimeout(t);
    }
  }, [state.gameOver]); // eslint-disable-line

  const generateInvite = useCallback(() => {
    setState(prev => {
      if (prev.gameOver) return prev;
      if (prev.cash >= goal.amount) return { ...prev, gameOver: true, won: true, currentInvite: null };
      const inv = pick(INVITES);
      return { ...prev, currentInvite: { ...inv, cost: inv.cost + rand(-2, 4) },
        invitesThisDay: prev.invitesThisDay + 1, callout: null, surprise: null, animatingAction: null,
        stats: { ...prev.stats, totalInvites: prev.stats.totalInvites + 1 } };
    });
  }, [goal.amount]);

  useEffect(() => { generateInvite(); }, [generateInvite]);

  const processDebt = (cash, debts) => {
    let c = cash, paid = 0;
    const updated = debts.map(d => {
      if (d.remaining > 0) {
        const p = Math.ceil(d.amount / 6), i = Math.ceil(p * d.rate);
        c -= p + i; paid += i;
        return { ...d, remaining: d.remaining - 1 };
      }
      return d;
    }).filter(d => d.remaining > 0);
    return { cash: c, debts: updated, interestPaid: paid };
  };

  const doBorrow = (deficit, st) => {
    const n = st.borrowCount + 1, rate = [0.3, 0.4, 0.5][Math.min(n - 1, 2)], amt = Math.abs(deficit) + 5;
    if (n >= 3) return { cash: st.cash + amt, borrowCount: 3, debts: [...st.debts, { amount: amt, rate, remaining: 6 }],
      totalInterest: st.totalInterest, gameOver: true, won: false, showBorrowWarning: false,
      callout: "💳 3rd borrow! Debt spiral consumed everything.", stats: { ...st.stats, borrowCount: n } };
    return { cash: st.cash + amt, borrowCount: n, debts: [...st.debts, { amount: amt, rate, remaining: 6 }],
      totalInterest: st.totalInterest, showBorrowWarning: n === 2,
      callout: n === 1 ? CALLOUTS.borrow_interest : CALLOUTS.debt_stacking, stats: { ...st.stats, borrowCount: n } };
  };

  const handleAction = (action) => {
    if (state.gameOver || state.animatingAction) return;
    if (!state.currentInvite) return;
    setState(p => ({ ...p, animatingAction: action }));

    setTimeout(() => {
      setState(prev => {
        if (prev.gameOver) return prev;
        const inv = prev.currentInvite;
        if (!inv) return prev;
        let n = { ...prev, animatingAction: null };
        let dc = 0, de = 0, ds = 0, co = "";

        switch (action) {
          case "join":
            dc = -inv.cost; de = -(inv.energy || rand(1,2)); ds = rand(3,5); co = CALLOUTS.spend_tradeoff;
            n.stats = { ...n.stats, joins: n.stats.joins + 1, totalSpent: n.stats.totalSpent + inv.cost }; break;
          case "split": {
            const h = Math.ceil(inv.cost / 2);
            dc = -h; de = -1; ds = rand(2,3); co = CALLOUTS.social_tradeoff;
            n.stats = { ...n.stats, splits: n.stats.splits + 1, totalSpent: n.stats.totalSpent + h }; break;
          }
          case "skip":
            ds = -rand(2,4); co = CALLOUTS.skip_protected;
            n.stats = { ...n.stats, skips: n.stats.skips + 1 }; break;
          case "earn": {
            const h = pick(HUSTLES), pay = h.basePay + rand(-2,2);
            dc = pay; de = -h.energy; ds = -1;
            co = `${h.emoji} ${h.name}: +$${pay}! ${CALLOUTS.earn_boosted}`;
            n.stats = { ...n.stats, hustleCount: n.stats.hustleCount + 1, totalEarned: n.stats.totalEarned + pay }; break;
          }
        }
        n.cash = prev.cash + dc; n.energy = clamp(prev.energy + de, 0, 3);
        n.social = clamp(prev.social + ds, 0, 100); n.callout = co;

        if (n.cash < 0) Object.assign(n, doBorrow(n.cash, n));
        if ((action === "join" || action === "split") && Math.random() < 0.25 && !n.gameOver) {
          const s = pick(SURPRISE_EVENTS);
          n.surprise = s; n.cash -= s.cost; n.stats = { ...n.stats, totalSpent: n.stats.totalSpent + s.cost };
          n.callout = CALLOUTS.surprise_hit;
          if (n.cash < 0) Object.assign(n, doBorrow(n.cash, n));
        }
        if (n.cash >= goal.amount && !n.gameOver) { n.gameOver = true; n.won = true; }
        if (!n.gameOver) {
          const max = rand(2,4);
          if (n.invitesThisDay >= max) {
            const d = processDebt(n.cash, n.debts);
            n.cash = d.cash; n.debts = d.debts; n.totalInterest += d.interestPaid;
            if (n.cash < 0) Object.assign(n, doBorrow(n.cash, n));
            n.day += 1; n.energy = 3; n.invitesThisDay = 0;
          }
        }
        if (!n.gameOver) setTimeout(() => generateInvite(), 1000);
        return n;
      });
    }, 400);
  };

  const inv = state.currentInvite;
  const goalPct = clamp((state.cash / goal.amount) * 100, 0, 100);
  const wb = (c) => state.cash < c;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans'" }}>
      <link href={FONTS} rel="stylesheet" /><style>{CSS}</style>

      <div style={{ padding: "16px 16px 0", maxWidth: 420, margin: "0 auto" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'Space Mono'", letterSpacing: "0.1em" }}>DAY {state.day}</span>
          <div className="flex items-center gap-2">
            {state.borrowCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, fontFamily: "'Space Mono'",
                background: state.borrowCount >= 2 ? "rgba(239,68,68,0.15)" : "rgba(251,146,60,0.15)",
                color: state.borrowCount >= 2 ? "#ef4444" : "#fb923c",
                border: `1px solid ${state.borrowCount >= 2 ? "#ef444433" : "#fb923c33"}`,
                animation: state.showBorrowWarning ? "pulse 1s infinite" : "none"
              }}>💳 {state.borrowCount}/3</span>
            )}
            <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'Space Mono'" }}>{goal.emoji} ${goal.amount}</span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>🎯 {goal.name}</span>
            <span style={{ fontSize: 11, color: goal.color, fontFamily: "'Space Mono'", fontWeight: 700 }}>{Math.round(goalPct)}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
              background: `linear-gradient(90deg, ${goal.color}99, ${goal.color})`,
              width: `${goalPct}%`, boxShadow: `0 0 12px ${goal.color}44` }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <MeterBar label="Cash" value={state.cash} max={goal.amount} color="#22c55e" icon="💵" />
          <EnergyDots energy={state.energy} />
          <MeterBar label="Social" value={state.social} max={100} color="#38bdf8" icon="👥" />
          <MeterBar label="Goal" value={Math.max(0, state.cash)} max={goal.amount} color={goal.color} icon="🎯" />
        </div>
      </div>

      {state.showBorrowWarning && (
        <div style={{ margin: "0 16px 12px", maxWidth: 388, marginLeft: "auto", marginRight: "auto", padding: "10px 14px", borderRadius: 10,
          background: "linear-gradient(90deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))", border: "1px solid rgba(239,68,68,0.2)",
          fontSize: 13, color: "#fca5a5", textAlign: "center", fontWeight: 600 }}>🚨 One more borrow and it's GAME OVER!</div>
      )}

      <div style={{ padding: "0 16px", maxWidth: 420, margin: "0 auto" }}>
        {inv && !state.gameOver && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "20px 18px", marginBottom: 12,
            opacity: state.animatingAction ? 0.5 : 1, transition: "all 0.3s ease",
            transform: state.animatingAction ? "scale(0.97)" : "scale(1)" }}>
            <div className="flex items-start justify-between" style={{ marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Space Mono'", marginBottom: 4 }}>
                  {inv.type === "hangout" ? "🎉 Invite" : "🛍️ Buy"}</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0, fontFamily: "'Sora'" }}>{inv.title}</h2>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444", fontFamily: "'Space Mono'",
                background: "rgba(239,68,68,0.1)", padding: "4px 10px", borderRadius: 8 }}>-${inv.cost}</div>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{inv.desc}</p>
            <div className="flex gap-2 flex-wrap" style={{ marginTop: 10 }}>
              {wb(inv.cost) && <span style={{ fontSize: 10, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 6px", borderRadius: 4, fontFamily: "'Space Mono'" }}>💳 Join triggers borrow</span>}
              {wb(Math.ceil(inv.cost / 2)) && <span style={{ fontSize: 10, color: "#fb923c", background: "rgba(251,146,60,0.1)", padding: "2px 6px", borderRadius: 4, fontFamily: "'Space Mono'" }}>💳 Split triggers borrow</span>}
            </div>
          </div>
        )}

        {state.surprise && !state.gameOver && (
          <div style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(251,146,60,0.06))",
            border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, animation: "fadeIn 0.3s ease" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>💥</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", fontFamily: "'Sora'" }}>{state.surprise.title}</span>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{state.surprise.desc} <span style={{ color: "#ef4444", fontWeight: 700, fontFamily: "'Space Mono'" }}>-${state.surprise.cost}</span></p>
          </div>
        )}

        {state.callout && !state.gameOver && (
          <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#7dd3fc", lineHeight: 1.5, animation: "fadeIn 0.3s ease" }}>💡 {state.callout}</div>
        )}

        {!state.gameOver && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 24 }}>
            {[
              { id: "join", icon: "✓", label: `Join -$${inv?.cost||0}`, b: "rgba(239,68,68,0.2)", bg: "rgba(239,68,68,0.08)", bg2: "rgba(239,68,68,0.03)", c: "#fca5a5", ne: true },
              { id: "split", icon: "⚡", label: `Split -$${inv?Math.ceil(inv.cost/2):0}`, b: "rgba(251,146,60,0.2)", bg: "rgba(251,146,60,0.08)", bg2: "rgba(251,146,60,0.03)", c: "#fed7aa", ne: true },
              { id: "skip", icon: "✕", label: "Skip $0", b: "rgba(34,197,94,0.2)", bg: "rgba(34,197,94,0.08)", bg2: "rgba(34,197,94,0.03)", c: "#86efac", ne: false },
              { id: "earn", icon: "💰", label: "Earn First", b: "rgba(250,204,21,0.2)", bg: "rgba(250,204,21,0.08)", bg2: "rgba(250,204,21,0.03)", c: "#fde68a", ne: true },
            ].map(btn => (
              <button key={btn.id} onClick={() => handleAction(btn.id)}
                disabled={(btn.ne && state.energy < 1) || !inv}
                style={{ padding: "14px 8px", borderRadius: 12, border: `1px solid ${btn.b}`,
                  background: `linear-gradient(135deg, ${btn.bg}, ${btn.bg2})`,
                  color: btn.c, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  opacity: (btn.ne && state.energy < 1) ? 0.3 : 1, transition: "all 0.2s", fontFamily: "'DM Sans'" }}>
                <div style={{ fontSize: 20, marginBottom: 2 }}>{btn.icon}</div>{btn.label}
              </button>
            ))}
          </div>
        )}

        {state.gameOver && (
          <div style={{ textAlign: "center", padding: "40px 0", animation: "slideUp 0.6s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{state.won ? "🎉" : "💳"}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'",
              color: state.won ? "#22c55e" : "#ef4444", marginBottom: 12 }}>
              {state.won ? "GOAL ACHIEVED!" : "DEBT TRAP — GAME OVER"}</div>
            <div className="flex items-center justify-center gap-1.5">
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%",
                  background: state.won ? "#22c55e" : "#ef4444",
                  animation: `pulse 1s ease-in-out ${i*0.2}s infinite` }} />
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 12 }}>Building your report card...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ gameState, goal, onRestart, onNewGoal }) {
  const s = gameState.stats;
  const goalProg = clamp((gameState.cash / goal.amount) * 100, 0, 100);
  const skipRate = s.totalInvites > 0 ? Math.round((s.skips / s.totalInvites) * 100) : 0;
  const savRate = s.totalEarned > 0 ? Math.round(((s.totalEarned - s.totalSpent) / s.totalEarned) * 100) : 0;
  const hRatio = s.borrowCount > 0 ? (s.hustleCount / s.borrowCount).toFixed(1) : s.hustleCount > 0 ? "∞" : "—";
  const sg = { ...s, social: gameState.social, goalProgress: goalProg };

  const concepts = [
    { icon: "📊", title: "Overborrowing", grade: getGrade(1, sg),
      details: [`Borrowed: ${s.borrowCount}/3`, `Interest: $${gameState.totalInterest}`],
      lesson: s.borrowCount === 0 ? "Zero debt — masterful!" : s.borrowCount <= 1 ? "Minimal borrowing." : "Debt spiraled." },
    { icon: "⏱️", title: "Delayed Gratification", grade: getGrade(2, sg),
      details: [`Joined: ${s.joins} | Skipped: ${s.skips} (${skipRate}%)`, `${gameState.day} days`],
      lesson: skipRate >= 50 ? "Great discipline!" : skipRate >= 25 ? "Could skip more." : "Saying yes too much." },
    { icon: "💰", title: "Opportunity Cost", grade: getGrade(3, sg),
      details: [`Earned: $${s.totalEarned} | Spent: $${s.totalSpent}`, `Savings: ${savRate}%`],
      lesson: savRate >= 30 ? "Great saving!" : savRate >= 0 ? "Spent almost everything." : "Overspent." },
    { icon: "💪", title: "Earning vs Borrowing", grade: getGrade(4, sg),
      details: [`Hustled: ${s.hustleCount} | Borrowed: ${s.borrowCount}`, `Ratio: ${hRatio}`],
      lesson: s.hustleCount > s.borrowCount ? "Earned more than borrowed!" : "Need more hustling." },
    { icon: "👥", title: "Social vs Financial", grade: getGrade(5, sg),
      details: [`Social: ${gameState.social}`, `Goal: ${Math.round(goalProg)}%`],
      lesson: gameState.social >= 40 && goalProg >= 100 ? "Perfect balance!" : gameState.social >= 40 ? "Popular but broke." : "Focused but lonely." },
  ];

  const gn = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const avg = concepts.reduce((s, c) => s + gn[c.grade], 0) / concepts.length;
  const overall = avg >= 3.5 ? "A" : avg >= 2.5 ? "B" : avg >= 1.5 ? "C" : avg >= 0.5 ? "D" : "F";

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: "24px 16px", fontFamily: "'DM Sans'" }}>
      <link href={FONTS} rel="stylesheet" /><style>{CSS}</style>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24, animation: "slideUp 0.5s ease" }}>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono'", marginBottom: 12 }}>Financial Report Card</div>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{gameState.won ? "🎉" : "💳"}</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'", margin: 0, color: gameState.won ? "#22c55e" : "#ef4444" }}>
            {gameState.won ? "GOAL ACHIEVED!" : "DEBT TRAP — GAME OVER"}</h1>
          <div className="flex items-center justify-center gap-4" style={{ marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Space Mono'" }}>📅 {gameState.day}d</span>
            <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Space Mono'" }}>💵 ${gameState.cash}</span>
            <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Space Mono'" }}>👥 {gameState.social}</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16,
            padding: "8px 20px", borderRadius: 12, background: `${GRADE_COLORS[overall]}11`, border: `1px solid ${GRADE_COLORS[overall]}33` }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Overall:</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: GRADE_COLORS[overall], fontFamily: "'Sora'" }}>{overall}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {concepts.map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, padding: "14px 16px", animation: `fadeIn 0.4s ease ${0.2+i*0.1}s both` }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{c.title}</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: GRADE_COLORS[c.grade], fontFamily: "'Sora'",
                  background: `${GRADE_COLORS[c.grade]}11`, padding: "2px 10px", borderRadius: 6 }}>{c.grade}</span>
              </div>
              {c.details.map((d, j) => (
                <div key={j} style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Space Mono'", lineHeight: 1.6 }}>→ {d}</div>
              ))}
              <div style={{ fontSize: 12, color: "#7dd3fc", marginTop: 6 }}>💡 {c.lesson}</div>
            </div>
          ))}
        </div>

        {gameState.won && (
          <div style={{ marginTop: 16, padding: "16px", borderRadius: 14, textAlign: "center",
            background: `linear-gradient(145deg, ${goal.gradient[0]}11, ${goal.gradient[1]}08)`,
            border: `1px solid ${RARITY_GLOW[TIER_RARITY[goal.tier]]}33`, animation: "fadeIn 0.5s ease 0.8s both" }}>
            <div style={{ fontSize: 10, color: RARITY_GLOW[TIER_RARITY[goal.tier]], fontFamily: "'Space Mono'",
              letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>★ {TIER_RARITY[goal.tier]} Card Unlocked ★</div>
            <div style={{ fontSize: 36, marginBottom: 4 }}>{goal.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Sora'" }}>{goal.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono'", marginTop: 4 }}>Added to your collection!</div>
          </div>
        )}

        <div className="flex gap-3" style={{ marginTop: 24, paddingBottom: 32 }}>
          <button onClick={onRestart} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, cursor: "pointer",
            background: `linear-gradient(135deg, ${goal.color}22, ${goal.color}11)`,
            border: `1px solid ${goal.color}33`, color: goal.color, fontSize: 13, fontWeight: 700 }}>🔄 Try Again</button>
          <button onClick={onNewGoal} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, cursor: "pointer",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>🎯 New Goal</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  const [goal, setGoal] = useState(null);
  const [endState, setEndState] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  const [collection, setCollection] = useState(SAMPLE_COLLECTIBLES);

  useEffect(() => { loadCollection().then(setCollection); }, []);

  const handleGoalSelect = (g) => { setGoal(g); setScreen("game"); setGameKey(k => k + 1); };

  const handleGameEnd = async (state) => {
    setEndState(state);
    if (state.won) {
      const gradeToNum = { A: 4, B: 3, C: 2, D: 1, F: 0 };
      const sg = { ...state.stats, social: state.social, goalProgress: clamp((state.cash / goal.amount) * 100, 0, 100) };
      const grades = [1,2,3,4,5].map(c => getGrade(c, sg));
      const avg = grades.reduce((s, g) => s + gradeToNum[g], 0) / 5;
      const overall = avg >= 3.5 ? "A" : avg >= 2.5 ? "B" : avg >= 1.5 ? "C" : avg >= 0.5 ? "D" : "F";
      const entry = { goalId: goal.id, days: state.day, cashLeft: state.cash, social: state.social, date: Date.now(), grade: overall };
      const updated = await saveToCollection(entry);
      setCollection(updated);
    }
    setScreen("report");
  };

  if (screen === "home") return <HomeScreen onSelect={handleGoalSelect} collection={collection} />;
  if (screen === "game") return <GameScreen key={gameKey} goal={goal} onEnd={handleGameEnd} />;
  if (screen === "report") return (
    <ReportCard gameState={endState} goal={goal}
      onRestart={() => { setScreen("game"); setGameKey(k => k + 1); }}
      onNewGoal={() => setScreen("home")} />
  );
}
