"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  Mic,
  Sparkles,
  Target,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";

export default function LessonsIndexPage() {
  const { state } = useAccentLab();
  const lessons = state?.lessons || [];
  const skills = state?.skillMeasurements || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D5] bg-[#F4F1EA] px-3.5 py-1 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
          <Sparkles className="h-3.5 w-3.5 text-[#B84A27] dark:text-[#F4A261]" />
          Clinical 8-Step Articulatory Curriculum
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#141413] dark:text-[#F3EFE6]">
          Personalized Pronunciation, Prosody &amp; Connected Speech Lessons
        </h1>
        <p className="mt-1 text-sm text-[#78756E] dark:text-[#8A857A]">
          Every lesson follows the 8-stage clinical progression:{" "}
          <strong className="text-[#1B4332] dark:text-[#6EE7B7]">
            Learn → Listen → Repeat → Words → Sentences → Shadowing → Free Speech → Feedback
          </strong>
          .
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {lessons.map((lesson, idx) => {
          const skillMetric = skills.find((s) => s.skillId === lesson.skillId);
          return (
            <div
              key={lesson.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 hover:border-[#1B4332]/50 dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:hover:border-[#6EE7B7]/50 transition"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="rounded-lg bg-[#E9F2EE] border border-[#1B4332]/30 px-2.5 py-1 text-xs font-bold text-[#1B4332] dark:bg-[rgba(38,92,69,0.35)] dark:border-[#6EE7B7]/30 dark:text-[#6EE7B7]">
                    Module #{idx + 1} • {lesson.difficulty}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-[#78756E] dark:text-[#8A857A]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#78756E] dark:text-[#8A857A]" />
                      {lesson.estimatedMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-[#78756E] dark:text-[#8A857A]" />
                      {lesson.exercises.length} Interactive Steps
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">{lesson.title}</h2>
                <p className="mt-1 text-xs sm:text-sm text-[#4A4842] dark:text-[#B8B3A8]">{lesson.subtitle}</p>

                <div className="mt-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3.5 dark:border-[#2E2D29] dark:bg-[#161614]">
                  <div className="text-xs font-semibold text-[#1B4332] dark:text-[#6EE7B7] mb-1">
                    Articulatory &amp; Acoustic Focus:
                  </div>
                  <p className="text-xs text-[#78756E] dark:text-[#8A857A] leading-relaxed">
                    {lesson.learnContent.acousticMarker}
                  </p>
                </div>

                {skillMetric && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3.5 py-2.5 text-xs dark:border-[#2E2D29] dark:bg-[#161614]">
                    <div>
                      <span className="text-[#78756E] dark:text-[#8A857A]">Your Skill Score: </span>
                      <strong className="text-[#141413] dark:text-[#F3EFE6]">{skillMetric.score}/100</strong>
                      <span className="ml-2 text-[#1B4332] dark:text-[#6EE7B7] font-semibold">
                        (+{skillMetric.score - skillMetric.baselineScore} vs Baseline)
                      </span>
                    </div>
                    <span className="font-mono text-[#B84A27] dark:text-[#F4A261] font-semibold">
                      Priority: {skillMetric.priorityScore}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-5 py-3 text-sm font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
                >
                  <Mic className="h-4 w-4" />
                  Launch 8-Step Interactive Lesson
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
