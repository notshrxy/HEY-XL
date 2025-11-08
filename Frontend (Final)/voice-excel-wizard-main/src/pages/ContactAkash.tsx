import { Github, Linkedin, Instagram, Mail, MapPin, Calendar, Code, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const ContactAkash = () => {
  const navigate = useNavigate();

  // Skills with tooltip descriptions (mirrors Contact.tsx behavior)
  const skills = [
    { name: "Artificial Intelligence", description: "Designing intelligent systems for decision-making and automation" },
    { name: "Machine Learning", description: "Training models to learn patterns and make predictions" },
    { name: "Python", description: "Primary programming language for ML, scripting and tooling" },
    { name: "Design & Analysis of Algorithms", description: "Optimizing solutions with space/time complexity trade-offs" },
    { name: "Data Analytics", description: "Deriving insights from data with statistics and visualization" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar: back and teammate switch */}
      <div className="container mx-auto px-4 pt-6 flex items-center justify-between gap-3">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/contact')} 
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View Shreyas' Profile
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">AP</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 text-light hover-lift text-glow cursor-pointer">
              Akash P
            </h1>
            <p className="text-xl text-lighter mb-4">
              Computer Science Engineering Student & AI/ML Enthusiast
            </p>
            <p className="text-lg text-lighter max-w-2xl mx-auto mb-8">
              Enthusiastic and dedicated Computer Science Engineering student with a strong foundation in programming, problem-solving, and core computer science principles. A quick learner seeking opportunities to apply academic knowledge, gain practical experience, and contribute positively to organizational goals.
            </p>

            {/* Contact Info (same structure) */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-lighter">
                <MapPin className="w-5 h-5" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2 text-lighter">
                <GraduationCap className="w-5 h-5" />
                <span>CSE Student (Expected 2027)</span>
              </div>
              <div className="flex items-center gap-2 text-lighter">
                <Code className="w-5 h-5" />
                <span>AI/ML & Python Focus</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('#', '_blank')}
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('mailto:akashplacements21@gmail.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About + Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-light hover-lift text-glow cursor-pointer">About Me</h2>
                <div className="space-y-4 text-lighter">
                  <p>
                    Hello, I'm Akash P, an enthusiastic and dedicated Computer Science Engineering student. I have a strong foundation in programming, problem-solving, and core computer science principles. I am a quick learner with the ability to adapt to new technologies and environments.
                  </p>
                  <p>
                    I am currently seeking an internship opportunity to apply my academic knowledge, gain practical experience, and contribute positively to organizational goals while continuing to grow as a professional.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-light">Bachelor of Technology</h4>
                        <p className="text-sm text-lighter">Computer Science and Engineering</p>
                        <p className="text-sm text-lighter">Sathyabama Institute Of Science And Technology, Chennai</p>
                        <p className="text-sm text-lighter">(Expected 2027)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Current Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-lighter">• Artificial Intelligence & Machine Learning</p>
                      <p className="text-sm text-lighter">• Python Programming</p>
                      <p className="text-sm text-lighter">• Design & Analysis of Algorithms</p>
                      <p className="text-sm text-lighter">• Data Analytics</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section with tooltips (same behavior) */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-light hover-lift text-glow cursor-pointer">Skills & Focus</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="relative group">
                  <Badge 
                    variant="secondary" 
                    className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    title={skill.description}
                  >
                    {skill.name}
                  </Badge>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {skill.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-light hover-lift text-glow cursor-pointer">Let's Connect!</h2>
            <p className="text-xl text-lighter mb-8">
              Open to internship opportunities and collaborations. Let's talk!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('mailto:akashplacements21@gmail.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('#', '_blank')}
              >
                <Linkedin className="w-5 h-5 mr-2" />
                Connect on LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactAkash;


