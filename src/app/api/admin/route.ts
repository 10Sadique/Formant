import { NextResponse } from "next/server";
import { createInitialState, getStoreState, saveStoreState } from "@/lib/db/store";
import { evaluateMultidimensionalSkills } from "@/lib/engine/priority-engine";
import type { AccentSkill, LessonData } from "@/lib/db/seed-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    let state = getStoreState();

    // 1. Toggle Target Accent Active Status (PRD Section 19)
    if (action === "toggle_accent") {
      const { accentId } = payload;
      state.accents = state.accents.map((acc) =>
        acc.id === accentId ? { ...acc, isActive: !acc.isActive } : acc
      );
      saveStoreState(state);
      return NextResponse.json(state);
    }

    // 2. Full Skills CRUD: Create / Update / Delete Skill & Recalculate Priority
    if (action === "update_skill") {
      const { skillId, importanceWeight, name, ipaSymbols, articulatoryGuide, scoreOverride } =
        payload;
      state.skills = state.skills.map((s) =>
        s.id === skillId
          ? {
              ...s,
              importanceWeight:
                importanceWeight !== undefined ? Number(importanceWeight) : s.importanceWeight,
              name: name || s.name,
              ipaSymbols: ipaSymbols || s.ipaSymbols,
              articulatoryGuide: articulatoryGuide || s.articulatoryGuide,
            }
          : s
      );

      state.skillMeasurements = state.skillMeasurements
        .map((m) => {
          if (m.skillId === skillId) {
            const imp =
              importanceWeight !== undefined ? Number(importanceWeight) : m.importance;
            const newScore =
              scoreOverride !== undefined ? Math.max(0, Math.min(100, Number(scoreOverride))) : m.score;
            const severity = Number(((100 - newScore) / 100).toFixed(3));
            const priorityScore = Number((severity * m.frequency * imp).toFixed(3));
            return {
              ...m,
              skillName: name || m.skillName,
              ipaSymbols: ipaSymbols || m.ipaSymbols,
              score: newScore,
              severity,
              importance: imp,
              priorityScore,
            };
          }
          return m;
        })
        .sort((a, b) => b.priorityScore - a.priorityScore);

      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "create_skill") {
      const {
        name,
        category = "pronunciation",
        ipaSymbols = "/x/",
        description = "Custom phonological skill target.",
        importanceWeight = 0.85,
        articulatoryGuide = "Position tongue and lips deliberately.",
      } = payload;
      const newSkillId = `skill_${Date.now()}`;
      const newSkill: AccentSkill = {
        id: newSkillId,
        accentId: "en-US",
        name,
        category,
        ipaSymbols,
        description,
        importanceWeight: Number(importanceWeight),
        articulatoryGuide,
      };
      state.skills = [newSkill, ...state.skills];
      state.skillMeasurements = [
        {
          skillId: newSkillId,
          skillName: name,
          category,
          ipaSymbols,
          score: 52,
          baselineScore: 50,
          severity: 0.48,
          frequency: 0.75,
          importance: Number(importanceWeight),
          priorityScore: Number((0.48 * 0.75 * Number(importanceWeight)).toFixed(3)),
          evidenceNote: "Newly added custom diagnostic skill.",
          recommendedLessonId: state.lessons[0]?.id || "lesson_am_r_mastery",
        },
        ...state.skillMeasurements,
      ];
      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "delete_skill") {
      const { skillId } = payload;
      state.skills = state.skills.filter((s) => s.id !== skillId);
      state.skillMeasurements = state.skillMeasurements.filter((m) => m.skillId !== skillId);
      saveStoreState(state);
      return NextResponse.json(state);
    }

    // 3. Full Lessons CRUD: Create / Update / Delete Lesson & Exercises
    if (action === "create_lesson") {
      const {
        title,
        subtitle,
        skillId,
        accentId = "en-US",
        difficulty = "Intermediate",
        estimatedMinutes = 15,
        overview,
        mouthPosition,
        commonL1Mistake,
        acousticMarker,
        promptText,
        targetIpa,
      } = payload;

      const newLessonId = `lesson_custom_${Date.now()}`;
      const newLesson: LessonData = {
        id: newLessonId,
        skillId,
        accentId,
        title,
        subtitle,
        difficulty,
        estimatedMinutes: Number(estimatedMinutes) || 15,
        learnContent: {
          overview: overview || "Custom articulatory & prosodic diagnostic module.",
          mouthPosition: mouthPosition || "Maintain relaxed jaw and target tongue placement.",
          commonL1Mistake: commonL1Mistake || "Watch for L1 phoneme substitution in rapid speech.",
          acousticMarker: acousticMarker || "Target F3/F0 acoustic alignment.",
          contrastExamples: [
            {
              target: promptText?.slice(0, 24) || "Target Phrase",
              ipa: targetIpa || "/ˈtɑɹɡət/",
              mistakeIpa: "/ˈtɑɡət/",
              note: "Custom admin-authored contrast drill.",
            },
          ],
        },
        exercises: [
          {
            id: `ex_${Date.now()}_1`,
            lessonId: newLessonId,
            skillId,
            targetAccent: accentId,
            stepOrder: 1,
            lessonStage: "learn",
            exerciseType: "listen_identify",
            difficulty,
            promptText: promptText || "Practice the new target pattern clearly.",
            targetIpa: targetIpa || "/ˈpɹæktəs/",
            coachingFocus: "Verify articulatory setup before full sentence production.",
          },
          {
            id: `ex_${Date.now()}_2`,
            lessonId: newLessonId,
            skillId,
            targetAccent: accentId,
            stepOrder: 2,
            lessonStage: "sentences",
            exerciseType: "read_aloud",
            difficulty,
            promptText: promptText || "Practice the new target pattern in a full sentence.",
            targetIpa: targetIpa || "/ˈpɹæktəs/",
            coachingFocus: "Maintain target pronunciation across connected words.",
          },
        ],
      };

      state.lessons = [newLesson, ...state.lessons];
      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "update_lesson") {
      const { lessonId, title, subtitle, difficulty, estimatedMinutes } = payload;
      state.lessons = state.lessons.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              title: title || l.title,
              subtitle: subtitle || l.subtitle,
              difficulty: difficulty || l.difficulty,
              estimatedMinutes:
                estimatedMinutes !== undefined ? Number(estimatedMinutes) : l.estimatedMinutes,
            }
          : l
      );
      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "delete_lesson") {
      const { lessonId } = payload;
      state.lessons = state.lessons.filter((l) => l.id !== lessonId);
      saveStoreState(state);
      return NextResponse.json(state);
    }

    // 4. Full Users CRUD: Create / Edit / Delete / Impersonate User
    if (action === "create_user") {
      const {
        name,
        email,
        role = "learner",
        nativeLanguage = "Bengali",
        englishLevel = "Intermediate",
        learningGoal = "Professional communication",
      } = payload;
      const newUser = {
        id: `usr_${Date.now()}`,
        name: name || "New User",
        email: email || `user${Date.now()}@accentlab.ai`,
        role: role as "learner" | "superadmin",
        nativeLanguage,
        englishLevel,
        targetAccentId: "en-US",
        learningGoal,
        dailyPracticeGoalMinutes: 20,
        streakDays: 1,
        overallScore: 58,
        baselineScore: 54,
        onboardingCompleted: true,
        status: "active" as const,
      };
      state.users = [newUser, ...(state.users || [])];
      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "delete_user") {
      const { userId } = payload;
      state.users = (state.users || []).filter((u) => u.id !== userId);
      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "switch_or_update_user") {
      const {
        id,
        name,
        email,
        role,
        nativeLanguage,
        englishLevel,
        targetAccentId,
        learningGoal,
        dailyPracticeGoalMinutes,
        streakDays,
        overallScore,
      } = payload;

      state.profile = {
        ...state.profile,
        userId: id || state.profile.userId,
        name: name ?? state.profile.name,
        email: email ?? state.profile.email,
        role: role ?? state.profile.role,
        nativeLanguage: nativeLanguage ?? state.profile.nativeLanguage,
        englishLevel: englishLevel ?? state.profile.englishLevel,
        targetAccentId: targetAccentId ?? state.profile.targetAccentId,
        learningGoal: learningGoal ?? state.profile.learningGoal,
        dailyPracticeGoalMinutes:
          dailyPracticeGoalMinutes !== undefined
            ? Number(dailyPracticeGoalMinutes)
            : state.profile.dailyPracticeGoalMinutes,
        streakDays:
          streakDays !== undefined ? Number(streakDays) : state.profile.streakDays,
      };

      if (id) {
        state.users = (state.users || []).map((u) =>
          u.id === id
            ? {
                ...u,
                name: name ?? u.name,
                email: email ?? u.email,
                role: role ?? u.role,
                nativeLanguage: nativeLanguage ?? u.nativeLanguage,
                englishLevel: englishLevel ?? u.englishLevel,
                overallScore:
                  overallScore !== undefined ? Number(overallScore) : u.overallScore,
              }
            : u
        );
      }

      const updatedSkills = evaluateMultidimensionalSkills({
        telemetry: state.recordings[0]?.telemetry,
        nativeLanguage: state.profile.nativeLanguage,
        practiceBoostPoints: 15,
      });
      state.skillMeasurements = updatedSkills;

      saveStoreState(state);
      return NextResponse.json(state);
    }

    // 5. Recordings Moderation (Delete Recording / Override Score)
    if (action === "delete_recording") {
      const { recordingId } = payload;
      state.recordings = state.recordings.filter((r) => r.id !== recordingId);
      saveStoreState(state);
      return NextResponse.json(state);
    }

    // 6. User & Global Settings Updates
    if (action === "update_user_settings") {
      state.userSettings = {
        ...state.userSettings,
        ...payload,
      };
      saveStoreState(state);
      return NextResponse.json(state);
    }

    if (action === "update_global_settings") {
      state.globalSettings = {
        ...state.globalSettings,
        ...payload,
      };
      if (payload.unlockAllAccentsForLearners !== undefined) {
        state.accents = state.accents.map((acc) => ({
          ...acc,
          isActive: payload.unlockAllAccentsForLearners ? true : acc.id === "en-US",
        }));
      }
      saveStoreState(state);
      return NextResponse.json(state);
    }

    // 7. SuperAdmin Factory Reset Superpower
    if (action === "factory_reset_database") {
      state = createInitialState();
      saveStoreState(state);
      return NextResponse.json(state);
    }

    return NextResponse.json(state);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
