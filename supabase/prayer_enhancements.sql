-- Prayer Enhancements: Soft Delete, Hide Feature, and Prayer Counter
-- Run this migration in Supabase SQL Editor

-- 1. Add new columns to prayer_requests table
ALTER TABLE prayer_requests
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS prayer_count INTEGER DEFAULT 0;

-- 2. Create prayer_interactions table to track who prayed
CREATE TABLE IF NOT EXISTS prayer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prayer_id, user_id) -- Each user can only pray once per prayer
);

-- 3. Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_prayer_interactions_prayer_id ON prayer_interactions(prayer_id);
CREATE INDEX IF NOT EXISTS idx_prayer_interactions_user_id ON prayer_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_deleted_at ON prayer_requests(deleted_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_hidden ON prayer_requests(is_hidden);

-- 4. Enable RLS on prayer_interactions
ALTER TABLE prayer_interactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for prayer_interactions

-- Users can view their own prayer interactions
CREATE POLICY "Users can view own prayer interactions"
ON prayer_interactions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own prayer interactions
CREATE POLICY "Users can insert own prayer interactions"
ON prayer_interactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own prayer interactions (if they want to "unpray")
CREATE POLICY "Users can delete own prayer interactions"
ON prayer_interactions FOR DELETE
USING (auth.uid() = user_id);

-- 6. Function to increment prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayer_count = prayer_count + 1
  WHERE id = NEW.prayer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Function to decrement prayer count
CREATE OR REPLACE FUNCTION decrement_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayer_count = GREATEST(prayer_count - 1, 0)
  WHERE id = OLD.prayer_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers to automatically update prayer_count
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

-- 9. Update existing RLS policies for prayer_requests to handle hidden prayers

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own prayers" ON prayer_requests;
DROP POLICY IF EXISTS "Users can view church prayers" ON prayer_requests;

-- Users can view their own prayers (including hidden and soft-deleted)
CREATE POLICY "Users can view own prayers"
ON prayer_requests FOR SELECT
USING (auth.uid() = user_id);

-- Users can view church-wide prayers that are NOT hidden and NOT deleted
CREATE POLICY "Users can view church prayers"
ON prayer_requests FOR SELECT
USING (
  visibility = 'church' 
  AND is_hidden = FALSE 
  AND deleted_at IS NULL
);

-- Admin can view all prayers (handled by admin client, bypasses RLS)

-- 10. Add comment for documentation
COMMENT ON COLUMN prayer_requests.deleted_at IS 'Soft delete timestamp - prayer is hidden but not removed from database';
COMMENT ON COLUMN prayer_requests.is_hidden IS 'Creator can hide their public prayer - only they and admin can see it';
COMMENT ON COLUMN prayer_requests.prayer_count IS 'Number of people who have prayed for this request';
COMMENT ON TABLE prayer_interactions IS 'Tracks which users have prayed for which prayer requests';

-- Made with Bob
