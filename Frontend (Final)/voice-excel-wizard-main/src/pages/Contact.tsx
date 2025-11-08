import { Github, Linkedin, Instagram, Mail, MapPin, Calendar, Code, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  
  const skills = [
    { name: "Python", description: "Versatile programming language for web development, data science, and AI" },
    { name: "JavaScript", description: "Dynamic programming language for interactive web applications" },
    { name: "React", description: "Popular JavaScript library for building user interfaces" },
    { name: "Node.js", description: "JavaScript runtime for server-side development" },
    { name: "Machine Learning", description: "AI subset focused on algorithms that learn from data" },
    { name: "AI/ML", description: "Artificial Intelligence and Machine Learning technologies" },
    { name: "Web Development", description: "Full-stack development of web applications and websites" },
    { name: "Game Design", description: "Creating interactive games and user experiences" },
    { name: "3D Modelling", description: "Creating three-dimensional digital models and assets" },
    { name: "Cloud Computing", description: "On-demand computing services and infrastructure" },
    { name: "Excel Automation", description: "Automating spreadsheet tasks and data processing" }
  ];

  const projects = [
    {
      title: "Voice-Controlled Excel Assistant",
      description: "An innovative AI-powered solution that revolutionizes data entry by enabling hands-free Excel manipulation through natural voice commands. Built using advanced speech recognition and natural language processing, this system allows educators to update student records, marks, and attendance simply by speaking. The application features real-time voice feedback, error prevention mechanisms, and seamless integration with existing Excel workflows. This project demonstrates practical AI implementation in educational environments, significantly reducing manual data entry time while improving accuracy and accessibility for users with different technical backgrounds.",
      tech: ["Python", "React", "Machine Learning", "Speech Recognition"]
    },
    {
      title: "NaviBot - SIST",
      description: "A smart campus navigation system designed to solve the challenge of navigating large university campuses, especially for newcomers and visitors. Developed in collaboration with Kevin Alex, this project combines hardware and web technologies to create an intuitive navigation experience. The system features an ESP32 microcontroller powering a compact OLED display that generates dynamic QR codes for various campus locations. Integrated with a chatbot for instant querying, NaviBot provides real-time directions and campus information, making it easier for students and visitors to find their way around the vast Sathyabama University campus.",
      tech: ["ESP32", "Web Technologies", "QR Code", "Chatbot", "Hardware Integration"]
    }
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
          onClick={() => navigate('/contact/akash')}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View Akash's Profile
        </Button>
      </div>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">SS</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 text-light hover-lift text-glow cursor-pointer">
              Shreyas S
            </h1>
            <p className="text-xl text-lighter mb-4">
              Computer Science Student & AI/ML Enthusiast
            </p>
            <p className="text-lg text-lighter max-w-2xl mx-auto mb-8">
              Passionate about building innovative solutions that bridge the gap between 
              artificial intelligence and real-world applications. Currently pursuing Computer Science 
              and working on projects that make technology more accessible and efficient.
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-lighter">
                <MapPin className="w-5 h-5" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2 text-lighter">
                <GraduationCap className="w-5 h-5" />
                <span>3rd Year CS Student</span>
              </div>
              <div className="flex items-center gap-2 text-lighter">
                <Code className="w-5 h-5" />
                <span>Full Stack Developer</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://github.com/notshrxy', '_blank')}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://www.linkedin.com/in/shreyassrinivasan22/', '_blank')}
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://www.instagram.com/notshrxy/', '_blank')}
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('mailto:shreyasofficial2904@gmail.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-light hover-lift text-glow cursor-pointer">
                  About Me
                </h2>
                <div className="space-y-4 text-lighter">
                  <p>
                    Hello, I am Shreyas Srinivasan, an Engineering student aspiring to one day achieve my dream of becoming a Web Developer, also focusing on my journey in Game Design/Development and becoming the best version of me that I can be. Given my roles in the Management Team at ACM-SIST Student Chapter, I firmly believe that this role provides me with the benefit of organizing tech events and collaborating with industry professionals whilst continually keeping my Education and Hands-on experience balanced, thus helping me develop professional skills like Time Management, Leadership and Teamplay.
                  </p>
                  <p>
                    I'm passionate about Cloud, AI and ML. I love exploring tech, solving real-world problems (if not solve, atleast give a try at it) and making sure I continually improvise and improve my skillset.
                  </p>
                  <p>
                    Always open to discussions! Let's connect to discuss how I can be a part of and boost your team. Here's towards mutual growth!
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
                        <p className="text-sm text-lighter">Computer Science Engineering</p>
                        <p className="text-sm text-lighter">3rd Year (2023-2027)</p>
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
                      <p className="text-sm text-lighter">• AI/ML</p>
                      <p className="text-sm text-lighter">• Web Development</p>
                      <p className="text-sm text-lighter">• Game Design & Development</p>
                      <p className="text-sm text-lighter">• 3D Modelling</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-light hover-lift text-glow cursor-pointer">
              Skills & Technologies
            </h2>
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

      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-light hover-lift text-glow cursor-pointer">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <CardTitle className="text-light">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lighter mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <Badge 
                          key={techIndex} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-light hover-lift text-glow cursor-pointer">
              Let's Connect!
            </h2>
            <p className="text-xl text-lighter mb-8">
              I'm always interested in discussing new opportunities, 
              collaborating on projects, or just having a chat about technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('mailto:shreyasofficial2904@gmail.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://www.linkedin.com/in/shreyassrinivasan22/', '_blank')}
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

export default Contact;
