# Pyramid Workspace

A full-stack task management workspace built for the Full Stack Developer (Fresher) technical assessment.

**Stack:** Next.js 16 (App Router) · Tailwind CSS · NestJS · Supabase (Postgres via REST API) · TypeScript

**Live app:** https://pyramid-workspace.vercel.app
**API:** https://pyramid-workspace-api.onrender.com _(update after deploying — see [Deployment](#deployment))_

---

## Architecture

The frontend and backend are **two separate services**, matching the assessment's tech stack table (Next.js for frontend, NestJS for backend) — not a monolith where Next.js quietly does both jobs.

```
Browser
  │
  ├── POST/GET/DELETE /api/session ───────────► Next.js (same origin, Vercel)
  │                                              issues the guest-login cookie
  │
  └── GET/POST/PATCH/DELETE /api/tasks* ───────► NestJS (separate origin, Render)
                                                  │
                                                  ▼
                                          Supabase Postgres
                                          (via Supabase REST API)
```

- **NestJS is the one real backend.** It owns all task CRUD, DTO validation (`class-validator` + a global `ValidationPipe`), a `SessionGuard`, and talks to Postgres via the Supabase REST API. This is what the "clean NestJS APIs" requirement in the brief refers to.
- **Next.js is a client**, not a second backend. Its only server-side code is `/api/session`, which issues a signed, httpOnly cookie for guest login — this stays on the Next.js side because it's a same-origin auth concern for the browser session, not domain data.
- The browser calls Nest **directly and cross-origin**, sending the shared session cookie with `credentials: 'include'`. Nest's CORS is configured with `credentials: true` and reflects the calling origin, so the cookie set by Next.js is honoured by Nest's `SessionGuard`.

This is a deliberate correction from an earlier draft that duplicated task CRUD in Next.js API routes as well — that duplication has been removed. There is now exactly one backend, one database connection path, and one source of truth for task data.

---

## What's implemented

- **Guest login** — signed, httpOnly session cookie (`pyramid_guest`), no password required.
- **Task management** — full CRUD (create, read, update, delete) against NestJS, with:
  - List view grouped by status, and a Kanban board view
  - Search by title
  - Filter by status and priority (with an active-filter count badge)
  - Per-task actions: change status, change priority, delete — wired to real API calls with optimistic updates and rollback on failure
