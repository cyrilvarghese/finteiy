"use client";

import { Callout } from "@/components/callout";
import type { Lesson } from "@/lib/constants";

interface LessonIntroScreenProps {
  lesson: Lesson;
  onStartLesson: () => void;
  onBack: () => void;
}

export function LessonIntroScreen({ lesson, onStartLesson, onBack }: LessonIntroScreenProps) {
  return (
    <div className="min-h-screen px-6 py-10 font-dm-sans">
      <div className="max-w-game mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1"
        >
          ← Back
        </button>
        {/* Lesson Icon & Title */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.08))",
              border: "1.5px solid rgba(56,189,248,0.25)",
              boxShadow: "0 0 20px rgba(56,189,248,0.12)",
            }}
          >
            <span className="text-5xl">{lesson.icon}</span>
          </div>
          <h1 className="text-[28px] font-extrabold font-sora text-text-primary mb-2">
            {lesson.title}
          </h1>
          <p className="text-[14px] text-cyan-400 font-semibold">
            {lesson.subtitle}
          </p>
        </div>

        {/* Explanation */}
        <div
          className="rounded-xl px-5 py-4 mb-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-[15px] text-text-secondary leading-relaxed">
            {lesson.explanation}
          </p>
        </div>

        {/* Example Callout */}
        <div className="mb-8">
          <div className="text-[11px] text-text-muted tracking-[0.1em] uppercase mb-2 font-space-mono px-1">
            Example Lesson
          </div>
          <Callout text={lesson.exampleCallout} duration={999999} />
        </div>

        {/* Start Button */}
        <button
          onClick={onStartLesson}
          className="w-full px-6 py-4 rounded-2xl text-[16px] font-extrabold font-sora cursor-pointer transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.15))",
            border: "1.5px solid rgba(56,189,248,0.35)",
            color: "#38bdf8",
            boxShadow: "0 0 20px rgba(56,189,248,0.15)",
          }}
        >
          Let's Play! 🚀
        </button>

        {/* Footer hint */}
        <p className="text-center text-[11px] text-text-muted mt-4">
          You'll practice this concept through real gameplay scenarios
        </p>
      </div>
    </div>
  );
}
