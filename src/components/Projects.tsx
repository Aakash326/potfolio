import { useState, useEffect } from 'react';
import { Github, ExternalLink, X, FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: 'Best Project' | 'ML' | 'DL' | 'NLP/LLMS' | 'Agentic AI/RAG Agent' | 'MLOPS and LLMOPS';
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  // Load projects from Supabase on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;

      const formattedProjects: Project[] = projectsData.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description || 'Click to edit description...',
        techStack: project.tech_stack || [],
        githubUrl: project.github_url,
        liveUrl: project.live_url,
        category: project.category
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    }
  };

  const categories: Project['category'][] = ['Best Project', 'ML', 'DL', 'NLP/LLMS', 'Agentic AI/RAG Agent', 'MLOPS and LLMOPS'];
  const categoryDescriptions = {
    'Best Project': 'My most impressive and impactful projects that showcase the best of my skills and achievements',
    'ML': 'Machine Learning projects including supervised/unsupervised learning, data analysis, and predictive models',
    'DL': 'Deep Learning projects with neural networks, computer vision, and advanced architectures',
    'NLP/LLMS': 'Natural Language Processing and Large Language Models including text analysis, sentiment analysis, and language models',
    'Agentic AI/RAG Agent': 'AI Agents and RAG systems that can perform tasks, make decisions independently, and retrieve relevant information',
    'MLOPS and LLMOPS': 'MLOps and LLMOps projects including model deployment, monitoring, and production ML pipelines'
  };

  const getDefaultTechStack = (category: Project['category']): string[] => {
    switch (category) {
      case 'Best Project':
        return ['React', 'TypeScript', 'Node.js'];
      case 'ML':
        return ['Python', 'Scikit-learn', 'Pandas'];
      case 'DL':
        return ['Python', 'TensorFlow', 'PyTorch'];
      case 'NLP/LLMS':
        return ['Python', 'Transformers', 'spaCy'];
      case 'Agentic AI/RAG Agent':
        return ['Python', 'LangChain', 'OpenAI'];
      case 'MLOPS and LLMOPS':
        return ['Docker', 'Kubernetes', 'MLflow'];
      default:
        return ['Python', 'Machine Learning'];
    }
  };

  const addNewProject = async (category: Project['category']) => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: `New ${category} Project`,
          description: 'Click to edit description...',
          tech_stack: getDefaultTechStack(category),
          category: category
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Reload projects to get updated data
      await loadProjects();

      toast({
        title: "Project Added",
        description: `New ${category} project created successfully.`
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Add Failed",
        description: "Failed to add project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.githubUrl !== undefined) updateData.github_url = updates.githubUrl;
      if (updates.liveUrl !== undefined) updateData.live_url = updates.liveUrl;
      if (updates.techStack !== undefined) updateData.tech_stack = updates.techStack;

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setProjects(projects.filter(p => p.id !== id));
      
      toast({
        title: "Project Removed",
        description: "Project has been removed from your portfolio."
      });
    } catch (error) {
      console.error('Error removing project:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to remove project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getProjectsByCategory = (category: Project['category']) => {
    return projects.filter(p => p.category === category);
  };

  const ProjectCard = ({
    project,
    index
  }: {
    project: Project;
    index: number;
  }) => (
    <Card key={project.id} className="portfolio-card group h-auto border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="relative pb-3 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base cursor-pointer leading-tight" contentEditable suppressContentEditableWarning onBlur={e => updateProject(project.id, {
              title: e.currentTarget.textContent || ''
            })}>
              {project.title}
            </CardTitle>
            <Badge variant="outline" className="w-fit text-xs mt-1">
              {project.category}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0" onClick={() => removeProject(project.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <p className="text-muted-foreground cursor-pointer text-sm leading-relaxed" contentEditable suppressContentEditableWarning onBlur={e => updateProject(project.id, {
          description: e.currentTarget.textContent || ''
        })}>
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={project.githubUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={e => {
              if (!project.githubUrl) {
                e.preventDefault();
                const url = prompt('Enter GitHub URL:');
                if (url) updateProject(project.id, {
                  githubUrl: url
                });
              }
            }}>
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={project.liveUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={e => {
              if (!project.liveUrl) {
                e.preventDefault();
                const url = prompt('Enter Live Demo URL:');
                if (url) updateProject(project.id, {
                  liveUrl: url
                });
              }
            }}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Demo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading text-center gradient-text">Projects</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
            Explore my projects organized by specialization areas. Each project includes GitHub links and live demos.
          </p>

          {/* Collapsible Category Sections */}
          <Accordion type="multiple" className="w-full space-y-4">
            {categories.map(category => {
              const categoryProjects = getProjectsByCategory(category);
              return (
                <AccordionItem key={category} value={category} className="border border-border/50 rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="text-left">
                        <h3 className="text-xl font-semibold gradient-text">{category}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{categoryDescriptions[category]}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {categoryProjects.length} {categoryProjects.length === 1 ? 'project' : 'projects'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Add new project button */}
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => addNewProject(category)}>
                        <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Add a new {category} project
                        </p>
                      </div>

                      {/* Projects Grid */}
                      {categoryProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {categoryProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">
                            No {category} projects yet. Click above to create your first one.
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Global empty state */}
          {projects.length === 0 && (
            <div className="text-center py-16">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground">
                Start by adding your first project in any category above.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;