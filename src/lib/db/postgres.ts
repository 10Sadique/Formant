import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzleNodePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import * as schema from "./schema";
import { SEED_ACCENTS, SEED_SKILLS } from "./seed-data";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://accentlab:accentlab_password@localhost:5432/accentlab";

export type AccentLabDrizzleDb =
  | NodePgDatabase<typeof schema>
  | PgliteDatabase<typeof schema>;

let pgPool: Pool | null = null;
let pgliteInstance: PGlite | null = null;
let drizzleDbInstance: AccentLabDrizzleDb | null = null;
let initialized = false;

const INIT_DDL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified TIMESTAMP,
  image TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  native_language TEXT NOT NULL,
  english_level TEXT NOT NULL,
  target_accent_id TEXT NOT NULL REFERENCES accents(id),
  learning_goal TEXT NOT NULL,
  daily_practice_goal_minutes INTEGER NOT NULL,
  streak_days INTEGER NOT NULL DEFAULT 0,
  daily_minutes_completed_today INTEGER NOT NULL DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  device_id TEXT,
  sync_version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  accent_id TEXT NOT NULL REFERENCES accents(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  ipa_symbols TEXT NOT NULL,
  description TEXT NOT NULL,
  importance_weight REAL NOT NULL,
  articulatory_guide TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  accent_id TEXT NOT NULL REFERENCES accents(id),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  learn_content JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS recordings (
  id TEXT PRIMARY KEY,
  client_record_id TEXT UNIQUE,
  device_id TEXT,
  local_audio_uri TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced',
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  transcript TEXT NOT NULL,
  duration_seconds REAL NOT NULL,
  overall_score INTEGER NOT NULL,
  audio_data_url TEXT,
  acoustic_telemetry JSONB NOT NULL,
  ai_feedback JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  client_record_id TEXT UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  target_accent_id TEXT NOT NULL REFERENCES accents(id),
  overall_score INTEGER NOT NULL,
  recording_id TEXT,
  summary_coach_note TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'synced',
  completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress_snapshots (
  id TEXT PRIMARY KEY,
  client_record_id TEXT UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_label TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  skill_scores_map JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function seedReferenceAndSuperAdminWithDrizzle(db: AccentLabDrizzleDb) {
  // 1. Seed Reference Accents via Drizzle ORM
  for (const acc of SEED_ACCENTS) {
    await db
      .insert(schema.accents)
      .values({
        id: acc.id,
        name: acc.name,
        region: acc.region,
        isActive: acc.isActive,
        description: acc.description,
      })
      .onConflictDoNothing();
  }

  // 2. Seed Reference Phonetic Skills via Drizzle ORM
  for (const sk of SEED_SKILLS) {
    await db
      .insert(schema.skills)
      .values({
        id: sk.id,
        accentId: sk.accentId || "en-US",
        name: sk.name,
        category: sk.category,
        ipaSymbols: sk.ipaSymbols,
        description: sk.description,
        importanceWeight: sk.importanceWeight,
        articulatoryGuide: sk.articulatoryGuide,
      })
      .onConflictDoNothing();
  }

  // 3. Seed SuperAdmin Account via Drizzle ORM
  const superAdminEmail = (
    process.env.SUPERADMIN_EMAIL || "admin@accentlab.ai"
  ).toLowerCase();
  const superAdminPassword =
    process.env.SUPERADMIN_PASSWORD || "Admin@12345";
  const superAdminName = process.env.SUPERADMIN_NAME || "System Administrator";
  const passwordHash = await bcrypt.hash(superAdminPassword, 12);
  const superAdminId = "user_superadmin_seed";

  await db
    .insert(schema.users)
    .values({
      id: superAdminId,
      name: superAdminName,
      email: superAdminEmail,
      passwordHash,
      role: "superadmin",
      onboardingCompleted: true,
    })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: {
        role: "superadmin",
        onboardingCompleted: true,
      },
    });

  await db
    .insert(schema.profiles)
    .values({
      id: `prof_${superAdminId}`,
      userId: superAdminId,
      nativeLanguage: "English",
      englishLevel: "Advanced",
      targetAccentId: "en-US",
      learningGoal: "Platform Administration",
      dailyPracticeGoalMinutes: 20,
      streakDays: 1,
      dailyMinutesCompletedToday: 0,
      onboardingCompleted: true,
    })
    .onConflictDoNothing();
}

/**
 * Returns the initialized Drizzle ORM instance (`NodePgDatabase` when Docker PostgreSQL
 * is running, or `PgliteDatabase` embedded PostgreSQL 16 when offline).
 */
export async function getDb(): Promise<AccentLabDrizzleDb> {
  if (drizzleDbInstance && initialized) {
    return drizzleDbInstance;
  }

  try {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString,
        connectionTimeoutMillis: 1500,
      });
    }
    await pgPool.query(INIT_DDL);
    drizzleDbInstance = drizzleNodePg(pgPool, { schema });
    await seedReferenceAndSuperAdminWithDrizzle(drizzleDbInstance);
    initialized = true;
    return drizzleDbInstance;
  } catch {
    if (!pgliteInstance) {
      const dataDir = path.join(process.cwd(), ".data", "pglite-sql");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      pgliteInstance = new PGlite(dataDir);
      await pgliteInstance.exec(INIT_DDL);
    }
    drizzleDbInstance = drizzlePglite(pgliteInstance, { schema });
    await seedReferenceAndSuperAdminWithDrizzle(drizzleDbInstance);
    initialized = true;
    return drizzleDbInstance;
  }
}

export async function executeSql<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  await getDb();
  if (pgPool && !pgliteInstance) {
    try {
      const res = await pgPool.query(query, params);
      return res.rows as T[];
    } catch {
      // fall through
    }
  }
  if (pgliteInstance) {
    const res = await pgliteInstance.query(query, params);
    return (res.rows || []) as T[];
  }
  return [];
}
