import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

// ============================================================================
// AUTH.JS v5 (NEXT-AUTH) + USER IDENTITY TABLES
// ============================================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("learner").notNull(), // 'learner' | 'superadmin'
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ============================================================================
// ACCENTLAB DOMAIN + ANDROID LOCAL-FIRST SYNC TABLES
// ============================================================================

export const accents = pgTable("accents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  description: text("description").notNull(),
});

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  nativeLanguage: text("native_language").notNull(),
  englishLevel: text("english_level").notNull(),
  targetAccentId: text("target_accent_id")
    .notNull()
    .references(() => accents.id),
  learningGoal: text("learning_goal").notNull(),
  dailyPracticeGoalMinutes: integer("daily_practice_goal_minutes").notNull(),
  streakDays: integer("streak_days").default(0).notNull(),
  dailyMinutesCompletedToday: integer("daily_minutes_completed_today").default(0).notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  deviceId: text("device_id"), // For Android Local-First sync
  syncVersion: integer("sync_version").default(1).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  accentId: text("accent_id")
    .notNull()
    .references(() => accents.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'pronunciation' | 'prosody' | 'connected_speech'
  ipaSymbols: text("ipa_symbols").notNull(),
  description: text("description").notNull(),
  importanceWeight: real("importance_weight").notNull(),
  articulatoryGuide: text("articulatory_guide").notNull(),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id),
  accentId: text("accent_id")
    .notNull()
    .references(() => accents.id),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  learnContent: jsonb("learn_content").notNull(),
});

export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id),
  targetAccent: text("target_accent")
    .notNull()
    .references(() => accents.id),
  stepOrder: integer("step_order").notNull(),
  lessonStage: text("lesson_stage").notNull(),
  exerciseType: text("exercise_type").notNull(),
  difficulty: text("difficulty").notNull(),
  promptText: text("prompt_text").notNull(),
  targetIpa: text("target_ipa").notNull(),
  minimalPairOptions: jsonb("minimal_pair_options"),
  coachingFocus: text("coaching_focus").notNull(),
});

export const recordings = pgTable("recordings", {
  id: text("id").primaryKey(),
  clientRecordId: text("client_record_id").unique(), // UUID generated on Android/Web device
  deviceId: text("device_id"),
  localAudioUri: text("local_audio_uri"), // Android local file:/// path or IndexedDB key
  syncStatus: text("sync_status").default("synced").notNull(), // 'synced' | 'pending_upload'
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contextType: text("context_type").notNull(),
  exerciseType: text("exercise_type").notNull(),
  skillId: text("skill_id").notNull(),
  skillName: text("skill_name").notNull(),
  promptText: text("prompt_text").notNull(),
  transcript: text("transcript").notNull(),
  durationSeconds: real("duration_seconds").notNull(),
  overallScore: integer("overall_score").notNull(),
  audioDataUrl: text("audio_data_url"),
  acousticTelemetry: jsonb("acoustic_telemetry").notNull(),
  aiFeedback: jsonb("ai_feedback").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const exerciseAttempts = pgTable("exercise_attempts", {
  id: text("id").primaryKey(),
  clientRecordId: text("client_record_id").unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id),
  recordingId: text("recording_id")
    .notNull()
    .references(() => recordings.id, { onDelete: "cascade" }),
  overallScore: integer("overall_score").notNull(),
  objectiveMeasurements: jsonb("objective_measurements").notNull(),
  aiFeedback: jsonb("ai_feedback").notNull(),
  syncStatus: text("sync_status").default("synced").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assessments = pgTable("assessments", {
  id: text("id").primaryKey(),
  clientRecordId: text("client_record_id").unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentType: text("assessment_type").notNull(), // 'baseline' | 'weekly'
  targetAccentId: text("target_accent_id")
    .notNull()
    .references(() => accents.id),
  overallScore: integer("overall_score").notNull(),
  recordingId: text("recording_id"),
  summaryCoachNote: text("summary_coach_note").notNull(),
  syncStatus: text("sync_status").default("synced").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const assessmentScores = pgTable("assessment_scores", {
  id: text("id").primaryKey(),
  assessmentId: text("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id),
  score: integer("score").notNull(),
  baselineScore: integer("baseline_score").notNull(),
  severity: real("severity").notNull(),
  frequency: real("frequency").notNull(),
  importance: real("importance").notNull(),
  priorityScore: real("priority_score").notNull(),
  evidenceNote: text("evidence_note").notNull(),
});

export const trainingPlans = pgTable("training_plans", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  targetAccentId: text("target_accent_id")
    .notNull()
    .references(() => accents.id),
  focusSkillIds: jsonb("focus_skill_ids").notNull(),
  prioritizedItems: jsonb("prioritized_items").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const trainingSessions = pgTable("training_sessions", {
  id: text("id").primaryKey(),
  planId: text("plan_id")
    .notNull()
    .references(() => trainingPlans.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lessons.id),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id),
  title: text("title").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  priorityRank: integer("priority_rank").notNull(),
  status: text("status").notNull(),
  completedAt: timestamp("completed_at"),
});

export const progressSnapshots = pgTable("progress_snapshots", {
  id: text("id").primaryKey(),
  clientRecordId: text("client_record_id").unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dateLabel: text("date_label").notNull(),
  overallScore: integer("overall_score").notNull(),
  skillScoresMap: jsonb("skill_scores_map").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});
