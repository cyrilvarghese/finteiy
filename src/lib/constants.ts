// ─── TYPES ──────────────────────────────────────────────────────────────────

export type GoalTier = "Starter" | "Medium" | "Advanced" | "Dream";
export type Rarity = "Epic" | "Rare" | "Legendary" | "Mythic";
export type Grade = "A" | "B" | "C" | "D" | "F";
export type ActionType = "join" | "split" | "skip" | "earn";
export type ConceptNumber = 1 | 2 | 3 | 4 | 5;

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  amount: number;
  tier: GoalTier;
  color: string;
  gradient: [string, string, string];
}

export interface RepLevel {
  min: number;
  name: string;
  emoji: string;
  color: string;
  tag: string;
  tier: number;
}

export interface Collectible {
  goalId: string;
  days: number;
  cashLeft: number;
  social: number;
  date: number;
  grade: Grade;
}

export interface Invite {
  id: string;
  type: "hangout" | "buy";
  title: string;
  desc: string;
  cost: number;
  energy: number;
  social: number;
}

export interface SurpriseEventData {
  title: string;
  desc: string;
  cost: number;
}

export interface Hustle {
  name: string;
  emoji: string;
  basePay: number;
  energy: number;
}

export interface Debt {
  amount: number;
  rate: number;
  remaining: number;
}

export interface GameStats {
  joins: number;
  splits: number;
  skips: number;
  hustleCount: number;
  borrowCount: number;
  totalEarned: number;
  totalSpent: number;
  totalInvites: number;
}

export interface GradeStats extends GameStats {
  social: number;
  goalProgress: number;
}

export interface GameState {
  cash: number;
  energy: number;
  social: number;
  day: number;
  borrowCount: number;
  totalInterest: number;
  debts: Debt[];
  stats: GameStats;
  currentInvite: Invite | null;
  invitesThisDay: number;
  callout: string | null;
  surprise: SurpriseEventData | null;
  gameOver: boolean;
  won: boolean;
  animatingAction: ActionType | null;
  showBorrowWarning: boolean;
}

// ─── GRADE COLORS ───────────────────────────────────────────────────────────

export const GRADE_COLORS: Record<Grade, string> = {
  A: "#22c55e",
  B: "#86efac",
  C: "#facc15",
  D: "#fb923c",
  F: "#ef4444",
};

// ─── RARITY ─────────────────────────────────────────────────────────────────

export const TIER_RARITY: Record<GoalTier, Rarity> = {
  Starter: "Epic",
  Medium: "Rare",
  Advanced: "Legendary",
  Dream: "Mythic",
};

export const RARITY_GLOW: Record<Rarity, string> = {
  Epic: "#00f5ff",
  Rare: "#b866ff",
  Legendary: "#ff6600",
  Mythic: "#ffd700",
};

// ─── GOALS ──────────────────────────────────────────────────────────────────

