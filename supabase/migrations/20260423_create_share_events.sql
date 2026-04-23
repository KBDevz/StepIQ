-- Track share card generation events
create table if not exists public.share_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  test_result_id uuid references public.test_results on delete set null,
  format text not null check (format in ('square', 'story', 'challenge')),
  created_at timestamptz not null default now()
);

alter table public.share_events enable row level security;

create policy "Users can insert own share events"
  on public.share_events for insert
  with check (auth.uid() = user_id);

create policy "Users can view own share events"
  on public.share_events for select
  using (auth.uid() = user_id);
