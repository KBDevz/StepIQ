-- Create test_results table
create table if not exists public.test_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  age integer not null,
  sex text not null check (sex in ('male', 'female')),
  beta_blocker boolean not null default false,
  max_hr integer not null,
  stop_hr integer not null,
  resting_hr integer,
  levels_completed integer not null,
  level_data jsonb not null default '[]'::jsonb,
  vo2_max numeric(5,1) not null,
  classification text not null,
  stop_reason text not null default '',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.test_results enable row level security;

-- Users can read their own results
create policy "Users can view own results"
  on public.test_results for select
  using (auth.uid() = user_id);

-- Users can insert their own results
create policy "Users can insert own results"
  on public.test_results for insert
  with check (auth.uid() = user_id);

-- Index for fast lookups by user
create index idx_test_results_user_id on public.test_results (user_id, created_at desc);
