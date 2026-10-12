import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  getStoreState,
  saveStoreState,
  type PlatformUserRecord,
} from "@/lib/db/store";
import { getDb } from "@/lib/db/postgres";
import { users, profiles } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const state = getStoreState();
    const db = await getDb();

    if (action === "login") {
      const email = (body.email || body.payload?.email || "").trim().toLowerCase();
      const password = body.password || body.payload?.password || "";

      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required." },
          { status: 400 }
        );
      }

      // Query user & profile via Drizzle ORM
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const dbUser = userRows[0];
      if (!dbUser) {
        return NextResponse.json(
          {
            error:
              "No account found with this email address. Please sign up first.",
          },
          { status: 404 }
        );
      }

      const isValid = await bcrypt.compare(password, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const profileRows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, dbUser.id))
        .limit(1);

      const dbProfile = profileRows[0];

      const matchedUser: PlatformUserRecord = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        passwordHash: dbUser.passwordHash,
        role: (dbUser.role as "learner" | "superadmin") || "learner",
        nativeLanguage: dbProfile?.nativeLanguage || (dbUser.role === "superadmin" ? "English" : "Bengali"),
        englishLevel: dbProfile?.englishLevel || (dbUser.role === "superadmin" ? "Advanced" : "Upper-intermediate"),
        targetAccentId: dbProfile?.targetAccentId || "en-US",
        learningGoal:
          dbProfile?.learningGoal || (dbUser.role === "superadmin" ? "Platform Administration" : "Professional communication & global teams"),
        dailyPracticeGoalMinutes: dbProfile?.dailyPracticeGoalMinutes || 20,
        streakDays: dbProfile?.streakDays || 1,
        overallScore: 0,
        baselineScore: 0,
        onboardingCompleted: dbUser.role === "superadmin" ? true : Boolean(dbUser.onboardingCompleted),
        status: "active",
      };

      const existingIdx = state.users.findIndex(
        (u) => u.email.toLowerCase() === matchedUser.email.toLowerCase()
      );
      if (existingIdx === -1) {
        state.users.push(matchedUser);
      } else {
        state.users[existingIdx] = matchedUser;
      }

      state.profile = {
        userId: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        nativeLanguage: matchedUser.nativeLanguage,
        englishLevel: matchedUser.englishLevel,
        targetAccentId: matchedUser.targetAccentId,
        learningGoal: matchedUser.learningGoal,
        dailyPracticeGoalMinutes: matchedUser.dailyPracticeGoalMinutes,
        streakDays: matchedUser.streakDays,
        dailyMinutesCompletedToday: dbProfile?.dailyMinutesCompletedToday || 0,
        onboardingCompleted: matchedUser.onboardingCompleted,
      };

      saveStoreState(state);

      return NextResponse.json({
        success: true,
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          onboardingCompleted: matchedUser.onboardingCompleted,
        },
        state,
      });
    }

    if (action === "register") {
      const name = (body.name || body.payload?.name || "").trim();
      const email = (body.email || body.payload?.email || "").trim().toLowerCase();
      const password = body.password || body.payload?.password || "";
      const nativeLanguage =
        body.nativeLanguage || body.payload?.nativeLanguage || "Bengali";
      const englishLevel =
        body.englishLevel || body.payload?.englishLevel || "Upper-intermediate";
      const requestedRole: "learner" = "learner";

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Full name, email, and password are required." },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      // Check existing user via Drizzle ORM
      const existingUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const userId = `user_${Date.now()}`;
      const learningGoal = "Professional communication & global teams";

      // Insert into `users` table via Drizzle ORM
      await db.insert(users).values({
        id: userId,
        name,
        email,
        passwordHash,
        role: requestedRole,
        onboardingCompleted: false,
      });

      // Insert into `profiles` table via Drizzle ORM
      await db.insert(profiles).values({
        id: `prof_${userId}`,
        userId,
        nativeLanguage,
        englishLevel,
        targetAccentId: "en-US",
        learningGoal,
        dailyPracticeGoalMinutes: 20,
        streakDays: 1,
        dailyMinutesCompletedToday: 0,
        onboardingCompleted: false,
      });

      const newUser: PlatformUserRecord = {
        id: userId,
        name,
        email,
        passwordHash,
        role: requestedRole,
        nativeLanguage,
        englishLevel,
        targetAccentId: "en-US",
        learningGoal,
        dailyPracticeGoalMinutes: 20,
        streakDays: 1,
        overallScore: 0,
        baselineScore: 0,
        onboardingCompleted: false,
        status: "active",
      };

      state.users.push(newUser);
      state.profile = {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        nativeLanguage: newUser.nativeLanguage,
        englishLevel: newUser.englishLevel,
        targetAccentId: newUser.targetAccentId,
        learningGoal: newUser.learningGoal,
        dailyPracticeGoalMinutes: newUser.dailyPracticeGoalMinutes,
        streakDays: 1,
        dailyMinutesCompletedToday: 0,
        onboardingCompleted: false,
      };

      saveStoreState(state);

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          onboardingCompleted: false,
        },
        state,
      });
    }

    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  } catch (err) {
    console.error("Auth API Error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
