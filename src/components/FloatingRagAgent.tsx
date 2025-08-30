import { useState, useEffect } from 'react';
import { Bot, Send, X, MessageCircle, Loader2, Minimize2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ApiStatus {
  isOnline: boolean;
  isInitialized: boolean;
  lastChecked: Date;
}

const FloatingRagAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Aakash\'s AI Assistant powered by RAG technology. Ask me anything about his projects, skills, experience, or achievements!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isOnline: false,
    isInitialized: false,
    lastChecked: new Date()
  });
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Check RAG agent status
  const checkApiStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_RAG_API_URL || 'http://localhost:8000'}/api/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiStatus({
          isOnline: true,
          isInitialized: data.rag_initialized,
          lastChecked: new Date()
        });
      } else {
        setApiStatus({
          isOnline: false,
          isInitialized: false,
          lastChecked: new Date()
        });
      }
    } catch (error) {
      console.error('Status check error:', error);
      setApiStatus({
        isOnline: false,
        isInitialized: false,
        lastChecked: new Date()
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Check status on component mount and when opened
  useEffect(() => {
    if (isOpen) {
      checkApiStatus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if API is available before sending
    if (!apiStatus.isOnline) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '🔌 RAG Agent is offline. Please make sure the backend server is running on port 8000. You can start it by running: `cd Rag_agent && python main.py`',
        timestamp: new Date()
      }]);
      return;
    }

    if (!apiStatus.isInitialized) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ RAG Agent is online but not fully initialized. Please check the backend logs for any configuration issues.',
        timestamp: new Date()
      }]);
      return;
    }

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_RAG_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: userMessage,
          session_id: 'portfolio_chat'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        timestamp: new Date()
      }]);

      // Update status to show successful communication
      setApiStatus(prev => ({ ...prev, isOnline: true, isInitialized: true }));

    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = '❌ Sorry, I encountered an error while processing your request. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Please make sure the RAG agent backend is running on http://localhost:8000';
        } else if (error.message.includes('503')) {
          errorMessage += 'The RAG system is not properly initialized. Please check the backend configuration.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date()
      }]);
      
      // Update status to reflect the error
      setApiStatus(prev => ({ 
        ...prev, 
        isOnline: false, 
        lastChecked: new Date() 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg animate-pulse"
            size="lg"
          >
            <Bot className="h-6 w-6" />
          </Button>
          {/* Status indicator */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
            apiStatus.isOnline && apiStatus.isInitialized 
              ? 'bg-green-500' 
              : apiStatus.isOnline 
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`} />
        </div>
        <div className="absolute -bottom-8 right-0 text-xs text-muted-foreground whitespace-nowrap">
          Ask about Aakash
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className={`w-80 shadow-2xl border-2 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      }`}>
        <CardHeader className="p-3 bg-primary/5">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span>Aakash's AI Assistant</span>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={apiStatus.isOnline && apiStatus.isInitialized ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {apiStatus.isOnline && apiStatus.isInitialized ? (
                      <>
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Online
                      </>
                    ) : apiStatus.isOnline ? (
                      <>
                        <AlertCircle className="h-2 w-2 mr-1" />
                        Initializing
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-2 w-2 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={checkApiStatus}
                disabled={isCheckingStatus}
                className="h-6 w-6 p-0"
                title="Refresh connection status"
              >
                <RefreshCw className={`h-3 w-3 ${isCheckingStatus ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={
                    apiStatus.isOnline && apiStatus.isInitialized
                      ? "Ask about Aakash's projects, skills..."
                      : "AI Assistant is offline..."
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || (!apiStatus.isOnline || !apiStatus.isInitialized)}
                  className="text-sm"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputMessage.trim() || (!apiStatus.isOnline || !apiStatus.isInitialized)}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {!apiStatus.isOnline && (
                <div className="mt-2 text-xs text-muted-foreground">
                  💡 Start the RAG backend: <code className="bg-muted px-1 rounded">cd Rag_agent && python main.py</code>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingRagAgent;