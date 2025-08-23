/**
 * AI-Powered Code Features Integration
 * Features: Code explanation, optimization, language conversion, documentation generation
 */

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Brain,
  Zap,
  RefreshCw,
  FileText,
  ArrowRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Code,
  BookOpen,
  Settings,
  Send,
  Lightbulb,
  Target
} from 'lucide-react';
import { SupportedLanguage, AICodeFeature } from '@/types/codeplayground';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AICodeFeaturesProps {
  code: string;
  language: SupportedLanguage;
  onCodeUpdate?: (newCode: string) => void;
  className?: string;
}

interface AIRequest {
  id: string;
  type: AICodeFeature['type'];
  input: string;
  language: SupportedLanguage;
  targetLanguage?: SupportedLanguage;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
  suggestions?: string[];
  error?: string;
  rating?: 'up' | 'down';
}

const AI_FEATURE_CONFIG = {
  explain: {
    title: 'Code Explanation',
    icon: <BookOpen className="h-4 w-4" />,
    description: 'Get detailed explanations of how your code works',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    prompt: 'Explain this code in detail, including its purpose, logic flow, and key concepts:'
  },
  optimize: {
    title: 'Code Optimization',
    icon: <Zap className="h-4 w-4" />,
    description: 'Improve performance, readability, and best practices',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    prompt: 'Analyze this code and provide optimization suggestions for better performance, readability, and best practices:'
  },
  convert: {
    title: 'Language Conversion',
    icon: <ArrowRight className="h-4 w-4" />,
    description: 'Convert code between different programming languages',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    prompt: 'Convert this code to the specified target language while maintaining the same functionality:'
  },
  generate_docs: {
    title: 'Documentation Generator',
    icon: <FileText className="h-4 w-4" />,
    description: 'Generate comprehensive documentation for your code',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    prompt: 'Generate comprehensive documentation for this code including function descriptions, parameters, return values, and usage examples:'
  },
  review: {
    title: 'Code Review',
    icon: <Target className="h-4 w-4" />,
    description: 'Get detailed code review with suggestions for improvement',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    prompt: 'Perform a thorough code review of this code, identifying potential issues, security vulnerabilities, and improvement opportunities:'
  }
};

const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  go: 'Go',
  sql: 'SQL',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  markdown: 'Markdown',
  bash: 'Bash'
};

