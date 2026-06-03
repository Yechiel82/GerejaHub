-- ============================================
-- GerejaHub Complete Database Setup
-- ============================================
-- This file contains ALL database migrations in the correct order.
-- Run this ONCE in Supabase SQL Editor for a fresh installation.
-- 
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- CORE TABLES
-- ============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'leader', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prayer requests table (with enhancements)
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  request TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'church')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'prayed', 'archived')),
  deleted_at TIMESTAMPTZ,
  is_hidden BOOLEAN DEFAULT FALSE,
  prayer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prayer interactions table (tracks who prayed)
CREATE TABLE IF NOT EXISTS prayer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prayer_id, user_id)
);

-- Church settings table
CREATE TABLE IF NOT EXISTS public.church_settings (
  id TEXT PRIMARY KEY DEFAULT 'site',
  hero_eyebrow TEXT NOT NULL DEFAULT 'GerejaHub',
  hero_title TEXT NOT NULL DEFAULT 'Ladang Sudah Menguning',
  hero_description TEXT NOT NULL DEFAULT 'Mari menuai bersama dalam kasih, pelayanan, dan pertumbuhan iman. Temukan jadwal ibadah, renungan, komunitas, dan pelayanan gereja dalam satu tempat.',
  service_time TEXT NOT NULL DEFAULT 'Sunday, 9:00 AM',
  address TEXT NOT NULL DEFAULT '123 Faith Avenue, Jakarta',
  email TEXT NOT NULL DEFAULT 'hello@gerejahub.org',
  giving_note TEXT NOT NULL DEFAULT 'Add a secure giving provider when the church is ready.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sermons table
CREATE TABLE IF NOT EXISTS public.sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  sermon_date DATE NOT NULL,
  summary TEXT,
  media_url TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE,
  time_label TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ministries table
CREATE TABLE IF NOT EXISTS public.ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  meeting_day TEXT,
  meeting_time TEXT,
  meeting_location TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MEMBER AREA TABLES
-- ============================================

-- Event RSVPs
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Sermon bookmarks
CREATE TABLE IF NOT EXISTS public.sermon_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.sermons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sermon_id, user_id)
);

-- Sermon notes (fixed column name)
CREATE TABLE IF NOT EXISTS public.sermon_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.sermons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ministry members
CREATE TABLE IF NOT EXISTS public.ministry_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id UUID NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'leader')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(ministry_id, user_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('event', 'prayer', 'ministry', 'sermon', 'announcement', 'birthday')),
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Small groups
CREATE TABLE IF NOT EXISTS public.small_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  meeting_day TEXT,
  meeting_time TEXT,
  location TEXT,
  max_members INTEGER DEFAULT 12,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Small group members
CREATE TABLE IF NOT EXISTS public.small_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.small_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Event attendance
CREATE TABLE IF NOT EXISTS public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_in_by UUID REFERENCES auth.users(id),
  UNIQUE(event_id, user_id)
);

-- Ministry announcements
CREATE TABLE IF NOT EXISTS public.ministry_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id UUID NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Current profile role function
CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Increment prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayer_count = prayer_count + 1
  WHERE id = NEW.prayer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Decrement prayer count
CREATE OR REPLACE FUNCTION decrement_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayer_count = GREATEST(prayer_count - 1, 0)
  WHERE id = OLD.prayer_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Notify ministry members
