import { useState } from 'react';
import { Send, Bot, User, FileText, Activity, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

const RagAgent = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Aakash Assistant
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                An intelligent personal assistant powered by Retrieval-Augmented Generation (RAG) 
                technology, providing accurate information from curated knowledge sources.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="portfolio-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold gradient-text">Gemini 1.5 Flash</p>
                  <p className="text-xs text-muted-foreground">Google AI</p>
                </CardContent>
              </Card>


              <Card className="portfolio-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold gradient-text">&lt;2s</p>
                  <p className="text-xs text-muted-foreground">Average Latency</p>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <Card className="portfolio-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Chat with Assistant RAG Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4 bg-background/50 rounded-lg">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          message.role === 'user' 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary/10 text-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                          <Bot size={20} />
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask question about Aakash?"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon */}
            <Card className="portfolio-card mt-8">
              <CardHeader>
                <CardTitle className="text-center">🚀 Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-2xl font-bold gradient-text mb-4">Medical RAG Agent</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Advanced medical AI assistant with specialized healthcare knowledge base coming soon!
                  </p>
                  <Button variant="outline" asChild>
                    <a href="https://github.com/Aakash326/RAG-medical-chatbot" target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RagAgent;