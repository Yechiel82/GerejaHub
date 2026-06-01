create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('admin', 'leader', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  request text not null,
  visibility text not null default 'private' check (visibility in ('private', 'church')),
  status text not null default 'new' check (status in ('new', 'prayed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.church_settings (
  id text primary key default 'site',
  hero_eyebrow text not null default 'GerejaHub',
  hero_title text not null default 'Ladang Sudah Menguning',
  hero_description text not null default 'Mari menuai bersama dalam kasih, pelayanan, dan pertumbuhan iman. Temukan jadwal ibadah, renungan, komunitas, dan pelayanan gereja dalam satu tempat.',
  service_time text not null default 'Sunday, 9:00 AM',
  address text not null default '123 Faith Avenue, Jakarta',
  email text not null default 'hello@gerejahub.org',
  giving_note text not null default 'Add a secure giving provider when the church is ready.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null,
  sermon_date date not null,
  summary text,
  media_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  time_label text not null,
  location text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  meeting_day text,
  meeting_time text,
  meeting_location text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists prayer_requests_updated_at on public.prayer_requests;
create trigger prayer_requests_updated_at before update on public.prayer_requests for each row execute function public.set_updated_at();

drop trigger if exists church_settings_updated_at on public.church_settings;
create trigger church_settings_updated_at before update on public.church_settings for each row execute function public.set_updated_at();

drop trigger if exists sermons_updated_at on public.sermons;
create trigger sermons_updated_at before update on public.sermons for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events for each row execute function public.set_updated_at();

drop trigger if exists ministries_updated_at on public.ministries;
create trigger ministries_updated_at before update on public.ministries for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.church_settings enable row level security;
alter table public.sermons enable row level security;
alter table public.events enable row level security;
alter table public.ministries enable row level security;
alter table public.contact_messages enable row level security;

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile" on public.profiles for insert with check (auth.uid() = id and role = 'member');

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "Admins can read profiles" on public.profiles;
create policy "Admins can read profiles" on public.profiles for select using (public.current_profile_role() = 'admin');

drop policy if exists "Users can read own prayer requests" on public.prayer_requests;
create policy "Users can read own prayer requests" on public.prayer_requests for select using (auth.uid() = user_id);

drop policy if exists "Users can create own prayer requests" on public.prayer_requests;
create policy "Users can create own prayer requests" on public.prayer_requests for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own prayer requests" on public.prayer_requests;
create policy "Users can update own prayer requests" on public.prayer_requests for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Admins can manage prayer requests" on public.prayer_requests;
create policy "Admins can manage prayer requests" on public.prayer_requests for all using (public.current_profile_role() = 'admin') with check (public.current_profile_role() = 'admin');

drop policy if exists "Public can read church settings" on public.church_settings;
create policy "Public can read church settings" on public.church_settings for select using (true);

drop policy if exists "Authenticated can manage church settings" on public.church_settings;
create policy "Authenticated can manage church settings" on public.church_settings for all using (public.current_profile_role() = 'admin') with check (public.current_profile_role() = 'admin');

drop policy if exists "Public can read published sermons" on public.sermons;
create policy "Public can read published sermons" on public.sermons for select using (published = true);

drop policy if exists "Authenticated can manage sermons" on public.sermons;
create policy "Authenticated can manage sermons" on public.sermons for all using (public.current_profile_role() = 'admin') with check (public.current_profile_role() = 'admin');

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events" on public.events for select using (published = true);

drop policy if exists "Authenticated can manage events" on public.events;
create policy "Authenticated can manage events" on public.events for all using (public.current_profile_role() = 'admin') with check (public.current_profile_role() = 'admin');

drop policy if exists "Public can read published ministries" on public.ministries;
create policy "Public can read published ministries" on public.ministries for select using (published = true);

drop policy if exists "Authenticated can manage ministries" on public.ministries;
create policy "Authenticated can manage ministries" on public.ministries for all using (public.current_profile_role() = 'admin') with check (public.current_profile_role() = 'admin');

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages" on public.contact_messages for insert with check (true);

drop policy if exists "Authenticated can read contact messages" on public.contact_messages;
create policy "Authenticated can read contact messages" on public.contact_messages for select using (public.current_profile_role() = 'admin');

drop policy if exists "Authenticated can manage contact messages" on public.contact_messages;
create policy "Authenticated can manage contact messages" on public.contact_messages for update using (public.current_profile_role() = 'admin') with check (public.current_profile_role() = 'admin');

create unique index if not exists sermons_title_date_unique on public.sermons (title, sermon_date);
create unique index if not exists events_title_time_unique on public.events (title, time_label);
create unique index if not exists ministries_name_unique on public.ministries (name);

insert into public.church_settings (id)
values ('site')
on conflict (id) do nothing;

insert into public.sermons (title, speaker, sermon_date, summary, media_url, published)
values
  ('Grace for the Road Ahead', 'Ps. Daniel Wijaya', '2026-05-24', 'Exploring how God''s grace sustains us through life''s journey and prepares us for what lies ahead.', 'https://example.com/sermons/grace-road-ahead', true),
  ('A House of Prayer', 'Ps. Maria Santoso', '2026-05-17', 'Understanding the importance of prayer in building a strong spiritual foundation for our church community.', 'https://example.com/sermons/house-of-prayer', true),
  ('Faith That Serves', 'Ps. Daniel Wijaya', '2026-05-10', 'Discovering how authentic faith naturally leads to serving others and making a difference in our community.', 'https://example.com/sermons/faith-serves', true),
  ('Walking in the Spirit', 'Ps. Maria Santoso', '2026-05-03', 'Learning to live daily guided by the Holy Spirit and experiencing His power in our lives.', 'https://example.com/sermons/walking-spirit', true),
  ('The Power of Forgiveness', 'Ps. Daniel Wijaya', '2026-04-26', 'Understanding biblical forgiveness and how it brings freedom and healing to our hearts.', 'https://example.com/sermons/power-forgiveness', true),
  ('Building on the Rock', 'Ps. Maria Santoso', '2026-04-19', 'Establishing our lives on the solid foundation of Christ and His teachings.', 'https://example.com/sermons/building-rock', true),
  ('Love in Action', 'Ps. Daniel Wijaya', '2026-04-12', 'Practical ways to demonstrate God''s love through our daily actions and relationships.', 'https://example.com/sermons/love-action', true),
  ('The Joy of Salvation', 'Ps. Maria Santoso', '2026-04-05', 'Rediscovering the joy and gratitude that comes from knowing we are saved by grace.', 'https://example.com/sermons/joy-salvation', true)
on conflict do nothing;

insert into public.events (title, event_date, time_label, location, description, published)
values
  ('Sunday Worship', null, 'Every Sunday, 9:00 AM', 'Main Sanctuary', null, true),
  ('Youth Night', null, 'Friday, 7:00 PM', 'Community Hall', null, true),
  ('Prayer Gathering', null, 'Wednesday, 6:30 PM', 'Chapel Room', null, true)
on conflict do nothing;

insert into public.ministries (name, description, meeting_day, meeting_time, meeting_location, sort_order, published)
values
  ('Kids Ministry', 'Nurturing children''s faith through age-appropriate lessons, games, and activities. We create a safe and fun environment where kids can learn about Jesus and grow in their relationship with God.', 'Every Sunday', '9:00 AM', 'Kids Room', 1, true),
  ('Youth Ministry', 'Empowering teenagers to live out their faith boldly. We meet weekly for worship, Bible study, and fellowship, helping young people navigate life''s challenges with Christ at the center.', 'Every Friday', '7:00 PM', 'Youth Hall', 2, true),
  ('Worship Team', 'Leading the congregation in heartfelt worship through music and song. We practice weekly and serve during Sunday services, using our musical gifts to glorify God and inspire others.', 'Every Thursday', '7:00 PM', 'Main Sanctuary', 3, true),
  ('Small Groups', 'Building authentic community through weekly gatherings in homes. These groups provide a space for deeper relationships, Bible study, prayer, and mutual support in our faith journey.', 'Various days', 'Various times', 'Members'' Homes', 4, true),
  ('Outreach Ministry', 'Sharing God''s love beyond our church walls through community service, evangelism, and mission trips. We actively seek opportunities to serve our neighbors and spread the Gospel.', 'Every Saturday', '9:00 AM', 'Church Parking Lot', 5, true),
  ('Prayer Ministry', 'Interceding for our church, community, and world. We meet regularly to pray together and are available to pray for specific needs and requests from our congregation.', 'Every Wednesday', '6:00 AM', 'Prayer Room', 6, true),
  ('Hospitality Team', 'Creating a welcoming atmosphere for visitors and members alike. We serve refreshments, greet guests, and ensure everyone feels at home in our church family.', 'Every Sunday', '8:00 AM', 'Fellowship Hall', 7, true),
  ('Media Team', 'Supporting worship services through audio, video, and live streaming. We use technology to enhance the worship experience and extend our reach to those who can''t attend in person.', 'Every Tuesday', '7:30 PM', 'Media Room', 8, true)
on conflict do nothing;

-- Phase 1: Member Area Features

-- Event RSVPs
create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('going', 'maybe', 'not_going')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, user_id)
);

-- Sermon Bookmarks
create table if not exists public.sermon_bookmarks (
  id uuid primary key default gen_random_uuid(),
  sermon_id uuid not null references public.sermons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(sermon_id, user_id)
);

-- Sermon Notes
create table if not exists public.sermon_notes (
  id uuid primary key default gen_random_uuid(),
  sermon_id uuid not null references public.sermons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ministry Members
create table if not exists public.ministry_members (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'leader')),
  joined_at timestamptz not null default now(),
  unique(ministry_id, user_id)
);

