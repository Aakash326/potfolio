-- Create storage buckets for different file types
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('projects', 'projects', true),
  ('ai-assistant', 'ai-assistant', true),
  ('resume', 'resume', true);

-- Create storage policies for projects bucket
CREATE POLICY "Allow public access to projects" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects');

CREATE POLICY "Allow public upload to projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Allow public update to projects" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projects');

CREATE POLICY "Allow public delete from projects" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projects');

-- Create storage policies for ai-assistant bucket
CREATE POLICY "Allow public access to ai-assistant" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ai-assistant');

CREATE POLICY "Allow public upload to ai-assistant" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ai-assistant');

CREATE POLICY "Allow public update to ai-assistant" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'ai-assistant');

CREATE POLICY "Allow public delete from ai-assistant" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'ai-assistant');

-- Create storage policies for resume bucket
CREATE POLICY "Allow public access to resume" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resume');

CREATE POLICY "Allow public upload to resume" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resume');

CREATE POLICY "Allow public update to resume" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resume');

CREATE POLICY "Allow public delete from resume" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resume');

-- Create tables for storing project and file metadata
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('ML', 'DL', 'LLM', 'Agentic AI', 'Transformers')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_assistant_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since this is a portfolio)
CREATE POLICY "Allow public access to projects" 
ON public.projects 
FOR ALL 
USING (true);

CREATE POLICY "Allow public access to project_files" 
ON public.project_files 
FOR ALL 
USING (true);

CREATE POLICY "Allow public access to ai_assistant_files" 
ON public.ai_assistant_files 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();