CREATE OR REPLACE FUNCTION public.notify_ministry_members(
  p_ministry_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT 
    mm.user_id,
    p_title,
    p_message,
    'ministry',
    p_link
  FROM public.ministry_members mm
  WHERE mm.ministry_id = p_ministry_id;
END;
$$;

-- Notify event attendees
CREATE OR REPLACE FUNCTION public.notify_event_attendees(
  p_event_id UUID,
  p_title TEXT,
  p_message TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT 
    er.user_id,
    p_title,
    p_message,
    'event',
    '/member/events'
  FROM public.event_rsvps er
  WHERE er.event_id = p_event_id
  AND er.status = 'going';
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS prayer_requests_updated_at ON public.prayer_requests;
CREATE TRIGGER prayer_requests_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS church_settings_updated_at ON public.church_settings;
CREATE TRIGGER church_settings_updated_at BEFORE UPDATE ON public.church_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS sermons_updated_at ON public.sermons;
CREATE TRIGGER sermons_updated_at BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS events_updated_at ON public.events;
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS ministries_updated_at ON public.ministries;
CREATE TRIGGER ministries_updated_at BEFORE UPDATE ON public.ministries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS event_rsvps_updated_at ON public.event_rsvps;
CREATE TRIGGER event_rsvps_updated_at BEFORE UPDATE ON public.event_rsvps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS sermon_notes_updated_at ON public.sermon_notes;
CREATE TRIGGER sermon_notes_updated_at BEFORE UPDATE ON public.sermon_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS small_groups_updated_at ON public.small_groups;
CREATE TRIGGER small_groups_updated_at BEFORE UPDATE ON public.small_groups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_increment_prayer_count ON prayer_interactions;
CREATE TRIGGER trigger_increment_prayer_count
AFTER INSERT ON prayer_interactions
FOR EACH ROW
EXECUTE FUNCTION increment_prayer_count();

DROP TRIGGER IF EXISTS trigger_decrement_prayer_count ON prayer_interactions;
CREATE TRIGGER trigger_decrement_prayer_count
AFTER DELETE ON prayer_interactions
FOR EACH ROW
EXECUTE FUNCTION decrement_prayer_count();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_prayer_interactions_prayer_id ON prayer_interactions(prayer_id);
CREATE INDEX IF NOT EXISTS idx_prayer_interactions_user_id ON prayer_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_deleted_at ON prayer_requests(deleted_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_hidden ON prayer_requests(is_hidden);
CREATE INDEX IF NOT EXISTS event_rsvps_user_id_idx ON public.event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS event_rsvps_event_id_idx ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS sermon_bookmarks_user_id_idx ON public.sermon_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS sermon_bookmarks_sermon_id_idx ON public.sermon_bookmarks(sermon_id);
CREATE INDEX IF NOT EXISTS sermon_notes_user_id_idx ON public.sermon_notes(user_id);
CREATE INDEX IF NOT EXISTS sermon_notes_sermon_id_idx ON public.sermon_notes(sermon_id);
CREATE INDEX IF NOT EXISTS ministry_members_user_id_idx ON public.ministry_members(user_id);
CREATE INDEX IF NOT EXISTS ministry_members_ministry_id_idx ON public.ministry_members(ministry_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS small_group_members_group_id_idx ON public.small_group_members(group_id);
CREATE INDEX IF NOT EXISTS small_group_members_user_id_idx ON public.small_group_members(user_id);
CREATE INDEX IF NOT EXISTS event_attendance_event_id_idx ON public.event_attendance(event_id);
CREATE INDEX IF NOT EXISTS event_attendance_user_id_idx ON public.event_attendance(user_id);
CREATE INDEX IF NOT EXISTS ministry_announcements_ministry_id_idx ON public.ministry_announcements(ministry_id);

CREATE UNIQUE INDEX IF NOT EXISTS sermons_title_date_unique ON public.sermons (title, sermon_date);
CREATE UNIQUE INDEX IF NOT EXISTS events_title_time_unique ON public.events (title, time_label);
CREATE UNIQUE INDEX IF NOT EXISTS ministries_name_unique ON public.ministries (name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.small_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.small_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_announcements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id AND role = 'member');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can read profiles" ON public.profiles;
CREATE POLICY "Admins can read profiles" ON public.profiles FOR SELECT USING (public.current_profile_role() = 'admin');

-- Prayer requests policies
DROP POLICY IF EXISTS "Users can view own prayers" ON prayer_requests;
CREATE POLICY "Users can view own prayers"
ON prayer_requests FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view church prayers" ON prayer_requests;
CREATE POLICY "Users can view church prayers"
ON prayer_requests FOR SELECT
USING (
  visibility = 'church' 
  AND is_hidden = FALSE 
  AND deleted_at IS NULL
);

DROP POLICY IF EXISTS "Users can create own prayer requests" ON public.prayer_requests;
CREATE POLICY "Users can create own prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own prayer requests" ON public.prayer_requests;
CREATE POLICY "Users can update own prayer requests" ON public.prayer_requests FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage prayer requests" ON public.prayer_requests;
CREATE POLICY "Admins can manage prayer requests" ON public.prayer_requests FOR ALL USING (public.current_profile_role() = 'admin') WITH CHECK (public.current_profile_role() = 'admin');

-- Prayer interactions policies
DROP POLICY IF EXISTS "Users can view own prayer interactions" ON prayer_interactions;
CREATE POLICY "Users can view own prayer interactions"
ON prayer_interactions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own prayer interactions" ON prayer_interactions;
CREATE POLICY "Users can insert own prayer interactions"
ON prayer_interactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own prayer interactions" ON prayer_interactions;
CREATE POLICY "Users can delete own prayer interactions"
ON prayer_interactions FOR DELETE
USING (auth.uid() = user_id);

-- Church settings policies
DROP POLICY IF EXISTS "Public can read church settings" ON public.church_settings;
CREATE POLICY "Public can read church settings" ON public.church_settings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Authenticated can manage church settings" ON public.church_settings;
CREATE POLICY "Authenticated can manage church settings" ON public.church_settings FOR ALL USING (public.current_profile_role() = 'admin') WITH CHECK (public.current_profile_role() = 'admin');

-- Sermons policies
DROP POLICY IF EXISTS "Public can read published sermons" ON public.sermons;
CREATE POLICY "Public can read published sermons" ON public.sermons FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Authenticated can manage sermons" ON public.sermons;
CREATE POLICY "Authenticated can manage sermons" ON public.sermons FOR ALL USING (public.current_profile_role() = 'admin') WITH CHECK (public.current_profile_role() = 'admin');

-- Events policies
DROP POLICY IF EXISTS "Public can read published events" ON public.events;
CREATE POLICY "Public can read published events" ON public.events FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Authenticated can manage events" ON public.events;
CREATE POLICY "Authenticated can manage events" ON public.events FOR ALL USING (public.current_profile_role() = 'admin') WITH CHECK (public.current_profile_role() = 'admin');

-- Ministries policies
DROP POLICY IF EXISTS "Public can read published ministries" ON public.ministries;
CREATE POLICY "Public can read published ministries" ON public.ministries FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Authenticated can manage ministries" ON public.ministries;
CREATE POLICY "Authenticated can manage ministries" ON public.ministries FOR ALL USING (public.current_profile_role() = 'admin') WITH CHECK (public.current_profile_role() = 'admin');

-- Contact messages policies
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Authenticated can read contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can read contact messages" ON public.contact_messages FOR SELECT USING (public.current_profile_role() = 'admin');

DROP POLICY IF EXISTS "Authenticated can manage contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can manage contact messages" ON public.contact_messages FOR UPDATE USING (public.current_profile_role() = 'admin') WITH CHECK (public.current_profile_role() = 'admin');

-- Event RSVPs policies
DROP POLICY IF EXISTS "Users can read own RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can read own RSVPs" ON public.event_rsvps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can create own RSVPs" ON public.event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can update own RSVPs" ON public.event_rsvps FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can delete own RSVPs" ON public.event_rsvps FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all RSVPs" ON public.event_rsvps;
CREATE POLICY "Admins can manage all RSVPs" ON public.event_rsvps FOR ALL USING (public.current_profile_role() = 'admin');

-- Sermon bookmarks policies
DROP POLICY IF EXISTS "Users can read own bookmarks" ON public.sermon_bookmarks;
CREATE POLICY "Users can read own bookmarks" ON public.sermon_bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own bookmarks" ON public.sermon_bookmarks;
CREATE POLICY "Users can create own bookmarks" ON public.sermon_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.sermon_bookmarks;
CREATE POLICY "Users can delete own bookmarks" ON public.sermon_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Sermon notes policies
DROP POLICY IF EXISTS "Users can read own notes" ON public.sermon_notes;
CREATE POLICY "Users can read own notes" ON public.sermon_notes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own notes" ON public.sermon_notes;
CREATE POLICY "Users can create own notes" ON public.sermon_notes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notes" ON public.sermon_notes;
CREATE POLICY "Users can update own notes" ON public.sermon_notes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notes" ON public.sermon_notes;
CREATE POLICY "Users can delete own notes" ON public.sermon_notes FOR DELETE USING (auth.uid() = user_id);

-- Ministry members policies
DROP POLICY IF EXISTS "Users can read own memberships" ON public.ministry_members;
CREATE POLICY "Users can read own memberships" ON public.ministry_members FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own memberships" ON public.ministry_members;
CREATE POLICY "Users can create own memberships" ON public.ministry_members FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'member');

DROP POLICY IF EXISTS "Users can delete own memberships" ON public.ministry_members;
CREATE POLICY "Users can delete own memberships" ON public.ministry_members FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all memberships" ON public.ministry_members;
CREATE POLICY "Admins can manage all memberships" ON public.ministry_members FOR ALL USING (public.current_profile_role() = 'admin');

DROP POLICY IF EXISTS "Leaders can read their ministry members" ON public.ministry_members;
CREATE POLICY "Leaders can read their ministry members" ON public.ministry_members FOR SELECT USING (
  role = 'leader' AND user_id = auth.uid()
);

-- Notifications policies
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
CREATE POLICY "Admins can manage all notifications" ON public.notifications 
  FOR ALL USING (public.current_profile_role() = 'admin');

-- Small groups policies
DROP POLICY IF EXISTS "Anyone can read published groups" ON public.small_groups;
CREATE POLICY "Anyone can read published groups" ON public.small_groups 
  FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Admins can manage all groups" ON public.small_groups;
CREATE POLICY "Admins can manage all groups" ON public.small_groups 
  FOR ALL USING (public.current_profile_role() = 'admin');

DROP POLICY IF EXISTS "Leaders can update their groups" ON public.small_groups;
CREATE POLICY "Leaders can update their groups" ON public.small_groups 
  FOR UPDATE USING (auth.uid() = leader_id);

-- Small group members policies
DROP POLICY IF EXISTS "Users can read group members" ON public.small_group_members;
CREATE POLICY "Users can read group members" ON public.small_group_members 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.small_groups sg
      WHERE sg.id = small_group_members.group_id
      AND sg.published = TRUE
    )
  );

DROP POLICY IF EXISTS "Users can join groups" ON public.small_group_members;
CREATE POLICY "Users can join groups" ON public.small_group_members 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave groups" ON public.small_group_members;
CREATE POLICY "Users can leave groups" ON public.small_group_members 
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage group members" ON public.small_group_members;
CREATE POLICY "Admins can manage group members" ON public.small_group_members 
  FOR ALL USING (public.current_profile_role() = 'admin');

-- Event attendance policies
DROP POLICY IF EXISTS "Users can read own attendance" ON public.event_attendance;
CREATE POLICY "Users can read own attendance" ON public.event_attendance 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage attendance" ON public.event_attendance;
CREATE POLICY "Admins can manage attendance" ON public.event_attendance 
  FOR ALL USING (public.current_profile_role() = 'admin');

-- Ministry announcements policies
DROP POLICY IF EXISTS "Members can read ministry announcements" ON public.ministry_announcements;
CREATE POLICY "Members can read ministry announcements" ON public.ministry_announcements 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ministry_members mm
      WHERE mm.ministry_id = ministry_announcements.ministry_id
      AND mm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Leaders can create announcements" ON public.ministry_announcements;
CREATE POLICY "Leaders can create announcements" ON public.ministry_announcements 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ministry_members mm
      WHERE mm.ministry_id = ministry_id
      AND mm.user_id = auth.uid()
      AND mm.role = 'leader'
    )
  );

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.ministry_announcements;
CREATE POLICY "Admins can manage announcements" ON public.ministry_announcements 
  FOR ALL USING (public.current_profile_role() = 'admin');

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert default church settings
INSERT INTO public.church_settings (id)
VALUES ('site')
ON CONFLICT (id) DO NOTHING;

