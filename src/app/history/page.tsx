"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileAudio,
  History,
  Layers,
  Play,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { FeedbackReportCard } from "@/components/feedback/FeedbackReportCard";

export default function RecordingHistoryPage() {
  const { state, speakReference } = useAccentLab();
  const recordings = state?.recordings || [];
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(
    recordings[0]?.id || null
  );

  const selectedRec =
    recordings.find((r) => r.id === selectedRecordingId) || recordings[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D5] bg-[#F4F1EA] px-3.5 py-1 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
          <History className="h-3.5 w-3.5 text-[#B84A27] dark:text-[#F4A261]" />
          Complete Audio &amp; Diagnostic Archive
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#141413] dark:text-[#F3EFE6]">
          Recording History, Transcripts &amp; Acoustic Telemetry
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#78756E] dark:text-[#8A857A]">
          Review every baseline diagnostic, weekly reassessment, and lesson practice attempt with
          playback, transcript, DSP telemetry, and AI coaching feedback.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left List of Recordings */}
        <div className="lg:col-span-5 space-y-3">
          {recordings.map((rec) => {
            const isSelected = rec.id === selectedRec?.id;
            return (
              <button
                key={rec.id}
                type="button"
                onClick={() => setSelectedRecordingId(rec.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-[#1B4332] bg-[#E9F2EE] dark:border-[#6EE7B7] dark:bg-[rgba(38,92,69,0.35)]"
                    : "border-[#E5E0D5] bg-[#FFFFFF] hover:border-[#1B4332]/50 dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:hover:border-[#6EE7B7]/50"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="rounded-md bg-[#F4F1EA] border border-[#E5E0D5] px-2 py-0.5 font-mono text-[10px] uppercase text-[#1B4332] dark:bg-[#181816] dark:border-[#2E2D29] dark:text-[#6EE7B7]">
                    {rec.contextType.replace("_", " ")} • {rec.exerciseType.replace("_", " ")}
                  </span>
                  <span className="font-mono font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                    {rec.overallScore} / 100
                  </span>
                </div>
                <div className="text-sm font-bold text-[#141413] dark:text-[#F3EFE6] line-clamp-1">
                  {rec.skillName}
                </div>
                <p className="mt-1 text-xs text-[#78756E] dark:text-[#8A857A] line-clamp-2">
                  “{rec.transcript}”
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#78756E] dark:text-[#8A857A]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {rec.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rec.durationSeconds}s • F3: {rec.telemetry.f3EstimatedHz}Hz
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detailed Inspection & Playback */}
        <div className="lg:col-span-7 space-y-6">
          {selectedRec && (
            <>
              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D5] pb-4 mb-4 dark:border-[#2E2D29]">
                  <div>
                    <span className="text-xs font-semibold text-[#1B4332] dark:text-[#6EE7B7]">
                      {selectedRec.createdAt} • {selectedRec.durationSeconds}s Recording
                    </span>
                    <h2 className="text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                      {selectedRec.skillName}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakReference(selectedRec.promptText, 0.96)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B4332] px-3.5 py-2 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Play Reference Audio
                    </button>
                    {selectedRec.audioDataUrl && (
                      <audio
                        controls
                        src={selectedRec.audioDataUrl}
                        className="h-8 max-w-[190px]"
                      />
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 mb-4 dark:border-[#2E2D29] dark:bg-[#161614]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#78756E] dark:text-[#8A857A] mb-1">
                    Prompt &amp; Captured Transcript
                  </div>
                  <p className="text-sm text-[#141413] dark:text-[#F3EFE6] leading-relaxed">
                    “{selectedRec.transcript}”
                  </p>
                </div>

                {/* Waveform Visualization */}
                <div className="flex h-12 items-end gap-1 px-2">
                  {selectedRec.telemetry.waveformPeaks.slice(0, 40).map((b, i) => (
                    <div
                      key={i}
                      style={{ height: `${Math.max(14, b)}%` }}
                      className="w-full rounded-full bg-[#1B4332] dark:bg-[#6EE7B7]"
                    />
                  ))}
                </div>
              </div>

              <FeedbackReportCard
                feedback={selectedRec.feedback}
                telemetry={selectedRec.telemetry}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
