"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Volume2,
} from "lucide-react";
import type { DualModeCoachFeedback } from "@/lib/ai/gemini-speech-coach";
import type { AcousticTelemetry } from "@/lib/audio/acoustic-dsp";
import { useAccentLab } from "@/components/providers/AccentLabProvider";

interface FeedbackReportCardProps {
  feedback: DualModeCoachFeedback;
  telemetry: AcousticTelemetry;
}

export function FeedbackReportCard({ feedback, telemetry }: FeedbackReportCardProps) {
  const [mode, setMode] = useState<"simple" | "detailed">("simple");
  const { speakReference } = useAccentLab();

  return (
    <div className="rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-4 sm:p-6 text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]">
      {/* Header with Objective Score & Mode Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-[#1B4332]/30 bg-[#E9F2EE] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35">
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#1B4332] dark:text-[#6EE7B7]">
              {feedback.overallAttemptScore}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4A4843] dark:text-[#9E9A90]">
              / 100
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded border border-[#E5E0D5] bg-[#F4F1EA] px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
                <Cpu className="h-3 w-3 shrink-0" />
                Acoustic Signal + Phonetic Coach
              </span>
            </div>
            <h3 className="mt-1 font-serif text-base sm:text-xl font-normal text-[#141413] dark:text-[#F3EFE6]">
              {feedback.simpleModeFeedback.headline}
            </h3>
          </div>
        </div>

        {/* Simple vs Detailed Mode Toggle */}
        <div className="grid grid-cols-2 sm:inline-flex w-full sm:w-auto rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] p-1 dark:border-[#2E2D29] dark:bg-[#181816]">
          <button
            type="button"
            onClick={() => setMode("simple")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              mode === "simple"
                ? "bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#4A4843] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
            }`}
          >
            Simple Coaching
          </button>
          <button
            type="button"
            onClick={() => setMode("detailed")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              mode === "detailed"
                ? "bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#4A4843] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
            }`}
          >
            Detailed Phonetics
          </button>
        </div>
      </div>

      {/* Section 1: Objective Speech Measurements */}
      <div className="mb-6">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1">
          <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#4A4843] dark:text-[#B8B3A8] flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7] shrink-0" />
            Acoustic Signal Measurements
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] text-[#78736A] dark:text-[#9E9A90]">
            Measured from your voice capture
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-5">
          <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-[11px] text-[#78736A] dark:text-[#9E9A90]">American /r/ F3</div>
            <div className="mt-1 font-mono text-base font-bold text-[#1B4332] dark:text-[#6EE7B7]">
              {telemetry.f3EstimatedHz} Hz
            </div>
            <div className="font-mono text-[10px] text-[#78736A] dark:text-[#9E9A90]">Target: &lt;1,950 Hz</div>
          </div>
          <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-[11px] text-[#78736A] dark:text-[#9E9A90]">Stress Rhythm (nPVI)</div>
            <div className="mt-1 font-mono text-base font-bold text-[#141413] dark:text-[#F3EFE6]">
              {telemetry.nPviRhythm}
            </div>
            <div className="font-mono text-[10px] text-[#78736A] dark:text-[#9E9A90]">Target: 55–65</div>
          </div>
          <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-[11px] text-[#78736A] dark:text-[#9E9A90]">Pitch Range (F0)</div>
            <div className="mt-1 font-mono text-base font-bold text-[#1B4332] dark:text-[#6EE7B7]">
              {telemetry.f0MeanHz} Hz ±{telemetry.f0StdSemitones}st
            </div>
            <div className="font-mono text-[10px] text-[#78736A] dark:text-[#9E9A90]">Dynamic contour</div>
          </div>
          <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-[11px] text-[#78736A] dark:text-[#9E9A90]">Speech Rate</div>
            <div className="mt-1 font-mono text-base font-bold text-[#141413] dark:text-[#F3EFE6]">
              {telemetry.speechRateWpm} WPM
            </div>
            <div className="font-mono text-[10px] text-[#78736A] dark:text-[#9E9A90]">
              {telemetry.articulationRateSylPerSec} syl/sec
            </div>
          </div>
          <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-[11px] text-[#78736A] dark:text-[#9E9A90]">Pause Ratio</div>
            <div className="mt-1 font-mono text-base font-bold text-[#B84A27] dark:text-[#F4A261]">
              {Math.round(telemetry.pauseRatio * 100)}%
            </div>
            <div className="font-mono text-[10px] text-[#78736A] dark:text-[#9E9A90]">Target: 12–22%</div>
          </div>
        </div>
      </div>

      {/* Section 2: Grounded Coaching (What Happened -> Why It Matters -> What To Do Next) */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261] mb-1.5">
            1. What Happened
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#141413] dark:text-[#F3EFE6]">
            {feedback.whatHappened}
          </p>
        </div>

        <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4A4843] dark:text-[#B8B3A8] mb-1.5">
            2. Why It Matters
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#141413] dark:text-[#F3EFE6]">
            {feedback.whyItMatters}
          </p>
        </div>

        <div className="rounded-lg border border-[#1B4332]/30 bg-[#E9F2EE] p-4 dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] mb-1.5">
            3. Physical Adjustment &amp; Next Step
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#141413] dark:text-[#F3EFE6]">
            {mode === "simple"
              ? feedback.simpleModeFeedback.mouthAdjustmentTip
              : feedback.whatToDoNext}
          </p>
        </div>
      </div>

      {mode === "simple" ? (
        <div className="rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] p-4 flex flex-wrap items-center justify-between gap-4 dark:border-[#2E2D29] dark:bg-[#181816]">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Immediate Micro-Drill
            </div>
            <p className="mt-1 font-serif text-base font-normal text-[#141413] dark:text-[#F3EFE6]">
              {feedback.simpleModeFeedback.practiceDrillPrompt}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              speakReference(feedback.simpleModeFeedback.practiceDrillPrompt, 0.9)
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-3.5 py-2 text-xs font-semibold text-[#FBF9F5] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38] transition"
          >
            <Volume2 className="h-3.5 w-3.5" />
            Hear Target Drill
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Word-Level Phoneme Breakdown */}
          {feedback.detailedModeFeedback.wordDiagnostics.length > 0 && (
            <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#141413] dark:text-[#F3EFE6] mb-3 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" />
                Word-Level Phonetic &amp; IPA Alignment Diagnostics
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {feedback.detailedModeFeedback.wordDiagnostics.map((w, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${
                      w.status === "accurate"
                        ? "border-[#1B4332]/30 bg-[#E9F2EE] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/25"
                        : w.status === "slight_drift"
                        ? "border-[#E6D0A3] bg-[#FEF8EC] dark:border-[#524426] dark:bg-[#2A2315]"
                        : "border-[#E8C5B8] bg-[#FDF2EE] dark:border-[#572718] dark:bg-[#2B1712]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-normal text-[#141413] dark:text-[#F3EFE6]">
                        {w.word}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakReference(w.word, 0.85)}
                        className="font-mono text-xs text-[#1B4332] dark:text-[#6EE7B7] hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="h-3 w-3" />
                        IPA
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-xs">
                      <span className="text-[#1B4332] dark:text-[#6EE7B7] font-semibold">
                        Target: {w.targetIpa}
                      </span>
                      {w.status !== "accurate" && (
                        <span className="text-[#B84A27] dark:text-[#E07A5F] font-semibold">
                          Heard: {w.observedIpa}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#4A4843] dark:text-[#A8A29E] leading-snug">
                      {w.articulatoryFix}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* L1 Transfer & Prosody Deep Dive */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] mb-1">
                Native Language (L1) Phonetic Transfer Analysis
              </div>
              <p className="text-xs text-[#4A4843] dark:text-[#A8A29E] leading-relaxed">
                {feedback.detailedModeFeedback.l1TransferInsight}
              </p>
            </div>
            <div className="rounded-lg border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B84A27] dark:text-[#E07A5F] mb-1">
                Prosody, Stress &amp; Connected Speech Telemetry
              </div>
              <p className="text-xs text-[#4A4843] dark:text-[#A8A29E] leading-relaxed">
                {feedback.detailedModeFeedback.prosodyAndRhythmAnalysis}
              </p>
            </div>
          </div>

          {/* Concrete Correction Exercises */}
          {feedback.detailedModeFeedback.recommendedDrills.length > 0 && (
            <div className="rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] mb-2.5">
                Recommended Remedial Exercises
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {feedback.detailedModeFeedback.recommendedDrills.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] p-3.5 flex flex-col justify-between dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
                  >
                    <div>
                      <div className="font-serif text-sm font-normal text-[#141413] dark:text-[#F3EFE6]">
                        {d.drillTitle}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#B84A27] dark:text-[#E07A5F] font-semibold">
                        {d.contrastPair}
                      </div>
                      <p className="mt-1.5 text-xs text-[#4A4843] dark:text-[#A8A29E]">
                        “{d.targetSentence}”
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => speakReference(d.targetSentence, 0.92)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] dark:text-[#6EE7B7] hover:underline"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Listen
                      </button>
                      <Link
                        href={`/lessons/${d.lessonId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B84A27] dark:text-[#E07A5F] hover:underline"
                      >
                        Open Targeted Lesson
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
