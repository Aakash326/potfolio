import { Trophy, Code, Award, ExternalLink, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  platform: string;
  description: string;
  url?: string;
  badge?: string;
  category: 'coding' | 'certification' | 'competition' | 'other';
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { toast } = useToast();

  // Load achievements from Supabase on component mount
  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    // Temporarily force use of updated default data instead of database
    // TODO: Remove this after database is updated with correct values
    setAchievements([
      {
        id: 'leetcode-1',
        title: 'LeetCode Profile',
        platform: 'LeetCode',
        description: 'Solved algorithmic problems and coding challenges',
        url: 'https://leetcode.com/u/N8lUrPGvsi/',
        badge: '220+ Problems Solved',
        category: 'coding'
      },
      {
        id: 'hackerrank-1',
        title: 'HackerRank Profile',
        platform: 'HackerRank',
        description: 'Competitive programming and skill assessments',
        url: 'https://www.hackerrank.com/profile/saiaakash33333',
        badge: '150+ Problems with SQL, NLP, Python, DSA',
        category: 'coding'
      },
      {
        id: 'kaggle-1',
        title: 'Kaggle Competitions',
        platform: 'Kaggle',
        description: 'Active participation in competitions',
        url: 'https://www.kaggle.com/saiaakash332',
        badge: 'Competitor',
        category: 'competition'
      },
      {
        id: 'devpost-1',
        title: 'Devpost Hackathons',
        platform: 'Devpost',
        description: 'Active participant in hackathons',
        url: 'https://devpost.com/saiaakash33333',
        badge: 'Hackathon Participant',
        category: 'competition'
      },
      {
        id: 'hack2skill-1',
        title: 'Hack2Skill',
        platform: 'Hack2Skill',
        description: 'Active participant in hackathons',
        url: 'https://vision.hack2skill.com/dashboard/user_private_profile/?userId=686abd3c3788a274798654c3',
        badge: 'Hackathon Participant',
        category: 'competition'
      },
      {
        id: 'striver-1',
        title: 'Striver A2Z Sheet',
        platform: 'Striver',
        description: 'Comprehensive DSA practice sheet covering all important topics - 250+ Problems in A2Z',
        url: 'https://takeuforward.org/profile/Aakash334',
        badge: 'DSA Sheet Progress',
        category: 'coding'
      }
    ]);
    
    /* Commented out database loading to force updated defaults
    try {
      const { data: achievementsData, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAchievements: Achievement[] = achievementsData?.map((achievement: any) => ({
        id: achievement.id,
        title: achievement.title,
        platform: achievement.platform,
        description: achievement.description || '',
        url: achievement.url,
        badge: achievement.badge,
        category: achievement.category
      })) || [];

      setAchievements(formattedAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
      // Initialize with default achievements if table doesn't exist yet
      setAchievements([
        {
          id: 'leetcode-1',
          title: 'LeetCode Profile',
          platform: 'LeetCode',
          description: 'Solved algorithmic problems and coding challenges',
          url: 'https://leetcode.com/u/N8lUrPGvsi/',
          badge: '220+ Problems Solved',
          category: 'coding'
        },
        {
          id: 'hackerrank-1',
          title: 'HackerRank Profile',
          platform: 'HackerRank',
          description: 'Competitive programming and skill assessments',
          url: 'https://www.hackerrank.com/profile/saiaakash33333',
          badge: 'Gold Badge',
          category: 'coding'
        }
      ]);
    }
    */
  };

  const addNewAchievement = async (category: Achievement['category']) => {
    try {
      const newAchievement = {
        title: `New ${category} Achievement`,
        platform: 'Platform Name',
        description: 'Click to edit description...',
        category: category
      };

      const { data: achievementData, error } = await supabase
        .from('achievements')
        .insert([newAchievement])
        .select()
        .single();

      if (error) throw error;

      await loadAchievements();

      toast({
        title: "Achievement Added",
        description: `New ${category} achievement created successfully.`
      });
    } catch (error) {
      console.error('Error adding achievement:', error);
      toast({
        title: "Add Failed",
        description: "Failed to add achievement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAchievements(achievements.map(a => a.id === id ? { ...a, ...updates } : a));
    } catch (error) {
      console.error('Error updating achievement:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update achievement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAchievements(achievements.filter(a => a.id !== id));
      
      toast({
        title: "Achievement Removed",
        description: "Achievement has been removed successfully."
      });
    } catch (error) {
      console.error('Error removing achievement:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to remove achievement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { id: 'coding' as const, label: 'Coding Platforms', icon: Code },
    { id: 'competition' as const, label: 'Competitions', icon: Trophy }
  ];

  const getAchievementsByCategory = (category: Achievement['category']) => {
    return achievements.filter(a => a.category === category);
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <Card className="portfolio-card group h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle 
              className="text-lg cursor-pointer leading-tight mb-2" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={e => updateAchievement(achievement.id, {
                title: e.currentTarget.textContent || ''
              })}
            >
              {achievement.title}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <span 
                contentEditable 
                suppressContentEditableWarning
                onBlur={e => updateAchievement(achievement.id, {
                  platform: e.currentTarget.textContent || ''
                })}
              >
                {achievement.platform}
              </span>
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0" 
            onClick={() => removeAchievement(achievement.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p 
          className="text-muted-foreground mb-4 cursor-pointer text-sm leading-relaxed min-h-[40px]" 
          contentEditable 
          suppressContentEditableWarning 
          onBlur={e => updateAchievement(achievement.id, {
            description: e.currentTarget.textContent || ''
          })}
        >
          {achievement.description}
        </p>
        
        {achievement.badge && (
          <Badge variant="secondary" className="mb-4">
            <span 
              contentEditable 
              suppressContentEditableWarning
              onBlur={e => updateAchievement(achievement.id, {
                badge: e.currentTarget.textContent || ''
              })}
            >
              {achievement.badge}
            </span>
          </Badge>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          asChild={!!achievement.url}
          onClick={!achievement.url ? (e) => {
            e.preventDefault();
            const url = prompt('Enter URL:');
            if (url) updateAchievement(achievement.id, { url });
          } : undefined}
        >
          {achievement.url ? (
            <a href={achievement.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Achievement
            </a>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Add URL
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="achievements" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-heading text-center gradient-text">Achievements</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
            A showcase of my accomplishments across coding platforms and competitions.
          </p>

          <div className="space-y-12">
            {categories.map(category => {
              const categoryAchievements = getAchievementsByCategory(category.id);
              const Icon = category.icon;
              
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{category.label}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {categoryAchievements.map(achievement => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;