-- Triggers for updated_at
drop trigger if exists event_rsvps_updated_at on public.event_rsvps;
create trigger event_rsvps_updated_at before update on public.event_rsvps for each row execute function public.set_updated_at();

drop trigger if exists sermon_notes_updated_at on public.sermon_notes;
create trigger sermon_notes_updated_at before update on public.sermon_notes for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.event_rsvps enable row level security;
alter table public.sermon_bookmarks enable row level security;
alter table public.sermon_notes enable row level security;
alter table public.ministry_members enable row level security;

-- RLS Policies for event_rsvps
drop policy if exists "Users can read own RSVPs" on public.event_rsvps;
create policy "Users can read own RSVPs" on public.event_rsvps for select using (auth.uid() = user_id);

drop policy if exists "Users can create own RSVPs" on public.event_rsvps;
create policy "Users can create own RSVPs" on public.event_rsvps for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own RSVPs" on public.event_rsvps;
create policy "Users can update own RSVPs" on public.event_rsvps for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own RSVPs" on public.event_rsvps;
create policy "Users can delete own RSVPs" on public.event_rsvps for delete using (auth.uid() = user_id);

drop policy if exists "Admins can manage all RSVPs" on public.event_rsvps;
create policy "Admins can manage all RSVPs" on public.event_rsvps for all using (public.current_profile_role() = 'admin');

