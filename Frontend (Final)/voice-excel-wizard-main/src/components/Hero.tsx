import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Sparkles, LogOut, User } from "lucide-react";
import AuthSection from "./AuthSection";
import SuccessSection from "./SuccessSection";
import { signOutUser } from "@/lib/authService";

interface HeroProps {
  onTryDemo: () => void;
  onLearnMore: () => void;
  onAuthSuccess: (user: any) => void;
  user?: any;
  isAuthenticated: boolean;
}

const Hero = ({ onTryDemo, onLearnMore, onAuthSuccess, user, isAuthenticated }: HeroProps) => {

  const handleAuthSuccess = (user: any) => {
    onAuthSuccess(user);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[80vh]">
          {/* Left content - takes 7 columns */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Voice Assistant</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight hover-lift text-glow cursor-pointer text-light">
              Revolutionize Classroom Management{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                with Your Voice
              </span>
            </h1>

            <p className="text-xl text-lighter leading-relaxed">
              An AI-powered assistant that lets teachers update Excel records hands-free. 
              Say goodbye to manual typing and hello to efficiency.
            </p>

            {isAuthenticated ? (
              <div className="space-y-4">
                {user && (
                  <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-light">
                        Welcome, {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-lighter">{user.role} • {user.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="lg" className="group" onClick={onTryDemo}>
                    <Mic className="w-5 h-5 group-hover:animate-pulse-glow" />
                    Try Demo
                  </Button>
                  <Button variant="outline" size="lg" onClick={onLearnMore}>
                    Learn More
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleLogout} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-lighter">
                  Please authenticate to access the voice-controlled Excel assistant
                </p>
                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-sm text-lighter">Time Saved</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-primary">Zero</div>
                    <div className="text-sm text-lighter">Manual Entry</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-lighter">Hands-Free</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - takes 5 columns with left margin */}
          <div className="lg:col-span-5 lg:ml-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {!isAuthenticated ? (
              <AuthSection onAuthSuccess={handleAuthSuccess} />
            ) : (
              <SuccessSection />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
