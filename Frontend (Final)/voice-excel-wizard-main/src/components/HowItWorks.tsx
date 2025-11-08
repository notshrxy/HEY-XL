import { Mic, Brain, FileSpreadsheet, Volume2, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HowItWorksProps {
  onScrollToBottom?: () => void;
  slideIndex?: number;
}

const HowItWorks = ({ onScrollToBottom, slideIndex }: HowItWorksProps) => {
  const steps = [
    {
      icon: Mic,
      number: "01",
      title: "Listens to Your Voice",
      description: "Advanced Speech Recognition (ASR) captures your voice commands with high accuracy",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Brain,
      number: "02",
      title: "Understands the Command",
      description: "Natural Language Processing (NLP) interprets your intent and extracts data accurately",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FileSpreadsheet,
      number: "03",
      title: "Updates Excel Data",
      description: "Python with openpyxl library modifies your spreadsheet instantly and precisely",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Volume2,
      number: "04",
      title: "Confirms via Voice",
      description: "Text-to-Speech (TTS) provides verbal and visual confirmation of the completed action",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Scroll to Bottom Button - Top Right */}
      {onScrollToBottom && slideIndex && slideIndex % 2 === 1 && (
        <div className="absolute top-6 right-6 z-20 animate-fade-in">
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
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">How It Works</h2>
          <p className="text-xl text-lighter">
            Four simple steps powered by cutting-edge AI technology
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="relative p-8 text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card animate-fade-in overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Number badge */}
                <div className="absolute top-4 right-4 text-5xl font-bold text-muted/10 group-hover:text-muted/20 transition-colors">
                  {step.number}
                </div>

                {/* Icon with gradient background */}
                <div className="relative mb-6 inline-flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity`} />
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-soft`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
