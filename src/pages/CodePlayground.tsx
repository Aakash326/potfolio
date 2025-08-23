/**
 * Advanced Interactive Code Playground Page
 * Combines all playground components into a comprehensive development environment
 */

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Code,
  Play,
  Brain,
  Github,
  Trophy,
  Layers,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Share,
  Download,
  Sparkles,
  Zap,
  Eye,
  Terminal
} from 'lucide-react';

// Import playground components
import MonacoCodeEditor from '@/components/playground/MonacoEditor';
import CodeExecutor from '@/components/playground/CodeExecutor';
import FileTreeVisualizer from '@/components/playground/FileTreeVisualizer';
import CodeVisualization3D from '@/components/playground/CodeVisualization3D';
import AICodeFeatures from '@/components/playground/AICodeFeatures';
import SkillsPanel from '@/components/playground/SkillsPanel';
import GitHubIntegration from '@/components/playground/GitHubIntegration';

// Import types
import {
  SupportedLanguage,
  ExecutionResult,
  CodeSnippet,
  FileTreeNode,
  GitHubRepo,
  CodeVisualization3D as CodeViz3DType
} from '@/types/codeplayground';

interface PlaygroundState {
  currentCode: string;
  currentLanguage: SupportedLanguage;
  isFullscreen: boolean;
  selectedRepo: GitHubRepo | null;
  fileTree: FileTreeNode[];
  executionHistory: ExecutionResult[];
  savedSnippets: CodeSnippet[];
  activeTab: string;
  layoutSizes: number[];
}

