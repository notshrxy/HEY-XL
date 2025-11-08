import { Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FooterProps {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onDemoClick: () => void;
}

const Footer = ({ onHomeClick, onAboutClick, onDemoClick }: FooterProps) => {
  const navigate = useNavigate();
  
  const links = [
    { label: "Home", onClick: onHomeClick },
    { label: "About", onClick: onAboutClick },
    { label: "Contact", onClick: () => navigate('/contact') },
    { label: "Demo", onClick: onDemoClick },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              HEY-XL : Voice Assistant for Excel
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Developed to simplify data entry for educators using AI. 
              Making classrooms smarter, one voice command at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-center">Quick Links</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {links.map((link, index) => (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="text-sm text-lighter hover:text-primary transition-colors duration-200 hover:underline"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="text-center">
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://github.com/notshrxy', '_blank')}
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://www.linkedin.com/in/shreyassrinivasan22/', '_blank')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open('https://www.instagram.com/notshrxy/', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HEY-XL : Voice Assistant for Excel. Built with AI to empower educators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
