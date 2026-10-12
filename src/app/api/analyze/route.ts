import { NextResponse } from "next/server";
import { getStoreState, saveStoreState, type RecordingRecord } from "@/lib/db/store";
import { generateGroundedSpeechFeedback } from "@/lib/ai/gemini-speech-coach";
import { evaluateMultidimensionalSkills } from "@/lib/engine/priority-engine";
import { SEED_LESSONS } from "@/lib/db/seed-data";
import type { AcousticTelemetry } from "@/lib/audio/acoustic-dsp";
import { getDb } from "@/lib/db/postgres";
import { recordings, assessments, progressSnapshots } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      contextType = "lesson_exercise",
      exerciseType = "read_aloud",
      skillId = "am_r",
      skillName = "American /r/",
      promptText,
      transcript,
      telemetry,
      audioDataUrl,
    }: {
      contextType: "baseline_assessment" | "weekly_assessment" | "lesson_exercise";
      exerciseType: string;
      skillId: string;
      skillName: string;
      promptText: string;
      transcript: string;
      telemetry: AcousticTelemetry;
      audioDataUrl?: string;
    } = body;

    const state = getStoreState();
    const db = await getDb();

    // 1. Generate grounded speech coaching feedback
    const feedback = await generateGroundedSpeechFeedback({
      promptText,
      transcript: transcript || promptText,
      targetSkillId: skillId,
      nativeLanguage: state.profile.nativeLanguage,
      telemetry,
      audioBase64Wav: audioDataUrl,
    });

    // 2. Persist Recording into PostgreSQL via Drizzle ORM & State Store
    const recId = `rec_${Date.now()}`;
    const userId = state.profile.userId || "user_superadmin_seed";

    const newRecording: RecordingRecord = {
      id: recId,
      clientRecordId: recId,
      userId,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      contextType,
      exerciseType,
      skillId,
      skillName,
      promptText,
      transcript: transcript || promptText,
      durationSeconds: telemetry.durationSeconds,
      overallScore: feedback.overallAttemptScore,
      audioDataUrl,
      telemetry,
      feedback,
    };

    try {
      await db
        .insert(recordings)
        .values({
          id: recId,
          clientRecordId: recId,
          userId,
          contextType,
          exerciseType,
          skillId,
          skillName,
          promptText,
          transcript: transcript || promptText,
          durationSeconds: telemetry.durationSeconds,
          overallScore: feedback.overallAttemptScore,
          audioDataUrl: audioDataUrl || null,
          acousticTelemetry: telemetry,
          aiFeedback: feedback,
        })
        .onConflictDoNothing();
    } catch (dbErr) {
      console.error("Drizzle insert recording warning:", dbErr);
    }

    state.recordings = [newRecording, ...state.recordings.slice(0, 29)];
    state.profile.dailyMinutesCompletedToday = Math.min(
      state.profile.dailyPracticeGoalMinutes,
      state.profile.dailyMinutesCompletedToday +
        Math.max(2, Math.round(telemetry.durationSeconds / 15))
    );

    // 3. Update multidimensional skill scores and recalculate Priority = Severity * Frequency * Importance
    const baselineMap: Record<string, number> = {};
    state.skillMeasurements.forEach((s) => {
      baselineMap[s.skillId] = s.baselineScore;
    });

    const recalculated = evaluateMultidimensionalSkills({
      telemetry,
      nativeLanguage: state.profile.nativeLanguage,
      existingBaselineMap: baselineMap,
      practiceBoostPoints: contextType === "baseline_assessment" ? 2 : 19,
    }).map((item) => {
      if (item.skillId === skillId) {
        const blendedScore = Math.round(
          item.score * 0.5 + feedback.overallAttemptScore * 0.5
        );
        const severity = Number(((100 - blendedScore) / 100).toFixed(3));
        return {
          ...item,
          score: blendedScore,
          severity,
          priorityScore: Number(
            (severity * item.frequency * item.importance).toFixed(3)
          ),
        };
      }
      return item;
    });

    recalculated.sort((a, b) => b.priorityScore - a.priorityScore);
    state.skillMeasurements = recalculated;

    // 4. Update Training Sessions queue based on new Priority order
    state.trainingSessions = recalculated.slice(0, 6).map((s, idx) => {
      const lesson =
        SEED_LESSONS.find((l) => l.skillId === s.skillId) ||
        SEED_LESSONS[idx % SEED_LESSONS.length];
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
        status:
          s.skillId === skillId
            ? "completed"
            : idx === 0
            ? "in_progress"
            : "recommended",
      };
    });

    // 5. If this was a Baseline or Weekly Assessment, insert Assessment & ProgressSnapshot via Drizzle ORM
    if (
      contextType === "baseline_assessment" ||
      contextType === "weekly_assessment"
    ) {
      const scoreMap: Record<string, number> = {};
      recalculated.forEach((s) => {
        scoreMap[s.skillId] = s.score;
      });

      const avgOverall = Math.round(
        recalculated.reduce((acc, s) => acc + s.score, 0) /
          Math.max(1, recalculated.length)
      );

      const assessId = `assess_${Date.now()}`;
      const snapId = `snap_${Date.now()}`;

      try {
        await db
          .insert(assessments)
          .values({
            id: assessId,
            clientRecordId: assessId,
            userId,
            assessmentType:
              contextType === "baseline_assessment" ? "baseline" : "weekly",
            targetAccentId: state.profile.targetAccentId || "en-US",
            overallScore: avgOverall,
            recordingId: newRecording.id,
            summaryCoachNote: feedback.whatHappened,
          })
          .onConflictDoNothing();

        await db
          .insert(progressSnapshots)
          .values({
            id: snapId,
            clientRecordId: snapId,
            userId,
            dateLabel: "Latest Check",
            overallScore: avgOverall,
            skillScoresMap: scoreMap,
          })
          .onConflictDoNothing();
      } catch (dbErr) {
        console.error("Drizzle insert assessment warning:", dbErr);
      }

      state.assessments.push({
        id: assessId,
        userId,
        assessmentType:
          contextType === "baseline_assessment" ? "baseline" : "weekly",
        label:
          contextType === "baseline_assessment"
            ? "Updated Baseline Assessment"
            : `Reassessment (${new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })})`,
        completedAt: new Date().toISOString().slice(0, 10),
        overallScore: avgOverall,
        recordingId: newRecording.id,
        skillScores: scoreMap,
        summaryCoachNote: feedback.whatHappened,
      });

      state.progressSnapshots.push({
        dateLabel: "Latest Check",
        overallScore: avgOverall,
        am_r: scoreMap.am_r || 74,
        th_sounds: scoreMap.th_sounds || 80,
        vowel_contrasts: scoreMap.vowel_contrasts || 76,
        flap_t: scoreMap.flap_t || 72,
        rhythm: scoreMap.rhythm || 70,
        word_stress: scoreMap.word_stress || 80,
        intonation: scoreMap.intonation || 75,
      });
    }

    saveStoreState(state);

    return NextResponse.json({
      recording: newRecording,
      feedback,
      state,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
