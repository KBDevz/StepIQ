-- Add time-of-day tracking columns to test_results
alter table public.test_results
  add column if not exists tested_at_hour integer,
  add column if not exists tested_at_time_of_day text;

-- Constrain time_of_day to valid values
alter table public.test_results
  add constraint chk_tested_at_time_of_day
  check (tested_at_time_of_day in ('morning', 'afternoon', 'evening', 'night'));

-- Constrain hour to 0-23
alter table public.test_results
  add constraint chk_tested_at_hour
  check (tested_at_hour >= 0 and tested_at_hour <= 23);
