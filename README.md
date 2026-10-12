# Formant v1 — Spoken-English Pronunciation, Prosody & Clarity Studio

**Formant** is a full-stack spoken-English pronunciation, prosody, and accent training application built with **Next.js 15 (App Router)**, **React 19**, **TanStack Query**, **Auth.js v5 (`next-auth`)**, **Drizzle ORM**, **PostgreSQL 16 (Docker + pgAdmin 4 Web)**, and **shadcn/ui** components.

---

## Key Features

- **18-Skill Phonetic & Prosodic Matrix**: Tracks segmental pronunciation (American `/ɹ/`, dental fricatives `/θ, ð/`, tense/lax vowel contrasts, intervocalic flap `/ɾ/`), prosody (word stress, sentence focus, pitch contour), and connected speech (linking, function-word reduction, rhythm `nPVI`).
- **Priority Scoring Engine**: Dynamically ranks practice lessons using `Priority = Severity × Frequency × Importance`, calibrated to the learner's native language (`L1`) transfer baseline.
- **8-Stage Interactive Lesson Studio**: Guides learners through `Learn → Hear Contrast → Minimal Pair Perception → Guided Imitation → Sentence Shadowing → Context Production → Free Response → Summary`.
- **Real-Time Acoustic & Speech Coaching**: Captures browser audio (`48kHz` mono `.wav`), computes pitch (`F0`), rhotic formant (`F3`), rhythm (`nPVI`), and speech rate (`WPM`), and generates grounded articulatory feedback in both **Simple** and **Detailed** modes.
- **Role-Based Access Control (RBAC)**:
  - **Learner**: Public registration (`/register`), standalone calibration (`/onboarding`), dashboard (`/dashboard`), baseline & weekly reassessment (`/assessment`), 8-stage lessons (`/lessons`), before/after comparison (`/compare`), recording history (`/history`), and user settings (`/settings`).
  - **SuperAdmin**: Provisioned exclusively via database seeding (`admin@accentlab.ai`). Unlocks `/admin` (full CRUD over users, lessons, phonetic skills, recordings, and target English varieties) plus Global Platform Settings in `/settings`.
- **Local-First & Android Sync Ready**: Persists recordings and state snapshots locally in IndexedDB (`accentlab_local_db`) and exposes `/api/v1/sync` (`GET` delta pull with Android Room SQLite DDL + `POST` batch upload) for offline-first mobile synchronization.

---

## Prerequisites

- **Node.js** `>= 20.x` and **npm**
- **Docker Desktop** (for running PostgreSQL 16 and pgAdmin 4 Web via `docker compose`)
  - *Note*: If Docker Desktop is offline, [`src/lib/db/postgres.ts`](src/lib/db/postgres.ts) automatically falls back to an embedded PostgreSQL 16 instance (`@electric-sql/pglite` in `.data/pglite-sql`) using the exact same Drizzle ORM schema so the app still runs seamlessly.

---

## Step-by-Step Setup & Running Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (`.env`)

A `.env` file is included in the repository root. Verify or customize the following values in `.env`:

```env
# PostgreSQL 16 (Docker Compose)
DATABASE_URL="postgresql://accentlab:accentlab_password@localhost:5432/accentlab"

# pgAdmin 4 Web Console
PGADMIN_DEFAULT_EMAIL="admin@accentlab.ai"
PGADMIN_DEFAULT_PASSWORD="admin_password"

# Auth.js v5 Secret
AUTH_SECRET="accentlab-super-secret-jwt-key-2026-production-v1"

# Seeded SuperAdmin Account Credentials
SUPERADMIN_EMAIL="admin@accentlab.ai"
SUPERADMIN_PASSWORD="Admin@12345"
SUPERADMIN_NAME="System Administrator"

# Optional: Google Gemini API Key for live multimodal audio coaching
# (Falls back to deterministic acoustic coaching if omitted)
GEMINI_API_KEY=""
```

### 3. Start PostgreSQL 16 & pgAdmin 4 Web in Docker

Make sure **Docker Desktop** is running, then start the database and pgAdmin containers:

```bash
npm run db:up
# Equivalent to: docker compose up -d
```

