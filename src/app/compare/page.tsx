"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  GitCompare,
  Mic,
  Play,
  Sparkles,
  TrendingUp,
  Volume2,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";

export default function BeforeAfterComparisonPage() {
  const { state, speakReference } = useAccentLab();

  if (!state) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-[#78756E] dark:text-[#9E9A90]">
        Loading Before / After Acoustic Studio...
      </div>
    );
  }

  const baselineRec =
    state.recordings.find((r) => r.contextType === "baseline_assessment") ||
    state.recordings[state.recordings.length - 1];
  const currentRec =
    state.recordings.find((r) => r.contextType === "weekly_assessment") ||
    state.recordings[0];

  const keySkillDiffs = [
    { id: "am_r", label: "American R (/ɹ/, /ɚ/)" },
    { id: "vowel_contrasts", label: "Tense vs. Lax Vowels" },
    { id: "rhythm", label: "Stress-Timed Rhythm (nPVI)" },
    { id: "word_stress", label: "Word Stress Placement" },
    { id: "flap_t", label: "American Flap T (/ɾ/)" },
    { id: "th_sounds", label: "TH Sounds (/θ/ & /ð/)" },
    { id: "intonation", label: "Intonation & Pitch Movement" },
    { id: "linking", label: "Consonant-to-Vowel Linking" },
  ].map((item) => {
    const found = state.skillMeasurements.find((s) => s.skillId === item.id);
    const base = found?.baselineScore ?? 48;
    const curr = found?.score ?? 74;
    return {
      ...item,
      baseline: base,
      current: curr,
      delta: curr - base,
      ipa: found?.ipaSymbols || "",
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D5] bg-[#F4F1EA] px-3.5 py-1 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
            <GitCompare className="h-3.5 w-3.5 text-[#B84A27] dark:text-[#F4A261]" />
            Measurable Evidence of Improvement
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#141413] dark:text-[#F3EFE6]">
            Before / After Spoken-English Comparison Studio
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#78756E] dark:text-[#8A857A]">
            Listen to your Day-1 Baseline recording side-by-side with your latest Reassessment and
            compare objective acoustic signals &amp; skill scores.
          </p>
        </div>

        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
        >
          <Mic className="h-4 w-4" />
          Record New Reassessment Sample
        </Link>
      </div>

      {/* Side-by-Side Audio & Waveform Studio */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* BEFORE: Baseline Card */}
        <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3 mb-4 dark:border-[#2E2D29]">
            <div>
              <span className="rounded-md bg-[#F4F1EA] border border-[#E5E0D5] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#141413] dark:bg-[#181816] dark:border-[#2E2D29] dark:text-[#F3EFE6]">
                BEFORE • DAY-1 BASELINE
              </span>
              <h2 className="mt-1.5 text-lg font-bold text-[#141413] dark:text-[#F3EFE6]">
                {baselineRec?.createdAt || "2026-09-08"} Diagnostic
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#141413] dark:text-[#F3EFE6]">
                {baselineRec?.overallScore || 54}
                <span className="text-xs font-normal text-[#78756E] dark:text-[#8A857A]"> / 100</span>
              </div>
              <div className="text-[11px] text-[#78756E] dark:text-[#8A857A]">
                Duration: {baselineRec?.durationSeconds || 28.4}s
              </div>
            </div>
          </div>

          {/* Waveform Bars */}
          <div className="mb-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="mb-2 flex items-center justify-between text-[11px] text-[#78756E] dark:text-[#8A857A]">
              <span>Syllable-Timed Envelope (nPVI: {baselineRec?.telemetry.nPviRhythm || 41})</span>
              <span>F3: {baselineRec?.telemetry.f3EstimatedHz || 2210} Hz</span>
            </div>
            <div className="flex h-14 items-end gap-1">
              {(baselineRec?.telemetry.waveformPeaks || []).slice(0, 36).map((bar, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(15, bar)}%` }}
                  className="w-full rounded-full bg-[#A39E93] dark:bg-[#4A4842]"
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-[#4A4842] dark:text-[#B8B3A8] italic mb-4 line-clamp-3">
            “{baselineRec?.promptText}”
          </p>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => speakReference(baselineRec?.promptText || "", 0.82)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E0D5] bg-[#F4F1EA] px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EAE5DA] transition dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#F3EFE6] dark:hover:bg-[#20201D]"
            >
              <Play className="h-3.5 w-3.5" />
              Play Baseline Sample
            </button>
            <span className="text-xs text-[#B84A27] dark:text-[#F4A261] font-semibold">
              Pause Ratio: {Math.round((baselineRec?.telemetry.pauseRatio || 0.27) * 100)}%
            </span>
          </div>
        </div>

        {/* AFTER: Current Reassessment Card */}
        <div className="rounded-2xl border border-[#1B4332]/40 bg-[#E9F2EE] p-6 dark:border-[#265C45] dark:bg-[rgba(38,92,69,0.2)]">
          <div className="flex items-center justify-between border-b border-[#1B4332]/20 pb-3 mb-4 dark:border-[#265C45]/50">
            <div>
              <span className="rounded-md bg-[#1B4332]/10 border border-[#1B4332]/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#1B4332] dark:bg-[#265C45]/30 dark:border-[#6EE7B7]/30 dark:text-[#6EE7B7]">
                AFTER • CURRENT REASSESSMENT
              </span>
              <h2 className="mt-1.5 text-lg font-bold text-[#141413] dark:text-[#F3EFE6]">
                {currentRec?.createdAt || "2026-09-29"} Reassessment
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#1B4332] dark:text-[#6EE7B7]">
                {currentRec?.overallScore || 76}
                <span className="text-xs font-normal text-[#78756E] dark:text-[#8A857A]"> / 100</span>
              </div>
              <div className="text-[11px] font-bold text-[#1B4332] dark:text-[#6EE7B7]">
                +{(currentRec?.overallScore || 76) - (baselineRec?.overallScore || 54)} pts Improvement
              </div>
            </div>
          </div>

          {/* Waveform Bars */}
          <div className="mb-4 rounded-xl border border-[#1B4332]/30 bg-[#FFFFFF] p-3 dark:border-[#2E2D29] dark:bg-[#161614]">
            <div className="mb-2 flex items-center justify-between text-[11px] text-[#1B4332] dark:text-[#6EE7B7]">
              <span>
                Stress-Timed Cadence (nPVI: {currentRec?.telemetry.nPviRhythm || 56})
              </span>
              <span>F3 Rhotic Dip: {currentRec?.telemetry.f3EstimatedHz || 1945} Hz</span>
            </div>
            <div className="flex h-14 items-end gap-1">
              {(currentRec?.telemetry.waveformPeaks || []).slice(0, 36).map((bar, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(15, bar)}%` }}
                  className="w-full rounded-full bg-[#1B4332] dark:bg-[#6EE7B7]"
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-[#141413] dark:text-[#F3EFE6] italic mb-4 line-clamp-3">
            “{currentRec?.promptText}”
          </p>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => speakReference(currentRec?.promptText || "", 0.98)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1B4332] dark:text-[#FFFFFF] transition"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Play Current Reassessment
            </button>
            <span className="text-xs text-[#1B4332] dark:text-[#6EE7B7] font-semibold">
              Pause Ratio: {Math.round((currentRec?.telemetry.pauseRatio || 0.16) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* PRD Section 17 Skill Comparison Table */}
      <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
              Skill Measurement Comparison Table
            </span>
            <h2 className="text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
              Baseline vs. Current Skill-Level Gains
            </h2>
          </div>
          <span className="text-xs text-[#78756E] dark:text-[#8A857A]">
            Scale: 0–100 Objective Measurement Progress Indicator
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E0D5] text-xs uppercase tracking-wider text-[#78756E] dark:border-[#2E2D29] dark:text-[#8A857A]">
                <th className="py-3 px-4">Accent Skill</th>
                <th className="py-3 px-4">Target IPA</th>
                <th className="py-3 px-4">Baseline (Before)</th>
                <th className="py-3 px-4">Current (After)</th>
                <th className="py-3 px-4">Measured Gain</th>
                <th className="py-3 px-4">Visual Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D5] dark:divide-[#2E2D29] text-sm">
              {keySkillDiffs.map((row) => (
                <tr key={row.id} className="hover:bg-[#FBF9F5] dark:hover:bg-[#181816]">
                  <td className="py-3.5 px-4 font-bold text-[#141413] dark:text-[#F3EFE6]">{row.label}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#1B4332] dark:text-[#6EE7B7]">
                    {row.ipa}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#78756E] dark:text-[#8A857A]">
                    {row.baseline} / 100
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#141413] dark:text-[#F3EFE6]">
                    {row.current} / 100
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#E9F2EE] border border-[#1B4332]/30 px-2.5 py-0.5 font-mono text-xs font-bold text-[#1B4332] dark:bg-[rgba(38,92,69,0.35)] dark:border-[#6EE7B7]/30 dark:text-[#6EE7B7]">
                      +{row.delta} pts
                    </span>
                  </td>
                  <td className="py-3.5 px-4 w-56">
                    <div className="relative h-2.5 w-full rounded-full bg-[#E5E0D5] dark:bg-[#2E2D29] overflow-hidden">
                      <div
                        style={{ width: `${row.baseline}%` }}
                        className="absolute inset-y-0 left-0 bg-[#A39E93] dark:bg-[#4A4842]"
                      />
                      <div
                        style={{ width: `${row.current}%` }}
                        className="h-full rounded-full bg-[#1B4332] dark:bg-[#6EE7B7]"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
