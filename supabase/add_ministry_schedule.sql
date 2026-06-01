-- Add meeting schedule fields to ministries table
ALTER TABLE public.ministries 
ADD COLUMN IF NOT EXISTS meeting_day text,
ADD COLUMN IF NOT EXISTS meeting_time text,
ADD COLUMN IF NOT EXISTS meeting_location text;

-- Update existing ministries with sample meeting schedules
UPDATE public.ministries SET 
  meeting_day = 'Sunday',
  meeting_time = '10:00 AM',
  meeting_location = 'Kids Room'
WHERE name = 'Kids Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Friday',
  meeting_time = '7:00 PM',
  meeting_location = 'Youth Hall'
WHERE name = 'Youth Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Sunday',
  meeting_time = '9:00 AM',
  meeting_location = 'Main Sanctuary'
WHERE name = 'Worship Team';

UPDATE public.ministries SET 
  meeting_day = 'Various',
  meeting_time = 'Weekday Evenings',
  meeting_location = 'Members'' Homes'
WHERE name = 'Small Groups';

UPDATE public.ministries SET 
  meeting_day = 'Saturday',
  meeting_time = '9:00 AM',
  meeting_location = 'Community Center'
WHERE name = 'Outreach Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Wednesday',
  meeting_time = '6:30 PM',
  meeting_location = 'Prayer Room'
WHERE name = 'Prayer Ministry';

UPDATE public.ministries SET 
  meeting_day = 'Sunday',
  meeting_time = '8:30 AM',
  meeting_location = 'Church Entrance'
WHERE name = 'Hospitality Team';

UPDATE public.ministries SET 
  meeting_day = 'Sunday',
  meeting_time = '8:00 AM',
  meeting_location = 'Media Booth'
WHERE name = 'Media Team';

-- Made with Bob
