# Finteiy Prototype — Implementation Guide

**Version:** 2.1 · February 2026
**Source:** Single-file React artifact (`finteiy.jsx`, ~930 lines)
**Purpose:** Hand this doc + the spec doc + the artifact code to your developer so they can componentize it into a production app without needing a walkthrough.

---

## 1. What This App Does

Finteiy is a financial literacy game for teens. Players pick a savings goal, face social invites and spending pressure, and make decisions that affect 4 real-time meters. The game teaches 5 money concepts through consequences — not lectures. Sessions are 60–90 seconds.

**Win:** Cash ≥ goal amount
**Lose:** Borrow 3 times (debt trap)

---

## 2. Screen Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   HOME   │────▶│    GAME     │────▶│  GAME OVER       │────▶│  REPORT CARD │
│          │     │             │     │  (inline, 1.8s)  │     │              │
│ Goals tab│     │ Invite loop │     │  auto-transition │     │ 5 concepts   │
│ Collection│    │ 4 actions   │     │  loading dots    │     │ collectible  │
│ Rep badge│     │ meters      │     │                  │     │ unlock       │
└──────────┘     └─────────────┘     └──────────────────┘     └──────┬───────┘
      ▲                                                              │
      │                    "New Goal"                                │
      └──────────────────────────────────────────────────────────────┘
                           "Try Again" loops back to GAME with same goal
```

**Navigation:** Managed by a single `screen` state (`"home"` | `"game"` | `"report"`). No router. `gameKey` increments to force remount on retry.

---

## 3. Screen-by-Screen Breakdown

### 3.1 Home Screen (`HomeScreen`)

**Layout (top to bottom):**

1. **Header** — "FINTEIY" in spaced uppercase Space Mono, title in Sora 26px, subtitle
2. **Reputation Badge** — shows current rep level with XP progress bar (see §6)
3. **Tab Switcher** — `🎯 Goals` | `🏆 Collection` — pill-style toggle, active tab has `rgba(255,255,255,0.08)` background
4. **Goals Tab** — goals grouped by tier (Starter/Medium/Advanced/Dream), each row shows emoji + name + price + `✓ WON` badge if achieved. Tap → starts game.
5. **Collection Tab** — 2-column grid of collectible trading cards. Tap to flip. Empty state has CTA to switch to Goals.

**State used:** `collection` (array, loaded from persistent storage), `tab` ("goals"/"collection"), `hoveredGoal`

---

### 3.2 Game Screen (`GameScreen`)

**Layout (top to bottom):**

1. **Header bar** — `DAY {n}` left, borrow badge `💳 {n}/3` + goal emoji/price right
2. **Goal progress bar** — colored bar, `{n}%` label, uses goal's accent color
3. **Meters grid** — 2×2 grid:
   - Cash (green `#22C55E`) — `$` prefix, bar shows cash/goalAmount
   - Energy (yellow `#FACC15`) — 3 dot indicators, not a bar
   - Social (blue `#38BDF8`) — 0–100, bar
   - Goal (goal color) — same as cash but framed as progress
4. **Borrow warning banner** — red, only shows when `borrowCount === 2`
5. **Invite card** — type badge (`🎉 Invite` or `🛍️ Buy`), title (Sora 18px), description, cost badge (`-$XX` in red). Below: borrow-trigger warnings if `cash < cost`
6. **Surprise event card** — conditionally rendered after Join/Split. Red-orange gradient bg.
7. **Educational callout** — blue tint bg, `💡` prefix, contextual lesson text
8. **Action buttons** — 2×2 grid. Each has icon, label, cost. Disabled (opacity 0.3) when energy < 1.

**Game over state:** When `gameOver` flips true, buttons and invite card hide. Centered overlay shows emoji + result text + 3 animated bouncing dots + "Building your report card..." text. After 1.8s (via `useEffect`), transitions to Report Card.

**Critical implementation note:** The game-over transition uses a `useEffect` watching `state.gameOver`, NOT a check after `setState`. React batches state updates so checking `stateRef.current` right after `setState` doesn't work. A `pendingEndRef` prevents double-firing.

---

### 3.3 Report Card (`ReportCard`)

**Layout (top to bottom):**

1. **Header** — "Financial Report Card" label, big emoji, win/loss title (green/red), stats row (days, cash, social)
2. **Overall grade** — inline badge with letter grade (A–F), colored background
3. **5 concept cards** — staggered fadeIn animation. Each has:
   - Icon + title + grade badge (right-aligned)
   - Detail stats in Space Mono (`→ Borrowed: 2/3`, etc.)
   - `💡` lesson text in callout blue
