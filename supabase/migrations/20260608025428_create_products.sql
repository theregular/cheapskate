create table public.products (
  id uuid primary key default gen_random_uuid(),
  gtin text not null unique,
  name text not null,
  brand text,
  created_at timestamptz not null default now(),
  created_by uuid not null default auth.uid()
    references auth.users(id),
  updated_at timestamptz not null default now(),
  updated_by uuid not null default auth.uid()
    references auth.users(id)
);

alter table public.products enable row level security;

grant select, insert, update, delete
  on public.products
  to authenticated;

create policy "Authenticated users can read products"
  on public.products
  for select
  to authenticated
  using (true);

create policy "Authenticated users can create products"
  on public.products
  for insert
  to authenticated
  with check (
    (select auth.uid()) = created_by
    and (select auth.uid()) = updated_by
  );

create policy "Creators can update products"
  on public.products
  for update
  to authenticated
  using ((select auth.uid()) = created_by)
  with check (
    (select auth.uid()) = created_by
    and (select auth.uid()) = updated_by
  );

create policy "Creators can delete products"
  on public.products
  for delete
  to authenticated
  using ((select auth.uid()) = created_by);

create or replace function public.set_products_updated_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

create trigger products_set_updated_fields
before update on public.products
for each row
execute function public.set_products_updated_fields();