-- RLS Policies for sermon_bookmarks
drop policy if exists "Users can read own bookmarks" on public.sermon_bookmarks;
create policy "Users can read own bookmarks" on public.sermon_bookmarks for select using (auth.uid() = user_id);

drop policy if exists "Users can create own bookmarks" on public.sermon_bookmarks;
create policy "Users can create own bookmarks" on public.sermon_bookmarks for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own bookmarks" on public.sermon_bookmarks;
create policy "Users can delete own bookmarks" on public.sermon_bookmarks for delete using (auth.uid() = user_id);

-- RLS Policies for sermon_notes
drop policy if exists "Users can read own notes" on public.sermon_notes;
create policy "Users can read own notes" on public.sermon_notes for select using (auth.uid() = user_id);

drop policy if exists "Users can create own notes" on public.sermon_notes;
create policy "Users can create own notes" on public.sermon_notes for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own notes" on public.sermon_notes;
create policy "Users can update own notes" on public.sermon_notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own notes" on public.sermon_notes;
create policy "Users can delete own notes" on public.sermon_notes for delete using (auth.uid() = user_id);

-- RLS Policies for ministry_members
drop policy if exists "Users can read own memberships" on public.ministry_members;
create policy "Users can read own memberships" on public.ministry_members for select using (auth.uid() = user_id);

drop policy if exists "Users can create own memberships" on public.ministry_members;
create policy "Users can create own memberships" on public.ministry_members for insert with check (auth.uid() = user_id and role = 'member');

drop policy if exists "Users can delete own memberships" on public.ministry_members;
create policy "Users can delete own memberships" on public.ministry_members for delete using (auth.uid() = user_id);

drop policy if exists "Admins can manage all memberships" on public.ministry_members;
create policy "Admins can manage all memberships" on public.ministry_members for all using (public.current_profile_role() = 'admin');

drop policy if exists "Leaders can read their ministry members" on public.ministry_members;
create policy "Leaders can read their ministry members" on public.ministry_members for select using (
  role = 'leader' and user_id = auth.uid()
);

-- Indexes for performance
create index if not exists event_rsvps_user_id_idx on public.event_rsvps(user_id);
create index if not exists event_rsvps_event_id_idx on public.event_rsvps(event_id);
create index if not exists sermon_bookmarks_user_id_idx on public.sermon_bookmarks(user_id);
create index if not exists sermon_bookmarks_sermon_id_idx on public.sermon_bookmarks(sermon_id);
create index if not exists sermon_notes_user_id_idx on public.sermon_notes(user_id);
create index if not exists sermon_notes_sermon_id_idx on public.sermon_notes(sermon_id);
create index if not exists ministry_members_user_id_idx on public.ministry_members(user_id);
create index if not exists ministry_members_ministry_id_idx on public.ministry_members(ministry_id);