4. **Collectible unlock** (win only) — rarity label, big emoji, goal name, "Added to your collection!"
5. **Two buttons** — "🔄 Try Again" (goal color accent) and "🎯 New Goal" (neutral)

---

## 4. Game Mechanics

### 4.1 Starting State

```
cash: 50, energy: 3, social: 50, day: 1
borrowCount: 0, totalInterest: 0, debts: []
```

### 4.2 Four Actions

| Action | Cash | Energy | Social | Teaches |
|--------|------|--------|--------|---------|
| **Join** | −full cost | −1 to −2 | +3 to +5 | Instant gratification, opportunity cost |
| **Split** | −half cost (ceil) | −1 | +2 to +3 | Compromise, still costs money |
| **Skip** | $0 | 0 | −2 to −4 | Delayed gratification, social tradeoff |
| **Earn First** | +$8 to $17 | −1 to −2 | −1 | Earning beats borrowing |

Earn First picks a random hustle: Dog Walking ($10, 1 energy), Tutoring ($12, 1 energy), or Lawn Mowing ($15, 2 energy) — then adds rand(-2, +2).

### 4.3 Auto-Borrow System

Triggers when `cash < 0` after any action:
- Borrow amount = `abs(deficit) + $5` buffer
- Interest escalates: **30%** (1st), **40%** (2nd), **50%** (3rd)
- Repayment: over 6 days, deducted at day boundaries
- **3rd borrow = immediate game over**

### 4.4 Day Cycle

- Each day has 2–4 invites (`rand(2,4)`)
- At day boundary: energy refills to 3, debt payments processed
- Debt payments can push cash negative → trigger another borrow
- Day counter increments

### 4.5 Surprise Events

- **Trigger:** 25% chance after Join or Split
- **Effect:** unavoidable cost ($6–$25) deducted from cash
- **Can cascade:** if surprise pushes cash negative → auto-borrow
- 10 event types: streaming charges, parking tickets, phone overage, etc.

### 4.6 Win/Loss Check

- **Win:** `cash >= goal.amount` — checked after every action
- **Loss:** `borrowCount >= 3` — checked inside `doBorrow()`

---

## 5. Grading System

Each of the 5 concepts gets a letter grade (A–F). Overall grade = average (A=4, B=3, C=2, D=1, F=0).

| Concept | A | B | C | D | F |
|---------|---|---|---|---|---|
| 1. Overborrowing | 0 borrows | 1 borrow | — | 2 borrows | 3 borrows |
| 2. Delayed Gratification | skip ≥60% | ≥40% | ≥25% | ≥10% | <10% |
| 3. Opportunity Cost | savings ≥50% | ≥30% | ≥10% | ≥0% | <0% |
| 4. Earning vs Borrowing | ratio ≥3 | ≥2 | ≥1 | ≥0.5 | <0.5 |
| 5. Social vs Financial | goal 100% + social ≥40 | 75%+social | 50% or social | 25%+ | <25% |

Grade colors: A `#22c55e`, B `#86efac`, C `#facc15`, D `#fb923c`, F `#ef4444`

---

## 6. Reputation System

Badge appears on Home Screen. XP is earned from collectibles, weighted by goal tier.

| LVL | XP | Name | Emoji | Tag | Color |
|-----|-----|------|-------|-----|-------|
| 0 | 0 | Broke & Clueless | 🐣 | Just hatched | `#94a3b8` |
| 1 | 1 | Penny Pincher | 🪙 | Baby steps | `#a8a29e` |
| 2 | 2 | Budget Rookie | 📊 | Getting the hang of it | `#22c55e` |
| 3 | 4 | Cash Flow Kid | 💸 | Money moves | `#38bdf8` |
| 4 | 6 | Stack Builder | 🧱 | Brick by brick | `#a78bfa` |
| 5 | 9 | Hustle Boss | 🔥 | Built different | `#fb923c` |
| 6 | 12 | Money Mogul | 👑 | Walking bank account | `#ffd700` |
| 7 | 16 | Finance Demon | 😈 | They can't keep up | `#ef4444` |
| 8 | 20 | Generational Wealth | 💎 | Legacy mode activated | `#e0f2fe` |

**XP per collectible:** Starter = 1, Medium = 2, Advanced = 3, Dream = 5

