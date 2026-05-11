-- VisiblyAI Database Schema
-- Run in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Scans table
create table public.scans (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  business_name       text not null,
  website_url         text not null,
  city                text not null,
  primary_service     text not null,
  competitors         text[] default '{}',
  overall_score       integer not null,
  grade               char(1) not null,
  created_at          timestamptz default now()
);

alter table public.scans enable row level security;
create policy "Users can view own scans" on public.scans
  for select using (auth.uid() = user_id);
create policy "Users can insert own scans" on public.scans
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own scans" on public.scans
  for delete using (auth.uid() = user_id);

-- Scan results (detailed JSON)
create table public.scan_results (
  id            uuid primary key default uuid_generate_v4(),
  scan_id       uuid references public.scans(id) on delete cascade,
  categories    jsonb not null,
  insights      jsonb not null default '[]',
  problems      jsonb not null default '[]',
  recommendations jsonb not null default '[]',
  quick_wins    jsonb not null default '[]',
  competitor_comparison jsonb not null default '[]',
  created_at    timestamptz default now()
);

alter table public.scan_results enable row level security;
create policy "Users can view own scan results" on public.scan_results
  for select using (
    exists (select 1 from public.scans where scans.id = scan_results.scan_id and scans.user_id = auth.uid())
  );
create policy "Users can insert own scan results" on public.scan_results
  for insert with check (
    exists (select 1 from public.scans where scans.id = scan_results.scan_id and scans.user_id = auth.uid())
  );

-- Useful indexes
create index idx_scans_user_id    on public.scans(user_id);
create index idx_scans_created_at on public.scans(created_at desc);
create index idx_scan_results_scan_id on public.scan_results(scan_id);
