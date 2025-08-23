/**
 * Interactive File Tree Visualizer for GitHub Projects
 * Features: Lazy loading, search/filter, code previews, virtual scrolling
 */

import React, { useState, useCallback, useMemo, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  Search, 
  Filter,
  Code,
  Eye,
  Download,
  ExternalLink,
  GitBranch,
  Star,
  Calendar,
  FileType,
  Zap
} from 'lucide-react';
import { FileTreeNode, FileTreeProps, SupportedLanguage } from '@/types/codeplayground';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// File type icons and colors
const FILE_TYPE_CONFIG: Record<string, { icon: string; color: string; language?: SupportedLanguage }> = {
  // Web Technologies
  'js': { icon: '🟨', color: '#F7DF1E', language: 'javascript' },
  'jsx': { icon: '⚛️', color: '#61DAFB', language: 'javascript' },
  'ts': { icon: '🔷', color: '#3178C6', language: 'typescript' },
  'tsx': { icon: '🔷', color: '#3178C6', language: 'typescript' },
  'html': { icon: '🌐', color: '#E34F26', language: 'html' },
  'css': { icon: '🎨', color: '#1572B6', language: 'css' },
  'scss': { icon: '🎨', color: '#CF649A', language: 'css' },
  'sass': { icon: '🎨', color: '#CF649A', language: 'css' },
  
  // Backend & Data
  'py': { icon: '🐍', color: '#3776AB', language: 'python' },
  'java': { icon: '☕', color: '#ED8B00', language: 'java' },
  'cpp': { icon: '⚡', color: '#00599C', language: 'cpp' },
  'c': { icon: '⚡', color: '#A8B9CC', language: 'cpp' },
  'go': { icon: '🐹', color: '#00ADD8', language: 'go' },
  'rs': { icon: '🦀', color: '#000000' },
  'sql': { icon: '🗄️', color: '#336791', language: 'sql' },
  
  // Config & Data
  'json': { icon: '📋', color: '#000000', language: 'json' },
  'yaml': { icon: '📄', color: '#CB171E' },
  'yml': { icon: '📄', color: '#CB171E' },
  'xml': { icon: '📄', color: '#0060AC' },
  'toml': { icon: '📄', color: '#9C4221' },
  
  // Documentation
  'md': { icon: '📝', color: '#083FA1', language: 'markdown' },
  'txt': { icon: '📄', color: '#666666' },
  'pdf': { icon: '📕', color: '#FF0000' },
  
  // Build & Config
  'dockerfile': { icon: '🐳', color: '#2496ED' },
  'gitignore': { icon: '🚫', color: '#F05032' },
  'env': { icon: '🔐', color: '#ECD53F' },
  'lock': { icon: '🔒', color: '#CB3837' },
  
  // Images
  'png': { icon: '🖼️', color: '#FF6B6B' },
  'jpg': { icon: '🖼️', color: '#FF6B6B' },
  'jpeg': { icon: '🖼️', color: '#FF6B6B' },
  'gif': { icon: '🖼️', color: '#FF6B6B' },
  'svg': { icon: '🎨', color: '#FFB86C' },
  
  // Default
  'default': { icon: '📄', color: '#6B7280' }
};

interface FilePreview {
  node: FileTreeNode;
  content: string;
  isLoading: boolean;
  error?: string;
}

interface VirtualizedTreeProps {
  nodes: FileTreeNode[];
  onNodeSelect: (node: FileTreeNode) => void;
  onNodeExpand: (nodeId: string) => void;
  selectedNodeId?: string;
  searchQuery: string;
  itemHeight: number;
  maxHeight: number;
}

