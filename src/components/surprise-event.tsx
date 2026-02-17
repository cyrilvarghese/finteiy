"use client";

import type { SurpriseEventData } from "@/lib/constants";

interface SurpriseEventProps {
  event: SurpriseEventData;
}

export function SurpriseEvent({ event }: SurpriseEventProps) {
  return (
    <div
      className="rounded-xl px-4 py-3 animate-fade-in"
      style={{
        background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(251,146,60,0.06))",
        border: "1px solid rgba(239,68,68,0.15)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{"\u{1F4A5}"}</span>
        <span className="text-[13px] font-bold text-red-300 font-sora">
          {event.title}
        </span>
      </div>
      <p className="text-xs text-text-secondary m-0">
        {event.desc}{" "}
        <span className="text-danger font-bold font-space-mono">
          -${event.cost}
        </span>
      </p>
    </div>
  );
}
