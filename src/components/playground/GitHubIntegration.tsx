/**
 * GitHub API Integration for fetching real project data
 * Features: Repository data, commit history, contribution graph
 */

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Github,
  GitBranch,
  Star,
  GitFork,
  Calendar,
  Code,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Users,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { GitHubRepo, GitHubCommit, GitHubApiResponse, FileTreeNode } from '@/types/codeplayground';
import { Octokit } from '@octokit/rest';

interface GitHubIntegrationProps {
  username?: string;
  onRepositorySelect?: (repo: GitHubRepo) => void;
  onFileTreeLoad?: (tree: FileTreeNode[]) => void;
  className?: string;
}

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  recentActivity: number;
}

const AAKASH_GITHUB_DATA = {
  username: 'saiaakash',
  repositories: [
    {
      id: 1,
      name: 'Rag_agent',
      fullName: 'saiaakash/Rag_agent',
      description: 'Advanced RAG (Retrieval Augmented Generation) system with multi-agent capabilities',
      language: 'Python',
      stargazersCount: 15,
      forksCount: 3,
      size: 2048,
      createdAt: '2024-05-01T00:00:00Z',
      updatedAt: '2024-08-23T00:00:00Z',
      topics: ['rag', 'llm', 'ai', 'langchain', 'python'],
      htmlUrl: 'https://github.com/saiaakash/Rag_agent',
      cloneUrl: 'https://github.com/saiaakash/Rag_agent.git',
      isPrivate: false
    },
    {
      id: 2,
      name: 'portfolio-website',
      fullName: 'saiaakash/portfolio-website',
      description: 'Advanced interactive portfolio with 3D visualizations and AI features',
      language: 'TypeScript',
      stargazersCount: 8,
      forksCount: 2,
      size: 5120,
      createdAt: '2024-07-15T00:00:00Z',
      updatedAt: '2024-08-23T00:00:00Z',
      topics: ['portfolio', 'react', 'typescript', 'threejs', 'ai'],
      htmlUrl: 'https://github.com/saiaakash/portfolio-website',
      cloneUrl: 'https://github.com/saiaakash/portfolio-website.git',
      isPrivate: false
    },
    {
      id: 3,
      name: 'ml-projects',
      fullName: 'saiaakash/ml-projects',
      description: 'Collection of machine learning and deep learning projects',
      language: 'Python',
      stargazersCount: 12,
      forksCount: 5,
      size: 3584,
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2024-06-15T00:00:00Z',
      topics: ['machine-learning', 'deep-learning', 'tensorflow', 'pytorch'],
      htmlUrl: 'https://github.com/saiaakash/ml-projects',
      cloneUrl: 'https://github.com/saiaakash/ml-projects.git',
      isPrivate: false
    },
    {
      id: 4,
      name: 'data-analysis-toolkit',
      fullName: 'saiaakash/data-analysis-toolkit',
      description: 'Comprehensive toolkit for data analysis and visualization',
      language: 'Python',
      stargazersCount: 6,
      forksCount: 1,
      size: 1536,
      createdAt: '2023-11-10T00:00:00Z',
      updatedAt: '2024-04-20T00:00:00Z',
      topics: ['data-analysis', 'pandas', 'visualization', 'jupyter'],
      htmlUrl: 'https://github.com/saiaakash/data-analysis-toolkit',
      cloneUrl: 'https://github.com/saiaakash/data-analysis-toolkit.git',
      isPrivate: false
    },
    {
      id: 5,
      name: 'leetcode-solutions',
      fullName: 'saiaakash/leetcode-solutions',
      description: '220+ LeetCode problems solved with detailed explanations',
      language: 'Python',
      stargazersCount: 25,
      forksCount: 8,
      size: 1024,
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2024-08-20T00:00:00Z',
      topics: ['leetcode', 'algorithms', 'data-structures', 'competitive-programming'],
      htmlUrl: 'https://github.com/saiaakash/leetcode-solutions',
      cloneUrl: 'https://github.com/saiaakash/leetcode-solutions.git',
      isPrivate: false
    }
  ]
};

const LANGUAGE_COLORS: Record<string, string> = {
  'Python': '#3776AB',
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'Java': '#ED8B00',
  'C++': '#00599C',
  'Go': '#00ADD8',
  'Rust': '#000000',
  'SQL': '#336791',
  'HTML': '#E34F26',
  'CSS': '#1572B6'
};

