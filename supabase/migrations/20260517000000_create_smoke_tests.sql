create extension if not exists postgis with schema extensions;

create table if not exists public.smoke_tests (
  id bigint primary key generated always as identity,
  label text not null,
  created_at timestamptz not null default now()
);

alter table public.smoke_tests enable row level security;

create policy "Authenticated users can read smoke tests"
  on public.smoke_tests
  for select
  to authenticated
  using (true);
