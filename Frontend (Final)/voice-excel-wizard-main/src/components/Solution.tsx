import { CheckCircle2, Sparkles, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SolutionProps {
  onScrollToBottom?: () => void;
  slideIndex?: number;
}

const Solution = ({ onScrollToBottom, slideIndex }: SolutionProps) => {
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>The Smart Solution</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">
              Meet the Voice-Controlled{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Excel Assistant
              </span>
            </h2>
            <p className="text-xl text-lighter max-w-3xl mx-auto">
              Using Speech Recognition (ASR), Natural Language Processing (NLP), and Text-to-Speech (TTS), 
              our assistant updates Excel files based on your voice commands.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Demo visualization */}
            <Card className="p-8 bg-card shadow-elegant animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🎤</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">You say:</div>
                    <div className="font-medium">"Add 85 for Priya in DSA"</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent"></div>
                  
                  <div className="pl-16 space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary animate-pulse-glow" />
                      <span className="text-sm">Voice captured</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
                      <span className="text-sm">Command processed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary animate-pulse-glow" style={{ animationDelay: "0.6s" }} />
                      <span className="text-sm">Excel updated</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Assistant confirms:</div>
                    <div className="font-medium">"Done! Added 85 marks for Priya."</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features list */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {[
                {
                  title: "Natural Voice Commands",
                  description: "Speak naturally - no need to memorize specific phrases or syntax",
                },
                {
                  title: "Instant Updates",
                  description: "Excel files update in real-time as you speak",
                },
                {
                  title: "Voice Confirmation",
                  description: "Hear verbal feedback confirming your actions",
                },
                {
                  title: "Error Prevention",
                  description: "AI validates entries to prevent common mistakes",
                },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
