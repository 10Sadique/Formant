"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Database,
  Edit3,
  Eye,
  Globe,
  Layers,
  Mic,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import type { PlatformUserRecord } from "@/lib/db/store";
import type { LessonData } from "@/lib/db/seed-data";

type AdminGodTabId = "users" | "lessons" | "taxonomy" | "moderation";

export default function SuperAdminGodModePage() {
  const { state, loading, refreshState, speakReference } = useAccentLab();
  const [activeTab, setActiveTab] = useState<AdminGodTabId>("users");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // =========================================================================
  // 1. USERS CRUD + IMPERSONATION + SCORE OVERRIDE STATE
  // =========================================================================
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "learner" as "learner" | "superadmin",
    nativeLanguage: "Bengali",
    englishLevel: "Upper-intermediate",
    learningGoal: "Executive engineering communication & clarity",
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserDraft, setEditUserDraft] = useState<{
    name: string;
    email: string;
    role: "learner" | "superadmin";
    nativeLanguage: string;
    englishLevel: string;
    overallScore: number;
  }>({
    name: "",
    email: "",
    role: "learner",
    nativeLanguage: "Bengali",
    englishLevel: "Intermediate",
    overallScore: 75,
  });

  // =========================================================================
  // 2. LESSONS & EXERCISES FULL CRUD STATE
  // =========================================================================
  const [lessonForm, setLessonForm] = useState({
    title: "Connected Speech: Schwa Compression & Rapid Linking",
    subtitle: "Compress function words (/tə/, /fɚ/) while maintaining crisp stressed vowel nuclei",
    skillId: "rhythm",
    accentId: "en-US",
    difficulty: "Intermediate" as "Foundation" | "Intermediate" | "Advanced",
    estimatedMinutes: 15,
    overview:
      "Native General American relies on high contrast between lengthened stressed content words and ultra-short reduced function words.",
    mouthPosition:
      "Relax the jaw and centralize the tongue to mid-central schwa (/ə/) on unstressed 'to', 'for', 'of', and 'can'.",
    commonL1Mistake:
      "Giving every syllable equal duration and full vowel quality (/tuː/, /fɔːɹ/), creating syllable-timed rhythm.",
    acousticMarker:
      "Target Pairwise Variability Index (nPVI) > 54 with unstressed vowel duration < 65ms.",
    promptText:
      "We need to review the architecture for the international deployment on Thursday.",
    targetIpa: "/wi ˈniːd tə ɹɪˈvjuː ðə ˈɑɹkəˌtɛktʃɚ fɚ ðə ˌɪntɚˈnæʃənəl dɪˈplɔɪmənt/",
  });

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonDraft, setEditLessonDraft] = useState<{
    title: string;
    subtitle: string;
    difficulty: "Foundation" | "Intermediate" | "Advanced";
    estimatedMinutes: number;
  }>({
    title: "",
    subtitle: "",
    difficulty: "Intermediate",
    estimatedMinutes: 15,
  });

  // =========================================================================
  // 3. 18-SKILL TAXONOMY & PRIORITY FORMULA FULL CRUD STATE
  // =========================================================================
  const [newSkillForm, setNewSkillForm] = useState({
    name: "",
    category: "pronunciation" as "pronunciation" | "prosody" | "connected_speech",
    ipaSymbols: "/ɹ/, /ɚ/",
    description: "Custom phonological target with real-time priority weight governance.",
    importanceWeight: 0.88,
    articulatoryGuide: "Brace posterior lateral tongue margins against upper molars.",
  });

  const [skillEdits, setSkillEdits] = useState<
    Record<
      string,
      {
        name: string;
        ipaSymbols: string;
        importanceWeight: number;
        scoreOverride: number;
        articulatoryGuide: string;
      }
    >
  >({});

  useEffect(() => {
    if (state?.skills && state?.skillMeasurements) {
      const nextMap: Record<
        string,
        {
          name: string;
          ipaSymbols: string;
          importanceWeight: number;
          scoreOverride: number;
          articulatoryGuide: string;
        }
      > = {};
      state.skills.forEach((sk) => {
        const m = state.skillMeasurements.find((item) => item.skillId === sk.id);
        nextMap[sk.id] = {
          name: sk.name,
          ipaSymbols: sk.ipaSymbols,
          importanceWeight: sk.importanceWeight,
          scoreOverride: m?.score ?? 70,
          articulatoryGuide: sk.articulatoryGuide,
        };
      });
      setSkillEdits(nextMap);
    }
  }, [state]);

  const notifyStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 4800);
  };

  const runAdminAction = async (
    action: string,
    payload: Record<string, unknown>,
    successMsg: string
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      if (res.ok) {
        await refreshState();
        notifyStatus(successMsg);
      } else {
        notifyStatus("Action failed. Please check console parameters.");
      }
    } catch (err) {
      console.error("Admin API error:", err);
      notifyStatus("Network error communicating with /api/admin.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingUser = (user: PlatformUserRecord) => {
    setEditingUserId(user.id);
    setEditUserDraft({
      name: user.name,
      email: user.email,
      role: user.role,
      nativeLanguage: user.nativeLanguage,
      englishLevel: user.englishLevel,
      overallScore: user.overallScore,
    });
  };

  const startEditingLesson = (lesson: LessonData) => {
    setEditingLessonId(lesson.id);
    setEditLessonDraft({
      title: lesson.title,
      subtitle: lesson.subtitle,
      difficulty: lesson.difficulty,
      estimatedMinutes: lesson.estimatedMinutes,
    });
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-12 text-center ">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent" />
          <p className="font-serif text-lg font-semibold text-[#141413]">
            Initializing SuperAdmin God-Mode CRUD Console...
          </p>
          <p className="mt-1 text-xs text-[#78756E]">
            Syncing users, 18-skill Priority Engine weights, lessons, and acoustic telemetry store.
          </p>
        </div>
      </div>
    );
  }

  const usersList = state.users || [];
  const topPrioritySkills = [...state.skillMeasurements]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10 space-y-8">
        {/* =====================================================================
            SUPERADMIN EDITORIAL HEADER BANNER
           ===================================================================== */}
        <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D5] bg-[#F4F1EA] px-3.5 py-1 text-xs font-semibold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#6EE7B7]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B84A27] dark:text-[#F4A261]" />
                SuperAdmin Governance Console • Clinical Administration
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] dark:text-[#F3EFE6]">
                Platform Users, Curriculum CMS, 18-Skill Formula &amp; Database Control
              </h1>
              <p className="font-sans text-sm text-[#78756E] dark:text-[#A8A29E] max-w-3xl leading-relaxed">
                Full read/write authority over learner accounts, 1-click Shadow Learner
                impersonation, live score overrides, curriculum lessons, and the{" "}
                <code className="font-mono text-xs bg-[#F4F1EA] px-1.5 py-0.5 rounded border border-[#E5E0D5] text-[#141413] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#F3EFE6]">
                  Priority = Severity × Frequency × Importance
                </code>{" "}
                engine.
              </p>
            </div>

            {/* Active Impersonated Session Box */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 dark:border-[#2E2D29] dark:bg-[#181816]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78756E] dark:text-[#A8A29E]">
                    Active Shadow Session
                  </span>
                  <span className="rounded bg-[#1B4332]/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#1B4332] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]">
                    {state.profile.role?.toUpperCase() || "LEARNER"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold text-[#141413] dark:text-[#F3EFE6]">
                    {state.profile.name}
                  </span>
                  <span className="rounded-md border border-[#E5E0D5] bg-[#F4F1EA] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#B84A27] dark:border-[#2E2D29] dark:bg-[#141413] dark:text-[#F4A261]">
                    L1: {state.profile.nativeLanguage}
                  </span>
                </div>
                <p className="text-xs text-[#78756E] dark:text-[#A8A29E]">
                  {state.profile.email} • Target:{" "}
                  <span className="font-mono font-semibold text-[#141413] dark:text-[#F3EFE6]">
                    {state.profile.targetAccentId}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => refreshState()}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:border-[#1B4332] hover:text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#6EE7B7] dark:hover:text-[#6EE7B7] transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSaving ? "animate-spin" : ""}`} />
                  Sync Store
                </button>
                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1B4332] px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38] transition"
                >
                  <Settings className="h-3.5 w-3.5" />
                  DSP &amp; Global Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Live Telemetry Summary Strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#E5E0D5] pt-5 sm:grid-cols-4 dark:border-[#2E2D29]">
            <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3.5 dark:border-[#2E2D29] dark:bg-[#181816]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78756E] dark:text-[#A8A29E]">
                Registered Users
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                  {usersList.length}
                </span>
                <span className="text-xs font-medium text-[#1B4332] dark:text-[#6EE7B7]">
                  {usersList.filter((u) => u.role === "superadmin").length} SuperAdmin
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3.5 dark:border-[#2E2D29] dark:bg-[#181816]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78756E] dark:text-[#A8A29E]">
                Published Lessons
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                  {state.lessons.length}
                </span>
                <span className="text-xs font-medium text-[#78756E] dark:text-[#A8A29E]">
                  {state.lessons.reduce((acc, l) => acc + (l.exercises?.length || 0), 0)} Exercises
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3.5 dark:border-[#2E2D29] dark:bg-[#181816]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78756E] dark:text-[#A8A29E]">
                Phonetic Skills Matrix
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                  {state.skills.length}
                </span>
                <span className="font-mono text-xs font-semibold text-[#B84A27] dark:text-[#F4A261]">
                  Top: {topPrioritySkills[0]?.skillName || "American /r/"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-3.5 dark:border-[#2E2D29] dark:bg-[#181816]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78756E] dark:text-[#A8A29E]">
                Stored Recordings
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                  {state.recordings.length}
                </span>
                <span className="font-mono text-xs text-[#1B4332] dark:text-[#6EE7B7]">
                  {state.accents.filter((a) => a.isActive).length}/{state.accents.length} Accents
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Status Toast Banner */}
          {statusMessage && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-[#1B4332]/30 bg-[#1B4332]/10 px-4 py-3 text-xs font-semibold text-[#1B4332] dark:border-[#6EE7B7]/30 dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7] shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-[#1B4332] dark:text-[#6EE7B7] hover:underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* =====================================================================
            4-TAB NAVIGATION BAR (WARM EDITORIAL LIGHT & OBSIDIAN DARK)
           ===================================================================== */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E5E0D5] bg-[#F4F1EA] p-2 dark:border-[#2E2D29] dark:bg-[#181816]">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              activeTab === "users"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#141413] hover:bg-[#FFFFFF] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]"
            }`}
          >
            <Users className="h-4 w-4" />
            1. Users CRUD, Shadow Learner &amp; Score Override ({usersList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lessons")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              activeTab === "lessons"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#141413] hover:bg-[#FFFFFF] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            2. Lessons &amp; Exercises Full CRUD ({state.lessons.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("taxonomy")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              activeTab === "taxonomy"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#141413] hover:bg-[#FFFFFF] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]"
            }`}
          >
            <Sliders className="h-4 w-4" />
            3. 18-Skill Taxonomy &amp; Priority Formula ({state.skills.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              activeTab === "moderation"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#141413] hover:bg-[#FFFFFF] dark:text-[#B8B3A8] dark:hover:bg-[#1E1E1B] dark:hover:text-[#F3EFE6]"
            }`}
          >
            <Database className="h-4 w-4" />
            4. Recordings Moderation &amp; DB Superpowers ({state.recordings.length})
          </button>
        </div>

        {/* =====================================================================
            TAB 1: USERS CRUD + IMPERSONATION ("SHADOW LEARNER") + SCORE OVERRIDE
           ===================================================================== */}
        {activeTab === "users" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column (8 cols): All Users Directory + Inline Edit + Impersonate + Delete */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
                      Platform User Directory &amp; Role Governance
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                      All Registered Learners &amp; SuperAdmins ({usersList.length})
                    </h2>
                  </div>
                  <span className="rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] px-3 py-1 font-mono text-xs font-semibold text-[#141413] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#F3EFE6]">
                    Active Session: {state.profile.name}
                  </span>
                </div>

                <div className="space-y-4">
                  {usersList.map((user) => {
                    const isImpersonated =
                      state.profile.userId === user.id ||
                      state.profile.email.toLowerCase() === user.email.toLowerCase();
                    const isEditingThis = editingUserId === user.id;

                    return (
                      <div
                        key={user.id}
                        className={`rounded-xl border p-4 transition ${
                          isImpersonated
                            ? "border-[#1B4332] bg-[#F4F1EA]/70 dark:border-[#6EE7B7] dark:bg-[rgba(38,92,69,0.25)]"
                            : "border-[#E5E0D5] bg-[#FBF9F5] dark:border-[#2E2D29] dark:bg-[#181816]"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-serif text-base font-bold text-[#141413] dark:text-[#F3EFE6]">
                                {user.name}
                              </span>
                              <span
                                className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold uppercase ${
                                  user.role === "superadmin"
                                    ? "bg-[#B84A27]/15 text-[#B84A27] border border-[#B84A27]/30 dark:bg-[rgba(184,74,39,0.25)] dark:text-[#F4A261] dark:border-[rgba(244,162,97,0.35)]"
                                    : "bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/25 dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7] dark:border-[rgba(110,231,183,0.35)]"
                                }`}
                              >
                                {user.role}
                              </span>
                              <span className="rounded-md border border-[#E5E0D5] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6]">
                                L1: {user.nativeLanguage}
                              </span>
                              <span className="rounded-md border border-[#E5E0D5] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[11px] font-bold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#6EE7B7]">
                                Score: {user.overallScore}/100 (Base: {user.baselineScore})
                              </span>
                              {isImpersonated && (
                                <span className="rounded-md bg-[#1B4332] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]">
                                  Shadowing Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#78756E] dark:text-[#A8A29E]">
                              {user.email} • Level: {user.englishLevel} • Goal: {user.learningGoal}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() =>
                                runAdminAction(
                                  "switch_or_update_user",
                                  {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                    nativeLanguage: user.nativeLanguage,
                                    englishLevel: user.englishLevel,
                                    targetAccentId: user.targetAccentId || "en-US",
                                    learningGoal: user.learningGoal,
                                    dailyPracticeGoalMinutes: user.dailyPracticeGoalMinutes,
                                    streakDays: user.streakDays,
                                    overallScore: user.overallScore,
                                  },
                                  `Now shadowing "${user.name}" (L1: ${user.nativeLanguage}). Priority Engine recalibrated!`
                                )
                              }
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                isImpersonated
                                  ? "border border-[#1B4332] bg-[#1B4332]/10 text-[#1B4332] dark:border-[#6EE7B7] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                                  : "bg-[#1B4332] text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38]"
                              }`}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {isImpersonated ? "Shadowing Now" : "Shadow Learner"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                isEditingThis ? setEditingUserId(null) : startEditingUser(user)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#141413] hover:border-[#B84A27] hover:text-[#B84A27] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#F4A261] dark:hover:text-[#F4A261] transition"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              {isEditingThis ? "Close Edit" : "Edit / Override Score"}
                            </button>

                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() =>
                                runAdminAction(
                                  "delete_user",
                                  { userId: user.id },
                                  `Deleted user "${user.name}" (${user.id}) from store.`
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-2 text-xs font-semibold text-[#B84A27] hover:bg-[#B84A27] hover:text-[#FFFFFF] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F4A261] dark:hover:bg-[#B84A27] dark:hover:text-[#FFFFFF] transition"
                              title="Delete User"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Edit & Score Override Drawer */}
                        {isEditingThis && (
                          <div className="mt-4 border-t border-[#E5E0D5] pt-4 dark:border-[#2E2D29]">
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={editUserDraft.name}
                                  onChange={(e) =>
                                    setEditUserDraft({ ...editUserDraft, name: e.target.value })
                                  }
                                  className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  value={editUserDraft.email}
                                  onChange={(e) =>
                                    setEditUserDraft({ ...editUserDraft, email: e.target.value })
                                  }
                                  className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Platform Role
                                </label>
                                <Select
                                  value={editUserDraft.role}
                                  onValueChange={(val) =>
                                    setEditUserDraft({
                                      ...editUserDraft,
                                      role: val as "learner" | "superadmin",
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="learner">learner</SelectItem>
                                    <SelectItem value="superadmin">superadmin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Native Language (L1)
                                </label>
                                <Select
                                  value={editUserDraft.nativeLanguage}
                                  onValueChange={(val) =>
                                    setEditUserDraft({
                                      ...editUserDraft,
                                      nativeLanguage: val,
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select native language" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Bengali">Bengali</SelectItem>
                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                                    <SelectItem value="Arabic">Arabic</SelectItem>
                                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                                    <SelectItem value="Japanese">Japanese</SelectItem>
                                    <SelectItem value="English">English</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  English Level
                                </label>
                                <Select
                                  value={editUserDraft.englishLevel}
                                  onValueChange={(val) =>
                                    setEditUserDraft({
                                      ...editUserDraft,
                                      englishLevel: val,
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Upper-intermediate">Upper-intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#B84A27] dark:text-[#F4A261] mb-1">
                                  Override Overall Score (0-100)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={editUserDraft.overallScore}
                                  onChange={(e) =>
                                    setEditUserDraft({
                                      ...editUserDraft,
                                      overallScore: Number(e.target.value),
                                    })
                                  }
                                  className="w-full rounded-lg border border-[#B84A27]/40 bg-[#FFFFFF] px-3 py-1.5 font-mono text-xs font-bold text-[#141413] dark:border-[#F4A261]/40 dark:bg-[#161614] dark:text-[#F3EFE6]"
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingUserId(null)}
                                className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#78756E] hover:text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#A8A29E] dark:hover:text-[#F3EFE6]"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                  runAdminAction(
                                    "switch_or_update_user",
                                    {
                                      id: user.id,
                                      ...editUserDraft,
                                    },
                                    `Saved changes & score override (${editUserDraft.overallScore}/100) for ${editUserDraft.name}.`
                                  );
                                  setEditingUserId(null);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-4 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38]"
                              >
                                <Save className="h-3.5 w-3.5" />
                                Save User &amp; Override Score
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Create New User Form */}
            <div className="lg:col-span-4 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAdminAction(
                    "create_user",
                    newUserForm,
                    `Created new ${newUserForm.role} account for ${newUserForm.name}.`
                  );
                  setNewUserForm({
                    ...newUserForm,
                    name: "",
                    email: "",
                  });
                }}
                className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
              >
                <div className="border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
                    Create User Action
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#141413] dark:text-[#F3EFE6] flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-[#B84A27] dark:text-[#F4A261]" />
                    Provision New Account
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Kenji Sato"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3.5 py-2 text-xs text-[#141413] focus:border-[#1B4332] focus:outline-none dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6] dark:focus:border-[#6EE7B7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kenji@accentlab.ai"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3.5 py-2 text-xs text-[#141413] focus:border-[#1B4332] focus:outline-none dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6] dark:focus:border-[#6EE7B7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                      Account Role
                    </label>
                    <Select
                      value={newUserForm.role}
                      onValueChange={(val) =>
                        setNewUserForm({
                          ...newUserForm,
                          role: val as "learner" | "superadmin",
                        })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learner">Learner</SelectItem>
                        <SelectItem value="superadmin">SuperAdmin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                      Native L1
                    </label>
                    <Select
                      value={newUserForm.nativeLanguage}
                      onValueChange={(val) =>
                        setNewUserForm({ ...newUserForm, nativeLanguage: val })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select L1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bengali">Bengali</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Mandarin">Mandarin</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    English Proficiency Level
                  </label>
                  <Select
                    value={newUserForm.englishLevel}
                    onValueChange={(val) =>
                      setNewUserForm({ ...newUserForm, englishLevel: val })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Upper-intermediate">Upper-intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Primary Learning Goal
                  </label>
                  <input
                    type="text"
                    value={newUserForm.learningGoal}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, learningGoal: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3.5 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-4 py-3 text-xs font-bold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38] transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Platform User
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: LESSONS & EXERCISES FULL CRUD TAB
           ===================================================================== */}
        {activeTab === "lessons" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column (5 cols): Create New Lesson Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAdminAction(
                    "create_lesson",
                    lessonForm,
                    `Published new lesson "${lessonForm.title}" with 2 interactive drill steps!`
                  );
                }}
                className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
              >
                <div className="border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
                    Curriculum Authoring Studio
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                    Create New Phonetic Lesson
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Subtitle / Pedagogical Objective
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.subtitle}
                    onChange={(e) => setLessonForm({ ...lessonForm, subtitle: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                      Target Skill
                    </label>
                    <Select
                      value={lessonForm.skillId}
                      onValueChange={(val) => setLessonForm({ ...lessonForm, skillId: val })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {state.skills.map((sk) => (
                          <SelectItem key={sk.id} value={sk.id}>
                            {sk.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                      Difficulty
                    </label>
                    <Select
                      value={lessonForm.difficulty}
                      onValueChange={(val) =>
                        setLessonForm({
                          ...lessonForm,
                          difficulty: val as "Foundation" | "Intermediate" | "Advanced",
                        })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Foundation">Foundation</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                      Est. Minutes
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={lessonForm.estimatedMinutes}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          estimatedMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-2.5 py-2 font-mono text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Articulatory Mouth &amp; Tongue Position Guide
                  </label>
                  <textarea
                    rows={2}
                    value={lessonForm.mouthPosition}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, mouthPosition: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Primary Practice Sentence Prompt
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.promptText}
                    onChange={(e) => setLessonForm({ ...lessonForm, promptText: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Target IPA Transcription
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.targetIpa}
                    onChange={(e) => setLessonForm({ ...lessonForm, targetIpa: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 font-mono text-xs text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#6EE7B7]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-4 py-3 text-xs font-bold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38] transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create &amp; Publish Lesson Module
                </button>
              </form>
            </div>

            {/* Right Column (7 cols): Existing Lessons List + Inline Edit + Delete */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
                      Live Curriculum Repository
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                      Manage Published Lessons ({state.lessons.length})
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {state.lessons.map((lesson) => {
                    const isEditing = editingLessonId === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 space-y-3 dark:border-[#2E2D29] dark:bg-[#181816]"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-[#F4F1EA] border border-[#E5E0D5] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1B4332] dark:bg-[#141413] dark:border-[#2E2D29] dark:text-[#6EE7B7]">
                                Skill: {lesson.skillId}
                              </span>
                              <span className="rounded-md bg-[#FFFFFF] border border-[#E5E0D5] px-2 py-0.5 text-[11px] font-semibold text-[#B84A27] dark:bg-[#1E1E1B] dark:border-[#2E2D29] dark:text-[#F4A261]">
                                {lesson.difficulty}
                              </span>
                              <span className="font-mono text-[11px] text-[#78756E] dark:text-[#A8A29E]">
                                {lesson.estimatedMinutes} mins • {lesson.exercises?.length || 0}{" "}
                                exercises
                              </span>
                            </div>
                            <h3 className="font-serif text-base font-bold text-[#141413] dark:text-[#F3EFE6]">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-[#78756E] dark:text-[#A8A29E]">{lesson.subtitle}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                isEditing ? setEditingLessonId(null) : startEditingLesson(lesson)
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:border-[#1B4332] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#6EE7B7]"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              {isEditing ? "Close" : "Edit"}
                            </button>

                            <Link
                              href={`/lessons/${lesson.id}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#1B4332] hover:bg-[#1B4332] hover:text-[#FFFFFF] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#6EE7B7] dark:hover:bg-[#265C45] dark:hover:text-[#FFFFFF] transition"
                            >
                              Open
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() =>
                                runAdminAction(
                                  "delete_lesson",
                                  { lessonId: lesson.id },
                                  `Deleted lesson "${lesson.title}" from curriculum.`
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-semibold text-[#B84A27] hover:bg-[#B84A27] hover:text-[#FFFFFF] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F4A261] dark:hover:bg-[#B84A27] dark:hover:text-[#FFFFFF] transition"
                              title="Delete Lesson"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Lesson Editor */}
                        {isEditing && (
                          <div className="border-t border-[#E5E0D5] pt-3 space-y-3 dark:border-[#2E2D29]">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Lesson Title
                                </label>
                                <input
                                  type="text"
                                  value={editLessonDraft.title}
                                  onChange={(e) =>
                                    setEditLessonDraft({
                                      ...editLessonDraft,
                                      title: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Subtitle
                                </label>
                                <input
                                  type="text"
                                  value={editLessonDraft.subtitle}
                                  onChange={(e) =>
                                    setEditLessonDraft({
                                      ...editLessonDraft,
                                      subtitle: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                                />
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Difficulty
                                </label>
                                <Select
                                  value={editLessonDraft.difficulty}
                                  onValueChange={(val) =>
                                    setEditLessonDraft({
                                      ...editLessonDraft,
                                      difficulty: val as
                                        | "Foundation"
                                        | "Intermediate"
                                        | "Advanced",
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Difficulty" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Foundation">Foundation</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#78756E] dark:text-[#A8A29E] mb-1">
                                  Estimated Minutes
                                </label>
                                <input
                                  type="number"
                                  min={5}
                                  max={60}
                                  value={editLessonDraft.estimatedMinutes}
                                  onChange={(e) =>
                                    setEditLessonDraft({
                                      ...editLessonDraft,
                                      estimatedMinutes: Number(e.target.value),
                                    })
                                  }
                                  className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 font-mono text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingLessonId(null)}
                                className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#78756E] hover:text-[#141413] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#A8A29E] dark:hover:text-[#F3EFE6]"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                  runAdminAction(
                                    "update_lesson",
                                    {
                                      lessonId: lesson.id,
                                      ...editLessonDraft,
                                    },
                                    `Updated lesson "${editLessonDraft.title}".`
                                  );
                                  setEditingLessonId(null);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-4 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38]"
                              >
                                <Save className="h-3.5 w-3.5" />
                                Save Lesson Updates
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 18-SKILL TAXONOMY & PRIORITY FORMULA FULL CRUD TAB
           ===================================================================== */}
        {activeTab === "taxonomy" && (
          <div className="space-y-8">
            {/* Create New Phonetic Skill Card */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAdminAction(
                  "create_skill",
                  newSkillForm,
                  `Created new phonetic skill "${newSkillForm.name}" (${newSkillForm.ipaSymbols})!`
                );
                setNewSkillForm({
                  ...newSkillForm,
                  name: "",
                });
              }}
              className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#2E2D29] dark:bg-[#1E1E1B]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
                    Phonological Taxonomy Expansion
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                    Create New Phonetic / Prosodic Skill
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dark /l/ Velarization"
                    value={newSkillForm.name}
                    onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Category
                  </label>
                  <Select
                    value={newSkillForm.category}
                    onValueChange={(val) =>
                      setNewSkillForm({
                        ...newSkillForm,
                        category: val as
                          | "pronunciation"
                          | "prosody"
                          | "connected_speech",
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pronunciation">pronunciation</SelectItem>
                      <SelectItem value="prosody">prosody</SelectItem>
                      <SelectItem value="connected_speech">connected_speech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    IPA Symbols
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkillForm.ipaSymbols}
                    onChange={(e) =>
                      setNewSkillForm({ ...newSkillForm, ipaSymbols: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 font-mono text-xs text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#6EE7B7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Importance Weight (0.1-1.0)
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={0.1}
                    max={1.0}
                    value={newSkillForm.importanceWeight}
                    onChange={(e) =>
                      setNewSkillForm({
                        ...newSkillForm,
                        importanceWeight: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 font-mono text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-12 items-end">
                <div className="sm:col-span-9">
                  <label className="block text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] mb-1">
                    Clinical Articulatory Guide
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkillForm.articulatoryGuide}
                    onChange={(e) =>
                      setNewSkillForm({ ...newSkillForm, articulatoryGuide: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] px-3 py-2 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1B4332] px-4 py-2.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38] transition"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Skill to Taxonomy
                  </button>
                </div>
              </div>
            </form>

            {/* Full 18-Skill Matrix Editor */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
                    Live Priority Engine Calibration
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                    Edit Skill Weights, IPA Symbols, Articulatory Guides &amp; Score Overrides (
                    {state.skills.length})
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {state.skills.map((skill) => {
                  const measurement = state.skillMeasurements.find((m) => m.skillId === skill.id);
                  const editState = skillEdits[skill.id] || {
                    name: skill.name,
                    ipaSymbols: skill.ipaSymbols,
                    importanceWeight: skill.importanceWeight,
                    scoreOverride: measurement?.score ?? 70,
                    articulatoryGuide: skill.articulatoryGuide,
                  };

                  return (
                    <div
                      key={skill.id}
                      className="rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 space-y-3 dark:border-[#2E2D29] dark:bg-[#181816]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base font-bold text-[#141413] dark:text-[#F3EFE6]">
                              {skill.name}
                            </span>
                            <span className="rounded border border-[#E5E0D5] bg-[#F4F1EA] px-2 py-0.5 font-mono text-xs font-bold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#141413] dark:text-[#6EE7B7]">
                              {skill.ipaSymbols}
                            </span>
                          </div>
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78756E] dark:text-[#A8A29E]">
                            Category: {skill.category} • Priority Score:{" "}
                            <strong className="font-mono text-[#B84A27] dark:text-[#F4A261]">
                              {measurement?.priorityScore ?? 0.25}
                            </strong>
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() =>
                            runAdminAction(
                              "delete_skill",
                              { skillId: skill.id },
                              `Deleted skill "${skill.name}" (${skill.id}).`
                            )
                          }
                          className="rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] p-1.5 text-[#B84A27] hover:bg-[#B84A27] hover:text-[#FFFFFF] dark:border-[#2E2D29] dark:bg-[#1E1E1B] dark:text-[#F4A261] dark:hover:bg-[#B84A27] dark:hover:text-[#FFFFFF] transition"
                          title="Delete Skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#78756E] dark:text-[#A8A29E] mb-1">
                            IPA Symbols
                          </label>
                          <input
                            type="text"
                            value={editState.ipaSymbols}
                            onChange={(e) =>
                              setSkillEdits({
                                ...skillEdits,
                                [skill.id]: { ...editState, ipaSymbols: e.target.value },
                              })
                            }
                            className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-1.5 font-mono text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] dark:text-[#6EE7B7] mb-1">
                            Importance (0-1)
                          </label>
                          <input
                            type="number"
                            step={0.01}
                            min={0.1}
                            max={1.0}
                            value={editState.importanceWeight}
                            onChange={(e) =>
                              setSkillEdits({
                                ...skillEdits,
                                [skill.id]: {
                                  ...editState,
                                  importanceWeight: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-1.5 font-mono text-xs font-bold text-[#1B4332] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#6EE7B7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#B84A27] dark:text-[#F4A261] mb-1">
                            Score Override
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editState.scoreOverride}
                            onChange={(e) =>
                              setSkillEdits({
                                ...skillEdits,
                                [skill.id]: {
                                  ...editState,
                                  scoreOverride: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full rounded-lg border border-[#B84A27]/40 bg-[#FFFFFF] px-2.5 py-1.5 font-mono text-xs font-bold text-[#B84A27] dark:border-[#F4A261]/40 dark:bg-[#161614] dark:text-[#F4A261]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#78756E] dark:text-[#A8A29E] mb-1">
                          Articulatory Guide
                        </label>
                        <input
                          type="text"
                          value={editState.articulatoryGuide}
                          onChange={(e) =>
                            setSkillEdits({
                              ...skillEdits,
                              [skill.id]: { ...editState, articulatoryGuide: e.target.value },
                            })
                          }
                          className="w-full rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-2.5 py-1.5 text-xs text-[#141413] dark:border-[#2E2D29] dark:bg-[#161614] dark:text-[#F3EFE6]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() =>
                            runAdminAction(
                              "update_skill",
                              {
                                skillId: skill.id,
                                name: editState.name,
                                ipaSymbols: editState.ipaSymbols,
                                importanceWeight: editState.importanceWeight,
                                scoreOverride: editState.scoreOverride,
                                articulatoryGuide: editState.articulatoryGuide,
                              },
                              `Updated skill "${skill.name}" (Weight: ${editState.importanceWeight}, Score: ${editState.scoreOverride}) & recalculated Priority queue.`
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#133024] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1f4a38] transition"
                        >
                          <Save className="h-3.5 w-3.5" />
                          Update Skill &amp; Recalculate Priority
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: RECORDINGS MODERATION, TARGET VARIETIES & FACTORY RESET
           ===================================================================== */}
        {activeTab === "moderation" && (
          <div className="space-y-8">
            {/* Section A: Recordings Moderation Table */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84A27] dark:text-[#F4A261]">
                    Acoustic Attempt Moderation
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                    Stored Learner Recordings &amp; Telemetry Logs ({state.recordings.length})
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {state.recordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex flex-col gap-4 rounded-xl border border-[#E5E0D5] bg-[#FBF9F5] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#2E2D29] dark:bg-[#181816]"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-sm font-bold text-[#141413] dark:text-[#F3EFE6]">
                          {rec.skillName}
                        </span>
                        <span className="rounded border border-[#E5E0D5] bg-[#F4F1EA] px-2 py-0.5 font-mono text-[11px] font-bold text-[#1B4332] dark:border-[rgba(110,231,183,0.35)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]">
                          Score: {rec.overallScore}/100
                        </span>
                        <span className="font-mono text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                          F3: {rec.telemetry.f3EstimatedHz} Hz • nPVI: {rec.telemetry.nPviRhythm} •{" "}
                          {rec.durationSeconds}s
                        </span>
                        <span className="text-[11px] text-[#78756E] dark:text-[#9E9A90]">• {rec.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#78756E] dark:text-[#9E9A90] line-clamp-1">
                        Prompt: &ldquo;{rec.promptText}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => speakReference(rec.promptText, 0.95)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E5E0D5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:border-[#1B4332] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#6EE7B7] transition"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" />
                        Play Reference
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          runAdminAction(
                            "delete_recording",
                            { recordingId: rec.id },
                            `Deleted recording "${rec.id}" (${rec.skillName}).`
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#B84A27]/40 bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#B84A27] hover:bg-[#B84A27] hover:text-[#FFFFFF] dark:border-[rgba(244,162,97,0.35)] dark:bg-[#1E1E1B] dark:text-[#F4A261] dark:hover:bg-[#B84A27] dark:hover:text-[#FFFFFF] transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Recording
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Target English Varieties Manager (en-US, en-GB, en-AU, en-CA, en-IE) */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
              <div className="border-b border-[#E5E0D5] pb-4 dark:border-[#2E2D29]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] dark:text-[#6EE7B7]">
                  Target English Varieties Governance
                </span>
                <h2 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                  Toggle Active Target Accents (en-US, en-GB, en-AU, en-CA, en-IE)
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {state.accents.map((acc) => (
                  <div
                    key={acc.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between gap-4 ${
                      acc.isActive
                        ? "border-[#1B4332] bg-[#F4F1EA]/60 dark:border-[rgba(110,231,183,0.35)] dark:bg-[rgba(38,92,69,0.25)]"
                        : "border-[#E5E0D5] bg-[#FBF9F5] dark:border-[#2E2D29] dark:bg-[#181816]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#B84A27] dark:text-[#F4A261]">{acc.id}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            acc.isActive
                              ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                              : "bg-[#E5E0D5] text-[#78756E] dark:bg-[#2E2D29] dark:text-[#9E9A90]"
                          }`}
                        >
                          {acc.isActive ? "Active" : "Locked"}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-bold text-[#141413] dark:text-[#F3EFE6]">{acc.name}</h3>
                      <p className="text-[11px] text-[#78756E] dark:text-[#B8B3A8] leading-relaxed">
                        {acc.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        runAdminAction(
                          "toggle_accent",
                          { accentId: acc.id },
                          `Toggled ${acc.name} (${acc.id}) availability status.`
                        )
                      }
                      className={`w-full rounded-lg px-3 py-2 text-xs font-bold transition ${
                        acc.isActive
                          ? "border border-[#E5E0D5] bg-[#FFFFFF] text-[#141413] hover:border-[#B84A27] dark:border-[#35332E] dark:bg-[#1E1E1B] dark:text-[#F3EFE6] dark:hover:border-[#F4A261]"
                          : "bg-[#1B4332] text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1E4A37]"
                      }`}
                    >
                      {acc.isActive ? "Disable Variety" : "Enable Variety"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: SuperAdmin Clean Seed Restoration & Global Settings Link */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[#B84A27]/40 bg-[#FFFFFF] p-6 space-y-4 dark:border-[rgba(244,162,97,0.35)] dark:bg-[#1E1E1B]">
                <div className="flex items-center gap-2 text-[#B84A27] dark:text-[#F4A261]">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Administrative Reset • Clean Seed Restoration
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                  Clinical Baseline State Restoration
                </h3>
                <p className="text-xs text-[#78756E] dark:text-[#B8B3A8] leading-relaxed">
                  Restores the platform database to its pristine clinical baseline state (core
                  accounts, 18 phonetic skills, 6 structured lessons, and initial acoustic calibration benchmarks).
                </p>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    runAdminAction(
                      "factory_reset_database",
                      {},
                      "Reset complete! Database restored to clean clinical seed state."
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#B84A27] px-5 py-3 text-xs font-bold text-[#FFFFFF] hover:bg-[#963B1E] dark:bg-[#B84A27] dark:text-[#FFFFFF] dark:hover:bg-[#963B1E] transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  Execute Baseline Reset
                </button>
              </div>

              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FFFFFF] p-6 space-y-4 flex flex-col justify-between dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1B4332] dark:text-[#6EE7B7]">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Global Platform &amp; Acoustic DSP Thresholds
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#141413] dark:text-[#F3EFE6]">
                    Configure Speech Coaching &amp; Thresholds
                  </h3>
                  <p className="text-xs text-[#78756E] dark:text-[#B8B3A8] leading-relaxed">
                    Adjust AI speech coaching engine configuration, American /r/ F3 target
                    ceiling Hz, nPVI stress-timing floor, and global maintenance controls.
                  </p>
                </div>

                <div>
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-3 text-xs font-bold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:text-[#FFFFFF] dark:hover:bg-[#1E4A37] transition"
                  >
                    <Settings className="h-4 w-4" />
                    Open Global Platform &amp; DSP Settings (/settings)
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
