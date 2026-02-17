"use client";

import { clamp } from "@/lib/constants";

interface MeterBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
  prefix?: string;
  hideLabel?: boolean;
}

export function MeterBar({ label, value, max, color, icon, prefix, hideLabel = false }: MeterBarProps) {
  const pct = clamp((value / max) * 100, 0, 100);
  const displayValue = prefix ? `${prefix}${value}` : value;

  return (
    <div className="flex flex-col gap-1">
      {!hideLabel && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-text-secondary tracking-[0.05em] font-dm-sans">
            {icon} {label}
          </span>
          <span
            className="text-[13px] font-bold font-space-mono"
            style={{ color }}
          >
            {displayValue}
          </span>
        </div>
      )}
      {hideLabel && (
        <div className="flex items-center justify-end">
          <span
            className="text-[13px] font-bold font-space-mono"
            style={{ color }}
          >
            {displayValue}
          </span>
        </div>
      )}
      <div className="h-1.5 rounded-[3px] bg-white/[0.06]">
        <div
          className="h-full rounded-[3px] transition-[width] duration-600 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            width: `${pct}%`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}