export const GOALS: Goal[] = [
  { id: "sneakers", name: "Limited Sneakers", emoji: "\u{1F45F}", amount: 150, tier: "Starter", color: "#00ff88", gradient: ["#00ff88", "#00cc66", "#009944"] },
  { id: "console", name: "Gaming Console", emoji: "\u{1F3AE}", amount: 180, tier: "Starter", color: "#b866ff", gradient: ["#b866ff", "#8844ff", "#6622ff"] },
  { id: "phone", name: "Phone Upgrade", emoji: "\u{1F4F1}", amount: 200, tier: "Starter", color: "#00f5ff", gradient: ["#00f5ff", "#0099ff", "#6666ff"] },
  { id: "concert", name: "Concert VIP", emoji: "\u{1F3B5}", amount: 300, tier: "Medium", color: "#ff6b9d", gradient: ["#ff6b9d", "#ff1493", "#9d1466"] },
  { id: "skateboard", name: "Electric Skateboard", emoji: "\u26A1", amount: 350, tier: "Medium", color: "#ffd700", gradient: ["#ffd700", "#ffaa00", "#ff8800"] },
  { id: "laptop", name: "Laptop", emoji: "\u{1F4BB}", amount: 400, tier: "Medium", color: "#4da6ff", gradient: ["#4da6ff", "#1a8cff", "#0066cc"] },
  { id: "camera", name: "Pro Camera", emoji: "\u{1F4F8}", amount: 500, tier: "Advanced", color: "#00d4aa", gradient: ["#00d4aa", "#00aa88", "#008866"] },
  { id: "trip", name: "Spring Break Trip", emoji: "\u2708\uFE0F", amount: 600, tier: "Advanced", color: "#ff6600", gradient: ["#ff6600", "#ff4400", "#cc2200"] },
  { id: "car", name: "Car Down Payment", emoji: "\u{1F697}", amount: 800, tier: "Advanced", color: "#ff4466", gradient: ["#ff4466", "#dd2244", "#bb0022"] },
  { id: "college", name: "College Savings", emoji: "\u{1F393}", amount: 1000, tier: "Dream", color: "#ffd700", gradient: ["#ffd700", "#ffaa00", "#ff6600"] },
];

// ─── REPUTATION LEVELS ──────────────────────────────────────────────────────

export const REP_LEVELS: RepLevel[] = [
  { min: 0, name: "Broke & Clueless", emoji: "\u{1F423}", color: "#94a3b8", tag: "Just hatched", tier: 0 },
  { min: 1, name: "Penny Pincher", emoji: "\u{1FA99}", color: "#a8a29e", tag: "Baby steps", tier: 1 },
  { min: 2, name: "Budget Rookie", emoji: "\u{1F4CA}", color: "#22c55e", tag: "Getting the hang of it", tier: 2 },
  { min: 4, name: "Cash Flow Kid", emoji: "\u{1F4B8}", color: "#38bdf8", tag: "Money moves", tier: 3 },
  { min: 6, name: "Stack Builder", emoji: "\u{1F9F1}", color: "#a78bfa", tag: "Brick by brick", tier: 4 },
  { min: 9, name: "Hustle Boss", emoji: "\u{1F525}", color: "#fb923c", tag: "Built different", tier: 5 },
  { min: 12, name: "Money Mogul", emoji: "\u{1F451}", color: "#ffd700", tag: "Walking bank account", tier: 6 },
  { min: 16, name: "Finance Demon", emoji: "\u{1F608}", color: "#ef4444", tag: "They can't keep up", tier: 7 },
  { min: 20, name: "Generational Wealth", emoji: "\u{1F48E}", color: "#e0f2fe", tag: "Legacy mode activated", tier: 8 },
];

// ─── SAMPLE COLLECTIBLES ────────────────────────────────────────────────────

export const SAMPLE_COLLECTIBLES: Collectible[] = [
  { goalId: "sneakers", days: 8, cashLeft: 162, social: 44, date: Date.now() - 86400000 * 5, grade: "B" },
  { goalId: "phone", days: 12, cashLeft: 211, social: 38, date: Date.now() - 86400000 * 3, grade: "A" },
  { goalId: "console", days: 10, cashLeft: 185, social: 52, date: Date.now() - 86400000 * 2, grade: "B" },
  { goalId: "concert", days: 18, cashLeft: 312, social: 41, date: Date.now() - 86400000 * 1, grade: "A" },
];

// ─── INVITES ────────────────────────────────────────────────────────────────

