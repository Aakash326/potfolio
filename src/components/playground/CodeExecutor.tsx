/**
 * Sandboxed Code Execution Environment
 * Supports safe execution of JavaScript/Python code with real-time output
 */

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Square, 
  Trash2, 
  Clock, 
  HardDrive, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Terminal,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { SupportedLanguage, ExecutionResult, CodeExecutorProps } from '@/types/codeplayground';

// Execution timeout limits (in milliseconds)
const EXECUTION_TIMEOUTS = {
  javascript: 10000,
  typescript: 10000,
  python: 15000,
  sql: 5000
};

// Memory limits (in MB)
const MEMORY_LIMITS = {
  javascript: 50,
  typescript: 50,
  python: 100,
  sql: 25
};

interface ExecutionOutput {
  id: string;
  type: 'log' | 'error' | 'result' | 'warning';
  content: string;
  timestamp: Date;
}

interface CodeExecutionState {
  isExecuting: boolean;
  outputs: ExecutionOutput[];
  startTime: number | null;
  executionTime: number;
  memoryUsage: number;
  error: string | null;
}

const CodeExecutor: React.FC<CodeExecutorProps> = memo(({
  code,
  language,
  onExecutionResult,
  timeout,
  memoryLimit
}) => {
  const [executionState, setExecutionState] = useState<CodeExecutionState>({
    isExecuting: false,
    outputs: [],
    startTime: null,
    executionTime: 0,
    memoryUsage: 0,
    error: null
  });

  const workerRef = useRef<Worker | null>(null);
  const executionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const outputIdCounterRef = useRef(0);

  // Initialize web worker for JavaScript execution
  useEffect(() => {
    if (language === 'javascript' || language === 'typescript') {
      const workerCode = `
        // Sandboxed JavaScript execution worker
        let console = {
          log: (...args) => {
            postMessage({
              type: 'output',
              data: { type: 'log', content: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ') }
            });
          },
          error: (...args) => {
            postMessage({
              type: 'output',
              data: { type: 'error', content: args.map(arg => String(arg)).join(' ') }
            });
          },
          warn: (...args) => {
            postMessage({
              type: 'output',
              data: { type: 'warning', content: args.map(arg => String(arg)).join(' ') }
            });
          }
        };

        // Restricted environment - remove dangerous globals
        delete self.importScripts;
        delete self.fetch;
        delete self.XMLHttpRequest;

        self.onmessage = function(e) {
          const { code, memoryLimit } = e.data;
          
          try {
            // Memory monitoring (basic)
            const memoryBefore = performance?.memory?.usedJSHeapSize || 0;
            
            // Execute code in restricted scope
            const result = (function() {
              "use strict";
              return eval(code);
            })();
            
            const memoryAfter = performance?.memory?.usedJSHeapSize || 0;
            const memoryUsed = Math.max(0, memoryAfter - memoryBefore);
            
            if (result !== undefined) {
              console.log('Return value:', result);
            }
            
            postMessage({
              type: 'complete',
              data: {
                memoryUsage: memoryUsed / (1024 * 1024), // Convert to MB
                success: true
              }
            });
          } catch (error) {
            console.error(error.message);
            postMessage({
              type: 'complete',
              data: {
                error: error.message,
                success: false
              }
            });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      workerRef.current = new Worker(URL.createObjectURL(blob));

      workerRef.current.onmessage = (e) => {
        const { type, data } = e.data;

        if (type === 'output') {
          addOutput(data.type, data.content);
        } else if (type === 'complete') {
          completeExecution(data);
        }
      };

      workerRef.current.onerror = (error) => {
        addOutput('error', `Worker error: ${error.message}`);
        completeExecution({ success: false, error: error.message });
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      };
    }
  }, [language]);

  const addOutput = useCallback((type: 'log' | 'error' | 'result' | 'warning', content: string) => {
    const output: ExecutionOutput = {
      id: `output_${++outputIdCounterRef.current}`,
      type,
      content,
      timestamp: new Date()
    };

    setExecutionState(prev => ({
      ...prev,
      outputs: [...prev.outputs, output]
    }));
  }, []);

  const completeExecution = useCallback((result: any) => {
    const endTime = Date.now();
    const executionTime = executionState.startTime ? endTime - executionState.startTime : 0;

    setExecutionState(prev => ({
      ...prev,
      isExecuting: false,
      executionTime,
      memoryUsage: result.memoryUsage || 0,
      error: result.error || null
    }));

    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current);
      executionTimerRef.current = null;
    }

    // Report execution result
    const executionResult: ExecutionResult = {
      output: executionState.outputs.filter(o => o.type === 'log').map(o => o.content).join('\n'),
      error: result.error || null,
      executionTime,
      memoryUsage: result.memoryUsage || 0,
      exitCode: result.success ? 0 : 1,
      warnings: executionState.outputs.filter(o => o.type === 'warning').map(o => o.content)
    };

    onExecutionResult(executionResult);
  }, [executionState.startTime, executionState.outputs, onExecutionResult]);

  const executeJavaScript = useCallback(() => {
    if (!workerRef.current || !code.trim()) return;

    const effectiveTimeout = timeout || EXECUTION_TIMEOUTS[language];
    const effectiveMemoryLimit = memoryLimit || MEMORY_LIMITS[language];

    setExecutionState(prev => ({
      ...prev,
      isExecuting: true,
      outputs: [],
      startTime: Date.now(),
      error: null
    }));

    // Set execution timeout
    executionTimerRef.current = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.terminate();
        // Recreate worker for next execution
        const event = new Event('worker-restart');
        window.dispatchEvent(event);
      }
      addOutput('error', `Execution timeout after ${effectiveTimeout}ms`);
      completeExecution({ success: false, error: 'Execution timeout' });
    }, effectiveTimeout);

    // Send code to worker
    workerRef.current.postMessage({
      code,
      memoryLimit: effectiveMemoryLimit
    });
  }, [code, language, timeout, memoryLimit, addOutput, completeExecution]);

  const executePython = useCallback(async () => {
    try {
      setExecutionState(prev => ({
        ...prev,
        isExecuting: true,
        outputs: [],
        startTime: Date.now(),
        error: null
      }));

      // Simulate Python execution (in a real implementation, you'd use Pyodide)
      addOutput('log', 'Python execution starting...');
      addOutput('warning', 'Python execution is simulated in this demo');
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse and simulate basic Python operations
      const lines = code.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.includes('print(')) {
          const match = line.match(/print\((.*?)\)/);
          if (match) {
            const content = match[1].replace(/['"]/g, '');
            addOutput('log', content);
          }
        }
      }
      
      addOutput('result', 'Python execution completed');
      completeExecution({ success: true, memoryUsage: 5 });
    } catch (error) {
      addOutput('error', `Python execution error: ${error}`);
      completeExecution({ success: false, error: String(error) });
    }
  }, [code, addOutput, completeExecution]);

  const executeSQL = useCallback(async () => {
    try {
      setExecutionState(prev => ({
        ...prev,
        isExecuting: true,
        outputs: [],
        startTime: Date.now(),
        error: null
      }));

      addOutput('log', 'SQL query execution starting...');
      addOutput('warning', 'SQL execution is simulated in this demo');
      
      // Simulate SQL execution
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Basic SQL parsing simulation
      const upperCode = code.toUpperCase();
      if (upperCode.includes('SELECT')) {
        addOutput('result', 'Query executed successfully');
        addOutput('log', 'Rows affected: 5');
      } else if (upperCode.includes('CREATE')) {
        addOutput('result', 'Table created successfully');
      } else if (upperCode.includes('INSERT')) {
        addOutput('result', 'Records inserted successfully');
      } else if (upperCode.includes('UPDATE')) {
        addOutput('result', 'Records updated successfully');
      } else if (upperCode.includes('DELETE')) {
        addOutput('result', 'Records deleted successfully');
      }
      
      completeExecution({ success: true, memoryUsage: 2 });
    } catch (error) {
      addOutput('error', `SQL execution error: ${error}`);
      completeExecution({ success: false, error: String(error) });
    }
  }, [code, addOutput, completeExecution]);

  const executeCode = useCallback(() => {
    if (executionState.isExecuting) return;

    switch (language) {
      case 'javascript':
      case 'typescript':
        executeJavaScript();
        break;
      case 'python':
        executePython();
        break;
      case 'sql':
        executeSQL();
        break;
      default:
        addOutput('error', `Execution not supported for language: ${language}`);
    }
  }, [language, executionState.isExecuting, executeJavaScript, executePython, executeSQL, addOutput]);

  const stopExecution = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    
    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current);
      executionTimerRef.current = null;
    }

    setExecutionState(prev => ({
      ...prev,
      isExecuting: false
    }));

    addOutput('warning', 'Execution stopped by user');
  }, [addOutput]);

  const clearOutput = useCallback(() => {
    setExecutionState(prev => ({
      ...prev,
      outputs: [],
      error: null,
      executionTime: 0,
      memoryUsage: 0
    }));
  }, []);

  const downloadOutput = useCallback(() => {
    const outputText = executionState.outputs.map(output => 
      `[${output.timestamp.toLocaleTimeString()}] ${output.type.toUpperCase()}: ${output.content}`
    ).join('\n');

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-output-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [executionState.outputs]);

  const getStatusIcon = () => {
    if (executionState.isExecuting) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (executionState.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (executionState.outputs.length > 0) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Terminal className="h-4 w-4 text-muted-foreground" />;
  };

  const getOutputTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'result':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return <Terminal className="h-3 w-3 text-blue-500" />;
    }
  };

  const isExecutionSupported = ['javascript', 'typescript', 'python', 'sql'].includes(language);

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getStatusIcon()}
            Code Execution
            {executionState.isExecuting && (
              <Badge variant="secondary" className="animate-pulse">
                Running...
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            {executionState.executionTime > 0 && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {executionState.executionTime}ms
              </Badge>
            )}
            
            {executionState.memoryUsage > 0 && (
              <Badge variant="outline" className="gap-1">
                <HardDrive className="h-3 w-3" />
                {executionState.memoryUsage.toFixed(1)}MB
              </Badge>
            )}

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={executeCode}
                disabled={!isExecutionSupported || executionState.isExecuting}
                className="h-8 gap-2"
              >
                <Play className="h-3 w-3" />
                Run
              </Button>

              {executionState.isExecuting && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopExecution}
                  className="h-8 gap-2 text-red-500"
                >
                  <Square className="h-3 w-3" />
                  Stop
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearOutput}
                disabled={executionState.outputs.length === 0}
                className="h-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={downloadOutput}
                disabled={executionState.outputs.length === 0}
                className="h-8"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!isExecutionSupported ? (
          <div className="p-4 text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Code execution is not supported for {language}</p>
            <p className="text-sm">Supported: JavaScript, TypeScript, Python, SQL</p>
          </div>
        ) : (
          <ScrollArea className="h-64 p-4">
            <AnimatePresence>
              {executionState.outputs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Output will appear here when you run the code</p>
                  <p className="text-sm">Press Ctrl+Enter to execute</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {executionState.outputs.map((output, index) => (
                    <motion.div
                      key={output.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`flex items-start gap-2 p-2 rounded-lg ${
                        output.type === 'error' ? 'bg-red-500/10' :
                        output.type === 'warning' ? 'bg-yellow-500/10' :
                        output.type === 'result' ? 'bg-green-500/10' :
                        'bg-muted/30'
                      }`}
                    >
                      {getOutputTypeIcon(output.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span className="uppercase font-medium">{output.type}</span>
                          <span>{output.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <pre className="text-sm whitespace-pre-wrap font-mono break-words">
                          {output.content}
                        </pre>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
});

CodeExecutor.displayName = 'CodeExecutor';

export default CodeExecutor;