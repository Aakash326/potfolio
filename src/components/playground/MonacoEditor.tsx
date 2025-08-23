/**
 * Advanced Monaco Editor Component with multi-language support
 * Features: Syntax highlighting, IntelliSense, error checking, themes
 */

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Settings, 
  Play, 
  Copy, 
  Save, 
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  Eye,
  FileText,
  Palette
} from 'lucide-react';
import { SupportedLanguage, EditorConfig, MonacoEditorProps } from '@/types/codeplayground';

// Language configurations with syntax highlighting and IntelliSense
const LANGUAGE_CONFIG = {
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    defaultCode: `// Welcome to the Advanced Code Playground
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci sequence:');
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
    extensions: ['.js', '.mjs'],
    monacoLanguage: 'javascript'
  },
  typescript: {
    name: 'TypeScript',
    icon: '🔷',
    defaultCode: `// TypeScript with advanced features
interface User {
    id: number;
    name: string;
    email: string;
}

class UserManager {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
        console.log(\`Added user: \${user.name}\`);
    }

    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }
}

const manager = new UserManager();
manager.addUser({ id: 1, name: 'Aakash', email: 'aakash@example.com' });`,
    extensions: ['.ts', '.tsx'],
    monacoLanguage: 'typescript'
  },
  python: {
    name: 'Python',
    icon: '🐍',
    defaultCode: `# Advanced Python code example
import numpy as np
from typing import List, Optional

class DataAnalyzer:
    def __init__(self, data: List[float]):
        self.data = np.array(data)
    
    def calculate_stats(self) -> dict:
        return {
            'mean': np.mean(self.data),
            'median': np.median(self.data),
            'std': np.std(self.data),
            'min': np.min(self.data),
            'max': np.max(self.data)
        }
    
    def find_outliers(self, threshold: float = 2.0) -> List[float]:
        z_scores = np.abs((self.data - np.mean(self.data)) / np.std(self.data))
        return self.data[z_scores > threshold].tolist()

# Example usage
data = [1, 2, 3, 4, 5, 100, 6, 7, 8, 9]
analyzer = DataAnalyzer(data)
print("Statistics:", analyzer.calculate_stats())
print("Outliers:", analyzer.find_outliers())`,
    extensions: ['.py'],
    monacoLanguage: 'python'
  },
  sql: {
    name: 'SQL',
    icon: '🗄️',
    defaultCode: `-- Advanced SQL queries
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complex query with window functions
SELECT 
    u.name,
    u.email,
    COUNT(p.id) as project_count,
    AVG(EXTRACT(DAY FROM (NOW() - p.created_at))) as avg_project_age,
    RANK() OVER (ORDER BY COUNT(p.id) DESC) as productivity_rank
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
WHERE u.created_at >= NOW() - INTERVAL '1 year'
GROUP BY u.id, u.name, u.email
HAVING COUNT(p.id) > 0
ORDER BY project_count DESC;`,
    extensions: ['.sql'],
    monacoLanguage: 'sql'
  }
};

const EDITOR_THEMES = [
  { value: 'vs-dark', label: 'Dark', icon: '🌙' },
  { value: 'vs-light', label: 'Light', icon: '☀️' },
  { value: 'hc-black', label: 'High Contrast', icon: '🔳' }
];

interface MonacoCodeEditorProps extends MonacoEditorProps {
  onExecute?: () => void;
  onSave?: () => void;
  onFormatCode?: () => void;
  isExecuting?: boolean;
  executionResult?: any;
  showToolbar?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = memo(({
  value,
  onChange,
  language,
  theme = 'vs-dark',
  height = '500px',
  options = {},
  loading,
  onMount,
  onExecute,
  onSave,
  onFormatCode,
  isExecuting = false,
  executionResult,
  showToolbar = true,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const editorRef = useRef<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(language);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorConfig, setEditorConfig] = useState<EditorConfig>({
    language: language,
    theme: theme as any,
    fontSize: 14,
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    folding: true,
    autoClosingBrackets: 'always'
  });

  // Enhanced Monaco Editor options
  const editorOptions = {
    fontSize: editorConfig.fontSize,
    fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    fontLigatures: true,
    wordWrap: editorConfig.wordWrap,
    lineNumbers: editorConfig.lineNumbers,
    minimap: { enabled: editorConfig.minimap },
    folding: editorConfig.folding,
    autoClosingBrackets: editorConfig.autoClosingBrackets,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    contextmenu: true,
    mouseWheelZoom: true,
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    wordBasedSuggestions: 'allDocuments',
    parameterHints: { enabled: true },
    formatOnType: true,
    formatOnPaste: true,
    ...options
  };

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      onFormatCode?.();
    });

    // Call the parent's onMount if provided
    onMount?.(editor, monaco);
  }, [onMount, onExecute, onSave, onFormatCode]);

  const handleEditorChange: OnChange = useCallback((value, event) => {
    onChange(value || '');
  }, [onChange]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      // Show success toast
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [value]);

  const downloadCode = useCallback(() => {
    const config = LANGUAGE_CONFIG[currentLanguage];
    const extension = config.extensions[0];
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [value, currentLanguage]);

  const formatCode = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      onFormatCode?.();
    }
  }, [onFormatCode]);

  const insertTemplate = useCallback((templateLanguage: SupportedLanguage) => {
    const config = LANGUAGE_CONFIG[templateLanguage];
    if (config && onChange) {
      onChange(config.defaultCode);
      setCurrentLanguage(templateLanguage);
    }
  }, [onChange]);

  const toolbarVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const configPanelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 }
  };

  return (
    <Card className={`relative bg-background/50 backdrop-blur-sm border-border/50 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
    }`}>
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            variants={toolbarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {LANGUAGE_CONFIG[currentLanguage]?.icon} {LANGUAGE_CONFIG[currentLanguage]?.name}
                  </Badge>
                  
                  <Select
                    value={currentLanguage}
                    onValueChange={(value: SupportedLanguage) => {
                      setCurrentLanguage(value);
                      insertTemplate(value);
                    }}
                  >
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            {config.icon} {config.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={currentTheme}
                    onValueChange={(value: string) => setCurrentTheme(value)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EDITOR_THEMES.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <span className="flex items-center gap-2">
                            {theme.icon} {theme.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExecute}
                    disabled={isExecuting}
                    className="h-8 gap-2"
                  >
                    {isExecuting ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                    Run
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={formatCode}
                    className="h-8 gap-2"
                  >
                    <Zap className="h-3 w-3" />
                    Format
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSave}
                    className="h-8"
                  >
                    <Save className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadCode}
                    className="h-8"
                  >
                    <Download className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="h-8"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>

                  {onToggleFullscreen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleFullscreen}
                      className="h-8"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-3 w-3" />
                      ) : (
                        <Maximize2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    variants={configPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <label className="text-muted-foreground">Font Size</label>
                        <Select
                          value={editorConfig.fontSize.toString()}
                          onValueChange={(value) => 
                            setEditorConfig(prev => ({ ...prev, fontSize: parseInt(value) }))
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[12, 14, 16, 18, 20, 24].map(size => (
                              <SelectItem key={size} value={size.toString()}>
                                {size}px
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-muted-foreground">Word Wrap</label>
                        <Select
                          value={editorConfig.wordWrap}
                          onValueChange={(value: any) => 
                            setEditorConfig(prev => ({ ...prev, wordWrap: value }))
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on">On</SelectItem>
                            <SelectItem value="off">Off</SelectItem>
                            <SelectItem value="bounded">Bounded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-muted-foreground">Line Numbers</label>
                        <Select
                          value={editorConfig.lineNumbers}
                          onValueChange={(value: any) => 
                            setEditorConfig(prev => ({ ...prev, lineNumbers: value }))
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on">On</SelectItem>
                            <SelectItem value="off">Off</SelectItem>
                            <SelectItem value="relative">Relative</SelectItem>
                            <SelectItem value="interval">Interval</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="minimap"
                          checked={editorConfig.minimap}
                          onChange={(e) => 
                            setEditorConfig(prev => ({ ...prev, minimap: e.target.checked }))
                          }
                          className="rounded"
                        />
                        <label htmlFor="minimap" className="text-muted-foreground text-sm">
                          Minimap
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent className="p-0">
        <div className={`relative ${isFullscreen ? 'h-screen' : ''}`}>
          <Editor
            height={isFullscreen ? '100vh' : height}
            language={LANGUAGE_CONFIG[currentLanguage]?.monacoLanguage || currentLanguage}
            value={value}
            theme={currentTheme}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={editorOptions}
            loading={
              loading || (
                <div className="flex items-center justify-center h-64">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading editor...
                  </div>
                </div>
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
});

MonacoCodeEditor.displayName = 'MonacoCodeEditor';

export default MonacoCodeEditor;