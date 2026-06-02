create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text not null default 'Asia/Kolkata',
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text not null default 'General',
  cadence text not null check (cadence in ('Daily', 'Weekly', 'Monthly')),
  reminder_time time,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.habit_logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_on date not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'General',
  priority text not null check (priority in ('Critical', 'High', 'Medium', 'Low')),
  status text not null default 'Backlog' check (status in ('Backlog', 'Today', 'In Progress', 'Done')),
  due_at timestamptz,
  tags text[] not null default '{}',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_logs (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  from_status text,
  to_status text not null,
  created_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  cadence text not null check (cadence in ('Daily', 'Weekly', 'Monthly', 'Yearly')),
  progress integer not null default 0 check (progress between 0 and 100),
  target_date date,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.goal_milestones (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes integer not null check (duration_minutes >= 0),
  target_minutes integer not null default 0 check (target_minutes >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table public.journals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null,
  gratitude text,
  reflection text,
  growth_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create table public.moods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mood text not null,
  intensity integer not null check (intensity between 1 and 5),
  logged_on date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  code text not null,
  name text not null,
  description text not null,
  earned_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, code)
);

create table public.productivity_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score_date date not null,
  habit_completion numeric not null default 0,
  task_completion numeric not null default 0,
  study_progress numeric not null default 0,
  goal_progress numeric not null default 0,
  journal_completion numeric not null default 0,
  total_score integer not null check (total_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, score_date)
);

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  channel text not null default 'in_app' check (channel in ('in_app', 'email', 'push')),
  scheduled_for timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;
alter table public.goals enable row level security;
alter table public.goal_milestones enable row level security;
alter table public.study_sessions enable row level security;
alter table public.journals enable row level security;
alter table public.moods enable row level security;
alter table public.achievements enable row level security;
alter table public.productivity_scores enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles are self managed" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Habits are user scoped" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Habit logs are user scoped" on public.habit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Tasks are user scoped" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Task logs are user scoped" on public.task_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Goals are user scoped" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Goal milestones are user scoped" on public.goal_milestones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Study sessions are user scoped" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Journals are user scoped" on public.journals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Moods are user scoped" on public.moods for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Achievements are user scoped" on public.achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Scores are user scoped" on public.productivity_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Notifications are user scoped" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index habits_user_id_idx on public.habits(user_id);
create index habit_logs_user_date_idx on public.habit_logs(user_id, completed_on);
create index tasks_user_status_idx on public.tasks(user_id, status);
create index goals_user_cadence_idx on public.goals(user_id, cadence);
create index study_sessions_user_started_idx on public.study_sessions(user_id, started_at);
create index journals_user_entry_date_idx on public.journals(user_id, entry_date);
create index productivity_scores_user_date_idx on public.productivity_scores(user_id, score_date);
