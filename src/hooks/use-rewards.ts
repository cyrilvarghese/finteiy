"use client";

import { useState, useEffect } from "react";

export interface CustomReward {
  goalId: string;
  reward: string;
}

export function useRewards(childId: string) {
  const storageKey = `finteiy-rewards-${childId}`;
  const [rewards, setRewards] = useState<CustomReward[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setRewards(JSON.parse(stored));
      }
    } catch {
      // Invalid data, reset
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  // Save to localStorage whenever rewards change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(rewards));
  }, [storageKey, rewards]);

  const addReward = (goalId: string, reward: string) => {
    setRewards((prev) => {
      // Remove any existing reward for this goal
      const filtered = prev.filter((r) => r.goalId !== goalId);
      return [...filtered, { goalId, reward }];
    });
  };

  const removeReward = (goalId: string) => {
    setRewards((prev) => prev.filter((r) => r.goalId !== goalId));
  };

  const getReward = (goalId: string): string | null => {
    return rewards.find((r) => r.goalId === goalId)?.reward ?? null;
  };

  return { rewards, addReward, removeReward, getReward };
}
