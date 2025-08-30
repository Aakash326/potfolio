-- Update LeetCode achievement to reflect 220+ problems solved
-- This updates any existing LeetCode achievement records in the database

UPDATE public.achievements 
SET 
  badge = '220+ Problems Solved',
  updated_at = now()
WHERE 
  platform = 'LeetCode' 
  AND title = 'LeetCode Profile';

-- If no existing LeetCode achievement found, insert the updated one
INSERT INTO public.achievements (title, platform, description, url, badge, category)
SELECT 
  'LeetCode Profile',
  'LeetCode', 
  'Solved algorithmic problems and coding challenges',
  'https://leetcode.com/u/N8lUrPGvsi/',
  '220+ Problems Solved',
  'coding'
WHERE NOT EXISTS (
  SELECT 1 FROM public.achievements 
  WHERE platform = 'LeetCode' AND title = 'LeetCode Profile'
);