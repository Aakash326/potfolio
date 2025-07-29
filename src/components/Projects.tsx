import { useState, useEffect } from 'react';
import { Github, ExternalLink, X, FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: 'ML' | 'DL' | 'LLM' | 'Agentic AI' | 'Transformers';
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

  const categories: Project['category'][] = ['ML', 'DL', 'LLM', 'Agentic AI', 'Transformers'];
  const categoryDescriptions = {
    'ML': 'Machine Learning projects including supervised/unsupervised learning, data analysis, and predictive models',
    'DL': 'Deep Learning projects with neural networks, computer vision, and advanced architectures',
    'LLM': 'Large Language Model projects including fine-tuning, prompt engineering, and NLP applications',
    'Agentic AI': 'AI Agents and autonomous systems that can perform tasks and make decisions independently',
    'Transformers': 'Transformer-based models and attention mechanisms for various AI applications'
  };

  const getDefaultTechStack = (category: Project['category']): string[] => {
    switch (category) {
      case 'ML':
        return ['Python', 'Scikit-learn', 'Pandas'];
      case 'DL':
        return ['Python', 'TensorFlow', 'PyTorch'];
      case 'LLM':
        return ['Python', 'Transformers', 'Hugging Face'];
      case 'Agentic AI':
        return ['Python', 'LangChain', 'OpenAI'];
      case 'Transformers':
        return ['Python', 'Transformers', 'Attention'];
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
    <Card key={project.id} className="portfolio-card group mb-1 h-[140px]">
      <CardHeader className="relative pb-1 p-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[8px] font-semibold text-primary">{index + 1}</span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-xs cursor-pointer leading-tight truncate" contentEditable suppressContentEditableWarning onBlur={e => updateProject(project.id, {
              title: e.currentTarget.textContent || ''
            })}>
              {project.title}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 p-0" onClick={() => removeProject(project.id)}>
            <X className="h-2 w-2" />
          </Button>
        </div>
        <Badge variant="outline" className="w-fit text-[8px] py-0 px-1 h-4">
          {project.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-2 pt-0 flex flex-col">
        <p className="text-muted-foreground mb-1 cursor-pointer text-[9px] leading-tight line-clamp-2 flex-1" contentEditable suppressContentEditableWarning onBlur={e => updateProject(project.id, {
          description: e.currentTarget.textContent || ''
        })}>
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-0.5 mb-1">
          {project.techStack.slice(0, 2).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-[8px] py-0 px-1 h-3">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 2 && (
            <Badge variant="secondary" className="text-[8px] py-0 px-1 h-3">
              +{project.techStack.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1 flex-1" asChild>
            <a href={project.githubUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={e => {
              if (!project.githubUrl) {
                e.preventDefault();
                const url = prompt('Enter GitHub URL:');
                if (url) updateProject(project.id, {
                  githubUrl: url
                });
              }
            }}>
              <Github className="h-1.5 w-1.5 mr-0.5" />
              Git
            </a>
          </Button>
          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1 flex-1" asChild>
            <a href={project.liveUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={e => {
              if (!project.liveUrl) {
                e.preventDefault();
                const url = prompt('Enter Live Demo URL:');
                if (url) updateProject(project.id, {
                  liveUrl: url
                });
              }
            }}>
              <ExternalLink className="h-1.5 w-1.5 mr-0.5" />
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

          {/* Category Tabs */}
          <Tabs defaultValue="ML" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => {
              const categoryProjects = getProjectsByCategory(category);
              return (
                <TabsContent key={category} value={category} className="space-y-6">
                  {/* Category Header */}
                  <Card className="portfolio-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-center text-2xl gradient-text">
                        {category} Projects
                      </CardTitle>
                      <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
                        {categoryDescriptions[category]}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Add new project button */}
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => addNewProject(category)}>
                        <Plus className="h-12 w-12 text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to add a new {category} project
                        </p>
                        <p className="text-sm font-medium text-primary">
                          Currently {categoryProjects.length} projects in this category
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects List */}
                  {categoryProjects.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                      {categoryProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No {category} projects yet</h3>
                      <p className="text-muted-foreground">
                        Click the add button above to create your first {category} project.
                      </p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

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