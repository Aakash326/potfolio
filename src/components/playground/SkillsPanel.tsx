/**
 * Advanced Skills Demonstration Panel
 * Features: Interactive skill bars, technology visualizer, achievement system
 */

import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Code,
  Database,
  Cloud,
  Wrench,
  Brain,
  Users,
  ChevronRight,
  ExternalLink,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Skill, Achievement, SkillVisualizerProps, TimelineEvent } from '@/types/codeplayground';

// Aakash's actual skills data based on his portfolio
const SKILLS_DATA: Skill[] = [
  // Programming Languages
  { 
    id: 'python', 
    name: 'Python', 
    category: 'language', 
    proficiency: 95, 
    yearsExperience: 3, 
    icon: '🐍', 
    color: '#3776AB',
    projects: ['RAG Agent', 'ML Models', 'Data Analysis', 'API Development'],
    certifications: ['Python for Data Science', 'Advanced Python Programming']
  },
  { 
    id: 'javascript', 
    name: 'JavaScript', 
    category: 'language', 
    proficiency: 88, 
    yearsExperience: 2, 
    icon: '🟨', 
    color: '#F7DF1E',
    projects: ['Portfolio Website', 'Interactive Dashboards', 'Frontend Applications'],
    certifications: ['JavaScript Algorithms and Data Structures']
  },
  { 
    id: 'typescript', 
    name: 'TypeScript', 
    category: 'language', 
    proficiency: 85, 
    yearsExperience: 2, 
    icon: '🔷', 
    color: '#3178C6',
    projects: ['Portfolio Website', 'Type-safe APIs', 'Enterprise Applications']
  },
  { 
    id: 'sql', 
    name: 'SQL', 
    category: 'database', 
    proficiency: 82, 
    yearsExperience: 2, 
    icon: '🗄️', 
    color: '#336791',
    projects: ['Data Analysis', 'Database Design', 'Query Optimization']
  },

  // AI/ML Frameworks
  { 
    id: 'langchain', 
    name: 'LangChain', 
    category: 'framework', 
    proficiency: 92, 
    yearsExperience: 1, 
    icon: '🔗', 
    color: '#1C3A3A',
    projects: ['RAG Agents', 'Chatbots', 'Document Processing', 'Multi-agent Systems']
  },
  { 
    id: 'tensorflow', 
    name: 'TensorFlow', 
    category: 'framework', 
    proficiency: 85, 
    yearsExperience: 2, 
    icon: '🧠', 
    color: '#FF6F00',
    projects: ['Deep Learning Models', 'Neural Networks', 'Computer Vision']
  },
  { 
    id: 'pytorch', 
    name: 'PyTorch', 
    category: 'framework', 
    proficiency: 82, 
    yearsExperience: 2, 
    icon: '🔥', 
    color: '#EE4C2C',
    projects: ['Research Models', 'NLP Applications', 'Custom Architectures']
  },
  { 
    id: 'huggingface', 
    name: 'Hugging Face', 
    category: 'framework', 
    proficiency: 88, 
    yearsExperience: 1, 
    icon: '🤗', 
    color: '#FF9D00',
    projects: ['Transformer Models', 'NLP Pipelines', 'Model Fine-tuning']
  },

  // Web Technologies
  { 
    id: 'react', 
    name: 'React', 
    category: 'framework', 
    proficiency: 90, 
    yearsExperience: 2, 
    icon: '⚛️', 
    color: '#61DAFB',
    projects: ['Portfolio Website', 'Interactive UIs', 'Component Libraries']
  },
  { 
    id: 'fastapi', 
    name: 'FastAPI', 
    category: 'framework', 
    proficiency: 88, 
    yearsExperience: 1, 
    icon: '⚡', 
    color: '#009688',
    projects: ['API Development', 'RAG Backend', 'Microservices']
  },

  // Cloud & Tools
  { 
    id: 'docker', 
    name: 'Docker', 
    category: 'tool', 
    proficiency: 80, 
    yearsExperience: 1, 
    icon: '🐳', 
    color: '#2496ED',
    projects: ['Containerization', 'Development Environments', 'Deployment']
  },
  { 
    id: 'git', 
    name: 'Git', 
    category: 'tool', 
    proficiency: 85, 
    yearsExperience: 3, 
    icon: '📝', 
    color: '#F05032',
    projects: ['Version Control', 'Collaboration', 'Open Source Contributions']
  },

  // Databases
  { 
    id: 'postgresql', 
    name: 'PostgreSQL', 
    category: 'database', 
    proficiency: 75, 
    yearsExperience: 1, 
    icon: '🐘', 
    color: '#336791',
    projects: ['Data Storage', 'Complex Queries', 'Database Design']
  },
  { 
    id: 'mongodb', 
    name: 'MongoDB', 
    category: 'database', 
    proficiency: 70, 
    yearsExperience: 1, 
    icon: '🍃', 
    color: '#47A248',
    projects: ['NoSQL Applications', 'Document Storage', 'Flexible Schemas']
  },

  // MLOps & Data
  { 
    id: 'pandas', 
    name: 'Pandas', 
    category: 'tool', 
    proficiency: 90, 
    yearsExperience: 2, 
    icon: '🐼', 
    color: '#150458',
    projects: ['Data Analysis', 'Data Cleaning', 'Statistical Computing']
  },
  { 
    id: 'numpy', 
    name: 'NumPy', 
    category: 'tool', 
    proficiency: 88, 
    yearsExperience: 2, 
    icon: '🔢', 
    color: '#013243',
    projects: ['Numerical Computing', 'Array Operations', 'Scientific Computing']
  }
];

