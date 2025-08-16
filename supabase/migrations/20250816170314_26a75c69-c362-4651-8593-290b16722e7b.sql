-- Add "Best Project" category to the projects table constraint
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;

-- Add the updated constraint with the "Best Project" category
ALTER TABLE public.projects ADD CONSTRAINT projects_category_check 
CHECK (category IN ('Best Project', 'ML', 'DL', 'NLP/LLMS', 'Agentic AI', 'MLOPS and LLMOPS'));