const INITIAL_CODE_TEMPLATES: Record<SupportedLanguage, string> = {
  javascript: `// Welcome to Aakash's Advanced Code Playground! 🚀
// This is a fully interactive development environment with AI assistance

// Example: Advanced React Component with Hooks
import React, { useState, useEffect, useCallback } from 'react';

const DataVisualization = ({ data }) => {
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const processData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate data processing
      const processed = data.map(item => ({
        ...item,
        score: Math.random() * 100,
        category: item.value > 50 ? 'high' : 'low'
      }));
      
      setProcessedData(processed);
    } catch (error) {
      console.error('Data processing failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [data]);
  
  useEffect(() => {
    processData();
  }, [processData]);
  
  if (isLoading) {
    return <div>Processing data...</div>;
  }
  
  return (
    <div className="data-visualization">
      <h2>Advanced Data Visualization</h2>
      {processedData.map((item, index) => (
        <div key={index} className={\`item \${item.category}\`}>
          {item.name}: {item.score.toFixed(2)}
        </div>
      ))}
    </div>
  );
};

export default DataVisualization;

// Test the component
console.log('🎉 Component ready for testing!');`,

  python: `# Welcome to Aakash's Advanced Code Playground! 🐍
# This showcases advanced Python concepts used in AI/ML projects

import numpy as np
import pandas as pd
from typing import List, Dict, Optional, Union
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass
class DataPoint:
    """Represents a single data point in our ML pipeline."""
    features: List[float]
    label: Optional[str] = None
    metadata: Dict[str, Union[str, float]] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
    
    def normalize_features(self) -> 'DataPoint':
        """Normalize features using Z-score normalization."""
        features_array = np.array(self.features)
        normalized = (features_array - np.mean(features_array)) / np.std(features_array)
        return DataPoint(normalized.tolist(), self.label, self.metadata)

class ModelInterface(ABC):
    """Abstract base class for ML models."""
    
    @abstractmethod
    def train(self, data: List[DataPoint]) -> None:
        pass
    
    @abstractmethod
    def predict(self, features: List[float]) -> str:
        pass

class AdvancedClassifier(ModelInterface):
    """Advanced classifier with ensemble methods."""
    
    def __init__(self, n_estimators: int = 10):
        self.n_estimators = n_estimators
        self.is_trained = False
        self.feature_importance = {}
    
    def train(self, data: List[DataPoint]) -> None:
        """Train the ensemble classifier."""
        print(f"Training classifier with {len(data)} samples...")
        
        # Simulate advanced training process
        for i in range(self.n_estimators):
            print(f"Training estimator {i+1}/{self.n_estimators}")
        
        # Calculate feature importance (mock)
        if data:
            n_features = len(data[0].features)
            self.feature_importance = {
                f'feature_{i}': np.random.random() 
                for i in range(n_features)
            }
        
        self.is_trained = True
        print("✅ Training completed!")
    
    def predict(self, features: List[float]) -> str:
        """Make prediction with confidence score."""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Advanced prediction logic (simplified)
        confidence = np.random.random()
        prediction = "positive" if np.mean(features) > 0 else "negative"
        
        print(f"Prediction: {prediction} (confidence: {confidence:.3f})")
        return prediction
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance scores."""
        return self.feature_importance

# Example usage demonstrating advanced Python features
def main():
    # Create sample data
    data = [
        DataPoint([1.2, -0.5, 2.1], "positive", {"source": "sensor_1"}),
        DataPoint([-0.8, 1.3, -1.5], "negative", {"source": "sensor_2"}),
        DataPoint([2.1, 0.8, 1.7], "positive", {"source": "sensor_3"}),
    ]
    
    # Normalize data
    normalized_data = [point.normalize_features() for point in data]
    
    # Train model
    classifier = AdvancedClassifier(n_estimators=5)
    classifier.train(normalized_data)
    
    # Make predictions
    test_features = [0.5, -0.2, 1.1]
    prediction = classifier.predict(test_features)
    
    # Show feature importance
    importance = classifier.get_feature_importance()
    print("\\n🎯 Feature Importance:")
    for feature, score in sorted(importance.items(), key=lambda x: x[1], reverse=True):
        print(f"  {feature}: {score:.3f}")

if __name__ == "__main__":
    main()
    print("\\n🚀 Advanced Python AI/ML pipeline demonstration complete!")`,

  typescript: `// Welcome to Aakash's Advanced Code Playground! 🔷
// This demonstrates advanced TypeScript patterns used in enterprise applications

// Advanced Generic Types and Utility Types
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
  metadata: {
    timestamp: Date;
    requestId: string;
  };
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Conditional Types
type NonNullable<T> = T extends null | undefined ? never : T;
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

// Advanced Interface with Generic Constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: DeepPartial<T>): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  update(id: string, updates: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// Domain Models with Advanced Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  createdAt: Date;
  lastActive?: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  collaborators: User[];
  status: 'active' | 'archived' | 'draft';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Advanced Class with Decorators (conceptual)
class ProjectService implements Repository<Project> {
  private cache = new Map<string, Project>();
  private readonly maxCacheSize = 100;

  // Method with complex generic constraints
  async findById(id: string): Promise<Project | null> {
    // Check cache first
    if (this.cache.has(id)) {
      console.log(\`📦 Cache hit for project: \${id}\`);
      return this.cache.get(id)!;
    }

    try {
      // Simulate API call
      const response: ApiResponse<Project> = await this.fetchFromAPI(\`/projects/\${id}\`);
      
      if (response.status === 'success') {
        this.updateCache(id, response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      return null;
    }
  }

  async findAll(filter?: DeepPartial<Project>): Promise<Project[]> {
    const queryParams = this.buildQueryParams(filter);
    const response: ApiResponse<Project[]> = await this.fetchFromAPI(\`/projects?\${queryParams}\`);
    
    return response.status === 'success' ? response.data : [];
  }

  async create(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const newProject: Project = {
      ...projectData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response: ApiResponse<Project> = await this.fetchFromAPI('/projects', {
      method: 'POST',
      body: JSON.stringify(newProject)
    });

    if (response.status === 'success') {
      this.updateCache(newProject.id, response.data);
      return response.data;
    }

    throw new Error(\`Failed to create project: \${response.message}\`);
  }

  async update(id: string, updates: DeepPartial<Project>): Promise<Project> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(\`Project not found: \${id}\`);
    }

    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    } as Project;

    const response: ApiResponse<Project> = await this.fetchFromAPI(\`/projects/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(updated)
    });

    if (response.status === 'success') {
      this.updateCache(id, response.data);
      return response.data;
    }

    throw new Error(\`Failed to update project: \${response.message}\`);
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response: ApiResponse<void> = await this.fetchFromAPI(\`/projects/\${id}\`, {
        method: 'DELETE'
      });

      if (response.status === 'success') {
        this.cache.delete(id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  }

  // Advanced utility methods
  private updateCache(id: string, project: Project): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(id, project);
  }

  private buildQueryParams(filter?: DeepPartial<Project>): string {
    if (!filter) return '';
    
    const params = new URLSearchParams();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    return params.toString();
  }

  private generateId(): string {
    return \`proj_\${Date.now()}_\${Math.random().toString(36).substring(2)}\`;
  }

  private async fetchFromAPI<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    return {
      data: {} as T,
      status: 'success',
      metadata: {
        timestamp: new Date(),
        requestId: this.generateId()
      }
    };
  }
}

// Advanced usage example with type inference
async function demonstrateAdvancedTypeScript() {
  const projectService = new ProjectService();
  
  // Type-safe operations
  const projects = await projectService.findAll({
    status: 'active',
    owner: {
      role: 'admin'
    }
  });
  
  console.log(\`🎯 Found \${projects.length} active projects\`);
  
  // Advanced type manipulation
  type ProjectSummary = Pick<Project, 'id' | 'name' | 'status'>;
  type ProjectUpdate = Partial<Pick<Project, 'name' | 'description' | 'status'>>;
  
  const summaries: ProjectSummary[] = projects.map(p => ({
    id: p.id,
    name: p.name,
    status: p.status
  }));
  
  console.log('📊 Project summaries:', summaries);
}

// Execute demonstration
demonstrateAdvancedTypeScript()
  .then(() => console.log('✅ Advanced TypeScript demonstration complete!'))
  .catch(error => console.error('❌ Error:', error));`,

  sql: `-- Welcome to Aakash's Advanced Code Playground! 🗄️
-- This demonstrates advanced SQL techniques used in data analysis

-- Advanced table creation with constraints and indexes
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    profile JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (length(username) >= 3)
);

CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user', 'guest');

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status project_status DEFAULT 'draft',
    priority INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    estimated_hours DECIMAL(10,2),
    actual_hours DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline DATE,
    
    CONSTRAINT positive_hours CHECK (estimated_hours >= 0 AND actual_hours >= 0),
    CONSTRAINT valid_priority CHECK (priority BETWEEN 0 AND 5)
);

CREATE TYPE project_status AS ENUM ('draft', 'active', 'completed', 'archived', 'cancelled');

-- Advanced indexing strategy
CREATE INDEX idx_projects_owner_status ON projects(owner_id, status) WHERE status != 'archived';
CREATE INDEX idx_projects_deadline ON projects(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_metadata ON projects USING GIN(metadata);
CREATE INDEX idx_users_email_active ON users(email) WHERE is_active = true;

-- Complex query with multiple advanced features
WITH project_analytics AS (
    -- Common Table Expression for project statistics
    SELECT 
        p.owner_id,
        u.username,
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE p.status = 'completed') as completed_projects,
        COUNT(*) FILTER (WHERE p.status = 'active') as active_projects,
        AVG(p.actual_hours) as avg_hours_per_project,
        SUM(p.actual_hours) as total_hours,
        
        -- Advanced aggregations with JSON
        jsonb_agg(
            jsonb_build_object(
                'project_name', p.name,
                'status', p.status,
                'completion_rate', 
                CASE 
                    WHEN p.estimated_hours > 0 THEN 
                        ROUND((p.actual_hours / p.estimated_hours) * 100, 2)
                    ELSE NULL 
                END
            ) ORDER BY p.updated_at DESC
        ) as project_details,
        
        -- Window functions for ranking
        DENSE_RANK() OVER (ORDER BY COUNT(*) FILTER (WHERE p.status = 'completed') DESC) as productivity_rank
    FROM projects p
    JOIN users u ON p.owner_id = u.id
    WHERE u.is_active = true
      AND p.created_at >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY p.owner_id, u.username
    HAVING COUNT(*) >= 2  -- Only users with 2+ projects
),
performance_metrics AS (
    -- Calculate performance percentiles
    SELECT 
        *,
        PERCENT_RANK() OVER (ORDER BY completed_projects) as completion_percentile,
        PERCENT_RANK() OVER (ORDER BY total_hours) as hours_percentile,
        
        -- Classification based on performance
        CASE 
            WHEN completed_projects >= 10 AND avg_hours_per_project <= 40 THEN 'high_performer'
            WHEN completed_projects >= 5 THEN 'good_performer'
            WHEN total_projects >= 2 THEN 'average_performer'
            ELSE 'new_user'
        END as performance_category
    FROM project_analytics
)
-- Final query with advanced filtering and formatting
SELECT 
    username,
    total_projects,
    completed_projects,
    ROUND(
        (completed_projects::decimal / NULLIF(total_projects, 0)) * 100, 
        1
    ) as completion_percentage,
    
    -- Format hours nicely
    CASE 
        WHEN total_hours >= 1000 THEN 
            ROUND(total_hours / 1000, 1) || 'K hours'
        ELSE 
            total_hours || ' hours'
    END as formatted_total_hours,
    
    -- Performance indicators
    performance_category,
    productivity_rank,
    
    -- Extract specific metadata if available
    COALESCE(
        (project_details->0->>'project_name'), 
        'No recent projects'
    ) as latest_project,
    
    -- Complex conditional formatting
    CASE 
        WHEN completion_percentile >= 0.8 THEN '🏆 Top Performer'
        WHEN completion_percentile >= 0.6 THEN '⭐ Above Average'
        WHEN completion_percentile >= 0.4 THEN '📈 Average'
        ELSE '🌱 Growing'
    END as performance_badge

FROM performance_metrics
ORDER BY 
    productivity_rank ASC,
    completion_percentage DESC,
    total_hours DESC;

-- Advanced analytical queries
-- 1. Time series analysis of project creation
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as projects_created,
    AVG(estimated_hours) as avg_estimated_hours,
    
    -- Running totals
    SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as cumulative_projects,
    
    -- Month-over-month growth
    LAG(COUNT(*), 1) OVER (ORDER BY DATE_TRUNC('month', created_at)) as prev_month_count,
    ROUND(
        (COUNT(*) - LAG(COUNT(*), 1) OVER (ORDER BY DATE_TRUNC('month', created_at))) * 100.0 / 
        NULLIF(LAG(COUNT(*), 1) OVER (ORDER BY DATE_TRUNC('month', created_at)), 0),
        1
    ) as mom_growth_percentage

FROM projects
WHERE created_at >= CURRENT_DATE - INTERVAL '2 years'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 2. Advanced JSON analysis
SELECT 
    jsonb_object_keys(metadata) as metadata_key,
    COUNT(*) as usage_count,
    
    -- Most common values for each key
    mode() WITHIN GROUP (ORDER BY metadata->>jsonb_object_keys(metadata)) as most_common_value,
    
    -- Value distribution
    jsonb_agg(DISTINCT metadata->>jsonb_object_keys(metadata)) as all_values

FROM projects,
     LATERAL jsonb_object_keys(metadata)
WHERE jsonb_typeof(metadata) = 'object'
GROUP BY jsonb_object_keys(metadata)
ORDER BY usage_count DESC;

-- 3. Recursive query for hierarchical data (if projects had parent-child relationships)
/*
WITH RECURSIVE project_hierarchy AS (
    -- Base case: root projects (no parent)
    SELECT id, name, parent_id, 1 as level, ARRAY[name] as path
    FROM projects 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child projects
    SELECT p.id, p.name, p.parent_id, ph.level + 1, ph.path || p.name
    FROM projects p
    JOIN project_hierarchy ph ON p.parent_id = ph.id
    WHERE ph.level < 10  -- Prevent infinite recursion
)
SELECT 
    REPEAT('  ', level - 1) || name as indented_name,
    level,
    array_to_string(path, ' → ') as full_path
FROM project_hierarchy
ORDER BY path;
*/

-- Advanced trigger for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Performance analysis query
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT u.username, COUNT(p.*) as project_count
FROM users u 
LEFT JOIN projects p ON u.id = p.owner_id 
WHERE u.created_at >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY u.username
ORDER BY project_count DESC
LIMIT 10;

-- 🎯 This demonstrates advanced SQL features:
-- ✅ Complex CTEs and window functions
-- ✅ JSON/JSONB operations
-- ✅ Advanced indexing strategies
-- ✅ Performance optimization
-- ✅ Data analytics and reporting
-- ✅ Constraint management
-- ✅ Time series analysis`
};

