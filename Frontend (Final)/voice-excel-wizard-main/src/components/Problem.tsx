import { AlertCircle, Clock, Frown, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProblemProps {
  onScrollToBottom?: () => void;
  slideIndex?: number;
}

const Problem = ({ onScrollToBottom, slideIndex }: ProblemProps) => {
  const challenges = [
    {
      icon: Clock,
      title: "Time-Consuming",
      description: "Hours spent on manual data entry that could be used for teaching",
    },
    {
      icon: AlertCircle,
      title: "Error-Prone",
      description: "Human mistakes in typing lead to incorrect records and disputes",
    },
    {
      icon: Frown,
      title: "Exhausting",
      description: "Repetitive work causes fatigue and reduces educator productivity",
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
          <h2 className="text-4xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">
            The Challenge Teachers Face
          </h2>
          <p className="text-xl text-lighter leading-relaxed">
            Manual entry of marks and attendance is time-consuming, error-prone, and exhausting. 
            Educators deserve a smarter way to manage their records.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {challenges.map((challenge, index) => (
            <Card
              key={index}
              className="p-8 text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 animate-fade-in bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
                <challenge.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{challenge.title}</h3>
              <p className="text-muted-foreground">{challenge.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
