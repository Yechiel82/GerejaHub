-- Migration: Add meeting schedule fields to ministries table
-- Run this BEFORE running the main schema.sql if your ministries table already exists

-- Add the new columns if they don't exist
ALTER TABLE public.ministries 
ADD COLUMN IF NOT EXISTS meeting_day text,
ADD COLUMN IF NOT EXISTS meeting_time text,
ADD COLUMN IF NOT EXISTS meeting_location text;

-- Update existing ministries with sample schedule data
UPDATE public.ministries SET 
  meeting_day = 'Every Sunday',
  meeting_time = '9:00 AM',
  meeting_location = 'Kids Room'
WHERE name = 'Kids Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Every Friday',
  meeting_time = '7:00 PM',
  meeting_location = 'Youth Hall'
WHERE name = 'Youth Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Every Thursday',
  meeting_time = '7:00 PM',
  meeting_location = 'Main Sanctuary'
WHERE name = 'Worship Team';

UPDATE public.ministries SET 
  meeting_day = 'Various days',
  meeting_time = 'Various times',
  meeting_location = 'Members'' Homes'
WHERE name = 'Small Groups';

UPDATE public.ministries SET 
  meeting_day = 'Every Saturday',
  meeting_time = '9:00 AM',
  meeting_location = 'Church Parking Lot'
WHERE name = 'Outreach Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Every Wednesday',
  meeting_time = '6:00 AM',
  meeting_location = 'Prayer Room'
WHERE name = 'Prayer Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Every Sunday',
  meeting_time = '8:00 AM',
  meeting_location = 'Fellowship Hall'
WHERE name = 'Hospitality Team';

UPDATE public.ministries SET 
  meeting_day = 'Every Tuesday',
  meeting_time = '7:30 PM',
  meeting_location = 'Media Room'
WHERE name = 'Media Team';

-- Made with Bob
