-- First update any existing "Agentic AI" records to the new name
UPDATE public.projects 
SET category = 'Agentic AI/RAG Agent' 
WHERE category = 'Agentic AI';

-- Then update the check constraint to include the new category name
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;

-- Add the updated constraint with the new category name
ALTER TABLE public.projects ADD CONSTRAINT projects_category_check 
CHECK (category IN ('Best Project', 'ML', 'DL', 'NLP/LLMS', 'Agentic AI/RAG Agent', 'MLOPS and LLMOPS'));