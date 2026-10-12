"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
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

const EIGHT_STAGE_LABELS = [
  { key: "learn", label: "1. Learn" },
  { key: "listen", label: "2. Listen" },
  { key: "repeat", label: "3. Repeat" },
  { key: "words", label: "4. Words" },
  { key: "sentences", label: "5. Sentences" },
  { key: "shadowing", label: "6. Shadowing" },
  { key: "free_speech", label: "7. Free Speech" },
  { key: "feedback", label: "8. Feedback" },
];

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { state, speakReference } = useAccentLab();

  const lesson =
    state?.lessons.find((l) => l.id === resolvedParams.lessonId) || state?.lessons[0];

  const [stepIdx, setStepIdx] = useState(0);
  const [selectedPairChoice, setSelectedPairChoice] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<{
    recording: RecordingRecord;
    feedback: DualModeCoachFeedback;
  } | null>(null);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center text-[#78756E] dark:text-[#9E9A90]">
        Loading interactive 8-step lesson...
      </div>
    );
  }

  const currentExercise = lesson.exercises[stepIdx] || lesson.exercises[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Back & Lesson Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:text-[#143325] dark:text-[#6EE7B7] dark:hover:text-[#6EE7B7]/80"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Personalized Curriculum
          </Link>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#141413] dark:text-[#F3EFE6]">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#78756E] dark:text-[#8A857A]">{lesson.subtitle}</p>
        </div>

        <div className="rounded-xl border border-[#E5E0D5] bg-[#F4F1EA] px-3.5 py-2 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
          8-Stage Articulatory Progression
        </div>
      </div>

      {/* 8-Stage Progress Bar */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {lesson.exercises.map((ex, idx) => {
          const isCurrent = idx === stepIdx;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setStepIdx(idx);
                setLatestResult(null);
              }}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                isCurrent
                  ? "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] dark:border-[#6EE7B7] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                  : idx < stepIdx
                  ? "border-[#1B4332]/40 bg-[#E9F2EE]/50 text-[#1B4332] dark:border-[#265C45] dark:bg-[rgba(38,92,69,0.2)] dark:text-[#6EE7B7]"
                  : "border-[#E5E0D5] bg-[#FFFFFF] text-[#78756E] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#8A857A] dark:hover:border-[#35332E]"
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-75">
                Step {idx + 1} / {lesson.exercises.length}
              </div>
              <div className="mt-0.5 text-xs font-bold capitalize">
                {ex.lessonStage.replace("_", " ")}
              </div>
            </button>
          );
        })}
      </div>

      {/* Articulatory Learn Card (Always accessible or prominent in Step 1) */}
      <div className="mb-6 rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E9F2EE] border border-[#1B4332]/30 px-2.5 py-1 text-xs font-bold text-[#1B4332] dark:bg-[rgba(38,92,69,0.35)] dark:border-[#6EE7B7]/30 dark:text-[#6EE7B7] uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            Stage: {currentExercise.lessonStage.replace("_", " ")} •{" "}
            {currentExercise.exerciseType.replace("_", " ")}
          </span>
          <span className="text-xs font-medium text-[#78756E] dark:text-[#8A857A]">
            Focus: {currentExercise.coachingFocus}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-5">
          <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] mb-1">
              Physical Mouth &amp; Tongue Position
            </div>
            <p className="text-xs text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
              {lesson.learnContent.mouthPosition}
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261] mb-1">
              Common L1 Transfer Trap to Avoid
            </div>
            <p className="text-xs text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
              {lesson.learnContent.commonL1Mistake}
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7] mb-1">
              Acoustic Formant / Prosody Target
            </div>
            <p className="text-xs text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
              {lesson.learnContent.acousticMarker}
            </p>
            <div className="mt-2 space-y-1">
              {lesson.learnContent.contrastExamples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded bg-[#F4F1EA] px-2 py-1 text-[11px] dark:bg-[#181816]"
                >
                  <span className="font-semibold text-[#141413] dark:text-[#F3EFE6]">{ex.target}</span>
                  <span className="font-mono text-[#1B4332] dark:text-[#6EE7B7]">{ex.ipa}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Minimal Pair Discrimination Widget */}
        {currentExercise.minimalPairOptions && (
          <div className="mb-5 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="text-xs font-bold text-[#1B4332] dark:text-[#6EE7B7] mb-2">
              Minimal Pair Ear &amp; Production Check — Click to Hear &amp; Discriminate:
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: currentExercise.minimalPairOptions.wordA,
                  ipa: currentExercise.minimalPairOptions.ipaA,
                },
                {
                  label: currentExercise.minimalPairOptions.wordB,
                  ipa: currentExercise.minimalPairOptions.ipaB,
                },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setSelectedPairChoice(opt.label);
                    speakReference(opt.label, 0.88);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition ${
                    selectedPairChoice === opt.label
                      ? "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] dark:border-[#6EE7B7] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                      : "border-[#E5E0D5] bg-[#FFFFFF] text-[#141413] hover:border-[#1B4332]/50 dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#6EE7B7]/50"
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{opt.label}</div>
                    <div className="font-mono text-xs text-[#78756E] dark:text-[#8A857A]">{opt.ipa}</div>
                  </div>
                  <Volume2 className="h-4 w-4 text-[#B84A27] dark:text-[#F4A261]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Microphone & DSP Studio */}
        <AudioRecorderStudio
          contextType="lesson_exercise"
          exerciseType={currentExercise.exerciseType}
          skillId={lesson.skillId}
          skillName={lesson.title}
          promptText={currentExercise.promptText}
          targetIpa={currentExercise.targetIpa}
          onAnalysisComplete={(res) => setLatestResult(res)}
        />
      </div>

      {/* Step Navigation Controls */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          disabled={stepIdx === 0}
          onClick={() => {
            setStepIdx((s) => Math.max(0, s - 1));
            setLatestResult(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E5E0D5] bg-[#F4F1EA] px-4 py-2.5 text-xs font-bold text-[#141413] hover:bg-[#EAE5DA] disabled:opacity-40 transition dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#F3EFE6] dark:hover:bg-[#20201D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Lesson Step
        </button>

        {stepIdx < lesson.exercises.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              setStepIdx((s) => Math.min(lesson.exercises.length - 1, s + 1));
              setLatestResult(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-2.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
          >
            Next Step ({lesson.exercises[stepIdx + 1]?.lessonStage.replace("_", " ")})
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-2.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete Lesson &amp; Return to Dashboard
          </Link>
        )}
      </div>

      {/* Grounded Feedback Report Card */}
      {latestResult && (
        <FeedbackReportCard
          feedback={latestResult.feedback}
          telemetry={latestResult.recording.telemetry}
        />
      )}
    </div>
  );
}
