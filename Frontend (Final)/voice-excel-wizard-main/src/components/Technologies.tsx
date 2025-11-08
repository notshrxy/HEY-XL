import { Code2, Database, Mic, Brain, Volume2, Layout, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TechnologiesProps {
  onScrollToBottom?: () => void;
  slideIndex?: number;
}

const Technologies = ({ onScrollToBottom, slideIndex }: TechnologiesProps) => {
  const technologies = [
    {
      icon: Code2,
      name: "Python",
      description: "Core programming language",
      color: "text-blue-600",
    },
    {
      icon: Database,
      name: "openpyxl",
      description: "Excel file manipulation",
      color: "text-green-600",
    },
    {
      icon: Mic,
      name: "SpeechRecognition",
      description: "Voice input processing",
      color: "text-purple-600",
    },
    {
      icon: Brain,
      name: "NLP",
      description: "Natural language understanding",
      color: "text-indigo-600",
    },
    {
      icon: Volume2,
      name: "TTS",
      description: "Voice output synthesis",
      color: "text-cyan-600",
    },
    {
      icon: Layout,
      name: "GUI Framework",
      description: "Tkinter / PyQt interface",
      color: "text-pink-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle relative">
      {/* Scroll to Bottom Button - Top Right */}
      {onScrollToBottom && slideIndex && slideIndex % 2 === 1 && (
        <div className="absolute top-6 right-6 z-10 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onScrollToBottom}
            className="group hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
          >
            <ArrowDown className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Scroll to Bottom
          </Button>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">Powered by Modern Technologies</h2>
          <p className="text-xl text-lighter">
            Built with industry-leading tools and frameworks for reliability and performance
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-card animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  <tech.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
