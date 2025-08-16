-- Fix security vulnerability: Restrict achievements write operations to authenticated users only
-- Keep read access public for portfolio viewing

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create achievements" ON public.achievements;
DROP POLICY IF EXISTS "Anyone can update achievements" ON public.achievements;
DROP POLICY IF EXISTS "Anyone can delete achievements" ON public.achievements;

-- Create secure policies that require authentication for write operations
CREATE POLICY "Only authenticated users can create achievements" 
ON public.achievements 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update achievements" 
ON public.achievements 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete achievements" 
ON public.achievements 
FOR DELETE 
TO authenticated 
USING (true);