This launches two containers defined in [`docker-compose.yml`](docker-compose.yml):
1. **PostgreSQL 16 (`accentlab-postgres`)**: Listening on `localhost:5432` (Database: `accentlab`, User: `accentlab`, Password: `accentlab_password`).
2. **pgAdmin 4 Web (`accentlab-pgadmin`)**: Available at **[http://localhost:5050](http://localhost:5050)**
   - **pgAdmin Login Email**: `admin@accentlab.ai`
   - **pgAdmin Login Password**: `admin_password`
   - The `AccentLab PostgreSQL (Docker)` server connection is pre-registered automatically via [`docker/pgadmin/servers.json`](docker/pgadmin/servers.json).

### 4. Push Drizzle ORM Schema (Optional / When Modifying Schema)

All tables (`users`, `profiles`, `accents`, `skills`, `lessons`, `exercises`, `recordings`, `assessments`, `progress_snapshots`, etc.) and the seeded `superadmin` account are automatically created and seeded on server startup via [`src/lib/db/postgres.ts`](src/lib/db/postgres.ts).

To manually push schema changes from [`src/lib/db/schema.ts`](src/lib/db/schema.ts) or open Drizzle Studio:

```bash
npm run db:push
npm run db:studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Authentication & Default Accounts

The application starts with **zero demo learner data**—all learner accounts and recordings come from real registrations and microphone captures.

| Account Type | How to Access | Credentials |
| :--- | :--- | :--- |
| **New Learner** | Visit **[http://localhost:3000/register](http://localhost:3000/register)** | Create an account with your name, email, password (`8+` chars), and native language (`L1`). Public signups are always assigned the `learner` role. |
| **SuperAdmin** | Visit **[http://localhost:3000/login](http://localhost:3000/login)** | **Email**: `admin@accentlab.ai`<br>**Password**: `Admin@12345`<br>*(Seeded automatically into PostgreSQL via Drizzle ORM)* |

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js development server on `http://localhost:3000` |
| `npm run build` | Build the production application |
| `npm run start` | Run the compiled production server |
| `npm run typecheck` | Run TypeScript compiler validation (`tsc --noEmit`) |
| `npm run db:up` | Start PostgreSQL 16 (`:5432`) and pgAdmin 4 Web (`:5050`) containers |
| `npm run db:down` | Stop the Docker Compose containers |
| `npm run db:push` | Push Drizzle schema (`src/lib/db/schema.ts`) to PostgreSQL |
| `npm run db:studio` | Launch Drizzle Studio web database browser |

---

## Project Structure

```text
├── docker-compose.yml               # PostgreSQL 16 (:5432) + pgAdmin 4 Web (:5050)
├── drizzle.config.ts                # Drizzle Kit configuration
├── AGENTS.md                        # Engineering & UI/UX contract for AI coding agents
└── src/
    ├── auth.ts                      # Auth.js v5 (NextAuth) Credentials + Drizzle query setup
    ├── app/
    │   ├── page.tsx                 # Public Landing Page (/)
    │   ├── login/page.tsx           # Email & Password Sign-In (/login)
    │   ├── register/page.tsx        # Learner Registration (/register)
    │   ├── onboarding/page.tsx      # Standalone Language & Goal Calibration (/onboarding)
    │   ├── dashboard/page.tsx       # Intelligibility Radar & Priority Queue (/dashboard)
    │   ├── assessment/page.tsx      # Baseline & Reassessment Studio (/assessment)
    │   ├── lessons/                 # 8-Stage Pronunciation & Prosody Curriculum (/lessons)
    │   ├── compare/page.tsx         # Before / After Acoustic Comparison (/compare)
    │   ├── history/page.tsx         # Recording Archive (/history)
    │   ├── settings/page.tsx        # User Preferences & SuperAdmin Global Settings (/settings)
    │   ├── admin/page.tsx           # SuperAdmin Console (/admin)
    │   └── api/
    │       ├── auth/                # Auth.js handlers & bcrypt + Drizzle registration/login
    │       ├── state/               # Drizzle-backed state & onboarding synchronization
    │       ├── analyze/             # Acoustic DSP + Speech Coach + Drizzle recording storage
    │       ├── admin/               # SuperAdmin CRUD endpoints
    │       └── v1/sync/             # Android Room & Local-First IndexedDB delta sync API
    ├── components/
    │   ├── ui/                      # shadcn/ui primitives (Button, Card, Input, Label, Select, Badge)
    │   ├── layout/AppNavigation.tsx # Route guards, RBAC, and seamless sidebar/header layout
    │   ├── audio/                   # Real-time Web Audio recorder & waveform monitor
    │   ├── feedback/                # Simple & Detailed speech coaching report cards
    │   └── providers/               # TanStack Query (QueryClientProvider) + Local-First sync
    └── lib/
        ├── db/                      # Drizzle ORM schema.ts, postgres.ts (getDb), seed-data.ts
        ├── audio/                   # Acoustic DSP feature extractor (F0, F3, nPVI, WPM, WAV encoder)
        ├── engine/                  # Priority Engine (Severity × Frequency × Importance)
        ├── ai/                      # Speech Coach feedback generator
        └── sync/                    # IndexedDB local-first persistence (local-first-storage.ts)
```
