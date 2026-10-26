-- AISS Foundation Baseline Migration
-- Reconciled from docs/backend/supabase-setup/01-bootstrap-development.sql
-- Represents the agreed baseline schema for student branches.
-- DO NOT re-run against a database where 01-bootstrap-development.sql was already executed.

begin;

-- 1. admin_users table
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 3 and 160),
  description text not null check (char_length(btrim(description)) between 10 and 3000),
  category text not null check (category in ('WORKSHOP','TALK','BUILD SESSION')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text check (location is null or char_length(location) <= 200),
  lead text check (lead is null or char_length(lead) <= 200),
  image_path text check (image_path is null or image_path in (
    '/students/gizem/ai-ethics.jpg','/students/gizem/computer-vision.jpg',
    '/students/gizem/llm-finetuning.jpg','/students/gizem/transformer-architecture.jpg'
  )),
  publication_status text not null default 'draft'
    check (publication_status in ('draft','published','archived')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

-- 3. contact_messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 100),
  university_email text not null check (
    char_length(university_email) <= 254
    and university_email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  ),
  area_of_interest text not null check (area_of_interest in (
    'Machine Learning','Robotics','Joining the Team','General Inquiry'
  )),
  message text not null check (char_length(btrim(message)) between 10 and 3000),
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- 4. Indexes
create index if not exists events_publication_time_idx on public.events(publication_status, starts_at);
create unique index if not exists events_one_published_featured_idx on public.events(is_featured)
  where publication_status = 'published' and is_featured = true;
create index if not exists contact_messages_recent_idx on public.contact_messages(created_at desc);
create index if not exists contact_messages_status_recent_idx on public.contact_messages(status, created_at desc);

-- 5. Updated_at Trigger Function
create or replace function public.aiss_touch_updated_at()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.aiss_touch_updated_at() from public, anon, authenticated;

drop trigger if exists events_touch_updated_at on public.events;
create trigger events_touch_updated_at before update on public.events
for each row execute function public.aiss_touch_updated_at();

-- 6. Row Level Security & Explicit Grants
alter table public.admin_users enable row level security;
alter table public.events enable row level security;
alter table public.contact_messages enable row level security;

revoke all on public.admin_users, public.events, public.contact_messages
  from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;

-- admin_users policy & grant
grant select on public.admin_users to authenticated;
drop policy if exists admin_users_read_self on public.admin_users;
create policy admin_users_read_self on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

-- events policies & grants
grant select on public.events to anon, authenticated;
drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events for select to anon, authenticated
  using (publication_status = 'published');

drop policy if exists events_admin_read on public.events;
create policy events_admin_read on public.events for select to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant insert (title,description,category,starts_at,ends_at,location,lead,image_path,
  publication_status,is_featured) on public.events to authenticated;
grant update (title,description,category,starts_at,ends_at,location,lead,image_path,
  publication_status,is_featured) on public.events to authenticated;

drop policy if exists events_admin_insert on public.events;
create policy events_admin_insert on public.events for insert to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists events_admin_update on public.events;
create policy events_admin_update on public.events for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- contact_messages policies & grants (No anonymous access)
grant select on public.contact_messages to authenticated;
grant update (status) on public.contact_messages to authenticated;

drop policy if exists messages_admin_read on public.contact_messages;
create policy messages_admin_read on public.contact_messages for select to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists messages_admin_status_update on public.contact_messages;
create policy messages_admin_status_update on public.contact_messages for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Service role privileged access for contact messages (never used in browser)
revoke all on public.contact_messages from service_role;
grant select, insert on public.contact_messages to service_role;

notify pgrst, 'reload schema';
commit;
