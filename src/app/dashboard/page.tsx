"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookA,
  BookOpen,
  Calendar,
  Flame,
  GitCompare,
  Info,
  Mic,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { resolveSoundEntry } from "@/lib/phonetics/phonetic-dictionary";

export default function DashboardPage() {
  const { state } = useAccentLab();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "pronunciation" | "prosody" | "connected_speech"
  >("all");

  if (!state) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#78736A] font-sans">
        Loading your Formant diagnostic workspace...
      </div>
    );
  }

  const { profile, skillMeasurements, progressSnapshots, trainingSessions, assessments } = state;

  const latestAssessment = assessments[assessments.length - 1];
  const baselineAssessment = assessments[0];
  const overallScore = latestAssessment?.overallScore || 76;
  const baselineOverall = baselineAssessment?.overallScore || 54;
  const deltaSinceBaseline = overallScore - baselineOverall;
  const topFocusSkill = skillMeasurements[0];

  // Radar chart data comparing Baseline vs Current across key skills (PRD Section 15.2)
  const radarSkills = [
    { id: "am_r", label: "American R" },
    { id: "th_sounds", label: "TH Sounds" },
    { id: "vowel_contrasts", label: "Vowels" },
    { id: "word_stress", label: "Word Stress" },
    { id: "rhythm", label: "Rhythm" },
    { id: "intonation", label: "Intonation" },
    { id: "flap_t", label: "Flap T" },
    { id: "linking", label: "Linking" },
  ];

  const radarData = radarSkills.map((rs) => {
    const found = skillMeasurements.find((m) => m.skillId === rs.id);
    return {
      skill: rs.label,
      Baseline: found?.baselineScore ?? 50,
      Current: found?.score ?? 72,
    };
  });

  const filteredSkills =
    selectedCategory === "all"
      ? skillMeasurements
      : skillMeasurements.filter((s) => s.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 text-[#141413] dark:text-[#F3EFE6]">
      {/* Top Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#E5E0D5] pb-6 dark:border-[#2E2D29]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-[#1B4332]/30 bg-[#E9F2EE] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
              Target: General American English ({profile.targetAccentId})
            </span>
            <span className="rounded border border-[#E5E0D5] bg-[#F4F1EA] px-2.5 py-0.5 font-mono text-xs text-[#4A4843] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8]">
              Native L1: {profile.nativeLanguage}
            </span>
          </div>
          <h1 className="mt-2.5 font-serif text-2xl sm:text-4xl font-normal tracking-tight text-[#141413] dark:text-[#F3EFE6]">
            {profile.name}’s Spoken-English Diagnostic Dashboard
          </h1>
          <p className="mt-1 font-sans text-xs sm:text-sm text-[#78736A] dark:text-[#9E9A90]">
            Goal: <span className="text-[#4A4843] dark:text-[#B8B3A8] font-medium">{profile.learningGoal}</span> • Scores represent objective acoustic progress indicators (0–100)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/phonetics"
            className="inline-flex items-center gap-2 rounded-lg border border-[#D5CFC2] bg-[#FFFFFF] px-4 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#F4F1EA] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:bg-[#2A2925] transition"
          >
            <BookA className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />
            Phonetic Symbol Guide
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-lg border border-[#D5CFC2] bg-[#FFFFFF] px-4 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#F4F1EA] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:bg-[#2A2925] transition"
          >
            <GitCompare className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />
            Before / After Studio
          </Link>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B4332] px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] hover:bg-[#133024] dark:bg-[#265C45] dark:hover:bg-[#1E4A37] dark:text-[#FFFFFF] transition"
          >
            <Mic className="h-4 w-4" />
            Take Weekly Reassessment
          </Link>
        </div>
      </div>

      {/* 15.1 Overview KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Overall Progress Score & Delta */}
        <div className="rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="flex items-center justify-between text-xs text-[#78736A] dark:text-[#9E9A90]">
            <span className="font-sans font-semibold uppercase tracking-wider">
              Overall Accent Score
            </span>
            <TrendingUp className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="font-serif text-4xl font-normal text-[#141413] dark:text-[#F3EFE6]">
              {overallScore}
            </span>
            <span className="font-mono text-xs text-[#78736A] dark:text-[#9E9A90]">/ 100</span>
            <span className="inline-flex items-center rounded border border-[#1B4332]/30 bg-[#E9F2EE] px-2 py-0.5 font-mono text-xs font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
              +{deltaSinceBaseline} pts
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#78736A] dark:text-[#9E9A90]">
            Baseline was <span className="font-mono text-[#4A4843] dark:text-[#B8B3A8]">{baselineOverall}/100</span> on{" "}
            {baselineAssessment?.completedAt}
          </p>
        </div>

        {/* KPI 2: Current #1 Focus Skill (Priority Engine) */}
        <div className="rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="flex items-center justify-between text-xs text-[#B84A27] dark:text-[#F4A261]">
            <span className="font-sans font-semibold uppercase tracking-wider">
              Current #1 Focus Skill
            </span>
            <Target className="h-4 w-4 text-[#B84A27] dark:text-[#F4A261]" />
          </div>
          <div className="mt-2 font-serif text-lg font-normal text-[#141413] dark:text-[#F3EFE6] line-clamp-1">
            {topFocusSkill?.skillName}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <Link
              href={`/phonetics?sound=${resolveSoundEntry(topFocusSkill?.skillId || "am_r")?.id || "american_r"}`}
              title="Click to learn how this symbol is pronounced in the Phonetics Guide"
              className="font-mono text-[#1B4332] bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#E5E0D5] hover:border-[#1B4332] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#6EE7B7] dark:hover:border-[#6EE7B7] transition inline-flex items-center gap-1"
            >
              {topFocusSkill?.ipaSymbols}
              <Info className="h-3 w-3 opacity-70" />
            </Link>
            <span className="font-mono font-semibold text-[#B84A27] dark:text-[#F4A261]">
              Priority: {topFocusSkill?.priorityScore}
            </span>
          </div>
          <Link
            href={`/lessons/${topFocusSkill?.recommendedLessonId || "lesson_am_r_mastery"}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7]"
          >
            Practice Focus Lesson Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* KPI 3: Daily Practice Status & Streak */}
        <div className="rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="flex items-center justify-between text-xs text-[#78736A] dark:text-[#9E9A90]">
            <span className="font-sans font-semibold uppercase tracking-wider">
              Daily Practice Goal
            </span>
            <Flame className="h-4 w-4 text-[#B84A27] dark:text-[#F4A261]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="font-serif text-3xl font-normal text-[#141413] dark:text-[#F3EFE6]">
                {profile.dailyMinutesCompletedToday}
              </span>
              <span className="text-xs text-[#78736A] dark:text-[#9E9A90]">
                {" "}
                / {profile.dailyPracticeGoalMinutes} mins today
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#B84A27] dark:text-[#F4A261]">
              {profile.streakDays} Day Streak
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-sm bg-[#F4F1EA] dark:bg-[#2E2D29] overflow-hidden">
            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (profile.dailyMinutesCompletedToday /
                      Math.max(1, profile.dailyPracticeGoalMinutes)) *
                      100
                  )
                )}%`,
              }}
              className="h-full bg-[#1B4332] dark:bg-[#265C45]"
            />
          </div>
        </div>

        {/* KPI 4: Recent Assessment Status */}
        <div className="rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="flex items-center justify-between text-xs text-[#78736A] dark:text-[#9E9A90]">
            <span className="font-sans font-semibold uppercase tracking-wider">
              Latest Assessment
            </span>
            <Calendar className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />
          </div>
          <div className="mt-2 font-serif text-base font-normal text-[#141413] dark:text-[#F3EFE6]">
            {latestAssessment?.label}
          </div>
          <p className="mt-1 text-xs text-[#4A4843] dark:text-[#B8B3A8] line-clamp-2">
            {latestAssessment?.summaryCoachNote}
          </p>
          <Link
            href="/history"
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7]"
          >
            Listen in Recording History
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 15.2 & 15.3 Charts Grid: Radar Profile + Progress Trend Line */}
      <div className="mb-8 grid gap-6 lg:grid-cols-12">
        {/* 15.2 Multidimensional Skill Radar Chart */}
        <div className="lg:col-span-6 rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="mb-4 flex items-center justify-between border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#78756A] dark:text-[#9E9A90]">
                ACOUSTIC PROFILE • SKILL VISUALIZATION
              </span>
              <h2 className="font-serif text-lg font-normal text-[#141413] dark:text-[#F3EFE6]">
                Multidimensional Accent Radar (Baseline vs. Current)
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#78756A] dark:text-[#9E9A90]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8C8577]" />
                Baseline
              </span>
              <span className="flex items-center gap-1.5 text-[#1B4332] dark:text-[#6EE7B7] font-semibold">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1B4332] dark:bg-[#6EE7B7]" />
                Current
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="74%" data={radarData}>
                <PolarGrid stroke="#E5E0D5" className="stroke-[#E5E0D5] dark:stroke-[#2E2D29]" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#4A4843", fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#8C8577", fontSize: 10 }}
                />
                <Radar
                  name="Baseline"
                  dataKey="Baseline"
                  stroke="#8C8577"
                  fill="#8C8577"
                  fillOpacity={0.18}
                />
                <Radar
                  name="Current"
                  dataKey="Current"
                  stroke="#1B4332"
                  fill="#1B4332"
                  fillOpacity={0.28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E1E1B",
                    borderColor: "#2E2D29",
                    color: "#F3EFE6",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Over Time Line Chart */}
        <div className="lg:col-span-6 rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="mb-4 flex items-center justify-between border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#78756A] dark:text-[#9E9A90]">
                TEMPORAL PROGRESSION • LONGITUDINAL TRAJECTORY
              </span>
              <h2 className="font-serif text-lg font-normal text-[#141413] dark:text-[#F3EFE6]">
                Weekly Assessment &amp; Core Skill Trajectories
              </h2>
            </div>
            <span className="rounded border border-[#1B4332]/30 bg-[#E9F2EE] px-2.5 py-1 font-mono text-xs font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[#265C45]/35 dark:text-[#6EE7B7]">
              American /r/: 42 → 74
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressSnapshots}>
                <XAxis
                  dataKey="dateLabel"
                  stroke="#D5CFC2"
                  tick={{ fill: "#78756A", fontSize: 11 }}
                />
                <YAxis
                  domain={[30, 100]}
                  stroke="#D5CFC2"
                  tick={{ fill: "#78756A", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E1E1B",
                    borderColor: "#2E2D29",
                    color: "#F3EFE6",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="overallScore"
                  name="Overall Score"
                  stroke="#1B4332"
                  strokeWidth={2.75}
                  dot={{ r: 4, fill: "#1B4332" }}
                />
                <Line
                  type="monotone"
                  dataKey="am_r"
                  name="American /r/"
                  stroke="#B84A27"
                  strokeWidth={2.25}
                  dot={{ r: 3, fill: "#B84A27" }}
                />
                <Line
                  type="monotone"
                  dataKey="rhythm"
                  name="Stress Rhythm"
                  stroke="#2D6A4F"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: "#2D6A4F" }}
                />
                <Line
                  type="monotone"
                  dataKey="vowel_contrasts"
                  name="Vowels"
                  stroke="#8C8577"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#8C8577" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 11: Personalized Training Plan Queue */}
      <div className="mb-8 rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
              PERSONALIZED TRAINING ENGINE
            </span>
            <h2 className="mt-0.5 font-serif text-xl sm:text-2xl font-normal text-[#141413] dark:text-[#F3EFE6]">
              Your Prioritized Daily Curriculum (Priority = Severity × Frequency × Importance)
            </h2>
          </div>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-4 py-2 text-xs font-semibold text-[#FBF9F5] hover:bg-[#133024] dark:bg-[#265C45] dark:hover:bg-[#1E4A37] dark:text-[#FFFFFF] transition"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Browse All 8-Step Lessons
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {trainingSessions.slice(0, 3).map((session, idx) => (
            <div
              key={session.id}
              className="flex flex-col justify-between rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-5 hover:border-[#1B4332] transition dark:border-[#2E2D29] dark:bg-[#181816] dark:hover:border-[#6EE7B7]/50"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="rounded border border-[#B84A27]/30 bg-[#F9ECE8] px-2 py-0.5 font-mono font-semibold text-[#B84A27] dark:border-[#F4A261]/35 dark:bg-[#B84A27]/25 dark:text-[#F4A261]">
                    PRIORITY #{idx + 1} • {session.priorityScore}
                  </span>
                  <span className="font-mono text-[#78736A] dark:text-[#9E9A90]">{session.durationMinutes} mins</span>
                </div>
                <h3 className="font-serif text-base font-normal text-[#141413] dark:text-[#F3EFE6]">
                  {session.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#1B4332] dark:text-[#6EE7B7]">
                  Target Skill: {session.skillName}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center font-mono text-[11px] bg-[#FFFFFF] rounded-lg p-2 border border-[#E5E0D5] dark:border-[#2E2D29] dark:bg-[#161614]">
                  <div>
                    <div className="text-[#78736A] dark:text-[#9E9A90]">Severity</div>
                    <div className="text-[#B84A27] dark:text-[#F4A261] font-semibold">{session.severity}</div>
                  </div>
                  <div>
                    <div className="text-[#78736A] dark:text-[#9E9A90]">Frequency</div>
                    <div className="text-[#1B4332] dark:text-[#6EE7B7] font-semibold">{session.frequency}</div>
                  </div>
                  <div>
                    <div className="text-[#78736A] dark:text-[#9E9A90]">Importance</div>
                    <div className="text-[#141413] dark:text-[#F3EFE6] font-semibold">{session.importance}</div>
                  </div>
                </div>
              </div>

              <Link
                href={`/lessons/${session.lessonId}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1B4332] px-3.5 py-2.5 text-xs font-semibold text-[#FBF9F5] hover:bg-[#133024] dark:bg-[#265C45] dark:hover:bg-[#1E4A37] dark:text-[#FFFFFF] transition"
              >
                Start 8-Step Lesson
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Complete 18-Skill Multidimensional Profile */}
      <div className="rounded-xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
              MULTIDIMENSIONAL SKILL LEDGER
            </span>
            <h2 className="mt-0.5 font-serif text-xl sm:text-2xl font-normal text-[#141413] dark:text-[#F3EFE6]">
              All 18 General American Pronunciation, Prosody &amp; Connected Speech Skills
            </h2>
          </div>

          <div className="inline-flex rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] p-1 dark:border-[#2E2D29] dark:bg-[#181816]">
            {[
              { id: "all", label: "All 18 Skills" },
              { id: "pronunciation", label: "Pronunciation" },
              { id: "prosody", label: "Prosody" },
              { id: "connected_speech", label: "Connected Speech" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    tab.id as "all" | "pronunciation" | "prosody" | "connected_speech"
                  )
                }
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === tab.id
                    ? "bg-[#1B4332] text-[#FBF9F5] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                    : "text-[#4A4843] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => {
            const gain = skill.score - skill.baselineScore;
            return (
              <div
                key={skill.skillId}
                className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 flex flex-col justify-between hover:border-[#D5CFC2] transition dark:border-[#2E2D29] dark:bg-[#181816] dark:hover:border-[#35332E]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-[#F4F1EA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#78756A] border border-[#E5E0D5] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#9E9A90]">
                      {skill.category.replace("_", " ")}
                    </span>
                    <Link
                      href={`/phonetics?sound=${resolveSoundEntry(skill.skillId)?.id || "american_r"}`}
                      title={`Learn how ${skill.ipaSymbols} is pronounced in the Phonetics Guide`}
                      className="font-mono text-xs font-semibold text-[#1B4332] hover:underline dark:text-[#6EE7B7] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {skill.ipaSymbols}
                      <Info className="h-3 w-3 opacity-60" />
                    </Link>
                  </div>
                  <h3 className="mt-2 font-serif text-base font-normal text-[#141413] dark:text-[#F3EFE6]">
                    {skill.skillName}
                  </h3>
                  <p className="mt-1 text-xs text-[#4A4843] dark:text-[#B8B3A8] leading-snug">
                    {skill.evidenceNote}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#78756A] dark:text-[#9E9A90]">
                      Baseline: <strong className="font-mono text-[#4A4843] dark:text-[#B8B3A8]">{skill.baselineScore}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      {gain > 0 && (
                        <span className="font-mono text-[#1B4332] dark:text-[#6EE7B7] font-semibold">
                          +{gain} pts
                        </span>
                      )}
                      <span className="font-mono text-sm font-bold text-[#141413] dark:text-[#F3EFE6]">
                        {skill.score} / 100
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-sm bg-[#E5E0D5] dark:bg-[#2E2D29] overflow-hidden">
                    <div
                      style={{ width: `${skill.score}%` }}
                      className="h-full bg-[#1B4332] dark:bg-[#265C45]"
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#B84A27] dark:text-[#F4A261] font-semibold">
                      Priority: {skill.priorityScore}
                    </span>
                    <Link
                      href={`/lessons/${skill.recommendedLessonId}`}
                      className="font-semibold text-[#1B4332] hover:underline inline-flex items-center gap-1 dark:text-[#6EE7B7]"
                    >
                      Practice Skill
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
