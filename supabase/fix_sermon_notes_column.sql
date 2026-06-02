-- Fix sermon_notes table: rename 'note' column to 'content' and clear existing data
-- Run this migration to fix the column name mismatch

-- First, clear any existing data
DELETE FROM public.sermon_notes;

-- Rename the column from 'note' to 'content'
ALTER TABLE public.sermon_notes 
  RENAME COLUMN note TO content;

-- Verify the change
COMMENT ON COLUMN public.sermon_notes.content IS 'User sermon notes content';

-- Made with Bob
