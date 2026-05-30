create extension if not exists pgcrypto;

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

drop trigger if exists church_settings_updated_at on public.church_settings;
create trigger church_settings_updated_at before update on public.church_settings for each row execute function public.set_updated_at();

drop trigger if exists sermons_updated_at on public.sermons;
create trigger sermons_updated_at before update on public.sermons for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events for each row execute function public.set_updated_at();

drop trigger if exists ministries_updated_at on public.ministries;
create trigger ministries_updated_at before update on public.ministries for each row execute function public.set_updated_at();

alter table public.church_settings enable row level security;
alter table public.sermons enable row level security;
alter table public.events enable row level security;
alter table public.ministries enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read church settings" on public.church_settings;
create policy "Public can read church settings" on public.church_settings for select using (true);

drop policy if exists "Authenticated can manage church settings" on public.church_settings;
create policy "Authenticated can manage church settings" on public.church_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can read published sermons" on public.sermons;
create policy "Public can read published sermons" on public.sermons for select using (published = true);

drop policy if exists "Authenticated can manage sermons" on public.sermons;
create policy "Authenticated can manage sermons" on public.sermons for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events" on public.events for select using (published = true);

drop policy if exists "Authenticated can manage events" on public.events;
create policy "Authenticated can manage events" on public.events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can read published ministries" on public.ministries;
create policy "Public can read published ministries" on public.ministries for select using (published = true);

drop policy if exists "Authenticated can manage ministries" on public.ministries;
create policy "Authenticated can manage ministries" on public.ministries for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages" on public.contact_messages for insert with check (true);

drop policy if exists "Authenticated can read contact messages" on public.contact_messages;
create policy "Authenticated can read contact messages" on public.contact_messages for select using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage contact messages" on public.contact_messages;
create policy "Authenticated can manage contact messages" on public.contact_messages for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

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