const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'leetcode_210',
    title: 'LeetCode Problem Solver',
    description: 'Solved 210+ data structures and algorithms problems',
    icon: '🧩',
    category: 'challenge',
    difficulty: 'gold',
    unlockedAt: new Date('2024-06-01'),
    progress: 210,
    maxProgress: 250,
    reward: 'Algorithm Master Badge'
  },
  {
    id: 'hackerrank_gold',
    title: 'HackerRank Gold Badge',
    description: 'Achieved Gold badge in competitive programming',
    icon: '🏆',
    category: 'challenge',
    difficulty: 'gold',
    unlockedAt: new Date('2024-05-15'),
    progress: 100,
    maxProgress: 100,
    reward: 'Gold Problem Solver'
  },
  {
    id: 'rag_expert',
    title: 'RAG System Architect',
    description: 'Built multiple production-ready RAG applications',
    icon: '🤖',
    category: 'code',
    difficulty: 'platinum',
    unlockedAt: new Date('2024-07-20'),
    progress: 5,
    maxProgress: 5,
    reward: 'AI Systems Expert'
  },
  {
    id: 'freelance_success',
    title: 'Freelancing Champion',
    description: 'Successfully completed multiple client projects on Truelancer',
    icon: '💼',
    category: 'sharing',
    difficulty: 'silver',
    unlockedAt: new Date('2024-08-01'),
    progress: 100,
    maxProgress: 100,
    reward: 'Professional Recognition'
  },
  {
    id: 'portfolio_dev',
    title: 'Portfolio Perfectionist',
    description: 'Created an advanced interactive portfolio with 3D visualizations',
    icon: '🎨',
    category: 'code',
    difficulty: 'gold',
    unlockedAt: new Date('2024-08-23'),
    progress: 100,
    maxProgress: 100,
    reward: 'Frontend Mastery'
  },
  {
    id: 'continuous_learner',
    title: 'Continuous Learner',
    description: 'Completed multiple AI/ML courses and certifications',
    icon: '📚',
    category: 'learning',
    difficulty: 'silver',
    progress: 80,
    maxProgress: 100,
    reward: 'Knowledge Seeker'
  }
];

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: 'start_journey',
    date: new Date('2022-01-01'),
    title: 'Started Programming Journey',
    description: 'Began learning Python and basic programming concepts',
    type: 'skill',
    icon: '🚀',
    color: '#3776AB'
  },
  {
    id: 'first_project',
    date: new Date('2022-06-15'),
    title: 'First ML Project',
    description: 'Built first machine learning model for data analysis',
    type: 'project',
    icon: '🧠',
    color: '#FF6F00'
  },
  {
    id: 'geeksforgeeks_internship',
    date: new Date('2023-03-01'),
    title: 'Data Analyst Internship',
    description: 'Completed internship at GeeksforGeeks, building dashboards',
    type: 'achievement',
    icon: '💼',
    color: '#00C853'
  },
  {
    id: 'leetcode_milestone',
    date: new Date('2024-01-15'),
    title: 'LeetCode 200+ Problems',
    description: 'Reached milestone of solving 200+ algorithm problems',
    type: 'achievement',
    icon: '🏅',
    color: '#FFA726'
  },
  {
    id: 'rag_mastery',
    date: new Date('2024-05-20'),
    title: 'RAG Systems Expertise',
    description: 'Mastered RAG architectures and built multiple applications',
    type: 'skill',
    icon: '🤖',
    color: '#9C27B0'
  },
  {
    id: 'freelancing_start',
    date: new Date('2024-07-01'),
    title: 'Started Freelancing',
    description: 'Began professional freelancing career on Truelancer',
    type: 'achievement',
    icon: '💰',
    color: '#2196F3'
  },
  {
    id: 'portfolio_launch',
    date: new Date('2024-08-23'),
    title: 'Advanced Portfolio Launch',
    description: 'Launched interactive portfolio with 3D visualizations and AI features',
    type: 'project',
    icon: '🌟',
    color: '#E91E63'
  }
];

