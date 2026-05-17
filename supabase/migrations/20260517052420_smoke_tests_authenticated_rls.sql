alter table public.smoke_tests
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

delete from public.smoke_tests
where user_id is null;

alter table public.smoke_tests
  alter column user_id set default auth.uid(),
  alter column user_id set not null;

drop policy if exists "Authenticated users can read smoke tests" on public.smoke_tests;

create policy "Users can read their smoke tests"
  on public.smoke_tests
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their smoke tests"
  on public.smoke_tests
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert on public.smoke_tests to authenticated;
grant usage on sequence public.smoke_tests_id_seq to authenticated;