// Mock 3D visualization data
const MOCK_3D_DATA: CodeViz3DType = {
  nodes: [
    {
      id: 'main',
      label: 'Main',
      type: 'class',
      position: [0, 0, 0],
      color: '#4CAF50',
      size: 1.5,
      connections: ['utils', 'api', 'components']
    },
    {
      id: 'utils',
      label: 'Utils',
      type: 'function',
      position: [-10, 5, -5],
      color: '#2196F3',
      size: 1.2,
      connections: ['main']
    },
    {
      id: 'api',
      label: 'API',
      type: 'function',
      position: [10, -5, 5],
      color: '#FF9800',
      size: 1.3,
      connections: ['main', 'database']
    },
    {
      id: 'components',
      label: 'Components',
      type: 'class',
      position: [0, 10, -10],
      color: '#9C27B0',
      size: 1.4,
      connections: ['main', 'hooks']
    },
    {
      id: 'hooks',
      label: 'Hooks',
      type: 'function',
      position: [-5, 15, -15],
      color: '#607D8B',
      size: 1.0,
      connections: ['components']
    },
    {
      id: 'database',
      label: 'Database',
      type: 'import',
      position: [15, -10, 10],
      color: '#795548',
      size: 1.1,
      connections: ['api']
    }
  ],
  edges: [
    { source: 'main', target: 'utils', type: 'calls', strength: 0.8 },
    { source: 'main', target: 'api', type: 'calls', strength: 0.9 },
    { source: 'main', target: 'components', type: 'imports', strength: 0.7 },
    { source: 'api', target: 'database', type: 'uses', strength: 0.6 },
    { source: 'components', target: 'hooks', type: 'uses', strength: 0.5 }
  ]
};