-- Insert sample sermons
INSERT INTO public.sermons (title, speaker, sermon_date, summary, media_url, published)
VALUES
  ('Grace for the Road Ahead', 'Ps. Daniel Wijaya', '2026-05-24', 'Exploring how God''s grace sustains us through life''s journey and prepares us for what lies ahead.', 'https://example.com/sermons/grace-road-ahead', TRUE),
  ('A House of Prayer', 'Ps. Maria Santoso', '2026-05-17', 'Understanding the importance of prayer in building a strong spiritual foundation for our church community.', 'https://example.com/sermons/house-of-prayer', TRUE),
  ('Faith That Serves', 'Ps. Daniel Wijaya', '2026-05-10', 'Discovering how authentic faith naturally leads to serving others and making a difference in our community.', 'https://example.com/sermons/faith-serves', TRUE),
  ('Walking in the Spirit', 'Ps. Maria Santoso', '2026-05-03', 'Learning to live daily guided by the Holy Spirit and experiencing His power in our lives.', 'https://example.com/sermons/walking-spirit', TRUE),
  ('The Power of Forgiveness', 'Ps. Daniel Wijaya', '2026-04-26', 'Understanding biblical forgiveness and how it brings freedom and healing to our hearts.', 'https://example.com/sermons/power-forgiveness', TRUE),
  ('Building on the Rock', 'Ps. Maria Santoso', '2026-04-19', 'Establishing our lives on the solid foundation of Christ and His teachings.', 'https://example.com/sermons/building-rock', TRUE),
  ('Love in Action', 'Ps. Daniel Wijaya', '2026-04-12', 'Practical ways to demonstrate God''s love through our daily actions and relationships.', 'https://example.com/sermons/love-action', TRUE),
  ('The Joy of Salvation', 'Ps. Maria Santoso', '2026-04-05', 'Rediscovering the joy and gratitude that comes from knowing we are saved by grace.', 'https://example.com/sermons/joy-salvation', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO public.events (title, event_date, time_label, location, description, published)
VALUES
  ('Sunday Worship', NULL, 'Every Sunday, 9:00 AM', 'Main Sanctuary', NULL, TRUE),
  ('Youth Night', NULL, 'Friday, 7:00 PM', 'Community Hall', NULL, TRUE),
  ('Prayer Gathering', NULL, 'Wednesday, 6:30 PM', 'Chapel Room', NULL, TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample ministries
INSERT INTO public.ministries (name, description, meeting_day, meeting_time, meeting_location, sort_order, published)
VALUES
  ('Kids Ministry', 'Nurturing children''s faith through age-appropriate lessons, games, and activities. We create a safe and fun environment where kids can learn about Jesus and grow in their relationship with God.', 'Every Sunday', '9:00 AM', 'Kids Room', 1, TRUE),
  ('Youth Ministry', 'Empowering teenagers to live out their faith boldly. We meet weekly for worship, Bible study, and fellowship, helping young people navigate life''s challenges with Christ at the center.', 'Every Friday', '7:00 PM', 'Youth Hall', 2, TRUE),
  ('Worship Team', 'Leading the congregation in heartfelt worship through music and song. We practice weekly and serve during Sunday services, using our musical gifts to glorify God and inspire others.', 'Every Thursday', '7:00 PM', 'Main Sanctuary', 3, TRUE),
  ('Small Groups', 'Building authentic community through weekly gatherings in homes. These groups provide a space for deeper relationships, Bible study, prayer, and mutual support in our faith journey.', 'Various days', 'Various times', 'Members'' Homes', 4, TRUE),
  ('Outreach Ministry', 'Sharing God''s love beyond our church walls through community service, evangelism, and mission trips. We actively seek opportunities to serve our neighbors and spread the Gospel.', 'Every Saturday', '9:00 AM', 'Church Parking Lot', 5, TRUE),
  ('Prayer Ministry', 'Interceding for our church, community, and world. We meet regularly to pray together and are available to pray for specific needs and requests from our congregation.', 'Every Wednesday', '6:00 AM', 'Prayer Room', 6, TRUE),
  ('Hospitality Team', 'Creating a welcoming atmosphere for visitors and members alike. We serve refreshments, greet guests, and ensure everyone feels at home in our church family.', 'Every Sunday', '8:00 AM', 'Fellowship Hall', 7, TRUE),
  ('Media Team', 'Supporting worship services through audio, video, and live streaming. We use technology to enhance the worship experience and extend our reach to those who can''t attend in person.', 'Every Tuesday', '7:30 PM', 'Media Room', 8, TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample small groups
INSERT INTO public.small_groups (name, description, meeting_day, meeting_time, location, max_members, is_open, published)
VALUES
  ('Young Adults', 'A group for young adults (18-30) to grow in faith together through Bible study, fellowship, and service.', 'Every Wednesday', '7:00 PM', 'Coffee House Downtown', 15, TRUE, TRUE),
  ('Couples Ministry', 'Married couples building stronger relationships through biblical principles and mutual support.', 'Every Friday', '7:30 PM', 'Church Fellowship Hall', 10, TRUE, TRUE),
  ('Men''s Bible Study', 'Men gathering to study God''s Word, pray together, and encourage one another in their faith walk.', 'Every Saturday', '7:00 AM', 'Church Prayer Room', 12, TRUE, TRUE),
  ('Women of Faith', 'Women supporting each other through prayer, Bible study, and authentic community.', 'Every Thursday', '10:00 AM', 'Member''s Home (Rotating)', 12, TRUE, TRUE),
  ('College & Career', 'Students and young professionals navigating faith in the modern world.', 'Every Tuesday', '8:00 PM', 'Campus Ministry Center', 20, TRUE, TRUE),
  ('Senior Saints', 'Mature believers sharing wisdom, prayer, and fellowship.', 'Every Monday', '2:00 PM', 'Church Library', 15, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN prayer_requests.deleted_at IS 'Soft delete timestamp - prayer is hidden but not removed from database';
COMMENT ON COLUMN prayer_requests.is_hidden IS 'Admin can hide public prayers for moderation - only creator and admin can see it';
COMMENT ON COLUMN prayer_requests.prayer_count IS 'Number of people who have prayed for this request';
COMMENT ON TABLE prayer_interactions IS 'Tracks which users have prayed for which prayer requests';
COMMENT ON COLUMN public.sermon_notes.content IS 'User sermon notes content';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
