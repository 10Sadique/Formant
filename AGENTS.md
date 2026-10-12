# AGENTS.md — Formant v1 Engineering & Design Contract

This document defines the architectural invariants, UI/UX constraints, data flow, and verification criteria for AI agents working in **Formant** (`accent-lab`).

---

## 1. Visual & Component Invariants (Strict Guardrails)

Every UI change must preserve the **Editorial Warm Off-White & Obsidian** design system (`src/app/globals.css`):

- **Palette**:
  - **Light Mode (default)**: `#FBF9F5` canvas, `#FFFFFF` cards, `#F4F1EA` secondary panels, `1px solid #E5E0D5` borders, `#141413` ink, `#1B4332` deep forest green primary accent, `#B84A27` warm terracotta alert/secondary accent.
  - **Dark Mode (`html.dark`)**: `#111110` obsidian canvas, `#1E1E1B` cards, `#181816` panels, `#2E2D29` borders, `#F3EFE6` text, `#265C45` / `#6EE7B7` forest accents.
- **Typography**:
  - Display & Section Headings (`h1`, `h2`): `Newsreader` (`font-serif`).
  - Body, Labels & Controls: `Plus Jakarta Sans` (`font-sans`).
  - IPA Phonetics, Scores & Acoustic Telemetry: `JetBrains Mono` (`font-mono`).
- **Flat Surface Rule (Zero Shadows & Zero Gradients)**:
  - Use `1px solid` hairline borders (`border-[#E5E0D5]` / `dark:border-[#2E2D29]`) to separate surfaces.
  - Never add `shadow-*` or `bg-gradient-*` / `from-*` / `to-*` classes. Global CSS enforces `box-shadow: none !important` and `background-image: none !important`.
- **Component Primitives (`shadcn/ui` + Radix / Base UI)**:
  - Use shared primitives from `src/components/ui/`:
    - [`button.tsx`](src/components/ui/button.tsx) (`<Button>`)
    - [`card.tsx`](src/components/ui/card.tsx) (`<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`)
    - [`primitives.tsx`](src/components/ui/primitives.tsx) (`<Input>`, `<Label>`, `<Badge>`, `<Progress>`)
    - [`select.tsx`](src/components/ui/select.tsx) (`<Select>`, `<SelectTrigger>`, `<SelectValue>`, `<SelectContent>`, `<SelectItem>`)
    - [`form.tsx`](src/components/ui/form.tsx) (`<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormDescription>`, `<FormMessage>`) backed by `react-hook-form`, `@hookform/resolvers/zod`, and schemas in [`src/lib/validations/forms.ts`](src/lib/validations/forms.ts)
  - Always use `<Select>` from `src/components/ui/select.tsx` for dropdown selections; never use native `<select>` elements.
  - Use `lucide-react` for all iconography.
- **Customer-Facing Copy**:
  - Write concise, natural product copy. Never expose internal library or infrastructure names (`PostgreSQL`, `IndexedDB`, `Gemini`, `CMU`, `Web Audio`, `Auth.js`, `MVP`) in user-facing UI text.

---

## 2. Layout, Routing & Role-Based Access Control (RBAC)

Routing and layout chrome are governed by [`src/components/layout/AppNavigation.tsx`](src/components/layout/AppNavigation.tsx):

1. **Public Routes (`/`, `/login`, `/register`)**:
   - Render without the dashboard sidebar layout.
   - **Authenticated Redirect Guard**: When `authUser.isAuthenticated === true`, visiting `/login` or `/register` immediately redirects to `/dashboard` (or `/onboarding` if `onboardingCompleted === false`).
2. **Standalone Onboarding (`/onboarding`)**:
   - Requires authentication (`authUser.isAuthenticated === true`), but renders in a dedicated full-screen calibration layout **without** the left sidebar (`aside`).
3. **Authenticated Workspace (`/dashboard`, `/assessment`, `/lessons`, `/compare`, `/history`, `/settings`)**:
   - Renders with the left vertical sidebar (`lg:w-64`) and top header bar.
   - **Seamless Header Alignment**: Both the left sidebar brand header and the top utility header must maintain `h-16` (`64px`) with `border-b border-[#E5E0D5]` and zero banners above the top header so the horizontal divider line aligns to the exact pixel.
   - **Navigation Chrome Rules**:
     - Sidebar bottom user card displays only user identity, role badge, and the `Sign Out` button (no `Settings` or `Role` buttons in the bottom card).
     - Top utility bar displays the active page title, theme toggle (`Light Mode` / `Dark Mode`), and `Sign Out` button (no `Settings` button in the top bar).
