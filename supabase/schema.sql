-- Reading-room booking schema
-- Run this file in the Supabase SQL Editor before seed.sql

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  room_id uuid not null references public.rooms (id) on delete cascade,
  booking_date date not null,
  time_slot text not null,
  purpose text not null,
  created_at timestamptz not null default now(),
  constraint bookings_room_date_slot_unique unique (room_id, booking_date, time_slot)
);

alter table public.rooms enable row level security;
alter table public.bookings enable row level security;

drop policy if exists rooms_select_authenticated on public.rooms;
create policy rooms_select_authenticated
  on public.rooms
  for select
  to authenticated
  using (true);

drop policy if exists bookings_select_authenticated on public.bookings;
create policy bookings_select_authenticated
  on public.bookings
  for select
  to authenticated
  using (true);

drop policy if exists bookings_insert_own on public.bookings;
create policy bookings_insert_own
  on public.bookings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists bookings_update_own on public.bookings;
create policy bookings_update_own
  on public.bookings
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists bookings_delete_own on public.bookings;
create policy bookings_delete_own
  on public.bookings
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select on public.rooms to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
