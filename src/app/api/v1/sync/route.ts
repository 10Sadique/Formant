import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getStoreState, saveStoreState } from "@/lib/db/store";
import { getDb } from "@/lib/db/postgres";
import { recordings } from "@/lib/db/schema";

/**
 * Android Room / Local-First Delta Synchronization API (`/api/v1/sync`)
 * Powered by Drizzle ORM against PostgreSQL
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId") || "android_client_default";
  const state = getStoreState();
  const db = await getDb();

  const dbRecordings = await db
    .select()
    .from(recordings)
    .orderBy(desc(recordings.createdAt))
    .limit(50);

  return NextResponse.json({
    syncProtocolVersion: "1.0.0",
    serverTimestamp: new Date().toISOString(),
    deviceId,
    androidRoomSchemaDdl: [
      `CREATE TABLE IF NOT EXISTS local_recordings (
        client_record_id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        skill_id TEXT NOT NULL,
        prompt_text TEXT NOT NULL,
        local_audio_uri TEXT NOT NULL,
        duration_sec REAL NOT NULL,
        overall_score INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'synced',
        created_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS local_user_skill_scores (
        skill_id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        ipa_symbol TEXT NOT NULL,
        score INTEGER NOT NULL,
        priority_score INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      );`,
    ],
    payload: {
      profile: state.profile,
      accents: state.accents,
      skills: state.skills,
      lessons: state.lessons,
      recordings: dbRecordings.length > 0 ? dbRecordings : state.recordings,
      progressSnapshots: state.progressSnapshots,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId = "android_device", recordings: incomingRecordings = [] } = body;
    const state = getStoreState();
    const db = await getDb();

    let mergedCount = 0;

    for (const rec of incomingRecordings) {
      const id = rec.clientRecordId || rec.id || `sync_${Date.now()}_${mergedCount}`;
      const userId = rec.userId || state.profile.userId || "user_superadmin_seed";

      await db
        .insert(recordings)
        .values({
          id,
          clientRecordId: id,
          deviceId,
          localAudioUri: rec.localAudioFilePath || rec.localAudioUri || null,
          syncStatus: "synced",
          userId,
          contextType: "lesson_exercise",
          exerciseType: "sentence_shadowing",
          skillId: rec.skillId || "am_r",
          skillName: rec.skillName || "American /ɹ/",
          promptText: rec.promptText || "Synced from local device",
          transcript: rec.transcript || rec.promptText || "",
          durationSeconds: Number(rec.durationSec || rec.durationSeconds || 5),
          overallScore: Number(rec.overallScore || 75),
          acousticTelemetry: rec.telemetry || {},
          aiFeedback: rec.feedback || {},
        })
        .onConflictDoNothing();

      if (!state.recordings.some((r) => r.id === id)) {
        state.recordings.unshift({
          id,
          clientRecordId: id,
          deviceId,
          localAudioUri: rec.localAudioFilePath || rec.localAudioUri,
          syncStatus: "synced",
          userId,
          createdAt: rec.createdAt || new Date().toISOString(),
          contextType: "lesson_exercise",
          exerciseType: "sentence_shadowing",
          skillId: rec.skillId || "am_r",
          skillName: rec.skillName || "American /ɹ/",
          promptText: rec.promptText || "Synced from local device",
          transcript: rec.transcript || rec.promptText || "",
          durationSeconds: rec.durationSec || rec.durationSeconds || 5,
          overallScore: rec.overallScore || 75,
          telemetry: rec.telemetry,
          feedback: rec.feedback,
        });
      }
      mergedCount++;
    }

    saveStoreState(state);

    return NextResponse.json({
      success: true,
      deviceId,
      mergedRecordingsCount: mergedCount,
      syncedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Sync POST error:", err);
    return NextResponse.json(
      { error: "Failed to synchronize local device batch" },
      { status: 500 }
    );
  }
}
