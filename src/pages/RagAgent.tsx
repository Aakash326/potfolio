import { useState } from 'react';
import { Send, Bot, User, FileText, Activity, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

const RagAgent = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Medical Assistant. I can help answer your medical questions based on my knowledge base. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5001/api/chat', {
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
                RAG Medical Chatbot
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                An intelligent medical assistant powered by Retrieval-Augmented Generation (RAG) 
                technology, providing accurate medical information from a curated knowledge base.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="portfolio-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold gradient-text">Llama 2</p>
                  <p className="text-xs text-muted-foreground">7B Parameters</p>
                </CardContent>
              </Card>

              <Card className="portfolio-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold gradient-text">500+</p>
                  <p className="text-xs text-muted-foreground">Medical Documents</p>
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
                  Chat with Medical AI Assistant
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
                    placeholder="Ask a medical question..."
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

            {/* Technical Details */}
            <Card className="portfolio-card mt-8">
              <CardHeader>
                <CardTitle>Technical Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Backend Stack</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Flask API for serving requests</li>
                      <li>• LangChain for RAG pipeline</li>
                      <li>• FAISS vector database</li>
                      <li>• HuggingFace embeddings</li>
                      <li>• Llama 2 7B model via CTransformers</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Key Features</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Context-aware responses</li>
                      <li>• Medical document retrieval</li>
                      <li>• Session management</li>
                      <li>• Temperature control for responses</li>
                      <li>• Streaming response support</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" asChild>
                    <a href="https://github.com/Aakash326/RAG-medical-chatbot" target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo deployment coming soon!'); }}>
                      Live Demo
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