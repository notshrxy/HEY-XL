import { GraduationCap, Users, Eye, Building2, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UseCasesProps {
  onScrollToBottom?: () => void;
  slideIndex?: number;
}

const UseCases = ({ onScrollToBottom, slideIndex }: UseCasesProps) => {
  const useCases = [
    {
      icon: GraduationCap,
      title: "Classroom Marks Entry",
      description: "Quickly update student scores across multiple subjects and assignments without typing",
      gradient: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: "Attendance Management",
      description: "Mark attendance for entire classes using simple voice commands in seconds",
      gradient: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-600",
    },
    {
      icon: Eye,
      title: "Accessibility Support",
      description: "Empower visually impaired teachers with hands-free, voice-driven data management",
      gradient: "from-indigo-500/10 to-indigo-600/10",
      iconColor: "text-indigo-600",
    },
    {
      icon: Building2,
      title: "Beyond Education",
      description: "Extend to hospitals, offices, and any industry requiring efficient voice-driven data entry",
      gradient: "from-cyan-500/10 to-cyan-600/10",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <section className="py-20 bg-background relative">
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
          <h2 className="text-4xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">Versatile Use Cases</h2>
          <p className="text-xl text-lighter">
            From classrooms to boardrooms, voice-controlled data entry transforms how we work
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="group p-8 hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <useCase.icon className={`w-8 h-8 ${useCase.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
