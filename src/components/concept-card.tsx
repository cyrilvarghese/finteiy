"use client";

import { GradeBadge } from "@/components/grade-badge";
import type { Grade } from "@/lib/constants";

interface ConceptCardProps {
  icon: string;
  title: string;
  grade: Grade;
  details: string[];
  lesson: string;
  index: number;
}

export function ConceptCard({ icon, title, grade, details, lesson, index }: ConceptCardProps) {
  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        animation: `fadeIn 0.4s ease ${0.2 + index * 0.1}s both`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-[13px] font-semibold text-slate-200">
            {title}
          </span>
        </div>
        <GradeBadge grade={grade} size="sm" />
      </div>

      {details.map((d, j) => (
        <div
          key={j}
          className="text-[11px] text-text-secondary font-space-mono leading-relaxed"
        >
          {"\u2192"} {d}
        </div>
      ))}

      <div className="text-xs text-callout mt-1.5">
        {"\u{1F4A1}"} {lesson}
      </div>
    </div>
  );
}
