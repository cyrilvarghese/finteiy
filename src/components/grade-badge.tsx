"use client";

import { GRADE_COLORS, type Grade } from "@/lib/constants";

interface GradeBadgeProps {
  grade: Grade;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const color = GRADE_COLORS[grade];

  const sizes = {
    sm: { text: "text-xs", padding: "px-2 py-0.5", font: "text-[10px]" },
    md: { text: "text-base", padding: "px-2.5 py-0.5", font: "text-sm" },
    lg: { text: "text-2xl", padding: "px-5 py-2", font: "text-xs" },
  };

  const s = sizes[size];

  return (
    <span
      className={`inline-flex items-center gap-1 ${s.padding} rounded-md font-sora font-extrabold`}
      style={{
        color,
        background: `${color}11`,
        border: `1px solid ${color}33`,
      }}
    >
      {size !== "sm" && (
        <span className={`${s.font} font-space-mono font-normal text-text-secondary`}>
          Grade
        </span>
      )}
      <span className={s.text}>{grade}</span>
    </span>
  );
}
