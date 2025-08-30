import { useState, useEffect } from 'react';
import { Bot, Upload, MessageCircle, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AIAssistant = () => {
  const [isAgentUploaded, setIsAgentUploaded] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; path: string; size: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-enable the chat interface and add welcome message
  useEffect(() => {
    setIsAgentUploaded(true);
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm Sai Aakash's RAG-powered AI assistant. I can help you learn about his projects, experience, and technical skills based on his portfolio documents. Try asking me something like 'Tell me about Aakash's TensorFlow projects' or 'What internships has Sai Aakash done?'"
    }]);
  }, []);

  const checkExistingFiles = async () => {
    try {
      const { data: files, error } = await supabase
        .from('ai_assistant_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (files && files.length > 0) {
        setIsAgentUploaded(true);
        setUploadedFiles(files.map(file => ({
          name: file.file_name,
          path: file.file_path,
          size: file.file_size
        })));
        setMessages([{
          role: 'assistant',
          content: "Hello! I'm Sai Aakash's AI assistant. I can help you learn about his projects, experience, and technical skills. Try asking me something like 'Tell me about Aakash's TensorFlow projects' or 'What internships has Sai Aakash done?'"
        }]);
      }
    } catch (error) {
      console.error('Error checking existing files:', error);
    }
  };

  const handleAgentUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const uploadedFilesList = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `ai-assistant/${Date.now()}-${file.name}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('ai-assistant')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Store file metadata in database
        const { error: fileError } = await supabase
          .from('ai_assistant_files')
          .insert({
            file_name: file.name,
            file_path: fileName,
            file_size: file.size,
            content_type: file.type
          });

        if (fileError) throw fileError;

        uploadedFilesList.push({
          name: file.name,
          path: fileName,
          size: file.size
        });
      }

      setUploadedFiles(uploadedFilesList);
      setIsAgentUploaded(true);
      
      toast({
        title: "AI Agent Uploaded",
        description: `Successfully uploaded ${files.length} file(s). Your AI assistant is now ready!`,
      });

      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm Sai Aakash's AI assistant. I can help you learn about his projects, experience, and technical skills. Try asking me something like 'Tell me about Aakash's TensorFlow projects' or 'What internships has Sai Aakash done?'"
      }]);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload AI assistant files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isAgentUploaded) return;

    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputMessage,
          session_id: 'portfolio_chat'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: data.answer };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling backend API:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: "I'm sorry, I'm having trouble connecting to my backend right now. Please make sure the RAG backend is running on port 5001. You can start it with 'npm run dev:full'." 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the RAG backend. Please ensure it's running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }

    setInputMessage('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleAgentUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exampleQuestions = [
    "Tell me about Aakash's TensorFlow projects",
    "What internships has Sai Aakash done?",
    "List Aakash's ML models",
    "What are his technical skills?"
  ];

  return (
    <section id="ai-assistant" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-center gradient-text">Ask My AI</h2>

          {!isAgentUploaded ? (
            <Card className="portfolio-card">
              <CardContent className="p-8">
                <div
                  className="upload-zone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center">
                    <Bot className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Upload RAG Agent Files
                    </h3>
                    <p className="text-muted-foreground mb-4 text-center">
                      Upload your custom AI assistant files (.py, .js, .html, or Streamlit/Gradio app)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".py,.js,.html,.ipynb,.streamlit"
                      className="hidden"
                      id="agent-upload"
                      onChange={(e) => handleAgentUpload(e.target.files)}
                    />
                    <Button asChild disabled={isLoading}>
                      <label htmlFor="agent-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        {isLoading ? 'Uploading...' : 'Upload AI Agent'}
                      </label>
                    </Button>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Uploaded files: {uploadedFiles.length}
                        </p>
                        <div className="space-y-1">
                          {uploadedFiles.slice(0, 3).map((file, index) => (
                            <p key={index} className="text-xs text-muted-foreground">
                              • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </p>
                          ))}
                          {uploadedFiles.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              ... and {uploadedFiles.length - 3} more files
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Chat Interface */}
              <Card className="portfolio-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-6 w-6 text-primary" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto bg-background/50 rounded-lg p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about Sai Aakash's experience, projects, or skills..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                      <MessageCircle className="h-4 w-4" />
                      {isLoading && " ..."}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Example Questions */}
              <Card className="portfolio-card">
                <CardHeader>
                  <CardTitle>Try These Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exampleQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-3"
                        onClick={() => setInputMessage(question)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4 text-primary" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;