-- ─── Workouts ────────────────────────────────────────────────────────────────

create table if not exists public.workouts (
  id                 text        primary key,
  user_id            uuid        not null default auth.uid(),
  name               text        not null,
  description        text,
  exercises          jsonb       not null default '[]',
  estimated_duration integer     not null default 60,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.workouts enable row level security;

create policy "Users can view their own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workouts"
  on public.workouts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- ─── Meal Plans ───────────────────────────────────────────────────────────────

create table if not exists public.meal_plans (
  id               text        primary key,
  user_id          uuid        not null default auth.uid(),
  name             text        not null,
  description      text,
  meals            jsonb       not null default '[]',
  target_calories  integer     not null default 0,
  target_protein   integer     not null default 0,
  target_carbs     integer     not null default 0,
  target_fat       integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.meal_plans enable row level security;

create policy "Users can view their own meal plans"
  on public.meal_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own meal plans"
  on public.meal_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meal plans"
  on public.meal_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own meal plans"
  on public.meal_plans for delete
  using (auth.uid() = user_id);

-- ─── Workout Schedules ────────────────────────────────────────────────────────

create table if not exists public.workout_schedules (
  id               text        primary key,
  user_id          uuid        not null default auth.uid(),
  workout_id       text        not null,
  workout_name     text        not null,
  frequency        text        not null,
  date             text,
  days_of_week     jsonb,
  created_at       timestamptz not null default now()
);

alter table public.workout_schedules enable row level security;

create policy "Users can view their own schedules"
  on public.workout_schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedules"
  on public.workout_schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own schedules"
  on public.workout_schedules for delete
  using (auth.uid() = user_id);
