"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AccentLabDatabaseState, RecordingRecord } from "@/lib/db/store";
import type { AcousticTelemetry } from "@/lib/audio/acoustic-dsp";
import type { DualModeCoachFeedback } from "@/lib/ai/gemini-speech-coach";
import {
  saveRecordingLocally,
  cacheStateSnapshotLocally,
  getOrCreateDeviceId,
} from "@/lib/sync/local-first-storage";

interface AnalyzeSubmissionParams {
  contextType: "baseline_assessment" | "weekly_assessment" | "lesson_exercise";
  exerciseType: string;
  skillId: string;
  skillName: string;
  promptText: string;
  transcript: string;
  telemetry: AcousticTelemetry;
  audioDataUrl?: string;
}

export interface AuthSessionUser {
  id?: string;
  email: string;
  name: string;
  role: "learner" | "superadmin";
  isAuthenticated: boolean;
  onboardingCompleted?: boolean;
}

interface AccentLabContextValue {
  state: AccentLabDatabaseState | null;
  authUser: AuthSessionUser;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
  loading: boolean;
  authInitialized: boolean;
  isAnalyzing: boolean;
  refreshState: () => Promise<void>;
  loginUser: (params: {
    email: string;
    password?: string;
    name?: string;
    role?: "learner" | "superadmin";
    nativeLanguage?: string;
  }) => Promise<AuthSessionUser>;
  registerUser: (params: {
    name: string;
    email: string;
    password?: string;
    nativeLanguage: string;
    englishLevel?: string;
    role?: "learner" | "superadmin";
  }) => Promise<AuthSessionUser>;
  logoutUser: () => void;
  updateOnboarding: (payload: {
    name: string;
    nativeLanguage: string;
    englishLevel: string;
    targetAccentId: string;
    learningGoal: string;
    dailyPracticeGoalMinutes: number;
  }) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  submitAudioAnalysis: (params: AnalyzeSubmissionParams) => Promise<{
    recording: RecordingRecord;
    feedback: DualModeCoachFeedback;
  } | null>;
  speakReference: (text: string, rate?: number) => void;
}

const AccentLabContext = createContext<AccentLabContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "accentlab_auth_v2";

function AccentLabInnerProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthSessionUser>({
    email: "",
    name: "",
    role: "learner",
    isAuthenticated: false,
  });

  const applyThemeClass = (mode: "light" | "dark") => {
    if (typeof document !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setThemeMode = (mode: "light" | "dark") => {
    setTheme(mode);
    applyThemeClass(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("accentlab_theme", mode);
    }
  };

  const toggleTheme = () => {
    setThemeMode(theme === "light" ? "dark" : "light");
  };

  const { data: state = null, isLoading: loading } = useQuery<AccentLabDatabaseState>({
    queryKey: ["accentlab-state"],
    queryFn: async () => {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load AccentLab state");
      }
      const data = (await res.json()) as AccentLabDatabaseState;
      await cacheStateSnapshotLocally(data);
      return data;
    },
    staleTime: 1000 * 15,
  });

  const refreshState = async () => {
    await queryClient.invalidateQueries({ queryKey: ["accentlab-state"] });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clean up legacy demo auth storage key if present
      localStorage.removeItem("accentlab_auth");

      const savedTheme = localStorage.getItem("accentlab_theme");
      if (savedTheme === "dark") {
        setTheme("dark");
        applyThemeClass("dark");
      } else {
        setTheme("light");
        applyThemeClass("light");
      }

      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth) as AuthSessionUser;
          if (parsed && parsed.isAuthenticated && parsed.email) {
            setAuthUser(parsed);
          }
        } catch {
          // ignore malformed session
        }
      }
      setAuthInitialized(true);
    }
  }, []);

  // Synchronize active authUser with live database users snapshot
  useEffect(() => {
    if (state && authUser.email) {
      const activeUser = state.users.find(
        (u) => u.email.toLowerCase() === authUser.email.toLowerCase()
      );
      if (activeUser) {
        setAuthUser((prev) => {
          const isSuperAdmin =
            activeUser.role === "superadmin" ||
            activeUser.email.toLowerCase() === "admin@accentlab.ai";
          const resolvedOnboarding = isSuperAdmin
            ? true
            : Boolean(activeUser.onboardingCompleted);

          if (
            prev.onboardingCompleted !== resolvedOnboarding ||
            prev.role !== activeUser.role ||
            prev.name !== activeUser.name
          ) {
            const next: AuthSessionUser = {
              ...prev,
              name: activeUser.name || prev.name,
              role: activeUser.role,
              onboardingCompleted: resolvedOnboarding,
            };
            if (typeof window !== "undefined") {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
            }
            return next;
          }
          return prev;
        });
      }
    }
  }, [state, authUser.email]);

  const loginUser = async (params: {
    email: string;
    password?: string;
    name?: string;
    role?: "learner" | "superadmin";
    nativeLanguage?: string;
  }) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        email: params.email,
        password: params.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Invalid email or password.");
    }

    const isSuperAdmin = data.user?.role === "superadmin" || params.role === "superadmin";
    const nextAuth: AuthSessionUser = {
      id: data.user?.id,
      email: data.user?.email || params.email,
      name: data.user?.name || params.name || params.email.split("@")[0],
      role: (data.user?.role || params.role || "learner") as "learner" | "superadmin",
      isAuthenticated: true,
      onboardingCompleted: isSuperAdmin ? true : Boolean(data.user?.onboardingCompleted),
    };

    setAuthUser(nextAuth);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    }
    await refreshState();
    return nextAuth;
  };

  const registerUser = async (params: {
    name: string;
    email: string;
    password?: string;
    nativeLanguage: string;
    englishLevel?: string;
    role?: "learner" | "superadmin";
  }) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        name: params.name,
        email: params.email,
        password: params.password,
        nativeLanguage: params.nativeLanguage,
        englishLevel: params.englishLevel || "Upper-intermediate",
        role: params.role || "learner",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Could not create account.");
    }

    const nextAuth: AuthSessionUser = {
      id: data.user?.id,
      email: data.user?.email || params.email,
      name: data.user?.name || params.name,
      role: "learner",
      isAuthenticated: true,
      onboardingCompleted: false,
    };

    setAuthUser(nextAuth);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    }
    await refreshState();
    return nextAuth;
  };

  const logoutUser = () => {
    const loggedOut: AuthSessionUser = {
      email: "",
      name: "",
      role: "learner",
      isAuthenticated: false,
      onboardingCompleted: false,
    };
    setAuthUser(loggedOut);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const updateOnboarding = async (payload: {
    name: string;
    nativeLanguage: string;
    englishLevel: string;
    targetAccentId: string;
    learningGoal: string;
    dailyPracticeGoalMinutes: number;
  }) => {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_onboarding",
        payload: {
          ...payload,
          userEmail: authUser.email,
        },
      }),
    });
    if (res.ok) {
      const updated = (await res.json()) as AccentLabDatabaseState;
      queryClient.setQueryData(["accentlab-state"], updated);
      setAuthUser((prev) => {
        const next: AuthSessionUser = {
          ...prev,
          name: updated.profile?.name || payload.name || prev.name,
          isAuthenticated: true,
          onboardingCompleted: true,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
      await refreshState();
    }
  };

  const skipOnboarding = async () => {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "skip_onboarding",
        payload: {
          userEmail: authUser.email,
        },
      }),
    });
    if (res.ok) {
      const updated = (await res.json()) as AccentLabDatabaseState;
      queryClient.setQueryData(["accentlab-state"], updated);
      setAuthUser((prev) => {
        const next: AuthSessionUser = {
          ...prev,
          isAuthenticated: true,
          onboardingCompleted: true,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
      await refreshState();
    }
  };

  const submitAudioAnalysis = async (params: AnalyzeSubmissionParams) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.state) {
        queryClient.setQueryData(["accentlab-state"], data.state);
      }

      const recording = data.recording as RecordingRecord;
      if (recording) {
        await saveRecordingLocally({
          clientRecordId: recording.id,
          userId: authUser.id || authUser.email || "local_user",
          deviceId: getOrCreateDeviceId(),
          promptId: recording.skillId || params.skillId,
          promptText: recording.promptText || params.promptText,
          durationSec:
            recording.durationSeconds || params.telemetry.durationSeconds || 5,
          audioBase64DataUrl: params.audioDataUrl,
          overallScore: recording.overallScore,
          intelligibilityScore: recording.overallScore,
          fluencyScore: recording.overallScore,
          speechRateWpm: recording.telemetry?.speechRateWpm || 135,
          syncStatus: "synced",
          createdAt: recording.createdAt || new Date().toISOString(),
        });
      }

      return {
        recording,
        feedback: data.feedback as DualModeCoachFeedback,
      };
    } catch (err) {
      console.error("Error analyzing speech:", err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speakReference = (text: string, rate = 0.96) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const usVoice =
      voices.find((v) => v.lang === "en-US" && /natural|google|samantha|microsoft/i.test(v.name)) ||
      voices.find((v) => v.lang === "en-US");
    if (usVoice) utterance.voice = usVoice;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccentLabContext.Provider
      value={{
        state,
        authUser,
        theme,
        toggleTheme,
        setThemeMode,
        loading,
        authInitialized,
        isAnalyzing,
        refreshState,
        loginUser,
        registerUser,
        logoutUser,
        updateOnboarding,
        skipOnboarding,
        submitAudioAnalysis,
        speakReference,
      }}
    >
      {children}
    </AccentLabContext.Provider>
  );
}

export function AccentLabProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AccentLabInnerProvider>{children}</AccentLabInnerProvider>
    </QueryClientProvider>
  );
}

export function useAccentLab() {
  const ctx = useContext(AccentLabContext);
  if (!ctx) {
    throw new Error("useAccentLab must be used inside AccentLabProvider");
  }
  return ctx;
}
