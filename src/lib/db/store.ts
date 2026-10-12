import fs from "fs";
import path from "path";
import {
  SEED_ACCENTS,
  SEED_SKILLS,
  SEED_BASELINE_ASSESSMENT,
  SEED_LESSONS,
  type AccentTarget,
  type AccentSkill,
  type LessonData,
  type BaselineAssessmentItem,
} from "./seed-data";
import {
  computePriorityScore,
  type SkillMeasurement,
} from "../engine/priority-engine";
import type { AcousticTelemetry } from "../audio/acoustic-dsp";
import type { DualModeCoachFeedback } from "../ai/gemini-speech-coach";

export interface UserProfileRecord {
  userId: string;
  name: string;
  email: string;
  role?: "learner" | "superadmin";
  nativeLanguage: string;
  englishLevel: string;
  targetAccentId: string;
  learningGoal: string;
  dailyPracticeGoalMinutes: number;
  streakDays: number;
  dailyMinutesCompletedToday: number;
  onboardingCompleted: boolean;
}

export interface PlatformUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: "learner" | "superadmin";
  nativeLanguage: string;
  englishLevel: string;
  targetAccentId: string;
  learningGoal: string;
  dailyPracticeGoalMinutes: number;
  streakDays: number;
  overallScore: number;
  baselineScore: number;
  onboardingCompleted: boolean;
  status: "active" | "suspended";
}

export interface UserSettingsConfig {
  defaultPlaybackSpeed: number;
  defaultFeedbackMode: "simple" | "detailed";
  autoPlayReferenceAudio: boolean;
  micNoiseGateSensitivity: "low" | "balanced" | "strict";
  showIpaUnderlines: boolean;
  showFormantOverlays: boolean;
  dailyReminderEnabled: boolean;
  weeklyReassessmentDay: string;
}

export interface GlobalPlatformSettings {
  platformName: string;
  activeGeminiModel: "gemini-2.5-pro" | "gemini-2.0-flash";
  coachStrictness: "encouraging" | "clinical_balanced" | "strict_phonetician";
  targetAmericanRF3CeilingHz: number;
  targetStressRhythmNpviFloor: number;
  allowPublicRegistration: boolean;
  requireBaselineBeforeLessons: boolean;
  unlockAllAccentsForLearners: boolean;
  maintenanceBannerMessage: string;
}

export interface RecordingRecord {
  id: string;
  clientRecordId?: string;
  deviceId?: string;
  localAudioUri?: string;
  syncStatus?: "synced" | "pending_upload";
  userId: string;
  createdAt: string;
  contextType: "baseline_assessment" | "weekly_assessment" | "lesson_exercise";
  exerciseType: string;
  skillId: string;
  skillName: string;
  promptText: string;
  transcript: string;
  durationSeconds: number;
  overallScore: number;
  audioDataUrl?: string;
  telemetry: AcousticTelemetry;
  feedback: DualModeCoachFeedback;
}

export interface AssessmentRecord {
  id: string;
  clientRecordId?: string;
  userId: string;
  assessmentType: "baseline" | "weekly";
  label: string;
  completedAt: string;
  overallScore: number;
  recordingId: string;
  skillScores: Record<string, number>;
  summaryCoachNote: string;
}

export interface ProgressSnapshotRecord {
  dateLabel: string;
  overallScore: number;
  am_r: number;
  th_sounds: number;
  vowel_contrasts: number;
  flap_t: number;
  rhythm: number;
  word_stress: number;
  intonation: number;
}

export interface TrainingSessionRecord {
  id: string;
  lessonId: string;
  skillId: string;
  skillName: string;
  title: string;
  durationMinutes: number;
  priorityScore: number;
  severity: number;
  frequency: number;
  importance: number;
  status: "recommended" | "in_progress" | "completed";
}