**Badge UI:** Level icon (52×52 rounded square with gradient bg), glowing name text (`repGlow` animation), tagline, XP progress bar, "Next level" teaser with XP remaining.

---

## 7. Collectible Cards

### 7.1 Card Shape (stored in persistent storage)

```js
{
  goalId: "sneakers",   // links to GOALS array
  days: 8,              // days taken to win
  cashLeft: 162,        // final cash
  social: 44,           // final social score
  date: 1708123456000,  // timestamp
  grade: "B"            // overall grade from that run
}
```

### 7.2 Card Visual (PRESERVE THIS LOOK)

**Front side:**
- Holographic top stripe (3px, animated `holoShift` gradient using goal's 3 gradient colors)
- Corner serial: `#FNT-001` format (Space Mono 8px, semi-transparent)
- Rarity badge top-right (Epic/Rare/Legendary/Mythic, glow color bg)
- Shimmer sweep overlay (115deg gradient, `shimmer` animation 5s)
- Center: emoji in glowing radial-gradient ring (64×64), name (Sora 14px bold), price (Space Mono 11px)
- Grade badge: inline pill with letter grade
- Stats row: Days | Cash | Social, separated by 1px dividers
- Bottom holographic bar (2px)
- Pulsing glow border (`glowPulse` animation using rarity color)

**Back side (on tap/flip):**
- Rarity label centered, emoji, name, tier info
- Run summary text
- "TAP TO FLIP BACK" hint

### 7.3 Rarity Mapping

| Goal Tier | Rarity | Glow Color | XP |
|-----------|--------|------------|-----|
| Starter ($150–200) | Epic | `#00f5ff` cyan | 1 |
| Medium ($300–400) | Rare | `#b866ff` purple | 2 |
| Advanced ($500–800) | Legendary | `#ff6600` orange | 3 |
| Dream ($1000+) | Mythic | `#ffd700` gold | 5 |

### 7.4 Sample Collectibles (pre-loaded for demo)

4 cards ship pre-loaded so the collection tab isn't empty:
- 👟 Sneakers — 8 days, $162 left, social 44, grade B
- 📱 Phone — 12 days, $211 left, social 38, grade A
- 🎮 Console — 10 days, $185 left, social 52, grade B
- 🎵 Concert VIP — 18 days, $312 left, social 41, grade A

---

## 8. Visual Design Spec

### 8.1 Theme

Dark mode only. Background is a 145deg gradient: `#0a0a0f → #0f1019 → #0a0f1a`. All cards use glass-like semi-transparent backgrounds with subtle borders.

### 8.2 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Page BG | `#0A0A0F → #0F1019` | 145deg gradient, all screens |
| Card BG | `rgba(255,255,255,0.03)` | Invite cards, concept cards |
| Card Border | `rgba(255,255,255,0.06)` | Subtle glass edges |
| Text Primary | `#F1F5F9` | Headings, card titles |
| Text Secondary | `#94A3B8` | Labels, descriptions, stats |
| Text Muted | `#64748B` | Hints, sub-labels, subtitles |
| Green | `#22C55E` | Cash meter, win state, Skip button |
| Red | `#EF4444` | Borrow badges, cost, Join button, game over |
| Blue | `#38BDF8` | Social meter, callout bg |
| Yellow | `#FACC15` | Energy dots, Earn button |
| Orange | `#FB923C` | Split button, borrow count 1/3 |
| Callout Blue | `#7DD3FC` | Educational lesson text |

### 8.3 Typography

| Font | Weights | Usage |
|------|---------|-------|
| **Sora** | 600, 800 | Headings, invite titles, game over text, grade letters, rep names |
| **DM Sans** | 400, 500, 700 | Body text, descriptions, button labels, callouts |
| **Space Mono** | 400, 700 | Numbers, stats, prices, meters, serial numbers, data labels |

Google Fonts import: `DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&family=Sora:wght@600;800`

### 8.4 CSS Animations

| Name | Behavior | Used On |
|------|----------|---------|
| `fadeIn` | opacity 0→1, translateY 12→0, often staggered | Cards, callouts, concept rows |
| `slideUp` | opacity 0→1, translateY 30→0 | Game over overlay, report header |
| `pulse` | opacity 1→0.5→1 | Borrow badges, loading dots |
| `shimmer` | bg-position sweep -200%→200% | Collectible card metallic sweep |
| `holoShift` | bg-position 0%→100%→0% | Card top holographic stripe |
| `glowPulse` | box-shadow intensity pulse | Collectible card border glow |
| `badgeShine` | left -100%→200% | Rep badge light sweep |
| `repGlow` | text-shadow pulse | Rep level name text |

### 8.5 Layout Constants

- Max width: **420px** centered (mobile-first)
- Horizontal padding: **16px** (game), **28–32px top** (home)
- Meters grid: **2×2**, gap **12px**
- Action buttons: **2×2**, gap **10px**
- Collection grid: **2 columns**, gap **12px**
- Border radius: **10–16px** cards, **6–12px** badges/buttons
- Button hover: `translateY(-1px)` + `brightness(1.1)`, active: `translateY(0)` + `brightness(0.95)`

---

## 9. Data Libraries (extract to constants/)

| Library | Count | Shape |
|---------|-------|-------|
| `GOALS` | 10 | `{ id, name, emoji, amount, tier, color, gradient[3] }` |
| `INVITES` | 18 | `{ id, type, title, desc, cost, energy, social }` |
| `SURPRISE_EVENTS` | 10 | `{ title, desc, cost }` |
| `HUSTLES` | 3 | `{ name, emoji, basePay, energy }` |
| `CALLOUTS` | 8 | Keyed strings: `spend_tradeoff`, `borrow_interest`, etc. |
| `REP_LEVELS` | 9 | `{ min, name, emoji, color, tag, tier }` |
| `TIER_RARITY` | 4 | Map: Starter→Epic, Medium→Rare, Advanced→Legendary, Dream→Mythic |
| `RARITY_GLOW` | 4 | Map: Epic→`#00f5ff`, Rare→`#b866ff`, etc. |
| `GRADE_COLORS` | 5 | Map: A→`#22c55e`, B→`#86efac`, C→`#facc15`, D→`#fb923c`, F→`#ef4444` |

---

## 10. Suggested Component Breakdown

| Component | Responsibility |
|-----------|---------------|
| `App` | Screen state, collection persistence, goal selection |
| `HomeScreen` | Tab switcher, goal list, collection grid |
| `RepBadge` | Rep level calc, XP bar, next level teaser |
| `GoalCard` | Single goal row, hover state, achieved badge |
| `CollectibleCard` | Trading card with flip, holo effects, rarity, stats |
| `GameScreen` | Core loop, state management, invite generation |
| `MeterBar` | Reusable progress bar (label, value, max, color) |
| `EnergyDots` | 3-dot energy indicator |
| `InviteCard` | Current invite with borrow-trigger warnings |
| `ActionButtons` | 2×2 grid, disabled states, dynamic cost labels |
| `SurpriseEvent` | Surprise cost notification |
| `Callout` | Educational tip card |
| `GameOverOverlay` | Transition screen with loading dots |
| `ReportCard` | End screen with 5 concept cards |
| `ConceptCard` | Single graded concept row |
| `useGameEngine` | Custom hook: all game logic (actions, borrow, day cycle, surprises) |
| `useCollection` | Custom hook: load/save collectibles from storage |

---

## 11. Persistent Storage

**Prototype uses:** `window.storage` API (Anthropic artifact storage)
**Production replacement:** AsyncStorage (React Native), localStorage, or backend API

```
Key: "finteiy-collection-v2"
Value: JSON array of collectible objects
```

**Fallback:** If no stored data exists, `SAMPLE_COLLECTIBLES` (4 items) are returned so the collection tab is never empty on first load.

---

## 12. Known Issues / Production Notes

1. **No collectible dedup** — winning same goal twice creates duplicate cards. Consider tracking unique vs repeat.
2. **Simple invite randomization** — uses `pick(array)`. Production should weight by social score, avoid repeats within session.
3. **Random day length** — `rand(2,4)` invites per day. Consider making deterministic.
4. **No sound/haptics** — add for mobile.
5. **No onboarding** — a quick tutorial or first-run tutorial would help new players.
6. **Goal 10 of 12** — spec has 12 goals, prototype has 10. Missing: Apartment ($1500) and Start Business ($1200).
7. **Surprise event options** — spec has "Pay Now" vs "Borrow" choice. Prototype auto-deducts. Consider adding the choice.
8. **Session timing** — no timer shown. Spec targets 60–90s. Consider adding a visible timer.
9. **Collectible storage grows unbounded** — no pruning. Consider capping or pagination.
10. **All inline styles** — extract to a theme/design-tokens file and/or Tailwind config for production.