4. **SuperAdmin Role (`/admin` & Global Settings)**:
   - Public registration (`/register` and `POST /api/auth` with `action: "register"`) always assigns `role = "learner"`. Never allow role selection during signup.
   - `superadmin` accounts are provisioned exclusively via database seeding in [`src/lib/db/postgres.ts`](src/lib/db/postgres.ts) and [`src/lib/db/seed.ts`](src/lib/db/seed.ts) (`SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`, defaulting to `admin@accentlab.ai` / `Admin@12345`).
   - Only `authUser.role === "superadmin"` can see the `Admin Console` sidebar link, visit `/admin`, or see the Global Platform Settings section in `/settings`.

---

## 3. Data Layer, Authentication & Local-First Android Sync

- **PostgreSQL + Drizzle ORM & Zero Demo Data**:
  - Docker Compose ([`docker-compose.yml`](docker-compose.yml)) runs PostgreSQL 16 (`localhost:5432`, DB `accentlab`) and pgAdmin 4 Web (`http://localhost:5050`, pre-configured via [`docker/pgadmin/servers.json`](docker/pgadmin/servers.json)).
  - Database operations use **Drizzle ORM** via `await getDb()` from [`src/lib/db/postgres.ts`](src/lib/db/postgres.ts) (`drizzle-orm/node-postgres` with automatic fallback to `drizzle-orm/pglite` when the host Docker daemon is offline) against the typed tables in [`src/lib/db/schema.ts`](src/lib/db/schema.ts) (`db.select()`, `db.insert()`, `db.update()`, `db.delete()`).
  - Application state starts with **zero demo users, zero fake recordings, and zero fake snapshots**. All user accounts and recordings originate from real registrations and studio captures.
- **Authentication Flow**:
  - Configured with Auth.js v5 ([`src/auth.ts`](src/auth.ts), [`src/app/api/auth/[...nextauth]/route.ts`](src/app/api/auth/%5B...nextauth%5D/route.ts)) and `bcryptjs` 12-round password hashing in [`src/app/api/auth/route.ts`](src/app/api/auth/route.ts).
- **Client Data Fetching (`@tanstack/react-query`)**:
  - [`src/components/providers/AccentLabProvider.tsx`](src/components/providers/AccentLabProvider.tsx) wraps the app in `QueryClientProvider` and manages server state via `useQuery({ queryKey: ["accentlab-state"] })` and `queryClient.invalidateQueries`.
- **Local-First & Android Room Synchronization**:
  - Client audio captures and state snapshots are persisted locally first in IndexedDB (`accentlab_local_db`) via [`src/lib/sync/local-first-storage.ts`](src/lib/sync/local-first-storage.ts).
  - [`src/app/api/v1/sync/route.ts`](src/app/api/v1/sync/route.ts) exposes the `GET` delta pull (including Android Room SQLite DDL) and `POST` batch upload contract keyed by `clientRecordId` and `deviceId`.

---

## 4. Context Pointers by Task

- **Modifying DB Schema or Auth**: Read [`src/lib/db/schema.ts`](src/lib/db/schema.ts), [`src/lib/db/postgres.ts`](src/lib/db/postgres.ts), and [`src/app/api/auth/route.ts`](src/app/api/auth/route.ts).
- **Modifying Acoustic Analysis or Priority Scoring**: Read [`src/lib/audio/acoustic-dsp.ts`](src/lib/audio/acoustic-dsp.ts), [`src/lib/engine/priority-engine.ts`](src/lib/engine/priority-engine.ts), and [`src/lib/ai/gemini-speech-coach.ts`](src/lib/ai/gemini-speech-coach.ts).
- **Modifying Navigation, Layout, or Route Guards**: Read [`src/components/layout/AppNavigation.tsx`](src/components/layout/AppNavigation.tsx).
- **Modifying Client State or Local-First Sync**: Read [`src/components/providers/AccentLabProvider.tsx`](src/components/providers/AccentLabProvider.tsx) and [`src/lib/sync/local-first-storage.ts`](src/lib/sync/local-first-storage.ts).

---

## 5. Mandatory Completion Criteria

Before declaring any task complete:
1. Run `npm run typecheck` (`tsc --noEmit`) and confirm exit code `0` with zero TypeScript errors.
2. Verify zero native `<select>` elements exist in `src/` (all dropdowns must use `<Select>` from `src/components/ui/select.tsx`).
3. Verify zero `shadow-*` or `bg-gradient-*` classes were introduced.
4. Verify zero behind-the-scenes technology names or fake demo user data appear in user-facing components.
