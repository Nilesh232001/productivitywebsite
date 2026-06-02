# Personal OS

Personal OS is a productivity and time management platform for habits, tasks, study planning, goals, journaling, analytics, gamification, and productivity scoring.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Recharts and Chart.js-ready analytics layer
- Lucide React icons

## Project Structure

```txt
src/app                 App Router pages and global styles
src/components          Application shell, dashboard modules, charts, UI primitives
src/lib                 Domain types, scoring engine, mock data, Supabase clients
supabase/migrations     PostgreSQL schema, RLS policies, indexes
```

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and add Supabase project values when connecting the database.

## Database

Run `supabase/migrations/0001_initial_schema.sql` against a Supabase project. The schema includes:

- User profiles with XP and levels
- Habits and habit logs
- Tasks and task logs
- Goals and milestones
- Study sessions
- Journals and mood logs
- Achievements
- Productivity scores
- Notifications

All user-owned tables have row-level security policies scoped to `auth.uid()`.

## MVP Roadmap

Phase 1:
- Authentication
- Dashboard
- Habit tracker
- Task manager
- Study tracker

Phase 2:
- Goals
- Journal
- Analytics

Phase 3:
- Productivity score engine
- Gamification
- Calendar module

## Implementation Notes

The current UI uses typed mock data so the product surface is runnable before Supabase credentials exist. Replace reads from `src/lib/mock-data.ts` with server-side Supabase queries as auth and persistence are connected.
