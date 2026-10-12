import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getStoreState, saveStoreState } from "@/lib/db/store";
import { evaluateMultidimensionalSkills } from "@/lib/engine/priority-engine";
import { getDb } from "@/lib/db/postgres";
import { users, profiles, recordings } from "@/lib/db/schema";

export async function GET() {
  const state = getStoreState();
  try {
    const db = await getDb();
    const dbUsers = await db.select().from(users);
    const dbProfiles = await db.select().from(profiles);
    const dbRecordings = await db
      .select()
      .from(recordings)
      .orderBy(desc(recordings.createdAt))
      .limit(50);

    // Sync users from Drizzle PostgreSQL into state view
    for (const u of dbUsers) {
      const prof = dbProfiles.find((p) => p.userId === u.id);
      const existingIdx = state.users.findIndex(
        (su) => su.email.toLowerCase() === u.email.toLowerCase()
      );
      const mapped = {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: (u.role as "learner" | "superadmin") || "learner",
        nativeLanguage: prof?.nativeLanguage || "Bengali",
        englishLevel: prof?.englishLevel || "Upper-intermediate",
        targetAccentId: prof?.targetAccentId || "en-US",
        learningGoal:
          prof?.learningGoal || "Professional communication & global teams",
        dailyPracticeGoalMinutes: prof?.dailyPracticeGoalMinutes || 20,
        streakDays: prof?.streakDays || 1,
        overallScore: existingIdx !== -1 ? state.users[existingIdx].overallScore : 0,
        baselineScore: existingIdx !== -1 ? state.users[existingIdx].baselineScore : 0,
        onboardingCompleted: u.role === "superadmin" ? true : Boolean(u.onboardingCompleted),
        status: "active" as const,
      };
      if (existingIdx === -1) {
        state.users.push(mapped);
      } else {
        state.users[existingIdx] = mapped;
      }
    }

    if (state.profile.role === "superadmin" || state.profile.email?.toLowerCase() === "admin@accentlab.ai") {
      state.profile.onboardingCompleted = true;
    } else if (state.profile.email) {
      const matchedUser = state.users.find(
        (u) => u.email.toLowerCase() === state.profile.email.toLowerCase()
      );
      if (matchedUser) {
        state.profile.onboardingCompleted = Boolean(matchedUser.onboardingCompleted);
        state.profile.name = matchedUser.name || state.profile.name;
        state.profile.role = matchedUser.role;
        state.profile.nativeLanguage = matchedUser.nativeLanguage;
        state.profile.englishLevel = matchedUser.englishLevel;
        state.profile.targetAccentId = matchedUser.targetAccentId;
        state.profile.learningGoal = matchedUser.learningGoal;
        state.profile.dailyPracticeGoalMinutes = matchedUser.dailyPracticeGoalMinutes;
      }
    }

    // Sync recordings from Drizzle PostgreSQL
    for (const rec of dbRecordings) {
      if (!state.recordings.some((r) => r.id === rec.id)) {
        state.recordings.push({
          id: rec.id,
          clientRecordId: rec.clientRecordId || rec.id,
          deviceId: rec.deviceId || undefined,
          localAudioUri: rec.localAudioUri || undefined,
          syncStatus: (rec.syncStatus as "synced" | "pending_upload") || "synced",
          userId: rec.userId,
          createdAt: rec.createdAt.toISOString(),
          contextType: rec.contextType as
            | "baseline_assessment"
            | "weekly_assessment"
            | "lesson_exercise",
          exerciseType: rec.exerciseType,
          skillId: rec.skillId,
          skillName: rec.skillName,
          promptText: rec.promptText,
          transcript: rec.transcript,
          durationSeconds: rec.durationSeconds,
          overallScore: rec.overallScore,
          audioDataUrl: rec.audioDataUrl || undefined,
          telemetry: rec.acousticTelemetry as never,
          feedback: rec.aiFeedback as never,
        });
      }
    }
    saveStoreState(state);
  } catch (err) {
    console.error("Drizzle state read sync error:", err);
  }
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const state = getStoreState();
    const db = await getDb();

    if (body.action === "update_onboarding" || body.action === "skip_onboarding") {
      const payload = body.payload || {};
      const {
        name,
        nativeLanguage,
        englishLevel,
        targetAccentId,
        learningGoal,
        dailyPracticeGoalMinutes,
      } = payload;

      const targetEmail = (payload.userEmail || state.profile.email || "").toLowerCase().trim();

      const updatedName = name || state.profile.name || "Learner";
      const updatedLanguage = nativeLanguage || state.profile.nativeLanguage || "Bengali";
      const updatedLevel = englishLevel || state.profile.englishLevel || "Upper-intermediate";
      const updatedAccent = targetAccentId || state.profile.targetAccentId || "en-US";
      const updatedGoal = learningGoal || state.profile.learningGoal || "Professional communication & global teams";
      const updatedMinutes = Number(dailyPracticeGoalMinutes) || state.profile.dailyPracticeGoalMinutes || 20;

      state.profile = {
        ...state.profile,
        email: targetEmail || state.profile.email,
        name: updatedName,
        nativeLanguage: updatedLanguage,
        englishLevel: updatedLevel,
        targetAccentId: updatedAccent,
        learningGoal: updatedGoal,
        dailyPracticeGoalMinutes: updatedMinutes,
        onboardingCompleted: true,
      };

      if (targetEmail) {
        const userIdx = state.users.findIndex(
          (u) => u.email.toLowerCase() === targetEmail
        );
        if (userIdx !== -1) {
          state.users[userIdx] = {
            ...state.users[userIdx],
            name: updatedName,
            nativeLanguage: updatedLanguage,
            englishLevel: updatedLevel,
            targetAccentId: updatedAccent,
            learningGoal: updatedGoal,
            dailyPracticeGoalMinutes: updatedMinutes,
            onboardingCompleted: true,
          };
        }

        await db
          .update(users)
          .set({
            name: updatedName,
            onboardingCompleted: true,
            updatedAt: new Date(),
          })
          .where(eq(users.email, targetEmail));

        const matchedUsers = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, targetEmail))
          .limit(1);

        if (matchedUsers[0]) {
          const uid = matchedUsers[0].id;
          await db
            .insert(profiles)
            .values({
              id: `prof_${uid}`,
              userId: uid,
              nativeLanguage: updatedLanguage,
              englishLevel: updatedLevel,
              targetAccentId: updatedAccent,
              learningGoal: updatedGoal,
              dailyPracticeGoalMinutes: updatedMinutes,
              streakDays: state.profile.streakDays || 1,
              dailyMinutesCompletedToday:
                state.profile.dailyMinutesCompletedToday || 0,
              onboardingCompleted: true,
            })
            .onConflictDoUpdate({
              target: profiles.userId,
              set: {
                nativeLanguage: updatedLanguage,
                englishLevel: updatedLevel,
                targetAccentId: updatedAccent,
                learningGoal: updatedGoal,
                dailyPracticeGoalMinutes: updatedMinutes,
                onboardingCompleted: true,
                updatedAt: new Date(),
              },
            });
        }
      }

      const baselineMap: Record<string, number> = {};
      state.skillMeasurements.forEach((s) => {
        baselineMap[s.skillId] = s.baselineScore;
      });

      const updatedSkills = evaluateMultidimensionalSkills({
        telemetry: state.recordings[0]?.telemetry,
        nativeLanguage: state.profile.nativeLanguage,
        existingBaselineMap: baselineMap,
        practiceBoostPoints: 0,
      });

      state.skillMeasurements = updatedSkills;
      saveStoreState(state);
      return NextResponse.json(state);
    }

    return NextResponse.json(state);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