export const INVITES: Invite[] = [
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

// ─── SURPRISE EVENTS ────────────────────────────────────────────────────────

export const SURPRISE_EVENTS: SurpriseEventData[] = [
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

// ─── HUSTLES ────────────────────────────────────────────────────────────────

export const HUSTLES: Hustle[] = [
  { name: "Dog Walking", emoji: "\u{1F415}", basePay: 10, energy: 1 },
  { name: "Tutoring", emoji: "\u{1F4DA}", basePay: 12, energy: 1 },
  { name: "Lawn Mowing", emoji: "\u{1F33F}", basePay: 15, energy: 2 },
];

// ─── EDUCATIONAL CALLOUTS ───────────────────────────────────────────────────

export const CALLOUTS: Record<string, string> = {
  spend_tradeoff: "Spending slows your goal unless it's planned.",
  borrow_interest: "Borrowing helps now, but you repay more later. That's interest.",
  debt_stacking: "Borrowing again squeezes your future cash even more.",
  skip_protected: "Skipping saves cash now, but can hurt social later.",
  earn_boosted: "Hustling builds your goal faster than spending slows it.",
  social_tradeoff: "Being included has a cost. Pick which hangs are worth it.",
  surprise_hit: "Unexpected costs are part of life. Keep a cash buffer.",
};

// ─── TIER DISPLAY CONSTANTS ─────────────────────────────────────────────────

export const TIERS: GoalTier[] = ["Starter", "Medium", "Advanced", "Dream"];

export const TIER_LABELS: Record<GoalTier, string> = {
  Starter: "$150\u2013200",
  Medium: "$300\u2013400",
  Advanced: "$500\u2013800",
  Dream: "$1000+",
};

export const TIER_DIFFICULTY: Record<GoalTier, string> = {
  Starter: "Chill",
  Medium: "Moderate",
  Advanced: "Hard",
  Dream: "Legendary",
};

export const TIER_DIFFICULTY_COLOR: Record<GoalTier, string> = {
  Starter: "#22c55e",
  Medium: "#facc15",
  Advanced: "#fb923c",
  Dream: "#ef4444",
};

export const GRADE_TO_NUM: Record<Grade, number> = {
  A: 4, B: 3, C: 2, D: 1, F: 0,
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getGrade(concept: ConceptNumber, stats: GradeStats): Grade {
  switch (concept) {
    case 1:
      return stats.borrowCount === 0 ? "A"
        : stats.borrowCount === 1 ? "B"
        : stats.borrowCount === 2 ? "D" : "F";
    case 2: {
      const r = stats.totalInvites > 0 ? stats.skips / stats.totalInvites : 0;
      return r >= 0.6 ? "A" : r >= 0.4 ? "B" : r >= 0.25 ? "C" : r >= 0.1 ? "D" : "F";
    }
    case 3: {
      const r = stats.totalEarned > 0
        ? (stats.totalEarned - stats.totalSpent) / stats.totalEarned : 0;
      return r >= 0.5 ? "A" : r >= 0.3 ? "B" : r >= 0.1 ? "C" : r >= 0 ? "D" : "F";
    }
    case 4: {
      const r = stats.borrowCount > 0
        ? stats.hustleCount / stats.borrowCount
        : stats.hustleCount > 0 ? 10 : 5;
      return r >= 3 ? "A" : r >= 2 ? "B" : r >= 1 ? "C" : r >= 0.5 ? "D" : "F";
    }
    case 5: {
      const p = stats.goalProgress;
      const ok = stats.social >= 40;
      if (p >= 100 && ok) return "A";
      if (p >= 75 && ok) return "B";
      if (p >= 50 || ok) return "C";
      return p >= 25 ? "D" : "F";
    }
    default: return "C";
  }
}

export function getRepLevel(collection: Collectible[]) {
  const tierPoints: Record<GoalTier, number> = { Starter: 1, Medium: 2, Advanced: 3, Dream: 5 };
  const totalPoints = collection.reduce((sum, item) => {
    const goal = GOALS.find(g => g.id === item.goalId);
    return sum + (goal ? tierPoints[goal.tier] : 1);
  }, 0);
  let level = REP_LEVELS[0];
  for (const l of REP_LEVELS) {
    if (totalPoints >= l.min) level = l;
  }
  return {
    ...level,
    points: totalPoints,
    nextLevel: REP_LEVELS[Math.min(level.tier + 1, REP_LEVELS.length - 1)],
  };
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