const CodePlayground: React.FC = memo(() => {
  const [state, setState] = useState<PlaygroundState>({
    currentCode: INITIAL_CODE_TEMPLATES.javascript,
    currentLanguage: 'javascript',
    isFullscreen: false,
    selectedRepo: null,
    fileTree: [],
    executionHistory: [],
    savedSnippets: [],
    activeTab: 'editor',
    layoutSizes: [40, 35, 25]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const updateState = useCallback((updates: Partial<PlaygroundState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleCodeChange = useCallback((code: string) => {
    updateState({ currentCode: code });
  }, [updateState]);

  const handleLanguageChange = useCallback((language: SupportedLanguage) => {
    updateState({ 
      currentLanguage: language,
      currentCode: INITIAL_CODE_TEMPLATES[language] || ''
    });
  }, [updateState]);

  const handleExecutionResult = useCallback((result: ExecutionResult) => {
    updateState({ 
      executionHistory: [result, ...state.executionHistory.slice(0, 9)] 
    });
  }, [state.executionHistory, updateState]);

  const handleRepositorySelect = useCallback((repo: GitHubRepo) => {
    updateState({ selectedRepo: repo });
  }, [updateState]);

  const handleFileTreeLoad = useCallback((tree: FileTreeNode[]) => {
    updateState({ fileTree: tree });
  }, [updateState]);

  const handleFileSelect = useCallback((node: FileTreeNode) => {
    if (node.type === 'file' && node.language) {
      handleLanguageChange(node.language);
      // In a real implementation, load file content
      console.log('Selected file:', node.path);
    }
  }, [handleLanguageChange]);

  const toggleFullscreen = useCallback(() => {
    updateState({ isFullscreen: !state.isFullscreen });
  }, [state.isFullscreen, updateState]);

  const resetPlayground = useCallback(() => {
    updateState({
      currentCode: INITIAL_CODE_TEMPLATES[state.currentLanguage],
      executionHistory: [],
      selectedRepo: null,
      fileTree: []
    });
  }, [state.currentLanguage, updateState]);

  const saveCurrentCode = useCallback(() => {
    const snippet: CodeSnippet = {
      id: `snippet_${Date.now()}`,
      title: `${state.currentLanguage} Snippet`,
      description: 'Saved from Code Playground',
      code: state.currentCode,
      language: state.currentLanguage,
      tags: [state.currentLanguage, 'playground'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      executionCount: 0,
      likes: 0,
      author: 'Aakash'
    };

    updateState({ 
      savedSnippets: [snippet, ...state.savedSnippets] 
    });
  }, [state, updateState]);

  const welcomeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <motion.div
          variants={welcomeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-4xl text-center space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-3xl"
            >
              🚀
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to the Future of Code
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience Aakash's Advanced Interactive Code Playground - featuring AI assistance, 
              3D visualizations, real-time execution, and GitHub integration.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { icon: <Code className="h-6 w-6" />, title: "Monaco Editor", desc: "Professional IDE experience" },
              { icon: <Brain className="h-6 w-6" />, title: "AI Assistant", desc: "Powered by RAG technology" },
              { icon: <Layers className="h-6 w-6" />, title: "3D Visualization", desc: "Interactive code structure" },
              { icon: <Github className="h-6 w-6" />, title: "GitHub Integration", desc: "Real project data" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-200"
              >
                <div className="text-primary mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <Button
              size="lg"
              onClick={() => setShowWelcome(false)}
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Launch Playground
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, Monaco Editor, Three.js, and AI
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${state.isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
                  A
                </div>
                <div>
                  <h1 className="text-lg font-bold">Advanced Code Playground</h1>
                  <p className="text-xs text-muted-foreground">by Sai Aakash</p>
                </div>
              </div>
              
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                {state.currentLanguage}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={saveCurrentCode}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetPlayground}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {state.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={state.activeTab} onValueChange={(tab) => updateState({ activeTab: tab })}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="editor" className="gap-2">
              <Code className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="execution" className="gap-2">
              <Play className="h-4 w-4" />
              Execute
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-2">
              <Github className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="3d" className="gap-2">
              <Layers className="h-4 w-4" />
              3D View
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Trophy className="h-4 w-4" />
              Skills
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <TabsContent value="editor" className="mt-0">
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
                    <ResizablePanel defaultSize={60}>
                      <MonacoCodeEditor
                        value={state.currentCode}
                        onChange={handleCodeChange}
                        language={state.currentLanguage}
                        height="600px"
                        isFullscreen={state.isFullscreen}
                        onToggleFullscreen={toggleFullscreen}
                        onExecute={() => updateState({ activeTab: 'execution' })}
                        onSave={saveCurrentCode}
                      />
                    </ResizablePanel>
                    
                    <ResizableHandle />
                    
                    <ResizablePanel defaultSize={40}>
                      <CodeExecutor
                        code={state.currentCode}
                        language={state.currentLanguage}
                        onExecutionResult={handleExecutionResult}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </motion.div>
              </TabsContent>

              <TabsContent value="execution" className="mt-0">
                <motion.div
                  key="execution"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <CodeExecutor
                        code={state.currentCode}
                        language={state.currentLanguage}
                        onExecutionResult={handleExecutionResult}
                      />
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Terminal className="h-5 w-5" />
                          Execution History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-96">
                          <div className="space-y-2">
                            {state.executionHistory.map((result, index) => (
                              <div key={index} className="p-3 border rounded-lg text-sm">
                                <div className="flex justify-between items-center mb-2">
                                  <Badge variant={result.exitCode === 0 ? 'default' : 'destructive'}>
                                    {result.exitCode === 0 ? 'Success' : 'Error'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {result.executionTime}ms
                                  </span>
                                </div>
                                {result.output && (
                                  <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto">
                                    {result.output.slice(0, 200)}
                                    {result.output.length > 200 && '...'}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AICodeFeatures
                    code={state.currentCode}
                    language={state.currentLanguage}
                    onCodeUpdate={handleCodeChange}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="files" className="mt-0">
                <motion.div
                  key="files"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <GitHubIntegration
                      onRepositorySelect={handleRepositorySelect}
                      onFileTreeLoad={handleFileTreeLoad}
                    />
                    
                    {state.fileTree.length > 0 && (
                      <FileTreeVisualizer
                        data={state.fileTree}
                        onNodeSelect={handleFileSelect}
                        onNodeExpand={() => {}}
                        searchQuery=""
                      />
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="3d" className="mt-0">
                <motion.div
                  key="3d"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CodeVisualization3D
                    data={MOCK_3D_DATA}
                    width={800}
                    height={600}
                    onNodeClick={(nodeId) => console.log('3D Node clicked:', nodeId)}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SkillsPanel
                    skills={[]}
                    view="grid"
                    animated={true}
                    interactive={true}
                  />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
});

CodePlayground.displayName = 'CodePlayground';

export default CodePlayground;