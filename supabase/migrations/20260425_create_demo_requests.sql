-- Create demo_requests table for clinical page contact form
create table if not exists public.demo_requests (
  id uuid default gen_random_uuid() primary key,
  first_name text,
  last_name text,
  organization text,
  job_title text,
  email text,
  phone text,
  org_type text,
  monthly_volume text,
  message text,
  tab_source text,
  created_at timestamptz not null default now()
);

-- Allow anonymous inserts (no auth required for demo requests)
alter table public.demo_requests enable row level security;

create policy "Anyone can submit demo requests"
  on public.demo_requests for insert
  with check (true);

-- Index for admin lookups
create index idx_demo_requests_created on public.demo_requests (created_at desc);