const SkillsPanel: React.FC<SkillVisualizerProps> = memo(({
  skills = SKILLS_DATA,
  view = 'grid',
  animated = true,
  interactive = true,
  filterCategory
}) => {
  const [selectedView, setSelectedView] = useState<'grid' | 'chart' | 'timeline'>(view);
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || 'all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(skill => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  const skillCategories = useMemo(() => {
    const categories = [...new Set(skills.map(skill => skill.category))];
    return categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1) + 's',
      count: skills.filter(s => s.category === category).length,
      icon: {
        language: <Code className="h-4 w-4" />,
        framework: <Wrench className="h-4 w-4" />,
        tool: <Target className="h-4 w-4" />,
        database: <Database className="h-4 w-4" />,
        cloud: <Cloud className="h-4 w-4" />,
        other: <Star className="h-4 w-4" />
      }[category as keyof typeof skillCategories] || <Star className="h-4 w-4" />
    }));
  }, [skills]);

  const skillStats = useMemo(() => {
    const avgProficiency = skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length;
    const totalExperience = Math.max(...skills.map(skill => skill.yearsExperience));
    const totalProjects = skills.reduce((sum, skill) => sum + skill.projects.length, 0);
    
    return {
      averageProficiency: Math.round(avgProficiency),
      totalExperience,
      totalProjects,
      topSkills: skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 3)
    };
  }, [skills]);

  const renderSkillCard = (skill: Skill) => (
    <motion.div
      key={skill.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={interactive ? { scale: 1.05, y: -5 } : undefined}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          selectedSkill?.id === skill.id ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
        style={{ borderColor: selectedSkill?.id === skill.id ? skill.color : undefined }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="p-2 rounded-lg text-white text-lg"
              style={{ backgroundColor: skill.color }}
            >
              {skill.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{skill.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{skill.category}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {skill.yearsExperience}y
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Proficiency</span>
              <span className="font-medium">{skill.proficiency}%</span>
            </div>
            <Progress 
              value={skill.proficiency} 
              className="h-2"
              style={{ 
                '--progress-foreground': skill.color 
              } as React.CSSProperties}
            />
          </div>

          <AnimatePresence>
            {selectedSkill?.id === skill.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border/50"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Projects:</h4>
                    <div className="flex flex-wrap gap-1">
                      {skill.projects.map((project, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {skill.certifications && skill.certifications.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Certifications:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {skill.certifications.map((cert, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAchievementCard = (achievement: Achievement) => {
    const difficultyColors = {
      bronze: 'bg-amber-600',
      silver: 'bg-slate-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-purple-500'
    };

    return (
      <motion.div
        key={achievement.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 rounded-full ${difficultyColors[achievement.difficulty]} text-white text-xl`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              <Badge 
                variant={achievement.unlockedAt ? 'default' : 'secondary'}
                className={`${difficultyColors[achievement.difficulty]} text-white border-0`}
              >
                {achievement.difficulty}
              </Badge>
            </div>

            {achievement.progress < achievement.maxProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
              </div>
            )}

            {achievement.unlockedAt && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderTimeline = () => (
    <div className="space-y-6">
      {TIMELINE_DATA.sort((a, b) => b.date.getTime() - a.date.getTime()).map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4 items-start"
        >
          <div 
            className="p-3 rounded-full text-white flex-shrink-0"
            style={{ backgroundColor: event.color }}
          >
            <span className="text-lg">{event.icon}</span>
          </div>
          
          <div className="flex-1 pb-6 border-l-2 border-border/20 ml-6 pl-6 relative">
            <div className="absolute w-3 h-3 bg-background border-2 border-border/50 rounded-full -left-2 top-6" />
            
            <div className="bg-card p-4 rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {event.date.toLocaleDateString()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {event.type}
              </Badge>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skills & Expertise Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{skillStats.averageProficiency}%</div>
              <div className="text-sm text-muted-foreground">Avg Proficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{skillStats.totalExperience}+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{skillStats.totalProjects}</div>
              <div className="text-sm text-muted-foreground">Projects Built</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{skills.length}</div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={selectedView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('grid')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Skills Grid
          </Button>
          <Button
            variant={selectedView === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('timeline')}
          >
            <Activity className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={showAchievements ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAchievements(!showAchievements)}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </Button>
        </div>

        {selectedView === 'grid' && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All ({skills.length})
            </Button>
            {skillCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-1"
              >
                {category.icon}
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {showAchievements ? (
          <motion.div
            key="achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements & Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACHIEVEMENTS_DATA.map(renderAchievementCard)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : selectedView === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Learning & Development Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {renderTimeline()}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="skills-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filteredSkills.map(renderSkillCard)}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SkillsPanel.displayName = 'SkillsPanel';

export default SkillsPanel;