- **Theme + accent color** — persist across refreshes via `localStorage`.
- **Editable profile** — name/title/username/email are real controlled inputs with a save button, persisted locally and reflected in the sidebar.
- **Working "Leave Workspace"** — clears the session and returns to login.
- **Responsive layout** — collapsing sidebar and adjusted grid columns at tablet (800px) and mobile (560px) breakpoints.
- **Reusable component structure** — the UI is split into focused files under `components/` (see [Project layout](#project-layout)), not one large file.
- **No third-party branding** — custom favicon and initials-based avatars; no v0-generated assets or placeholder images.

## Known limitations / deviations from the Figma

The brief requires documenting intentional deviations here rather than leaving them undiscovered. Everything below was a deliberate scope decision, not an oversight.

**Auth**
- Only Guest Login is functional, per the brief's explicit requirement. The Figma shows a "Login with Google" button — it's rendered for visual fidelity but is disabled/decorative, since OAuth was never a stated requirement and wasn't worth the build time against graded criteria.
- Guest sessions currently share **one workspace** — any guest, in any browser, sees and edits the same task list. This wasn't a specific Figma requirement either way; it's a reasonable interpretation (Notion/Linear-style shared team workspace) but per-guest private data is an equally valid reading. Not changed without a decision either way — flagging it here so it's a documented choice, not a missed bug.

**Projects**
- Local-only, in-memory state — no `projects` table or API. Adding a project updates the UI but won't persist across a refresh. Tasks are the graded CRUD surface per the brief; Projects was intentionally left lighter.

**Task detail screen**
- Subtasks, comments, and file attachments are presentational (no backing API).
- Priority/Status rows in the Details panel are static text — Figma shows these as live dropdowns. Not wired up; would reuse the same pattern as `TaskActionsMenu`, which the list/board views do already use.
- The Dates row's calendar date-picker is not implemented (decorative).
- No real breadcrumb navigation (`Projects > Design Homepage`) — would require actual project↔task linkage in the data model, which doesn't exist yet. Currently just a "← Tasks" back button.

**Filters**
- The Filter popover uses a single flat panel with checkboxes (Status, Priority, etc.) rather than Figma's nested flyout-per-category submenus. Functionally equivalent (multi-select filtering works), visually simpler.

**Avatars**
- Figma mixes real photo avatars with initials. This build uses initials-only (no external images), by explicit request during development — a deliberate simplification, not a miss.

**AI assistant**
- Not part of the brief's requirements (confirmed against the Tech Stack and Requirements sections — neither mentions AI). Included anyway as a scoped extra: a single NestJS `/api/chat` endpoint with real function-calling against the actual `TasksService` (create/update/delete/list), not a UI mockup. See [AI assistant](#ai-assistant-optional) below. Fully optional — the app works with `GROQ_API_KEY` unset.

**General**
- Built primarily from screenshots of the Figma file rather than direct Figma file access (no exact hex/spacing/font tokens available during development) — closely matched, but not guaranteed pixel-perfect against the source file.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Set up Supabase

Only **one** database connection is needed — the NestJS API talks directly to Postgres.

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one).
2. Run this SQL in the Supabase SQL editor:

   ```sql
   create table public.tasks (
     id bigint generated always as identity primary key,
     title text not null,
     status text not null default 'To Do',
     priority text not null default 'Medium',
     member text default 'Admin',
     due_date date,
     labels text[] default '{}',
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );
   ```

3. Copy your **project URL** and **service role key** from *Project Settings → API*.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGIN=https://pyramid-workspace.vercel.app
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Never commit `.env.local`.

### 4. Run both services (two terminals)

```bash
npm run api:dev   # NestJS on http://localhost:4000
npm run dev       # Next.js on http://localhost:3000
```

Open `http://localhost:3000`. The frontend will call `http://localhost:4000` for task data (from `NEXT_PUBLIC_API_URL`).

---

## Build

```bash
npm run build       # Next.js production build
npm run api:build   # compiles the Nest API to dist/
npm run api:start   # runs the compiled Nest API (after api:build)
```

`dist/` is gitignored — always build fresh rather than relying on a committed copy.

---

## API reference (NestJS — the one backend)

All routes are prefixed with `/api` (`app.setGlobalPrefix('api')` in `main.ts`).

| Method | Route | Notes |
|---|---|---|
| `GET` | `/api/health` | DB connectivity check (runs a live query) |
| `GET` | `/api/tasks` | List tasks |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task (validated) |
| `PATCH` | `/api/tasks/:id` | Update a task (validated) |
| `DELETE` | `/api/tasks/:id` | Delete a task |

All `/api/tasks*` routes require the `pyramid_guest` session cookie (401 without it — issued by the Next.js `/api/session` route below).

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H 'Content-Type: application/json' \
  -H 'Cookie: pyramid_guest=<value from your browser>' \
  -d '{"title":"Review launch checklist","status":"To Do","priority":"High"}'
```

### Next.js (auth only)

| Method | Route | Notes |
|---|---|---|
| `POST` | `/api/session` | Create a guest session |
| `GET` | `/api/session` | Check session state |
| `DELETE` | `/api/session` | Clear the session |

---

## AI assistant (optional)

Not required by the brief — included as a scoped extra, see [Known limitations](#known-limitations--deviations-from-the-figma) above. A floating chat button (bottom-right) opens a panel that talks to `POST /api/chat`, which uses real OpenAI-compatible function-calling (via Groq) against the actual `TasksService` — it can list, create, update, and delete tasks through natural language, not just suggest text.

To enable it: get a free key at [console.groq.com](https://console.groq.com), set `GROQ_API_KEY` in `.env.local`, restart `npm run api:dev`. Without a key, the chat panel still renders but returns a clear "not configured" error — the rest of the app is unaffected either way.

---

## Project layout

```text
app/                         Next.js — frontend + guest-login cookie only
  api/session/route.ts          guest session (POST/GET/DELETE)
  icon.tsx, apple-icon.tsx      custom favicon, generated (no binary assets)
  layout.tsx, page.tsx

components/                  UI, split by responsibility (not one big file)
  types.ts                      shared TypeScript types
  data.ts                       seed data + lookup tables
  ui/                           Avatar (initials-based), IconButton, PriorityBadge
  topbar.tsx                    search, filter, fields, add-task/add-project
  sidebar.tsx                   workspace nav + profile popover
  profile-popover.tsx           theme/accent submenu
  menu-popover.tsx              fields toggle + working status/priority filters
  task-actions-menu.tsx         per-task dropdown: change status/priority, delete
  task-list.tsx / task-table.tsx    list view, grouped by status
  task-board.tsx                kanban board view
  detail-view.tsx               task detail screen
  projects-view.tsx             projects list (local state)
  settings-view.tsx             editable profile + working "Leave Workspace"
  login-view.tsx                 guest login screen
  chat-panel.tsx                 optional AI assistant panel
  workspace-app.tsx             orchestrator — owns state, wires everything together

lib/
  api-client.ts                  points the frontend at the NestJS API base URL
  supabase-admin.ts              Supabase REST client (Nest only)
  task-mapper.ts                 shared row → camelCase task mapper
  session.ts                     guest-session cookie helper (Next.js only)

server/src/                  NestJS API — the one backend
  main.ts                        bootstrap, dotenv, global prefix, ValidationPipe, CORS
  app.module.ts                  root module
  common/session.guard.ts        reads the shared pyramid_guest cookie
  health/health.controller.ts    GET /api/health
  tasks/                         controller, service, module, create/update DTOs
  chat/                          optional AI assistant: controller, service, module
```

---

## Deployment

### Next.js → Vercel

Already deployed. Set `NEXT_PUBLIC_API_URL` as a Vercel environment variable, pointing at the deployed Nest URL (see below).

### NestJS → Render

Vercel can't run a persistent Node server, so the backend deploys separately.

1. **Database:** reuse the Supabase Postgres connection string from setup step 2 above — no second database needed.
2. **New Web Service** on Render, connect this GitHub repo.
3. **Root Directory:** leave as the repo root (not `server/`) — the Nest service imports shared code from `lib/`.
4. **Build Command:** `npm install && npm run api:build`
5. **Start Command:** `npm run api:start`
6. **Environment variables:**
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — from Supabase's Project Settings → API
   - `ALLOWED_ORIGIN` — your Vercel URL, e.g. `https://pyramid-workspace.vercel.app`
7. Deploy, then verify: `curl https://your-render-url.onrender.com/api/health` should return `{"status":"ok","databaseConfigured":true,...}`.
8. Update `NEXT_PUBLIC_API_URL` on Vercel to the Render URL and redeploy the frontend.

Both services read from the same Supabase project, so there is exactly one source of truth for task data.
