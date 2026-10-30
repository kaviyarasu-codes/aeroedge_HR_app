-- AeroEdge HR: profiles table, row level security, and a trigger that
-- creates a profile automatically when someone signs up.
-- Run once in Supabase -> SQL Editor (or with the Supabase CLI: supabase db push).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'employee'
    check (role in ('admin', 'hr', 'manager', 'employee', 'intern')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Users may edit their own contact details, but not their role or status.
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke update on public.profiles from authenticated;
grant update (first_name, last_name, phone, avatar_url) on public.profiles to authenticated;

-- Create the profile from the sign-up metadata (first_name, last_name).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: profiles for users who signed up before this trigger existed.
insert into public.profiles (id, email, first_name, last_name)
select u.id,
       coalesce(u.email, ''),
       coalesce(u.raw_user_meta_data ->> 'first_name', ''),
       coalesce(u.raw_user_meta_data ->> 'last_name', '')
from auth.users u
on conflict (id) do nothing;
