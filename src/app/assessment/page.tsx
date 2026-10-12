"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Mic,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { AudioRecorderStudio } from "@/components/audio/AudioRecorderStudio";
import { FeedbackReportCard } from "@/components/feedback/FeedbackReportCard";
import type { DualModeCoachFeedback } from "@/lib/ai/gemini-speech-coach";
import type { RecordingRecord } from "@/lib/db/store";

export default function AssessmentPage() {
  const { state, speakReference } = useAccentLab();
  const prompts = state?.baselinePrompts || [];

  const [assessmentMode, setAssessmentMode] = useState<"baseline" | "weekly">("baseline");
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [completedStages, setCompletedStages] = useState<Record<number, boolean>>({});
  const [latestResult, setLatestResult] = useState<{
    recording: RecordingRecord;
    feedback: DualModeCoachFeedback;
  } | null>(null);

  const currentStage = prompts[activeStageIdx];

  if (!currentStage) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center text-[#78756E] dark:text-[#9E9A90]">
        Loading diagnostic assessment items...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header & Baseline vs Weekly Toggle */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D5] bg-[#F4F1EA] px-3.5 py-1 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
            <Sparkles className="h-3.5 w-3.5 text-[#B84A27] dark:text-[#F4A261]" />
            4-Stage Phonetic &amp; Prosodic Diagnostic
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#141413] dark:text-[#F3EFE6]">
            {assessmentMode === "baseline"
              ? "Baseline Spoken-English Assessment"
              : "Weekly Progress Reassessment"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#78756E] dark:text-[#8A857A]">
            Establishes your multidimensional skill scores across 18 General American skills and
            stores reference recordings for Before/After comparison.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E5E0D5] bg-[#F4F1EA] p-1.5 dark:border-[#2E2D29] dark:bg-[#181816]">
          <button
            type="button"
            onClick={() => setAssessmentMode("baseline")}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              assessmentMode === "baseline"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#4A4842] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
            }`}
          >
            Baseline Assessment
          </button>
          <button
            type="button"
            onClick={() => setAssessmentMode("weekly")}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              assessmentMode === "weekly"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#4A4842] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
            }`}
          >
            Weekly Reassessment
          </button>
        </div>
      </div>

      {/* 4-Stage Stepper */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {prompts.map((item, idx) => {
          const isCurrent = idx === activeStageIdx;
          const isDone = completedStages[idx];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveStageIdx(idx);
                setLatestResult(null);
              }}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition ${
                isCurrent
                  ? "border-[#1B4332] bg-[#E9F2EE] dark:border-[#6EE7B7] dark:bg-[rgba(38,92,69,0.35)]"
                  : isDone
                  ? "border-[#1B4332]/40 bg-[#E9F2EE]/50 dark:border-[#265C45] dark:bg-[rgba(38,92,69,0.2)]"
                  : "border-[#E5E0D5] bg-[#FFFFFF] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:hover:border-[#35332E]"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={isCurrent ? "text-[#1B4332] dark:text-[#6EE7B7]" : isDone ? "text-[#1B4332] dark:text-[#6EE7B7]" : "text-[#78756E] dark:text-[#8A857A]"}>
                  STAGE {idx + 1} / 4
                </span>
                {isDone && <CheckCircle2 className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm font-bold text-[#141413] dark:text-[#F3EFE6] line-clamp-1">
                {item.title.replace(/^Part \d+:\s*/, "")}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#78756E] dark:text-[#8A857A]">
                <Clock className="h-3 w-3" />
                ~{item.recommendedSeconds}s recording
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Assessment Stage Card */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#141413] dark:text-[#F3EFE6]">{currentStage.title}</h2>
              <span className="rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] px-2.5 py-1 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
                Tests {currentStage.testedSkills.length} Core Skills
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4842] dark:text-[#B8B3A8] mb-5 leading-relaxed">
              {currentStage.instructions}
            </p>

            {/* Optional Minimal Pair Interactive Cards for Stage 3 */}
            {currentStage.minimalPairs && (
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                {currentStage.minimalPairs.map((pair) => (
                  <div
                    key={pair.pairId}
                    className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                        {pair.wordA} vs. {pair.wordB}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          speakReference(`${pair.wordA}. ${pair.wordB}. ${pair.sentencePrompt}`, 0.88)
                        }
                        className="text-xs text-[#B84A27] hover:text-[#963B1E] dark:text-[#F4A261] dark:hover:text-[#F4A261]/80 inline-flex items-center gap-1 font-semibold"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Audio
                      </button>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-[#78756E] dark:text-[#8A857A]">
                      {pair.ipaA}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-[#78756E] dark:text-[#8A857A]">
                      {pair.ipaB}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <AudioRecorderStudio
              contextType={
                assessmentMode === "baseline"
                  ? "baseline_assessment"
                  : "weekly_assessment"
              }
              exerciseType={currentStage.stageType}
              skillId={currentStage.testedSkills[0] || "am_r"}
              skillName={`Diagnostic Stage ${activeStageIdx + 1}`}
              promptText={currentStage.promptText}
              targetIpa={currentStage.targetIpa}
              onAnalysisComplete={(res) => {
                setCompletedStages((prev) => ({ ...prev, [activeStageIdx]: true }));
                setLatestResult(res);
              }}
            />
          </div>

          {latestResult && (
            <FeedbackReportCard
              feedback={latestResult.feedback}
              telemetry={latestResult.recording.telemetry}
            />
          )}
        </div>

        {/* Right Sidebar: Live Skill Profile & Next Step */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] mb-3 flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Live Skill Profile Snapshot
            </h3>
            <p className="text-xs text-[#78756E] dark:text-[#8A857A] mb-4">
              Scores update immediately after each diagnostic recording and re-rank your
              personalized training plan.
            </p>

            <div className="space-y-2.5">
              {(state?.skillMeasurements || []).slice(0, 7).map((s) => (
                <div
                  key={s.skillId}
                  className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-2.5 dark:border-[#2E2D29] dark:bg-[#161614]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#141413] dark:text-[#F3EFE6]">{s.skillName}</span>
                    <span className="font-mono font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                      {s.score} / 100
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#E5E0D5] dark:bg-[#2E2D29] overflow-hidden">
                    <div
                      style={{ width: `${s.score}%` }}
                      className="h-full rounded-full bg-[#1B4332] dark:bg-[#6EE7B7]"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-[#78756E] dark:text-[#8A857A]">
                    <span>Priority: {s.priorityScore}</span>
                    <span>Baseline: {s.baselineScore}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {activeStageIdx < prompts.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveStageIdx((i) => i + 1);
                    setLatestResult(null);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
                >
                  Continue to Stage {activeStageIdx + 2}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : null}

              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D5] bg-[#F4F1EA] px-4 py-2.5 text-xs font-bold text-[#1B4332] hover:bg-[#EAE5DA] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7] dark:hover:bg-[#20201D] transition"
              >
                <BarChart3 className="h-4 w-4" />
                View Full Accent Profile & Training Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
