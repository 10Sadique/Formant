"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Crown,
  Globe2,
  Mic,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Sliders,
  User,
  Volume2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccentLab } from "@/components/providers/AccentLabProvider";
import { Input } from "@/components/ui/primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  settingsProfileSchema,
  type SettingsProfileValues,
} from "@/lib/validations/forms";

const NATIVE_LANGUAGES = [
  "Bengali",
  "Hindi",
  "Spanish",
  "Arabic",
  "Mandarin",
  "Portuguese",
  "Japanese",
  "Korean",
  "English",
];

const ENGLISH_LEVELS = ["Beginner", "Intermediate", "Upper-intermediate", "Advanced"];

export default function SettingsPage() {
  const { state, authUser, theme, setThemeMode, updateOnboarding, refreshState } =
    useAccentLab();
  const isSuperAdmin = authUser.role === "superadmin";

  const form = useForm<SettingsProfileValues>({
    resolver: zodResolver(settingsProfileSchema),
    defaultValues: {
      name: "Aarav Rahman",
      email: "aarav@accentlab.ai",
      nativeLanguage: "Bengali",
      englishLevel: "Upper-intermediate",
      dailyPracticeMinutesGoal: 20,
    },
  });

  // 1. Normal User Profile & Account State
  const [targetAccentId, setTargetAccentId] = useState("en-US");
  const [learningGoal, setLearningGoal] = useState("Professional communication");

  // 2. Normal User Audio & Practice Preferences
  const [defaultPlaybackSpeed, setDefaultPlaybackSpeed] = useState(0.96);
  const [defaultFeedbackMode, setDefaultFeedbackMode] = useState<"simple" | "detailed">("simple");
  const [autoPlayReferenceAudio, setAutoPlayReferenceAudio] = useState(false);
  const [micNoiseGateSensitivity, setMicNoiseGateSensitivity] = useState<
    "low" | "balanced" | "strict"
  >("balanced");
  const [showIpaUnderlines, setShowIpaUnderlines] = useState(true);
  const [showFormantOverlays, setShowFormantOverlays] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(true);
  const [weeklyReassessmentDay, setWeeklyReassessmentDay] = useState("Monday");

  // 3. SuperAdmin Global Platform Settings (Visible & Editable ONLY when role === "superadmin")
  const [platformName, setPlatformName] = useState("Formant Studio");
  const [activeGeminiModel, setActiveGeminiModel] = useState<"gemini-2.5-pro" | "gemini-2.0-flash">(
    "gemini-2.5-pro"
  );
  const [coachStrictness, setCoachStrictness] = useState<
    "encouraging" | "clinical_balanced" | "strict_phonetician"
  >("clinical_balanced");
  const [targetAmericanRF3CeilingHz, setTargetAmericanRF3CeilingHz] = useState(1950);
  const [targetStressRhythmNpviFloor, setTargetStressRhythmNpviFloor] = useState(54);
  const [allowPublicRegistration, setAllowPublicRegistration] = useState(true);
  const [requireBaselineBeforeLessons, setRequireBaselineBeforeLessons] = useState(false);
  const [unlockAllAccentsForLearners, setUnlockAllAccentsForLearners] = useState(false);
  const [maintenanceBannerMessage, setMaintenanceBannerMessage] = useState("");

  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!state) return;
    const validLevel = (
      ["Beginner", "Intermediate", "Upper-intermediate", "Advanced"].includes(
        state.profile.englishLevel
      )
        ? state.profile.englishLevel
        : "Intermediate"
    ) as SettingsProfileValues["englishLevel"];

    form.reset({
      name: state.profile.name,
      email: state.profile.email,
      nativeLanguage: state.profile.nativeLanguage,
      englishLevel: validLevel,
      dailyPracticeMinutesGoal: state.profile.dailyPracticeGoalMinutes,
    });
    setTargetAccentId(state.profile.targetAccentId);
    setLearningGoal(state.profile.learningGoal);

    if (state.userSettings) {
      setDefaultPlaybackSpeed(state.userSettings.defaultPlaybackSpeed);
      setDefaultFeedbackMode(state.userSettings.defaultFeedbackMode);
      setAutoPlayReferenceAudio(state.userSettings.autoPlayReferenceAudio);
      setMicNoiseGateSensitivity(state.userSettings.micNoiseGateSensitivity);
      setShowIpaUnderlines(state.userSettings.showIpaUnderlines);
      setShowFormantOverlays(state.userSettings.showFormantOverlays);
      setDailyReminderEnabled(state.userSettings.dailyReminderEnabled);
      setWeeklyReassessmentDay(state.userSettings.weeklyReassessmentDay);
    }

    if (state.globalSettings) {
      setPlatformName(state.globalSettings.platformName);
      setActiveGeminiModel(state.globalSettings.activeGeminiModel);
      setCoachStrictness(state.globalSettings.coachStrictness);
      setTargetAmericanRF3CeilingHz(state.globalSettings.targetAmericanRF3CeilingHz);
      setTargetStressRhythmNpviFloor(state.globalSettings.targetStressRhythmNpviFloor);
      setAllowPublicRegistration(state.globalSettings.allowPublicRegistration);
      setRequireBaselineBeforeLessons(state.globalSettings.requireBaselineBeforeLessons);
      setUnlockAllAccentsForLearners(state.globalSettings.unlockAllAccentsForLearners);
      setMaintenanceBannerMessage(state.globalSettings.maintenanceBannerMessage);
    }
  }, [state, form]);

  const handleSaveAllSettings = async (values: SettingsProfileValues) => {
    // 1. Save User Profile
    await updateOnboarding({
      name: values.name,
      nativeLanguage: values.nativeLanguage,
      englishLevel: values.englishLevel,
      targetAccentId,
      learningGoal,
      dailyPracticeGoalMinutes: values.dailyPracticeMinutesGoal,
    });

    // 2. Save Normal User Audio/Coaching Settings
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_user_settings",
        payload: {
          defaultPlaybackSpeed,
          defaultFeedbackMode,
          autoPlayReferenceAudio,
          micNoiseGateSensitivity,
          showIpaUnderlines,
          showFormantOverlays,
          dailyReminderEnabled,
          weeklyReassessmentDay,
        },
      }),
    });

    // 3. If SuperAdmin, also save Global Platform Settings
    if (isSuperAdmin) {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_global_settings",
          payload: {
            platformName,
            activeGeminiModel,
            coachStrictness,
            targetAmericanRF3CeilingHz: Number(targetAmericanRF3CeilingHz),
            targetStressRhythmNpviFloor: Number(targetStressRhythmNpviFloor),
            allowPublicRegistration,
            requireBaselineBeforeLessons,
            unlockAllAccentsForLearners,
            maintenanceBannerMessage,
          },
        }),
      });
    }

    await refreshState();
    setSaveBanner(
      isSuperAdmin
        ? "Saved Personal User Preferences + Global Platform & DSP Threshold Settings!"
        : "Saved your Account, L1 Calibration & Audio Practice Preferences!"
    );
    setTimeout(() => setSaveBanner(null), 4000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 text-[#141413] dark:text-[#F3EFE6]">
      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-5 dark:border-[#2E2D29]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#D2CBB8] bg-[#F4F1EA] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase text-[#1B4332] dark:border-[#35332E] dark:bg-[#181816] dark:text-[#6EE7B7]">
            <Settings className="h-3.5 w-3.5" />
            {isSuperAdmin ? "SuperAdmin Global + Personal Settings" : "Learner Account Settings"}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
            {isSuperAdmin
              ? "Global Platform Governance & Personal Settings"
              : "Personal Profile & Practice Preferences"}
          </h1>
          <p className="mt-1 text-sm text-[#4A4842] dark:text-[#B8B3A8]">
            {isSuperAdmin
              ? "As SuperAdmin, you have access to all standard learner preferences plus global AI model, acoustic DSP threshold, and feature-flag controls."
              : "Manage your Native Language (L1) calibration, audio recording preferences, and coaching display mode."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#D2CBB8] bg-white p-1.5 dark:border-[#35332E] dark:bg-[#1E1E1B]">
          <button
            type="button"
            onClick={() => setThemeMode("light")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              theme === "light"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#4A4842] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
            }`}
          >
            Off-White Light
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("dark")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              theme === "dark"
                ? "bg-[#1B4332] text-[#FFFFFF] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                : "text-[#4A4842] hover:text-[#141413] dark:text-[#B8B3A8] dark:hover:text-[#F3EFE6]"
            }`}
          >
            Obsidian Dark
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#1B4332]/30 bg-[#E9F2EE] p-4 text-xs font-semibold text-[#1B4332] dark:border-[#265C45] dark:bg-[rgba(38,92,69,0.35)] dark:text-[#6EE7B7]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{saveBanner}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveAllSettings)} noValidate className="space-y-8">
          {/* SECTION 1: Personal Profile & L1 Calibration (All Users) */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 sm:p-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
            <div className="mb-5 flex items-center gap-2 border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
              <User className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />
              <h2 className="font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                1. Personal Profile &amp; L1 Transfer Baseline
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8]">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nativeLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8]">
                      Native Language
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Native Language">
                          <SelectValue placeholder="Select native language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NATIVE_LANGUAGES.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="englishLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8]">
                      Spoken English Level
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Spoken English Level">
                          <SelectValue placeholder="Select English level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ENGLISH_LEVELS.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                  Target English Variety
                </label>
                <Select
                  value={targetAccentId}
                  onValueChange={(val) => setTargetAccentId(val)}
                >
                  <SelectTrigger aria-label="Target English Variety">
                    <SelectValue placeholder="Select target variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {(state?.accents || []).map((acc) => (
                      <SelectItem
                        key={acc.id}
                        value={acc.id}
                        disabled={!acc.isActive && !isSuperAdmin}
                      >
                        {acc.name} ({acc.id}) {!acc.isActive ? "[Admin Locked]" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="dailyPracticeMinutesGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8]">
                      Daily Practice Target (Minutes / Day)
                    </FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Daily Practice Target">
                          <SelectValue placeholder="Select daily target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[10, 20, 30, 45].map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m} minutes / day
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        </div>

        {/* SECTION 2: Audio Studio, Microphone & Coaching Preferences (All Users) */}
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 sm:p-8 dark:border-[#2E2D29] dark:bg-[#1E1E1B]">
          <div className="mb-5 flex items-center gap-2 border-b border-[#E5E0D5] pb-3 dark:border-[#2E2D29]">
            <Volume2 className="h-4 w-4 text-[#1B4332] dark:text-[#6EE7B7]" />
            <h2 className="font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
              2. Audio Capture, IPA Display &amp; Coaching Preferences
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                Default Feedback Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["simple", "detailed"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDefaultFeedbackMode(m)}
                    className={`rounded-xl border py-2.5 text-xs font-semibold capitalize transition ${
                      defaultFeedbackMode === m
                        ? "border-[#1B4332] bg-[#1B4332] text-[#FFFFFF] dark:border-[#265C45] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                        : "border-[#D2CBB8] bg-[#FBF9F5] text-[#4A4842] hover:border-[#1B4332]/50 dark:border-[#35332E] dark:bg-[#161614] dark:text-[#B8B3A8] dark:hover:border-[#6EE7B7]/50"
                    }`}
                  >
                    {m} Mode
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                Default Reference Speaker Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 1.0, label: "1.0x Normal" },
                  { val: 0.88, label: "0.88x Clear" },
                  { val: 0.75, label: "0.75x Slow" },
                ].map((spd) => (
                  <button
                    key={spd.val}
                    type="button"
                    onClick={() => setDefaultPlaybackSpeed(spd.val)}
                    className={`rounded-xl border py-2.5 text-xs font-semibold transition ${
                      defaultPlaybackSpeed === spd.val
                        ? "border-[#1B4332] bg-[#1B4332] text-[#FFFFFF] dark:border-[#265C45] dark:bg-[#265C45] dark:text-[#FFFFFF]"
                        : "border-[#D2CBB8] bg-[#FBF9F5] text-[#4A4842] hover:border-[#1B4332]/50 dark:border-[#35332E] dark:bg-[#161614] dark:text-[#B8B3A8] dark:hover:border-[#6EE7B7]/50"
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                Microphone Noise Gate Sensitivity
              </label>
              <Select
                value={micNoiseGateSensitivity}
                onValueChange={(val) =>
                  setMicNoiseGateSensitivity(val as "low" | "balanced" | "strict")
                }
              >
                <SelectTrigger aria-label="Microphone Noise Gate Sensitivity">
                  <SelectValue placeholder="Select sensitivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Quiet Studio Environment)</SelectItem>
                  <SelectItem value="balanced">Balanced (Recommended Home/Office)</SelectItem>
                  <SelectItem value="strict">Strict (Filter Background Fan/Street Noise)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                Weekly Reassessment Reminder Day
              </label>
              <Select
                value={weeklyReassessmentDay}
                onValueChange={(val) => setWeeklyReassessmentDay(val)}
              >
                <SelectTrigger aria-label="Weekly Reassessment Reminder Day">
                  <SelectValue placeholder="Select reminder day" />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                    (d) => (
                      <SelectItem key={d} value={d}>
                        Every {d}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 border-t border-[#EFECE4] pt-5 dark:border-[#2E2D29]">
            <label className="flex items-center gap-2.5 text-xs font-medium text-[#141413] dark:text-[#F3EFE6] cursor-pointer">
              <input
                type="checkbox"
                checked={showIpaUnderlines}
                onChange={(e) => setShowIpaUnderlines(e.target.checked)}
                className="h-4 w-4 accent-[#1B4332]"
              />
              <span>Display Phonetic Transcriptions (IPA)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium text-[#141413] dark:text-[#F3EFE6] cursor-pointer">
              <input
                type="checkbox"
                checked={showFormantOverlays}
                onChange={(e) => setShowFormantOverlays(e.target.checked)}
                className="h-4 w-4 accent-[#1B4332]"
              />
              <span>Show Acoustic Formant Telemetry</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium text-[#141413] dark:text-[#F3EFE6] cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlayReferenceAudio}
                onChange={(e) => setAutoPlayReferenceAudio(e.target.checked)}
                className="h-4 w-4 accent-[#1B4332]"
              />
              <span>Auto-Play Reference Speaker on Step Load</span>
            </label>
          </div>
        </div>

        {/* SECTION 3: SuperAdmin Exclusive Global Platform Settings */}
        {isSuperAdmin && (
          <div className="rounded-2xl border-2 border-[#9A5B13]/40 bg-[#FBF4E6]/40 p-6 sm:p-8 dark:border-[rgba(244,162,97,0.35)] dark:bg-[rgba(184,74,39,0.15)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#D2CBB8] pb-3 dark:border-[#2E2D29]">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#9A5B13] dark:text-[#F4A261]" />
                <h2 className="font-serif text-xl font-semibold text-[#141413] dark:text-[#F3EFE6]">
                  3. Global Platform Settings
                </h2>
              </div>
              <span className="rounded-md bg-[#9A5B13] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF] dark:bg-[#B84A27] dark:text-[#FFFFFF]">
                SuperAdmin Exclusive
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                  Speech Coaching Analysis Depth
                </label>
                <Select
                  value={activeGeminiModel}
                  onValueChange={(val) =>
                    setActiveGeminiModel(val as "gemini-2.5-pro" | "gemini-2.0-flash")
                  }
                >
                  <SelectTrigger aria-label="Speech Coaching Analysis Depth">
                    <SelectValue placeholder="Select coaching mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-2.5-pro">
                      Deep Clinical Phonetics (High Precision)
                    </SelectItem>
                    <SelectItem value="gemini-2.0-flash">
                      Fast Conversational Coaching (Low Latency)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                  Global Coaching Strictness
                </label>
                <Select
                  value={coachStrictness}
                  onValueChange={(val) =>
                    setCoachStrictness(
                      val as "encouraging" | "clinical_balanced" | "strict_phonetician"
                    )
                  }
                >
                  <SelectTrigger aria-label="Global Coaching Strictness">
                    <SelectValue placeholder="Select strictness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encouraging">Encouraging &amp; Supportive</SelectItem>
                    <SelectItem value="clinical_balanced">Clinical Balanced (Recommended)</SelectItem>
                    <SelectItem value="strict_phonetician">
                      Strict Phonetician (Exact Formant &amp; Flap-T Grading)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                  Global American /r/ F3 Target Threshold (Hz)
                </label>
                <input
                  type="number"
                  min={1700}
                  max={2200}
                  value={targetAmericanRF3CeilingHz}
                  onChange={(e) => setTargetAmericanRF3CeilingHz(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#D2CBB8] bg-white px-3.5 py-2.5 font-mono text-sm text-[#141413] dark:border-[#35332E] dark:bg-[#161614] dark:text-[#F3EFE6]"
                />
                <p className="mt-1 text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                  F3 frequencies below this Hz value receive maximum rhoticity credit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                  Global Stress-Timed Rhythm nPVI Target Floor
                </label>
                <input
                  type="number"
                  min={40}
                  max={68}
                  value={targetStressRhythmNpviFloor}
                  onChange={(e) => setTargetStressRhythmNpviFloor(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#D2CBB8] bg-white px-3.5 py-2.5 font-mono text-sm text-[#141413] dark:border-[#35332E] dark:bg-[#161614] dark:text-[#F3EFE6]"
                />
                <p className="mt-1 text-[11px] text-[#78756E] dark:text-[#9E9A90]">
                  General American benchmark is 54–65 (syllable-timed L1s average 38–44).
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4842] dark:text-[#B8B3A8] mb-1.5">
                  Global Announcement / Maintenance Banner (Leave blank to hide)
                </label>
                <input
                  type="text"
                  placeholder="e.g. New General British (en-GB) & Australian (en-AU) diagnostic modules are now live!"
                  value={maintenanceBannerMessage}
                  onChange={(e) => setMaintenanceBannerMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#D2CBB8] bg-white px-3.5 py-2.5 text-sm text-[#141413] dark:border-[#35332E] dark:bg-[#161614] dark:text-[#F3EFE6]"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 border-t border-[#D2CBB8] pt-5 dark:border-[#2E2D29]">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={unlockAllAccentsForLearners}
                  onChange={(e) => setUnlockAllAccentsForLearners(e.target.checked)}
                  className="h-4 w-4 accent-[#9A5B13]"
                />
                <span>Unlock All 5 Accents (en-GB, en-AU, en-CA, en-IE)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPublicRegistration}
                  onChange={(e) => setAllowPublicRegistration(e.target.checked)}
                  className="h-4 w-4 accent-[#9A5B13]"
                />
                <span>Allow Public Self-Registration</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#141413] dark:text-[#F3EFE6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireBaselineBeforeLessons}
                  onChange={(e) => setRequireBaselineBeforeLessons(e.target.checked)}
                  className="h-4 w-4 accent-[#9A5B13]"
                />
                <span>Enforce Baseline Before Lesson Unlock</span>
              </label>
            </div>
          </div>
        )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-6 py-3 text-sm font-semibold text-[#FFFFFF] hover:bg-[#143325] dark:bg-[#265C45] dark:hover:bg-[#1E4A37] dark:text-[#FFFFFF] transition"
            >
              <Save className="h-4 w-4" />
              Save {isSuperAdmin ? "Global & Personal Settings" : "Settings"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
