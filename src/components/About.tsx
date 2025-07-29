import { GraduationCap, Briefcase, Code, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
const About = () => {
  const experiences = [{
    role: "Data Analyst Intern",
    company: "GeeksforGeeks",
    description: "Analyzed large datasets and implemented data-driven solutions",
    icon: <Briefcase className="h-6 w-6" />
  }, {
    role: "Python Intern",
    company: "Delsquare",
    description: "Developed Python applications and automated workflows",
    icon: <Code className="h-6 w-6" />
  }, {
    role: "Freelancer",
    company: "Fiverr",
    description: "Delivered ML projects and AI solutions to global clients",
    icon: <Award className="h-6 w-6" />
  }];
  const skills = ["Machine Learning", "Deep Learning", "Natural Language Processing", "Large Language Models", "RAG Systems", "Python", "TensorFlow", "PyTorch", "Hugging Face", "LangChain", "Streamlit", "Pandas", "NumPy", "Scikit-learn", "Computer Vision", "Data Analysis"];
  return <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center gradient-text">About Me</h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
            I'm a passionate AI Engineer currently pursuing Computer Science Engineering at GITAM University. 
            With hands-on experience in machine learning and a drive to innovate, I'm dedicated to building 
            intelligent solutions that make a difference.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Education */}
            <Card className="portfolio-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-semibold text-foreground">Education</h3>
                    <p className="text-muted-foreground">Academic Background</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Computer Science Engineering</h4>
                    <p className="text-primary font-medium">GITAM University</p>
                    <p className="text-muted-foreground">4th Year • 2026</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Intermediate</h4>
                    <p className="text-primary font-medium">Narayana Ecil</p>
                    <p className="text-muted-foreground">Percentage: 94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="portfolio-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">Experience</h3>
                <div className="space-y-6">
                  {experiences.map((exp, index) => <div key={index} className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {exp.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{exp.role}</h4>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills */}
          <Card className="portfolio-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">Technical Skills</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill, index) => <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors duration-200">
                    {skill}
                  </span>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default About;