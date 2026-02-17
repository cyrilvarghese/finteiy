# Finteiy Spec Part 2 — Additional Changes

Changes and additions beyond [Finteiy Demo_MVP Spec v2.md](Finteiy%20Demo_MVP%20Spec%20v2.md).

---

## 1. Welcome / Persona Selector Screen

**Added:** A new entry screen before the Home screen.

### Flow
```
Welcome Screen → (Teen) → Home Screen → Game → Report Card
Welcome Screen → (Parent) → [TBD — parent flow not yet implemented]
```

### Design
- Two persona cards stacked vertically:
  - **"I'm a Parent"** — gold-tinted glass card (rgba(255,215,0,...))
  - **"I'm a Teen"** — cyan-tinted glass card (rgba(0,245,255,...))
- Each card has an icon, title, and subtitle
- App logo + tagline at top: "Teach teens about money before money teaches them."
- Placeholder "Sign In" link at bottom (not functional yet)

### Behavior
- Selecting **Teen** → Login Screen → routes based on user type
- Selecting **Parent** → Login Screen → Parent Dashboard (placeholder)
- **"Sign In"** link → Login Screen (no role filter, routes by matched user's role)

### Rationale
The app serves two personas. Teens play the game directly; parents will have a dashboard/tracking view (details TBD).

---

## 2. Callout Display Time & Progress Bar

**Changed:** Callout component now stays visible longer and shows a visual countdown.

### Before
- Callout appeared for ~1 second before the next invite loaded
- No visual indicator of remaining time

### After
- Callout displays for **3.5 seconds** (configurable via `duration` prop)
- A thin progress bar drains left-to-right over the duration
- Uses CSS `calloutDrain` keyframe animation (width: 100% → 0%)
- Gradient bar: `rgba(56,189,248,0.4)` → `rgba(56,189,248,0.15)`

### Rationale
Users couldn't read the educational callouts in 1 second. The progress bar gives a visual cue that the callout is timed, so users know to read quickly without feeling abrupt.

---

## 3. Login System & Multi-User Flows

**Added:** Hardcoded login screen with 3 users supporting 3 distinct flows.

### Hardcoded Credentials

| Username | Password | Role | User ID | Status | Description |
|----------|----------|------|---------|--------|-------------|
| `parent` | `finteiy2024` | Parent | `parent-1` | N/A | Parent dashboard access |
| `maya` | `save123` | Child | `child-1` | Existing | Has game history (sample collectibles) |
| `jordan` | `goal456` | Child | `child-2` | New | No game data, sees onboarding |

### Updated Screen Flow
```
Welcome Screen
  ├─ "I'm a Parent" → Login Screen → Parent Dashboard (placeholder)
  ├─ "I'm a Teen"  → Login Screen → checks user:
  │     ├─ Existing child (maya) → Home Screen (current game flow)
  │     └─ New child (jordan)    → Onboarding (placeholder) → Home Screen
  └─ "Sign In" link → Login Screen (no role filter) → routes by user.role
```

### Login Screen
- Username + password form
- Color accent matches persona: gold for parent, cyan for teen
- Error message on invalid credentials
- Back button returns to Welcome Screen

### Per-User Data
- Collection data is now keyed per user in localStorage: `finteiy-collection-v2-{userId}`
- Existing child (maya) defaults to `SAMPLE_COLLECTIBLES` on first login
- New child (jordan) starts with an empty collection

### Parent Dashboard (Placeholder)
- Shows "Coming soon" cards for: Teen Progress Tracking, Goal History, Learning Insights
- Sign Out button returns to Welcome Screen

### Onboarding Flow (6 steps)
Multi-step onboarding for new children, triggered after clicking "Start Playing".

**Step 0 — Welcome:** "Welcome, {name}!" with "Start Playing" button. Transitions to step 1.

**Step 1 — Character Selection:** "Choose your character" with two avatar options (boy/girl emoji). Subtly captures gender to personalize goals, invites, and rewards. Selected card gets a colored border + glow (blue for boy, pink for girl). Continue button disabled until selection made.

**Steps 2-6 — TBD:**
2. Introduce goals
3. Introduce meters (cash, energy, social, goal progress)
4. Introduce actions (join, split, skip, earn)
5. Play two sample invites (guided tutorial)
6. Show available goals to start

**Step indicator:** 6-dot progress bar at top of each step (active dot is wider + cyan).

**Data exported:** `OnboardingData { gender: "boy" | "girl" | null }` — passed to `page.tsx` on completion for future personalization.

---
