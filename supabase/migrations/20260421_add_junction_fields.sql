-- Add Junction (wearable) integration fields

-- Store Junction user ID on profiles for wearable connection
alter table public.profiles
  add column if not exists junction_user_id text,
  add column if not exists junction_provider text;

-- Track how HR was captured on each test result
alter table public.test_results
  add column if not exists hr_capture_method text not null default 'manual'
    check (hr_capture_method in ('manual', 'wearable'));
