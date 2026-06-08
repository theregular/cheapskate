create table public.profiles (
  id uuid primary key
    references auth.users(id) on delete cascade,

  username text not null unique
    check (username ~ '^[a-z0-9_]{3,30}$'),

  display_name text not null
    check (char_length(trim(display_name)) between 1 and 80),

  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Explicitly prevent clients from creating or deleting profiles.
revoke insert, delete
  on public.profiles
  from anon, authenticated;

grant select, update
  on public.profiles
  to authenticated;

create policy "Authenticated users can read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create schema if not exists private;

revoke all
  on schema private
  from public, anon, authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    username,
    display_name
  )
  values (
    new.id,
    lower(trim(new.raw_user_meta_data ->> 'username')),
    trim(new.raw_user_meta_data ->> 'display_name')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();
