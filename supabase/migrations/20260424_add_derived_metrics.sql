-- Add derived metrics columns to test_results for analytics
-- These can be recomputed from level_data but are denormalized for query convenience

alter table public.test_results
  add column if not exists zone_method text,
  add column if not exists aerobic_threshold integer,
  add column if not exists hr_efficiency numeric(6,4),
  add column if not exists regression_r2 numeric(4,3),
  add column if not exists regression_slope numeric(8,6);

alter table public.test_results
  add constraint chk_zone_method
  check (zone_method in ('data-derived', 'karvonen'));
