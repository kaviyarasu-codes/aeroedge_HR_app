-- AeroEdge HR: daily attendance (check in / check out).
-- Run once in Supabase -> SQL Editor (or: supabase db push). Safe to re-run.
--
-- Times always come from the database clock (now()), never from the phone,
-- so users can read their records but can only change them through the
-- check_in / check_out functions below.

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  work_date date not null,
  mode text not null check (mode in ('office', 'remote')),
  check_in_at timestamptz not null default now(),
  check_out_at timestamptz,
  created_at timestamptz not null default now(),
  constraint attendance_one_per_day unique (user_id, work_date),
  constraint attendance_out_after_in check (check_out_at is null or check_out_at >= check_in_at)
);

create index if not exists attendance_records_user_date_idx
  on public.attendance_records (user_id, work_date desc);

alter table public.attendance_records enable row level security;

drop policy if exists "Users can read their own attendance" on public.attendance_records;
create policy "Users can read their own attendance"
  on public.attendance_records for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies or grants: writes go through the functions.
revoke insert, update, delete on public.attendance_records from authenticated, anon;
grant select on public.attendance_records to authenticated;

-- Today's date in the user's time zone (falls back to Asia/Kolkata).
create or replace function public.attendance_today(p_timezone text)
returns date
language plpgsql
stable
set search_path = ''
as $$
begin
  return (now() at time zone coalesce(nullif(p_timezone, ''), 'Asia/Kolkata'))::date;
exception when others then
  return (now() at time zone 'Asia/Kolkata')::date;
end;
$$;

-- Check in for today. Fails if already checked in today.
create or replace function public.check_in(p_mode text, p_timezone text default 'Asia/Kolkata')
returns public.attendance_records
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_row public.attendance_records;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if p_mode not in ('office', 'remote') then
    raise exception 'Mode must be office or remote' using errcode = '22023';
  end if;

  insert into public.attendance_records (user_id, work_date, mode)
  values (v_user, public.attendance_today(p_timezone), p_mode)
  returning * into v_row;
  return v_row;
exception when unique_violation then
  raise exception 'You have already checked in today' using errcode = '23505';
end;
$$;

-- Check out of today's record. Fails if not checked in or already checked out.
create or replace function public.check_out(p_timezone text default 'Asia/Kolkata')
returns public.attendance_records
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_row public.attendance_records;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;

  update public.attendance_records
     set check_out_at = now()
   where user_id = v_user
     and work_date = public.attendance_today(p_timezone)
     and check_out_at is null
  returning * into v_row;

  if v_row.id is null then
    raise exception 'No open check-in for today' using errcode = 'P0002';
  end if;
  return v_row;
end;
$$;

revoke execute on function public.check_in(text, text) from public, anon;
revoke execute on function public.check_out(text) from public, anon;
grant execute on function public.check_in(text, text) to authenticated;
grant execute on function public.check_out(text) to authenticated;
grant execute on function public.attendance_today(text) to authenticated;