export interface AccentLabDatabaseState {
  profile: UserProfileRecord;
  users: PlatformUserRecord[];
  userSettings: UserSettingsConfig;
  globalSettings: GlobalPlatformSettings;
  accents: AccentTarget[];
  skills: AccentSkill[];
  lessons: LessonData[];
  baselinePrompts: BaselineAssessmentItem[];
  skillMeasurements: SkillMeasurement[];
  assessments: AssessmentRecord[];
  recordings: RecordingRecord[];
  progressSnapshots: ProgressSnapshotRecord[];
  trainingSessions: TrainingSessionRecord[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "accentlab-real-store.json");

/**
 * Creates a clean, zero-demo-data state containing ONLY the phonological reference catalog
 * (accents, skills, lessons, diagnostic prompts). Users, recordings, assessments, and snapshots
 * start 100% empty and are populated only by real registered users and real recordings.
 */
export function createInitialState(): AccentLabDatabaseState {
  const unassessedSkills: SkillMeasurement[] = SEED_SKILLS.map((skill) => {
    const frequency = 0.7;
    const { severity, priorityScore } = computePriorityScore(0, frequency, skill.importanceWeight);
    const matchingLesson =
      SEED_LESSONS.find((l) => l.skillId === skill.id) || SEED_LESSONS[0];

    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      ipaSymbols: skill.ipaSymbols,
      score: 0,
      baselineScore: 0,
      severity,
      frequency,
      importance: skill.importanceWeight,
      priorityScore,
      evidenceNote: "Awaiting baseline assessment recording.",
      recommendedLessonId: matchingLesson.id,
    };
  });

  const trainingSessions: TrainingSessionRecord[] = unassessedSkills.slice(0, 6).map((s, idx) => {
    const lesson =
      SEED_LESSONS.find((l) => l.skillId === s.skillId) || SEED_LESSONS[idx % SEED_LESSONS.length];
    return {
      id: `ts_${s.skillId}`,
      lessonId: lesson.id,
      skillId: s.skillId,
      skillName: s.skillName,
      title: lesson.title,
      durationMinutes: lesson.estimatedMinutes,
      priorityScore: s.priorityScore,
      severity: s.severity,
      frequency: s.frequency,
      importance: s.importance,
      status: "recommended",
    };
  });

  return {
    profile: {
      userId: "",
      name: "",
      email: "",
      role: "learner",
      nativeLanguage: "Bengali",
      englishLevel: "Intermediate",
      targetAccentId: "en-US",
      learningGoal: "Professional communication & global teams",
      dailyPracticeGoalMinutes: 20,
      streakDays: 0,
      dailyMinutesCompletedToday: 0,
      onboardingCompleted: false,
    },
    users: [],
    userSettings: {
      defaultPlaybackSpeed: 0.96,
      defaultFeedbackMode: "simple",
      autoPlayReferenceAudio: false,
      micNoiseGateSensitivity: "balanced",
      showIpaUnderlines: true,
      showFormantOverlays: true,
      dailyReminderEnabled: true,
      weeklyReassessmentDay: "Monday",
    },
    globalSettings: {
      platformName: "Formant",
      activeGeminiModel: "gemini-2.5-pro",
      coachStrictness: "clinical_balanced",
      targetAmericanRF3CeilingHz: 1950,
      targetStressRhythmNpviFloor: 54,
      allowPublicRegistration: true,
      requireBaselineBeforeLessons: false,
      unlockAllAccentsForLearners: false,
      maintenanceBannerMessage: "",
    },
    accents: SEED_ACCENTS,
    skills: SEED_SKILLS,
    lessons: SEED_LESSONS,
    baselinePrompts: SEED_BASELINE_ASSESSMENT,
    skillMeasurements: unassessedSkills,
    assessments: [],
    recordings: [],
    progressSnapshots: [],
    trainingSessions,
  };
}

export function getStoreState(): AccentLabDatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as AccentLabDatabaseState;
      const defaults = createInitialState();
      return {
        ...defaults,
        ...parsed,
        users: parsed.users || [],
        recordings: parsed.recordings || [],
        assessments: parsed.assessments || [],
        progressSnapshots: parsed.progressSnapshots || [],
        userSettings: { ...defaults.userSettings, ...(parsed.userSettings || {}) },
        globalSettings: { ...defaults.globalSettings, ...(parsed.globalSettings || {}) },
      };
    }
    const initial = createInitialState();
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch {
    return createInitialState();
  }
}

export function saveStoreState(nextState: AccentLabDatabaseState): AccentLabDatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(nextState, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist store file:", err);
  }
  return nextState;
}
