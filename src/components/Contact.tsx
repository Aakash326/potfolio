import { useState } from 'react';
import { Mail, Send, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive"
      });
      return;
    }

    // Create mailto link
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:saiaakash33333@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Email Client Opened",
      description: "Your default email client should now open with the message.",
    });

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-center gradient-text">Get In Touch</h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="portfolio-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-6 w-6 text-primary" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your project or how we can work together..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="portfolio-card">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-foreground">Email</h3>
                      <a 
                        href="mailto:saiaakash33333@gmail.com"
                        className="text-primary hover:underline"
                      >
                        saiaakash33333@gmail.com
                      </a>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    I typically respond within 24 hours. Feel free to reach out for collaborations, 
                    projects, or just to connect!
                  </p>
                </CardContent>
              </Card>

              <Card className="portfolio-card">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-foreground">Location</h3>
                      <p className="text-muted-foreground">India</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Currently pursuing CSE at GITAM University and open to remote opportunities 
                    worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card className="portfolio-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Let's Connect</h3>
                  <p className="text-muted-foreground mb-6">
                    Whether you're looking for a machine learning engineer, want to discuss AI projects, 
                    or just connect with a fellow tech enthusiast, I'm always excited to meet new people!
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" asChild>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;