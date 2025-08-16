-- Update the check constraint to rename "Agentic AI" to "Agentic AI/RAG Agent"
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;

-- Add the updated constraint with the new category name
ALTER TABLE public.projects ADD CONSTRAINT projects_category_check 
CHECK (category IN ('Best Project', 'ML', 'DL', 'NLP/LLMS', 'Agentic AI/RAG Agent', 'MLOPS and LLMOPS'));