"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  type Goal,
  type GameState,
  type ActionType,
  type Invite,
  type Debt,
  type SurpriseEventData,
  INVITES,
  SURPRISE_EVENTS,
  HUSTLES,
  CALLOUTS,
  rand,
  pick,
  clamp,
} from "@/lib/constants";

function createInitialState(): GameState {
  return {
    cash: 50,
    energy: 3,
    social: 50,
    day: 1,
    borrowCount: 0,
    totalInterest: 0,
    debts: [],
    stats: {
      joins: 0,
      splits: 0,
      skips: 0,
      hustleCount: 0,
      borrowCount: 0,
      totalEarned: 50,
      totalSpent: 0,
      totalInvites: 0,
    },
    currentInvite: null,
    invitesThisDay: 0,
    callout: null,
    surprise: null,
    gameOver: false,
    won: false,
    animatingAction: null,
    showBorrowWarning: false,
  };
}

function processDebt(
  cash: number,
  debts: Debt[]
): { cash: number; debts: Debt[]; interestPaid: number } {
  let c = cash;
  let paid = 0;
  const updated = debts
    .map(d => {
      if (d.remaining > 0) {
        const p = Math.ceil(d.amount / 6);
        const i = Math.ceil(p * d.rate);
        c -= p + i;
        paid += i;
        return { ...d, remaining: d.remaining - 1 };
      }
      return d;
    })
    .filter(d => d.remaining > 0);
  return { cash: c, debts: updated, interestPaid: paid };
}

function doBorrow(
  deficit: number,
  st: GameState
): Partial<GameState> {
  const n = st.borrowCount + 1;
  const rate = [0.3, 0.4, 0.5][Math.min(n - 1, 2)];
  const amt = Math.abs(deficit) + 5;

  if (n >= 3) {
    return {
      cash: st.cash + amt,
      borrowCount: 3,
      debts: [...st.debts, { amount: amt, rate, remaining: 6 }],
      totalInterest: st.totalInterest,
      gameOver: true,
      won: false,
      showBorrowWarning: false,
      callout: "\u{1F4B3} 3rd borrow! Debt spiral consumed everything.",
      stats: { ...st.stats, borrowCount: n },
    };
  }

  return {
    cash: st.cash + amt,
    borrowCount: n,
    debts: [...st.debts, { amount: amt, rate, remaining: 6 }],
    totalInterest: st.totalInterest,
    showBorrowWarning: n === 2,
    callout: n === 1 ? CALLOUTS.borrow_interest : CALLOUTS.debt_stacking,
    stats: { ...st.stats, borrowCount: n },
  };
}

export function useGameEngine(
  goal: Goal,
  onEnd: (state: GameState) => void
) {
  const [state, setState] = useState<GameState>(createInitialState);
  const pendingEndRef = useRef(false);

  // Game-over transition: 1.8s delay before calling onEnd
  useEffect(() => {
    if (state.gameOver && !pendingEndRef.current) {
      pendingEndRef.current = true;
      const t = setTimeout(() => onEnd(state), 1800);
      return () => clearTimeout(t);
    }
  }, [state.gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateInvite = useCallback(() => {
    setState(prev => {
      if (prev.gameOver) return prev;
      if (prev.cash >= goal.amount) {
        return { ...prev, gameOver: true, won: true, currentInvite: null };
      }
      const inv = pick(INVITES);
      return {
        ...prev,
        currentInvite: { ...inv, cost: inv.cost + rand(-2, 4) },
        invitesThisDay: prev.invitesThisDay + 1,
        callout: null,
        surprise: null,
        animatingAction: null,
        stats: { ...prev.stats, totalInvites: prev.stats.totalInvites + 1 },
      };
    });
  }, [goal.amount]);

  // Generate first invite on mount
  useEffect(() => {
    generateInvite();
  }, [generateInvite]);

  const handleAction = useCallback(
    (action: ActionType) => {
      if (state.gameOver || state.animatingAction) return;
      if (!state.currentInvite) return;

      setState(p => ({ ...p, animatingAction: action }));

      setTimeout(() => {
        setState(prev => {
          if (prev.gameOver) return prev;
          const inv = prev.currentInvite;
          if (!inv) return prev;

          const n: GameState = { ...prev, animatingAction: null };
          let dc = 0;
          let de = 0;
          let ds = 0;
          let co = "";

          switch (action) {
            case "join":
              dc = -inv.cost;
              de = -(inv.energy || rand(1, 2));
              ds = rand(3, 5);
              co = CALLOUTS.spend_tradeoff;
              n.stats = {
                ...n.stats,
                joins: n.stats.joins + 1,
                totalSpent: n.stats.totalSpent + inv.cost,
              };
              break;
            case "split": {
              const h = Math.ceil(inv.cost / 2);
              dc = -h;
              de = -1;
              ds = rand(2, 3);
              co = CALLOUTS.social_tradeoff;
              n.stats = {
                ...n.stats,
                splits: n.stats.splits + 1,
                totalSpent: n.stats.totalSpent + h,
              };
              break;
            }
            case "skip":
              ds = -rand(2, 4);
              co = CALLOUTS.skip_protected;
              n.stats = { ...n.stats, skips: n.stats.skips + 1 };
              break;
            case "earn": {
              const hustle = pick(HUSTLES);
              const pay = hustle.basePay + rand(-2, 2);
              dc = pay;
              de = -hustle.energy;
              ds = -1;
              co = `${hustle.emoji} ${hustle.name}: +$${pay}! ${CALLOUTS.earn_boosted}`;
              n.stats = {
                ...n.stats,
                hustleCount: n.stats.hustleCount + 1,
                totalEarned: n.stats.totalEarned + pay,
              };
              break;
            }
          }

          n.cash = prev.cash + dc;
          n.energy = clamp(prev.energy + de, 0, 3);
          n.social = clamp(prev.social + ds, 0, 100);
          n.callout = co;

          // Auto-borrow if cash < 0
          if (n.cash < 0) {
            Object.assign(n, doBorrow(n.cash, n));
          }

          // 25% surprise event after join/split
          if (
            (action === "join" || action === "split") &&
            Math.random() < 0.25 &&
            !n.gameOver
          ) {
            const s: SurpriseEventData = pick(SURPRISE_EVENTS);
            n.surprise = s;
            n.cash -= s.cost;
            n.stats = {
              ...n.stats,
              totalSpent: n.stats.totalSpent + s.cost,
            };
            n.callout = CALLOUTS.surprise_hit;
            if (n.cash < 0) {
              Object.assign(n, doBorrow(n.cash, n));
            }
          }

          // Win check
          if (n.cash >= goal.amount && !n.gameOver) {
            n.gameOver = true;
            n.won = true;
          }

          // Day boundary check
          if (!n.gameOver) {
            const max = rand(2, 4);
            if (n.invitesThisDay >= max) {
              const d = processDebt(n.cash, n.debts);
              n.cash = d.cash;
              n.debts = d.debts;
              n.totalInterest += d.interestPaid;
              if (n.cash < 0) {
                Object.assign(n, doBorrow(n.cash, n));
              }
              n.day += 1;
              n.energy = 3;
              n.invitesThisDay = 0;
            }
          }

          // Schedule next invite
          if (!n.gameOver) {
            setTimeout(() => generateInvite(), 3500);
          }

          return n;
        });
      }, 400);
    },
    [state.gameOver, state.animatingAction, state.currentInvite, goal.amount, generateInvite]
  );

  return { state, handleAction };
}
