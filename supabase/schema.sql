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
  ('Grace for the Road Ahead', 'Ps. Daniel Wijaya', '2026-05-24', null, null, true),
  ('A House of Prayer', 'Ps. Maria Santoso', '2026-05-17', null, null, true),
  ('Faith That Serves', 'Ps. Daniel Wijaya', '2026-05-10', null, null, true)
on conflict do nothing;

insert into public.events (title, event_date, time_label, location, description, published)
values
  ('Sunday Worship', null, 'Every Sunday, 9:00 AM', 'Main Sanctuary', null, true),
  ('Youth Night', null, 'Friday, 7:00 PM', 'Community Hall', null, true),
  ('Prayer Gathering', null, 'Wednesday, 6:30 PM', 'Chapel Room', null, true)
on conflict do nothing;

insert into public.ministries (name, description, sort_order, published)
values
  ('Kids', null, 1, true),
  ('Youth', null, 2, true),
  ('Worship', null, 3, true),
  ('Small Groups', null, 4, true),
  ('Outreach', null, 5, true),
  ('Prayer', null, 6, true)
on conflict do nothing;