const VirtualizedFileTree: React.FC<VirtualizedTreeProps> = memo(({
  nodes,
  onNodeSelect,
  onNodeExpand,
  selectedNodeId,
  searchQuery,
  itemHeight,
  maxHeight
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const flattenedNodes = useMemo(() => {
    const flatten = (nodes: FileTreeNode[], level = 0): Array<FileTreeNode & { level: number }> => {
      const result: Array<FileTreeNode & { level: number }> = [];
      
      for (const node of nodes) {
        // Apply search filter
        const matchesSearch = !searchQuery || 
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.path.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
          result.push({ ...node, level });
        }

        if (node.children && node.isExpanded && (matchesSearch || searchQuery)) {
          result.push(...flatten(node.children, level + 1));
        }
      }
      
      return result;
    };
    
    return flatten(nodes);
  }, [nodes, searchQuery]);

  const visibleNodes = useMemo(() => {
    const containerHeight = maxHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      flattenedNodes.length
    );

    return flattenedNodes.slice(startIndex, endIndex).map((node, index) => ({
      ...node,
      virtualIndex: startIndex + index
    }));
  }, [flattenedNodes, scrollTop, itemHeight, maxHeight]);

  const getFileTypeInfo = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return FILE_TYPE_CONFIG[extension] || FILE_TYPE_CONFIG.default;
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const renderTreeNode = (node: FileTreeNode & { level: number; virtualIndex: number }) => {
    const fileInfo = getFileTypeInfo(node.name);
    const isSelected = selectedNodeId === node.id;
    const indentLevel = node.level * 20;

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: node.virtualIndex * 0.02 }}
        style={{
          position: 'absolute',
          top: node.virtualIndex * itemHeight,
          width: '100%',
          height: itemHeight
        }}
        className={`flex items-center px-2 py-1 cursor-pointer hover:bg-muted/50 transition-colors ${
          isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''
        }`}
        onClick={() => {
          if (node.type === 'folder') {
            onNodeExpand(node.id);
          } else {
            onNodeSelect(node);
          }
        }}
      >
        <div style={{ paddingLeft: indentLevel }} className="flex items-center gap-2 flex-1 min-w-0">
          {node.type === 'folder' ? (
            <>
              {node.isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Folder className="h-4 w-4 text-blue-500" />
            </>
          ) : (
            <>
              <div className="w-4" /> {/* Spacer */}
              <div className="flex items-center">
                <span className="text-sm mr-1">{fileInfo.icon}</span>
              </div>
            </>
          )}
          
          <span 
            className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}
            style={{ color: node.type === 'file' ? fileInfo.color : undefined }}
          >
            {node.name}
          </span>
          
          {node.type === 'file' && node.size && (
            <span className="text-xs text-muted-foreground ml-auto">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      className="relative overflow-auto" 
      style={{ height: maxHeight }}
      onScroll={handleScroll}
      ref={scrollAreaRef}
    >
      <div style={{ height: flattenedNodes.length * itemHeight, position: 'relative' }}>
        {visibleNodes.map(renderTreeNode)}
      </div>
    </div>
  );
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const FileTreeVisualizer: React.FC<FileTreeProps> = memo(({
  data,
  onNodeSelect,
  onNodeExpand,
  searchQuery,
  selectedNodeId,
  maxHeight = 600
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNodeExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
    onNodeExpand(nodeId);
  }, [onNodeExpand]);

  const handleNodeSelect = useCallback(async (node: FileTreeNode) => {
    setSelectedNode(node);
    onNodeSelect(node);

    // Load file preview for supported file types
    const fileInfo = FILE_TYPE_CONFIG[node.name.split('.').pop()?.toLowerCase() || ''];
    
    if (fileInfo?.language && node.type === 'file') {
      setPreview({ node, content: '', isLoading: true });
      setShowPreview(true);

      try {
        // In a real implementation, fetch file content from GitHub API
        // For now, simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock content based on file type
        const mockContent = getMockFileContent(node, fileInfo.language);
        
        setPreview({ node, content: mockContent, isLoading: false });
      } catch (error) {
        setPreview({ 
          node, 
          content: '', 
          isLoading: false, 
          error: 'Failed to load file content' 
        });
      }
    }
  }, [onNodeSelect]);

  const getMockFileContent = (node: FileTreeNode, language: SupportedLanguage): string => {
    // Generate mock content based on file type
    switch (language) {
      case 'javascript':
        return `// ${node.name}
import React from 'react';

const Component = () => {
  return (
    <div className="component">
      <h1>Hello World</h1>
    </div>
  );
};

export default Component;`;
      
      case 'python':
        return `# ${node.name}
import numpy as np
import pandas as pd

class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    def process(self):
        return np.mean(self.data)

if __name__ == "__main__":
    processor = DataProcessor([1, 2, 3, 4, 5])
    print(f"Result: {processor.process()}")`;
      
      default:
        return `// ${node.name}
// This is a sample file preview
// Real content would be loaded from GitHub API`;
    }
  };

  // Update expanded state in tree data
  const updateTreeExpansion = useCallback((nodes: FileTreeNode[]): FileTreeNode[] => {
    return nodes.map(node => ({
      ...node,
      isExpanded: expandedNodes.has(node.id),
      children: node.children ? updateTreeExpansion(node.children) : undefined
    }));
  }, [expandedNodes]);

  const processedData = useMemo(() => updateTreeExpansion(data), [data, updateTreeExpansion]);

  const filteredData = useMemo(() => {
    if (filterType === 'all') return processedData;
    
    const filterByType = (nodes: FileTreeNode[]): FileTreeNode[] => {
      return nodes.filter(node => {
        if (node.type === 'folder') {
          return node.children && filterByType(node.children).length > 0;
        }
        
        const extension = node.name.split('.').pop()?.toLowerCase() || '';
        const fileInfo = FILE_TYPE_CONFIG[extension];
        
        switch (filterType) {
          case 'code':
            return fileInfo?.language !== undefined;
          case 'config':
            return ['json', 'yaml', 'yml', 'toml', 'env'].includes(extension);
          case 'docs':
            return ['md', 'txt', 'pdf'].includes(extension);
          default:
            return true;
        }
      }).map(node => ({
        ...node,
        children: node.children ? filterByType(node.children) : undefined
      }));
    };

    return filterByType(processedData);
  }, [processedData, filterType]);

  const totalFiles = useMemo(() => {
    const count = (nodes: FileTreeNode[]): number => {
      return nodes.reduce((acc, node) => {
        if (node.type === 'file') return acc + 1;
        return acc + (node.children ? count(node.children) : 0);
      }, 0);
    };
    return count(data);
  }, [data]);

  const totalFolders = useMemo(() => {
    const count = (nodes: FileTreeNode[]): number => {
      return nodes.reduce((acc, node) => {
        if (node.type === 'folder') return acc + 1 + (node.children ? count(node.children) : 0);
        return acc;
      }, 0);
    };
    return count(data);
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Project Structure
            </CardTitle>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Folder className="h-3 w-3" />
                {totalFolders}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <File className="h-3 w-3" />
                {totalFiles}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 text-sm border rounded-md bg-background"
            >
              <option value="all">All Files</option>
              <option value="code">Code Files</option>
              <option value="config">Config Files</option>
              <option value="docs">Documentation</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <VirtualizedFileTree
            nodes={filteredData}
            onNodeSelect={handleNodeSelect}
            onNodeExpand={handleNodeExpand}
            selectedNodeId={selectedNode?.id}
            searchQuery={localSearchQuery}
            itemHeight={32}
            maxHeight={maxHeight}
          />
        </CardContent>
      </Card>

      <AnimatePresence>
        {showPreview && preview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5" />
                    File Preview
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(false)}
                      className="h-8"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {preview.node && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {FILE_TYPE_CONFIG[preview.node.name.split('.').pop()?.toLowerCase() || '']?.icon}
                    </span>
                    <span className="font-mono text-sm">{preview.node.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {preview.node.path}
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0">
                {preview.isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      Loading file content...
                    </div>
                  </div>
                ) : preview.error ? (
                  <div className="flex items-center justify-center h-64 text-red-500">
                    <div className="text-center">
                      <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                      <p>{preview.error}</p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <SyntaxHighlighter
                      language={FILE_TYPE_CONFIG[preview.node.name.split('.').pop()?.toLowerCase() || '']?.language || 'text'}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        background: 'transparent',
                        fontSize: '14px'
                      }}
                      showLineNumbers
                      wrapLines
                    >
                      {preview.content}
                    </SyntaxHighlighter>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FileTreeVisualizer.displayName = 'FileTreeVisualizer';

export default FileTreeVisualizer;