"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  GraduationCap,
  Sliders,
  Target,
} from "lucide-react";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label } from "@/components/ui/primitives";

const NATIVE_LANGUAGES = [
  "Bengali",
  "Hindi",
  "Spanish",
  "Arabic",
  "Mandarin",
  "Portuguese",
  "Japanese",
  "Korean",
  "Russian",
  "French",
  "Vietnamese",
  "Turkish",
];

const ENGLISH_LEVELS = [
  "Beginner",
  "Intermediate",
  "Upper-intermediate",
  "Advanced",
];

const LEARNING_GOALS = [
  "Professional communication & global teams",
  "Job interviews & executive presentations",
  "Academic & study abroad environments",
  "Content creation & public speaking",
  "Everyday conversational naturalness",
];

const PRACTICE_GOALS = [10, 20, 30, 45];

export default function OnboardingPage() {
  const router = useRouter();
  const { state, authUser, updateOnboarding } = useAccentLab();

  const [name, setName] = useState(authUser.name || "");
  const [nativeLanguage, setNativeLanguage] = useState("Bengali");
  const [englishLevel, setEnglishLevel] = useState("Upper-intermediate");
  const [targetAccentId, setTargetAccentId] = useState("en-US");
  const [learningGoal, setLearningGoal] = useState(
    "Professional communication & global teams"
  );
  const [dailyPracticeGoalMinutes, setDailyPracticeGoalMinutes] = useState(20);
  const [savedToast, setSavedToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (state?.profile) {
      setName(authUser.name || state.profile.name || "");
      setNativeLanguage(state.profile.nativeLanguage || "Bengali");
      setEnglishLevel(state.profile.englishLevel || "Upper-intermediate");
      setTargetAccentId(state.profile.targetAccentId || "en-US");
      setLearningGoal(
        state.profile.learningGoal ||
          "Professional communication & global teams"
      );
      setDailyPracticeGoalMinutes(
        state.profile.dailyPracticeGoalMinutes || 20
      );
    }
  }, [state, authUser.name]);

  const userInState = authUser.email
    ? state?.users.find((u) => u.email.toLowerCase() === authUser.email.toLowerCase())
    : null;

  const hasCompleted = Boolean(
    authUser.role === "superadmin" ||
    state?.profile?.role === "superadmin" ||
    userInState?.role === "superadmin" ||
    authUser.email?.toLowerCase() === "admin@accentlab.ai" ||
    authUser.onboardingCompleted ||
    state?.profile?.onboardingCompleted ||
    userInState?.onboardingCompleted
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateOnboarding({
        name,
        nativeLanguage,
        englishLevel,
        targetAccentId,
        learningGoal,
        dailyPracticeGoalMinutes,
      });
      setSavedToast(true);
      setTimeout(() => {
        router.replace("/dashboard");
      }, 500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
          Personalize your learning plan
        </h1>
        <p className="mt-2 text-sm text-[#4A4842] dark:text-[#B8B3A8] leading-relaxed">
          Tell us about your language background and speaking goals so we can
          tailor your daily pronunciation and fluency practice.
        </p>
      </div>

      <Card className="border-[#E5E0D5] bg-white dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
        <CardHeader className="border-b border-[#E5E0D5] pb-5 dark:border-[#2E2D29]">
          <CardTitle className="text-xl">
            Language & Practice Preferences
          </CardTitle>
          <CardDescription>
            You can update these preferences anytime from your settings.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Learner Name */}
            <div>
              <Label htmlFor="onboarding-name">Full Name</Label>
              <Input
                id="onboarding-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="mt-1.5"
              />
            </div>

            {/* 1. Native Language (L1) */}
            <fieldset>
              <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-2.5">
                <Globe2 className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                1. Native Language (L1 Phonetic Transfer Baseline)
              </legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {NATIVE_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    aria-pressed={nativeLanguage === lang}
                    onClick={() => setNativeLanguage(lang)}
                    className={`rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors text-left flex items-center justify-between ${
                      nativeLanguage === lang
                        ? "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] dark:border-[rgba(110,231,183,0.4)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                        : "border-[#E5E0D5] bg-[#FBF9F5] text-[#4A4842] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8] dark:hover:border-[#35332E] dark:hover:text-[#F3EFE6]"
                    }`}
                  >
                    <span>{lang}</span>
                    {nativeLanguage === lang && (
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 2. Current Spoken English Level */}
            <fieldset>
              <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-2.5">
                <GraduationCap
                  className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]"
                  aria-hidden="true"
                />
                2. Current Spoken English Level
              </legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {ENGLISH_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    aria-pressed={englishLevel === lvl}
                    onClick={() => setEnglishLevel(lvl)}
                    className={`rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                      englishLevel === lvl
                        ? "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] dark:border-[rgba(110,231,183,0.4)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                        : "border-[#E5E0D5] bg-[#FBF9F5] text-[#4A4842] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8] dark:hover:border-[#35332E] dark:hover:text-[#F3EFE6]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 3. Configurable Target Accent */}
            <fieldset>
              <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-2.5">
                <Target className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                3. Target English Variety
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(state?.accents || []).map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={!acc.isActive}
                    aria-pressed={targetAccentId === acc.id}
                    onClick={() => acc.isActive && setTargetAccentId(acc.id)}
                    className={`rounded-lg border p-3.5 text-left transition-colors ${
                      targetAccentId === acc.id
                        ? "border-[#1B4332] bg-[#E9F2EE] dark:border-[rgba(110,231,183,0.4)] dark:bg-[rgba(38,92,69,0.35)]"
                        : acc.isActive
                        ? "border-[#E5E0D5] bg-[#FBF9F5] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#181816] dark:hover:border-[#35332E]"
                        : "border-[#E5E0D5] bg-[#F4F1EA] opacity-60 cursor-not-allowed dark:border-[#2E2D29] dark:bg-[#161614]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#141413] dark:text-[#F3EFE6]">
                        {acc.name} ({acc.id})
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
                          acc.isActive
                            ? "bg-white text-[#1B4332] border-[#1B4332] dark:bg-[#1E1E1B] dark:text-[#6EE7B7] dark:border-[rgba(110,231,183,0.4)]"
                            : "bg-[#FBF9F5] text-[#78756E] border-[#D2CBB8] dark:bg-[#181816] dark:text-[#8A857A] dark:border-[#35332E]"
                        }`}
                      >
                        {acc.isActive ? "Active" : "Optional"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#4A4842] dark:text-[#B8B3A8] leading-snug">
                      {acc.description}
                    </p>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 4. Primary Learning Goal */}
            <fieldset>
              <legend className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-2.5">
                4. Primary Spoken-English Goal
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {LEARNING_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    aria-pressed={learningGoal === goal}
                    onClick={() => setLearningGoal(goal)}
                    className={`rounded-lg border px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                      learningGoal === goal
                        ? "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] font-semibold dark:border-[rgba(110,231,183,0.4)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                        : "border-[#E5E0D5] bg-[#FBF9F5] text-[#4A4842] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8] dark:hover:border-[#35332E] dark:hover:text-[#F3EFE6]"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 5. Daily Practice Goal */}
            <fieldset>
              <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-2.5">
                <Clock className="h-3.5 w-3.5 text-[#1B4332] dark:text-[#6EE7B7]" aria-hidden="true" />
                5. Daily Practice Commitment (Minutes / Day)
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRACTICE_GOALS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    aria-pressed={dailyPracticeGoalMinutes === mins}
                    onClick={() => setDailyPracticeGoalMinutes(mins)}
                    className={`rounded-lg border py-3 text-center text-xs font-bold transition-colors ${
                      dailyPracticeGoalMinutes === mins
                        ? "border-[#1B4332] bg-[#E9F2EE] text-[#1B4332] dark:border-[rgba(110,231,183,0.4)] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]"
                        : "border-[#E5E0D5] bg-[#FBF9F5] text-[#4A4842] hover:border-[#D2CBB8] dark:border-[#2E2D29] dark:bg-[#181816] dark:text-[#B8B3A8] dark:hover:border-[#35332E] dark:hover:text-[#F3EFE6]"
                    }`}
                  >
                    {mins === 45 ? "45+ mins" : `${mins} mins / day`}
                  </button>
                ))}
              </div>
            </fieldset>

            {savedToast && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg border border-[#1B4332] bg-[#E9F2EE] p-3 text-xs font-semibold text-[#1B4332] dark:border-[#6EE7B7]/40 dark:bg-[#265C45]/35 dark:text-[#6EE7B7] flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                {hasCompleted
                  ? "Language profile updated successfully. Returning to dashboard..."
                  : "Preferences saved. Redirecting to your dashboard..."}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-[#E5E0D5] pt-5 dark:border-[#2E2D29]">
              <Button type="submit" size="lg" isLoading={submitting}>
                {hasCompleted ? "Save Language Profile" : "Save Profile & Continue to Dashboard"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
