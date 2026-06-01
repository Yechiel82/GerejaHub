-- Phase 2: Member Area Features
-- Run this SQL in Supabase SQL Editor after Phase 1 is complete

-- ============================================
-- 1. NOTIFICATIONS
-- ============================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('event', 'prayer', 'ministry', 'sermon', 'announcement', 'birthday')),
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_read_idx on public.notifications(read);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);

-- ============================================
-- 2. SMALL GROUPS
-- ============================================

create table if not exists public.small_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  leader_id uuid references auth.users(id) on delete set null,
  meeting_day text,
  meeting_time text,
  location text,
  max_members integer default 12,
  is_open boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.small_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.small_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(group_id, user_id)
);

create index if not exists small_group_members_group_id_idx on public.small_group_members(group_id);
create index if not exists small_group_members_user_id_idx on public.small_group_members(user_id);

-- ============================================
-- 3. EVENT ATTENDANCE (Enhancement)
-- ============================================

create table if not exists public.event_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references auth.users(id),
  unique(event_id, user_id)
);

create index if not exists event_attendance_event_id_idx on public.event_attendance(event_id);
create index if not exists event_attendance_user_id_idx on public.event_attendance(user_id);

-- ============================================
-- 4. MINISTRY ANNOUNCEMENTS
-- ============================================

create table if not exists public.ministry_announcements (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  title text not null,
  message text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists ministry_announcements_ministry_id_idx on public.ministry_announcements(ministry_id);

-- ============================================
-- TRIGGERS
-- ============================================

drop trigger if exists small_groups_updated_at on public.small_groups;
create trigger small_groups_updated_at before update on public.small_groups
  for each row execute function public.set_updated_at();

drop trigger if exists sermon_notes_updated_at on public.sermon_notes;
create trigger sermon_notes_updated_at before update on public.sermon_notes
  for each row execute function public.set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.notifications enable row level security;
alter table public.small_groups enable row level security;
alter table public.small_group_members enable row level security;
alter table public.event_attendance enable row level security;
alter table public.ministry_announcements enable row level security;

-- Notifications policies
drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications" on public.notifications 
  for select using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications" on public.notifications 
  for update using (auth.uid() = user_id);

drop policy if exists "Admins can manage all notifications" on public.notifications;
create policy "Admins can manage all notifications" on public.notifications 
  for all using (public.current_profile_role() = 'admin');

-- Small groups policies
drop policy if exists "Anyone can read published groups" on public.small_groups;
create policy "Anyone can read published groups" on public.small_groups 
  for select using (published = true);

drop policy if exists "Admins can manage all groups" on public.small_groups;
create policy "Admins can manage all groups" on public.small_groups 
  for all using (public.current_profile_role() = 'admin');

drop policy if exists "Leaders can update their groups" on public.small_groups;
create policy "Leaders can update their groups" on public.small_groups 
  for update using (auth.uid() = leader_id);

-- Small group members policies
drop policy if exists "Users can read group members" on public.small_group_members;
create policy "Users can read group members" on public.small_group_members 
  for select using (
    exists (
      select 1 from public.small_groups sg
      where sg.id = small_group_members.group_id
      and sg.published = true
    )
  );

drop policy if exists "Users can join groups" on public.small_group_members;
create policy "Users can join groups" on public.small_group_members 
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can leave groups" on public.small_group_members;
create policy "Users can leave groups" on public.small_group_members 
  for delete using (auth.uid() = user_id);

drop policy if exists "Admins can manage group members" on public.small_group_members;
create policy "Admins can manage group members" on public.small_group_members 
  for all using (public.current_profile_role() = 'admin');

-- Event attendance policies
drop policy if exists "Users can read own attendance" on public.event_attendance;
create policy "Users can read own attendance" on public.event_attendance 
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can manage attendance" on public.event_attendance;
create policy "Admins can manage attendance" on public.event_attendance 
  for all using (public.current_profile_role() = 'admin');

-- Ministry announcements policies
drop policy if exists "Members can read ministry announcements" on public.ministry_announcements;
create policy "Members can read ministry announcements" on public.ministry_announcements 
  for select using (
    exists (
      select 1 from public.ministry_members mm
      where mm.ministry_id = ministry_announcements.ministry_id
      and mm.user_id = auth.uid()
    )
  );

drop policy if exists "Leaders can create announcements" on public.ministry_announcements;
create policy "Leaders can create announcements" on public.ministry_announcements 
  for insert with check (
    exists (
      select 1 from public.ministry_members mm
      where mm.ministry_id = ministry_id
      and mm.user_id = auth.uid()
      and mm.role = 'leader'
    )
  );

drop policy if exists "Admins can manage announcements" on public.ministry_announcements;
create policy "Admins can manage announcements" on public.ministry_announcements 
  for all using (public.current_profile_role() = 'admin');

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample small groups
insert into public.small_groups (name, description, meeting_day, meeting_time, location, max_members, is_open, published)
values
  ('Young Adults', 'A group for young adults (18-30) to grow in faith together through Bible study, fellowship, and service.', 'Every Wednesday', '7:00 PM', 'Coffee House Downtown', 15, true, true),
  ('Couples Ministry', 'Married couples building stronger relationships through biblical principles and mutual support.', 'Every Friday', '7:30 PM', 'Church Fellowship Hall', 10, true, true),
  ('Men''s Bible Study', 'Men gathering to study God''s Word, pray together, and encourage one another in their faith walk.', 'Every Saturday', '7:00 AM', 'Church Prayer Room', 12, true, true),
  ('Women of Faith', 'Women supporting each other through prayer, Bible study, and authentic community.', 'Every Thursday', '10:00 AM', 'Member''s Home (Rotating)', 12, true, true),
  ('College & Career', 'Students and young professionals navigating faith in the modern world.', 'Every Tuesday', '8:00 PM', 'Campus Ministry Center', 20, true, true),
  ('Senior Saints', 'Mature believers sharing wisdom, prayer, and fellowship.', 'Every Monday', '2:00 PM', 'Church Library', 15, true, true)
on conflict do nothing;

-- Sample notifications (you'll need to replace user_id with actual user IDs)
-- insert into public.notifications (user_id, title, message, type, link)
-- values
--   ('user-uuid-here', 'New Sermon Available', 'Check out the latest sermon: "Walking in Faith"', 'sermon', '/member/sermons'),
--   ('user-uuid-here', 'Event Reminder', 'Youth Night is tomorrow at 7 PM!', 'event', '/member/events');

-- ============================================
-- FUNCTIONS FOR NOTIFICATIONS
-- ============================================

-- Function to create notification for all ministry members
create or replace function public.notify_ministry_members(
  p_ministry_id uuid,
  p_title text,
  p_message text,
  p_link text default null
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.notifications (user_id, title, message, type, link)
  select 
    mm.user_id,
    p_title,
    p_message,
    'ministry',
    p_link
  from public.ministry_members mm
  where mm.ministry_id = p_ministry_id;
end;
$$;

-- Function to create notification for all event RSVPs
create or replace function public.notify_event_attendees(
  p_event_id uuid,
  p_title text,
  p_message text
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.notifications (user_id, title, message, type, link)
  select 
    er.user_id,
    p_title,
    p_message,
    'event',
    '/member/events'
  from public.event_rsvps er
  where er.event_id = p_event_id
  and er.status = 'going';
end;
$$;

-- ============================================
-- COMPLETED
-- ============================================
-- Phase 2 schema is ready!
-- Next: Update TypeScript types and create UI components

-- Made with Bob
