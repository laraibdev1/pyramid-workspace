# Pyramid Workspace

A full-stack task management workspace built for the Full Stack Developer (Fresher) technical assessment.

**Stack:** Next.js 16 (App Router) · Tailwind CSS · NestJS · Supabase (Postgres via Drizzle ORM) · TypeScript

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
                                          (via Drizzle ORM)
```

- **NestJS is the one real backend.** It owns all task CRUD, DTO validation (`class-validator` + a global `ValidationPipe`), a `SessionGuard`, and talks directly to Postgres via Drizzle. This is what the "clean NestJS APIs" requirement in the brief refers to.
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

- Projects are **local-only** (no `projects` table/API) — adding a project updates in-memory state but won't persist across a refresh. Tasks are the graded CRUD surface per the brief; projects were left as a lighter, static-feeling area.
- Subtasks, comments, and file attachments on the task detail screen are presentational (no backing API) — out of scope for the assessment's core CRUD requirement.
- Design fidelity was built from the Figma reference without direct design-file access during this pass; a final pixel-check against the source file is worth doing before submission.

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
     labels jsonb not null default '[]',
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );
   ```

3. Copy your **Postgres connection string** from *Project Settings → Database → Connection string* — use the **Session** pooler mode (not Transaction), since both local dev and Render are long-running processes, not serverless.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```env
DATABASE_URL=postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-x-xxxx.pooler.supabase.com:5432/postgres
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
  workspace-app.tsx             orchestrator — owns state, wires everything together

lib/
  api-client.ts                  points the frontend at the NestJS API base URL
  db/schema.ts, db/index.ts      Drizzle schema + Postgres client (Nest only)
  session.ts                     guest-session cookie helper (Next.js only)

server/src/                  NestJS API — the one backend
  main.ts                        bootstrap, global prefix, ValidationPipe, CORS
  app.module.ts                  root module
  common/session.guard.ts        reads the shared pyramid_guest cookie
  health/health.controller.ts    GET /api/health
  tasks/                         controller, service, module, create/update DTOs
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
   - `DATABASE_URL` — the Supabase connection string
   - `ALLOWED_ORIGIN` — your Vercel URL, e.g. `https://pyramid-workspace.vercel.app`
7. Deploy, then verify: `curl https://your-render-url.onrender.com/api/health` should return `{"status":"ok","databaseConfigured":true,...}`.
8. Update `NEXT_PUBLIC_API_URL` on Vercel to the Render URL and redeploy the frontend.

Both services read from the same Supabase project, so there is exactly one source of truth for task data.
