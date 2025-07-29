import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/a8cd02b2-4750-468f-8606-246bb528d81a.png" 
                  alt="Sai Aakash Profile Picture"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NCA0OEM4NCA2MS4yNTQ4IDczLjI1NDggNzIgNjAgNzJDNDYuNzQ1MiA3MiAzNiA2MS4yNTQ4IDM2IDQ4QzM2IDM0Ljc0NTIgNDYuNzQ1MiAyNCA2MCAyNEM3My4yNTQ4IDI0IDg0IDM0Ljc0NTIgODQgNDhaIiBmaWxsPSIjOTlBM0FFIi8+CjxwYXRoIGQ9Ik0yMCA5NkMyMCA4NS41MDY2IDI4LjUwNjYgNzcgNDAgNzdIODBDOTEuNDkzNCA3NyAxMDAgODUuNTA2NiAxMDAgOTZWMTA0SDE5Ljk5OTlWOTZaIiBmaWxsPSIjOTlBM0FFIi8+Cjwvc3ZnPgo=';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            <span className="gradient-text">Sai Aakash</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8">
            Machine Learning, LLM & AI Engineer
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">Passionate about building intelligent systems that solve real-world problems. Specializing in Machine Learning, Deep Learning, NLP, and Large Language Models with hands-on experience in cutting-edge AI technologies.</p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <a href="https://github.com/Aakash326" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <a href="https://www.linkedin.com/in/sai-aakash-23a3a1334/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <a href="mailto:saiaakash33333@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Contact
              </a>
            </Button>
          </div>

          {/* CTA Button */}
          <Button size="lg" className="rounded-full text-lg px-8 py-6 h-auto" onClick={scrollToAbout}>
            Explore My Work
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;