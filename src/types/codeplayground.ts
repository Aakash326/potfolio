/**
 * Core TypeScript interfaces and types for the Advanced Code Playground
 * Provides comprehensive type safety for all playground features
 */

// Supported programming languages
export type SupportedLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'sql' 
  | 'json' 
  | 'html' 
  | 'css' 
  | 'markdown' 
  | 'bash'
  | 'java'
  | 'cpp'
  | 'go';

// Monaco Editor configuration
export interface EditorConfig {
  language: SupportedLanguage;
  theme: 'vs-dark' | 'vs-light' | 'hc-black';
  fontSize: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  folding: boolean;
  autoClosingBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
}

// Code execution result
export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
  memoryUsage?: number;
  exitCode: number;
  warnings?: string[];
}

// Code snippet structure
export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: SupportedLanguage;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  executionCount: number;
  likes: number;
  author: string;
}

// File tree structure for project visualization
export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  language?: SupportedLanguage;
  children?: FileTreeNode[];
  isExpanded?: boolean;
  content?: string;
  lastModified?: Date;
}

// GitHub repository data
export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  htmlUrl: string;
  cloneUrl: string;
  isPrivate: boolean;
}

// GitHub commit data
export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

// Skills and technologies
export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'cloud' | 'other';
  proficiency: number; // 0-100
  yearsExperience: number;
  icon: string;
  color: string;
  projects: string[];
  certifications?: string[];
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'code' | 'learning' | 'sharing' | 'challenge';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: Date;
  progress: number; // 0-100
  maxProgress: number;
  reward: string;
}

// Algorithm visualization data
export interface AlgorithmStep {
  id: string;
  step: number;
  description: string;
  code?: string;
  variables: Record<string, any>;
  arrays?: Array<{
    name: string;
    values: number[];
    highlightIndices?: number[];
  }>;
  complexity?: {
    time: string;
    space: string;
  };
}

// Code metrics and analysis
export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  codeSmells: string[];
  duplicatedLines: number;
  testCoverage: number;
  dependencies: string[];
  vulnerabilities: SecurityVulnerability[];
}

export interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  file: string;
  line: number;
  recommendation: string;
}

// AI-powered features
export interface AICodeFeature {
  type: 'explain' | 'optimize' | 'convert' | 'generate_docs' | 'review';
  input: string;
  language: SupportedLanguage;
  targetLanguage?: SupportedLanguage;
  output?: string;
  suggestions?: string[];
  isLoading: boolean;
  error?: string;
}

// 3D Visualization data
export interface CodeVisualization3D {
  nodes: Array<{
    id: string;
    label: string;
    type: 'class' | 'function' | 'variable' | 'import';
    position: [number, number, number];
    color: string;
    size: number;
    connections: string[];
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: 'calls' | 'imports' | 'inherits' | 'uses';
    strength: number;
  }>;
}

// Code collaboration features
export interface CodeReview {
  id: string;
  codeSnippetId: string;
  reviewer: string;
  comments: CodeComment[];
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeComment {
  id: string;
  line: number;
  content: string;
  author: string;
  createdAt: Date;
  type: 'suggestion' | 'question' | 'praise' | 'issue';
  resolved: boolean;
}

// Performance and analytics
export interface PerformanceMetrics {
  componentRenderTime: number;
  memoryUsage: number;
  bundleSize: number;
  loadTime: number;
  errorRate: number;
  userInteractions: number;
}

// Theme and styling
export interface PlaygroundTheme {
  name: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
    error: string;
    warning: string;
    success: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Component props interfaces
export interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  theme?: string;
  height?: string;
  options?: any;
  loading?: React.ReactNode;
  onMount?: (editor: any, monaco: any) => void;
}

export interface FileTreeProps {
  data: FileTreeNode[];
  onNodeSelect: (node: FileTreeNode) => void;
  onNodeExpand: (nodeId: string) => void;
  searchQuery: string;
  selectedNodeId?: string;
  maxHeight?: number;
}

export interface SkillVisualizerProps {
  skills: Skill[];
  view: 'grid' | 'chart' | 'timeline';
  animated: boolean;
  interactive: boolean;
  filterCategory?: string;
}

export interface CodeExecutorProps {
  code: string;
  language: SupportedLanguage;
  onExecutionResult: (result: ExecutionResult) => void;
  timeout?: number;
  memoryLimit?: number;
}

// API response types
export interface GitHubApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  rateLimit: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

// Error handling
export interface PlaygroundError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

// Local storage data structure
export interface LocalStorageData {
  savedSnippets: CodeSnippet[];
  editorConfig: EditorConfig;
  theme: PlaygroundTheme;
  achievements: Achievement[];
  lastVisit: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  autoSave: boolean;
  showMinimap: boolean;
  enableVim: boolean;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  enableLinting: boolean;
  theme: string;
}

// Context types
export interface PlaygroundContextType {
  currentCode: string;
  setCurrentCode: (code: string) => void;
  currentLanguage: SupportedLanguage;
  setCurrentLanguage: (language: SupportedLanguage) => void;
  editorConfig: EditorConfig;
  updateEditorConfig: (config: Partial<EditorConfig>) => void;
  savedSnippets: CodeSnippet[];
  saveSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteSnippet: (id: string) => void;
  executionHistory: ExecutionResult[];
  addExecutionResult: (result: ExecutionResult) => void;
  isLoading: boolean;
  error: PlaygroundError | null;
  clearError: () => void;
}

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: any;
  visible: any;
  exit?: any;
}

// Chart data for visualizations
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string;
    borderWidth: number;
  }>;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'project' | 'achievement' | 'skill' | 'certification';
  icon: string;
  color: string;
  link?: string;
}