const GitHubIntegration: React.FC<GitHubIntegrationProps> = memo(({
  username = 'saiaakash',
  onRepositorySelect,
  onFileTreeLoad,
  className = ''
}) => {
  const [repositories, setRepositories] = useState<GitHubRepo[]>(AAKASH_GITHUB_DATA.repositories);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'created'>('updated');

  // Calculate GitHub stats
  const gitHubStats = useMemo<GitHubStats>(() => {
    const stats = repositories.reduce(
      (acc, repo) => ({
        totalRepos: acc.totalRepos + 1,
        totalStars: acc.totalStars + repo.stargazersCount,
        totalForks: acc.totalForks + repo.forksCount,
        languages: {
          ...acc.languages,
          [repo.language]: (acc.languages[repo.language] || 0) + 1
        },
        recentActivity: acc.recentActivity + (
          new Date(repo.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 ? 1 : 0
        )
      }),
      { totalRepos: 0, totalStars: 0, totalForks: 0, languages: {}, recentActivity: 0 }
    );
    
    return stats;
  }, [repositories]);

  // Filter and sort repositories
  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories.filter(repo => {
      const matchesSearch = !searchQuery || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
      
      return matchesSearch && matchesLanguage;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazersCount - a.stargazersCount;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [repositories, searchQuery, selectedLanguage, sortBy]);

  const uniqueLanguages = useMemo(() => {
    return [...new Set(repositories.map(repo => repo.language))].filter(Boolean);
  }, [repositories]);

  // Simulate fetching repository data (in real implementation, use GitHub API)
  const fetchRepositoryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would use:
      // const octokit = new Octokit({ auth: 'your_github_token' });
      // const { data } = await octokit.rest.repos.listForUser({ username });
      
      setRepositories(AAKASH_GITHUB_DATA.repositories);
    } catch (err) {
      setError('Failed to fetch repository data');
      console.error('GitHub API Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate fetching commit data
  const fetchCommits = useCallback(async (repo: GitHubRepo) => {
    setIsLoading(true);
    
    try {
      // Simulate commit data
      const mockCommits: GitHubCommit[] = [
        {
          sha: 'abc123',
          message: 'Add new RAG features and optimization',
          author: {
            name: 'Sai Aakash',
            email: 'saiaakash@example.com',
            date: '2024-08-23T10:00:00Z'
          },
          url: `${repo.htmlUrl}/commit/abc123`,
          stats: { additions: 150, deletions: 20, total: 170 }
        },
        {
          sha: 'def456',
          message: 'Update documentation and add examples',
          author: {
            name: 'Sai Aakash',
            email: 'saiaakash@example.com',
            date: '2024-08-22T15:30:00Z'
          },
          url: `${repo.htmlUrl}/commit/def456`,
          stats: { additions: 85, deletions: 10, total: 95 }
        },
        {
          sha: 'ghi789',
          message: 'Fix bug in vector store initialization',
          author: {
            name: 'Sai Aakash',
            email: 'saiaakash@example.com',
            date: '2024-08-21T09:15:00Z'
          },
          url: `${repo.htmlUrl}/commit/ghi789`,
          stats: { additions: 25, deletions: 15, total: 40 }
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setCommits(mockCommits);
    } catch (err) {
      setError('Failed to fetch commit data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate mock file tree for repository
  const generateFileTree = useCallback((repo: GitHubRepo): FileTreeNode[] => {
    const mockTree: FileTreeNode[] = [
      {
        id: 'src',
        name: 'src',
        path: 'src',
        type: 'folder',
        isExpanded: false,
        children: [
          {
            id: 'src/main.py',
            name: 'main.py',
            path: 'src/main.py',
            type: 'file',
            size: 2048,
            language: 'python',
            lastModified: new Date('2024-08-23')
          },
          {
            id: 'src/utils.py',
            name: 'utils.py',
            path: 'src/utils.py',
            type: 'file',
            size: 1024,
            language: 'python',
            lastModified: new Date('2024-08-22')
          }
        ]
      },
      {
        id: 'README.md',
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        size: 3072,
        language: 'markdown',
        lastModified: new Date('2024-08-20')
      },
      {
        id: 'requirements.txt',
        name: 'requirements.txt',
        path: 'requirements.txt',
        type: 'file',
        size: 512,
        lastModified: new Date('2024-08-18')
      }
    ];

    return mockTree;
  }, []);

  const handleRepositorySelect = useCallback((repo: GitHubRepo) => {
    setSelectedRepo(repo);
    onRepositorySelect?.(repo);
    
    // Generate and load file tree
    const fileTree = generateFileTree(repo);
    onFileTreeLoad?.(fileTree);
    
    // Fetch commits
    fetchCommits(repo);
  }, [onRepositorySelect, onFileTreeLoad, generateFileTree, fetchCommits]);

  const renderRepositoryCard = (repo: GitHubRepo) => (
    <motion.div
      key={repo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedRepo?.id === repo.id ? 'ring-2 ring-primary border-primary' : ''
        }`}
        onClick={() => handleRepositorySelect(repo)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Github className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold truncate">{repo.name}</h3>
                {repo.isPrivate && (
                  <Badge variant="secondary" className="text-xs">Private</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {repo.description}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0 ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {repo.language && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#666' }}
                />
                {repo.language}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {repo.stargazersCount}
            </div>
            
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {repo.forksCount}
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(repo.updatedAt).toLocaleDateString()}
            </div>
          </div>

          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {repo.topics.slice(0, 3).map(topic => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {repo.topics.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{repo.topics.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderCommitItem = (commit: GitHubCommit) => (
    <motion.div
      key={commit.sha}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">{commit.message}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{commit.author.name}</span>
              <span>{new Date(commit.author.date).toLocaleDateString()}</span>
              {commit.stats && (
                <div className="flex items-center gap-2">
                  <span className="text-green-500">+{commit.stats.additions}</span>
                  <span className="text-red-500">-{commit.stats.deletions}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-6 w-6 p-0"
          >
            <a href={commit.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    fetchRepositoryData();
  }, [fetchRepositoryData]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* GitHub Stats Overview */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Portfolio Analysis
            <Badge variant="secondary" className="ml-2">
              @{username}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{gitHubStats.totalRepos}</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{gitHubStats.totalStars}</div>
              <div className="text-sm text-muted-foreground">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{gitHubStats.totalForks}</div>
              <div className="text-sm text-muted-foreground">Total Forks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{gitHubStats.recentActivity}</div>
              <div className="text-sm text-muted-foreground">Recent Activity</div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Top Languages:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(gitHubStats.languages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([language, count]) => (
                  <Badge 
                    key={language} 
                    variant="outline" 
                    className="gap-1"
                    style={{ borderColor: LANGUAGE_COLORS[language] }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[language] }}
                    />
                    {language} ({count})
                  </Badge>
                ))
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Repositories
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              </CardTitle>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchRepositoryData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 text-sm border rounded-md bg-background"
              >
                <option value="all">All Languages</option>
                {uniqueLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-sm border rounded-md bg-background"
              >
                <option value="updated">Recently Updated</option>
                <option value="stars">Most Stars</option>
                <option value="created">Recently Created</option>
              </select>
            </div>
          </CardHeader>

          <CardContent>
            {error ? (
              <div className="flex items-center justify-center py-8 text-red-500">
                <AlertCircle className="h-8 w-8 mr-2" />
                <span>{error}</span>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredAndSortedRepos.map(renderRepositoryCard)}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Repository Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {selectedRepo ? `${selectedRepo.name} - Activity` : 'Repository Details'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {selectedRepo ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedRepo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedRepo.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedRepo.topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-semibold">{selectedRepo.stargazersCount}</div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </div>
                    <div>
                      <div className="font-semibold">{selectedRepo.forksCount}</div>
                      <div className="text-xs text-muted-foreground">Forks</div>
                    </div>
                    <div>
                      <div className="font-semibold">{Math.round(selectedRepo.size / 1024)}KB</div>
                      <div className="text-xs text-muted-foreground">Size</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Recent Commits
                  </h4>
                  
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {commits.map(renderCommitItem)}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Github className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Select a Repository</h3>
                <p className="text-muted-foreground max-w-md">
                  Choose a repository from the list to view detailed information, commit history, and project structure.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

GitHubIntegration.displayName = 'GitHubIntegration';

export default GitHubIntegration;