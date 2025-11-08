import { Zap, TrendingUp, Heart, Scale, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImpactProps {
  onScrollToBottom?: () => void;
  slideIndex?: number;
}

const Impact = ({ onScrollToBottom, slideIndex }: ImpactProps) => {
  const benefits = [
    {
      icon: Zap,
      title: "Smart",
      description: "AI-powered intelligence that learns and adapts to your workflow",
    },
    {
      icon: TrendingUp,
      title: "Fast",
      description: "Complete in seconds what used to take minutes or hours",
    },
    {
      icon: Heart,
      title: "Inclusive",
      description: "Accessible technology that empowers everyone, regardless of ability",
    },
    {
      icon: Scale,
      title: "Scalable",
      description: "Easily extends to multiple domains beyond education",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle relative overflow-hidden">
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
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Smart. Fast. Inclusive.
              </span>
            </h2>
            <p className="text-xl text-lighter">
              Transforming data entry from a chore into a seamless experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-8 bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Key metrics */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { value: "95%", label: "Less manual effort" },
              { value: "0", label: "Typing errors" },
              { value: "10x", label: "Productivity boost" },
            ].map((metric, index) => (
              <Card
                key={index}
                className="p-6 text-center bg-card animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </Card>
            ))}
          </div>

          {/* Testimonial-style quote */}
          <Card className="p-8 bg-gradient-primary text-primary-foreground shadow-elegant animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4 opacity-50">"</div>
              <p className="text-xl italic mb-4">
                It's like having a digital assistant built right into Excel. 
                I can finally focus on teaching instead of typing.
              </p>
              <div className="text-sm opacity-90">— Educator using Voice-Controlled Excel Assistant</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Impact;
