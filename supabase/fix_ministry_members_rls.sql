-- Fix: Remove infinite recursion in ministry_members RLS policy
-- This fixes the "infinite recursion detected in policy" error

-- Drop the problematic policy
DROP POLICY IF EXISTS "Leaders can read their ministry members" ON public.ministry_members;

-- Create a simpler policy without recursion
-- Leaders can only read their own leader membership records
CREATE POLICY "Leaders can read their ministry members" 
ON public.ministry_members 
FOR SELECT 
USING (
  role = 'leader' AND user_id = auth.uid()
);

-- Verify all policies are correct
-- Run this to see all policies on ministry_members:
-- SELECT * FROM pg_policies WHERE tablename = 'ministry_members';

-- Made with Bob
