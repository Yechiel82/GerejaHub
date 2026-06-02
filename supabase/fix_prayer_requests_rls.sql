-- Fix RLS policies for prayer_requests table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can view church-wide prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can insert their own prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can update their own prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can delete their own prayer requests" ON prayer_requests;

-- Enable RLS
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own prayer requests
CREATE POLICY "Users can view their own prayer requests"
ON prayer_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can view church-wide prayer requests (visibility='church')
CREATE POLICY "Users can view church-wide prayer requests"
ON prayer_requests
FOR SELECT
USING (visibility = 'church');

-- Policy: Users can insert their own prayer requests
CREATE POLICY "Users can insert their own prayer requests"
ON prayer_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own prayer requests
CREATE POLICY "Users can update their own prayer requests"
ON prayer_requests
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own prayer requests
CREATE POLICY "Users can delete their own prayer requests"
ON prayer_requests
FOR DELETE
USING (auth.uid() = user_id);

-- Made with Bob