const AICodeFeatures: React.FC<AICodeFeaturesProps> = memo(({
  code,
  language,
  onCodeUpdate,
  className = ''
}) => {
  const [requests, setRequests] = useState<AIRequest[]>([]);
  const [activeFeature, setActiveFeature] = useState<AICodeFeature['type'] | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('python');
  const [isProcessing, setIsProcessing] = useState(false);
  const requestIdRef = useRef(0);

  // Simulate AI processing with your RAG agent
  const processWithAI = useCallback(async (
    prompt: string, 
    codeInput: string, 
    sourceLang: SupportedLanguage,
    targetLang?: SupportedLanguage
  ): Promise<{ result: string; suggestions: string[] }> => {
    try {
      // In a real implementation, this would call your RAG agent API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}\n\nCode:\n\`\`\`${sourceLang}\n${codeInput}\n\`\`\`${
            targetLang ? `\n\nTarget Language: ${SUPPORTED_LANGUAGES[targetLang]}` : ''
          }`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Parse suggestions from the AI response
      const suggestions = [];
      const lines = data.answer.split('\n');
      for (const line of lines) {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          suggestions.push(line.substring(2));
        }
      }

      return {
        result: data.answer,
        suggestions: suggestions.slice(0, 5) // Limit to 5 suggestions
      };
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process with AI assistant');
    }
  }, []);

  const executeAIFeature = useCallback(async (
    featureType: AICodeFeature['type'],
    customPromptText?: string,
    targetLang?: SupportedLanguage
  ) => {
    if (!code.trim()) {
      alert('Please provide some code to analyze');
      return;
    }

    const requestId = `req_${++requestIdRef.current}`;
    const featureConfig = AI_FEATURE_CONFIG[featureType];
    const prompt = customPromptText || featureConfig.prompt;

    const newRequest: AIRequest = {
      id: requestId,
      type: featureType,
      input: code,
      language: language,
      targetLanguage: targetLang,
      timestamp: new Date(),
      status: 'processing'
    };

    setRequests(prev => [newRequest, ...prev]);
    setIsProcessing(true);
    setActiveFeature(featureType);

    try {
      const { result, suggestions } = await processWithAI(prompt, code, language, targetLang);
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed', result, suggestions } 
          : req
      ));
    } catch (error) {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'error', error: String(error) } 
          : req
      ));
    } finally {
      setIsProcessing(false);
      setActiveFeature(null);
    }
  }, [code, language, processWithAI]);

  const rateResponse = useCallback((requestId: string, rating: 'up' | 'down') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, rating } : req
    ));
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success toast in a real implementation
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  const applyOptimization = useCallback((optimizedCode: string) => {
    onCodeUpdate?.(optimizedCode);
  }, [onCodeUpdate]);

  const renderFeatureCard = (featureType: AICodeFeature['type']) => {
    const config = AI_FEATURE_CONFIG[featureType];
    const isActive = activeFeature === featureType;
    
    return (
      <motion.div
        key={featureType}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className={`cursor-pointer transition-all duration-200 ${config.color} ${
            isActive ? 'ring-2 ring-primary' : 'hover:shadow-md'
          }`}
          onClick={() => {
            if (featureType === 'convert') {
              // Show language selection for conversion
              setActiveFeature(featureType);
            } else {
              executeAIFeature(featureType);
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                {config.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{config.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.description}
                </p>
              </div>
              {isProcessing && isActive && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderRequestResult = (request: AIRequest) => {
    const config = AI_FEATURE_CONFIG[request.type];
    
    return (
      <motion.div
        key={request.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {config.icon}
                {config.title}
                <Badge variant={
                  request.status === 'completed' ? 'default' :
                  request.status === 'error' ? 'destructive' :
                  'secondary'
                } className="ml-2">
                  {request.status}
                </Badge>
              </CardTitle>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{request.timestamp.toLocaleTimeString()}</span>
                {request.targetLanguage && (
                  <Badge variant="outline">
                    {SUPPORTED_LANGUAGES[request.language]} → {SUPPORTED_LANGUAGES[request.targetLanguage]}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {request.status === 'processing' ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>AI is analyzing your code...</span>
                </div>
              </div>
            ) : request.status === 'error' ? (
              <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">
                <p className="font-medium mb-2">Error occurred:</p>
                <p className="text-sm">{request.error}</p>
              </div>
            ) : request.result ? (
              <div className="space-y-4">
                {/* AI Response */}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ScrollArea className="h-64 p-4 bg-muted/30 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm">
                      {request.result}
                    </div>
                  </ScrollArea>
                </div>

                {/* Code Preview for optimizations or conversions */}
                {(request.type === 'optimize' || request.type === 'convert') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Generated Code:</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(request.result || '')}
                          className="h-7"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {request.type === 'optimize' && onCodeUpdate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applyOptimization(request.result || '')}
                            className="h-7"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                    <ScrollArea className="h-48">
                      <SyntaxHighlighter
                        language={request.targetLanguage || request.language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          background: 'transparent',
                          fontSize: '12px'
                        }}
                        showLineNumbers
                      >
                        {request.result}
                      </SyntaxHighlighter>
                    </ScrollArea>
                  </div>
                )}

                {/* Suggestions */}
                {request.suggestions && request.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Key Suggestions:
                    </h4>
                    <ul className="space-y-1">
                      {request.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    Was this response helpful?
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={request.rating === 'up' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => rateResponse(request.id, 'up')}
                      className="h-7"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={request.rating === 'down' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => rateResponse(request.id, 'down')}
                      className="h-7"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Features Grid */}
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Code Assistant
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by RAG
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get AI assistance with code explanation, optimization, conversion, and documentation
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {Object.keys(AI_FEATURE_CONFIG).map(featureType => 
              renderFeatureCard(featureType as AICodeFeature['type'])
            )}
          </div>

          {/* Language Conversion Panel */}
          <AnimatePresence>
            {activeFeature === 'convert' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Convert to:</span>
                    <Select
                      value={targetLanguage}
                      onValueChange={(value: SupportedLanguage) => setTargetLanguage(value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SUPPORTED_LANGUAGES)
                          .filter(([key]) => key !== language)
                          .map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={() => executeAIFeature('convert', undefined, targetLanguage)}
                    disabled={isProcessing}
                    size="sm"
                    className="h-8"
                  >
                    {isProcessing ? (
                      <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="h-3 w-3 mr-2" />
                    )}
                    Convert
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Prompt */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Custom AI Prompt:</span>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask the AI anything about your code..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="flex-1 h-20 text-sm"
              />
              <Button
                onClick={() => executeAIFeature('explain', customPrompt)}
                disabled={isProcessing || !customPrompt.trim()}
                size="sm"
                className="h-20"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <AnimatePresence>
          {requests.map(renderRequestResult)}
        </AnimatePresence>

        {requests.length === 0 && (
          <Card className="bg-muted/20 border-dashed border-2 border-muted">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Ready to Assist!</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Select an AI feature above to get intelligent assistance with your code. 
                The AI can explain, optimize, convert, and document your code.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

AICodeFeatures.displayName = 'AICodeFeatures';

export default AICodeFeatures;