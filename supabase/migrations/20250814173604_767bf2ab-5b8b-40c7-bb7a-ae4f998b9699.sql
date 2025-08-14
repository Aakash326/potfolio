-- Update the check constraint to allow the new NLP/LLMS category
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;

-- Add the updated constraint with the new category values
ALTER TABLE public.projects ADD CONSTRAINT projects_category_check 
CHECK (category IN ('ML', 'DL', 'NLP/LLMS', 'Agentic AI', 'MLOPS and LLMOPS'));