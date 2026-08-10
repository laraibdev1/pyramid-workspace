# Pyramid Workspace

A full-stack project-management workspace built with Next.js 16, a separate NestJS API, Drizzle ORM, and Neon Postgres.

## Features

- Guest session login using a signed, httpOnly cookie.
- SSR route shell: the initial login/workspace state is decided on the server.
- Neon-backed task list with create, update, and delete API routes.
- Separate NestJS API with validation, CORS, and the same Neon database.
- List and board views, search, field controls, projects, task details, profile preferences, theme, and accent modes.
- Responsive UI based on the supplied Pyramid references.

## Environment

This project uses Supabase REST for task persistence. For local development, copy `.env.example` to `.env.local` and replace the placeholders with literal values:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
NEXT_PUBLIC_API_URL=http://localhost:4000
PORT=4000
```

Do not write JavaScript expressions such as `process.env.SUPABASE_URL` inside `.env.local`; environment files contain literal values. Never commit `.env.local` or expose the service-role key in browser code. Restart `npm run dev` after changing environment variables.

## Install

```bash
npm install
```

## Run the Next.js app

```bash
npm run dev
```

The web app runs on `http://localhost:3000`.

## Run the NestJS API

In a second terminal:

```bash
pnpm api:dev
```

The API runs on `http://localhost:4000`.

## Build and verify

```bash
npm run build
npm run api:build
```

The database health endpoint is available at `GET /api/health`. It reports whether the database connection is configured, whether the `public.tasks` table exists, and the latest database timestamp.

## API

### Next.js routes

- `GET /api/session` — inspect guest session state.
- `POST /api/session` — create a guest session.
- `DELETE /api/session` — clear the guest session.
- `GET /api/health` — check database connectivity and schema.
- `GET /api/tasks` — list persisted tasks.
- `POST /api/tasks` — create a task.
- `PATCH /api/tasks/:id` — update task fields.
- `DELETE /api/tasks/:id` — delete a task.

All task routes require the guest session cookie.

### NestJS routes

- `GET http://localhost:4000/health`
- `GET http://localhost:4000/tasks`
- `POST http://localhost:4000/tasks`

Example request:

```bash
curl -X POST http://localhost:4000/tasks \
  -H 'content-type: application/json' \
  -d '{"title":"Review launch checklist","status":"To Do","priority":"High"}'
```

## Database

The app expects a `public.tasks` table with these fields:

- `id`
- `title`
- `status`
- `priority`
- `member`
- `due_date`
- `labels`
- `created_at`
- `updated_at`

Schema setup is handled through the connected Supabase integration. The Next.js task routes use Supabase REST with the server-only service-role key. RLS is enabled on `public.tasks`; the service-role key is used only on the server and must never be prefixed with `NEXT_PUBLIC_`.

## Project layout

```text
app/                  Next.js routes and API handlers
components/           Interactive workspace client
lib/db/               Drizzle schema and database client
lib/session.ts        Guest session helper
server/src/           NestJS API
```
