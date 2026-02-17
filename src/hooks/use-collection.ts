"use client";

import { useState, useEffect, useCallback } from "react";
import { SAMPLE_COLLECTIBLES, type Collectible } from "@/lib/constants";

const STORAGE_KEY_PREFIX = "finteiy-collection-v2";

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}-${userId}`;
}

export function useCollection(userId: string, defaultCollection: Collectible[] = []) {
  const storageKey = getStorageKey(userId);
  const [collection, setCollection] = useState<Collectible[]>(defaultCollection);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Collectible[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollection(parsed);
          return;
        }
      }
    } catch {
      // fall through to default
    }
    setCollection(defaultCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const addToCollection = useCallback(
    (entry: Collectible) => {
      setCollection((prev) => {
        const updated = [...prev, entry];
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // silently fail
        }
        return updated;
      });
    },
    [storageKey],
  );

  return { collection, addToCollection };
}
