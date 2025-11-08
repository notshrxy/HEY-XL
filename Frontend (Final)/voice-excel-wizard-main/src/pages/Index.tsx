import { useRef, useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import HowItWorks from "@/components/HowItWorks";
import Technologies from "@/components/Technologies";
import UseCases from "@/components/UseCases";
import Impact from "@/components/Impact";
import Demo from "@/components/Demo";
import Footer from "@/components/Footer";
import { onAuthStateChange, UserData } from "@/lib/authService";

const Index = () => {
  const demoRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSolution = () => {
    solutionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHome = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottom = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAuthSuccess = (userData: UserData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Auto-scroll to slide 2 after successful login
    setTimeout(() => {
      solutionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((userData: UserData | null) => {
      if (userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Lock scroll when not authenticated
  useEffect(() => {
    const preventWheelOrTouch = (e: Event) => {
      e.preventDefault();
    };
    const preventScrollKeys = (e: KeyboardEvent) => {
      const scrollKeys = [
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        ' ',
      ];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    if (!isAuthenticated) {
      // Lock scroll on both html and body
      document.body.style.overflow = 'hidden';
      (document.documentElement as HTMLElement).style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      // Block wheel/touch/keyboard scrolling
      window.addEventListener('wheel', preventWheelOrTouch, { passive: false });
      window.addEventListener('touchmove', preventWheelOrTouch, { passive: false });
      window.addEventListener('keydown', preventScrollKeys, { passive: false });
    } else {
      document.body.style.overflow = 'unset';
      (document.documentElement as HTMLElement).style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.style.height = 'auto';

      window.removeEventListener('wheel', preventWheelOrTouch as EventListener);
      window.removeEventListener('touchmove', preventWheelOrTouch as EventListener);
      window.removeEventListener('keydown', preventScrollKeys as EventListener);
    }

    return () => {
      document.body.style.overflow = 'unset';
      (document.documentElement as HTMLElement).style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.style.height = 'auto';

      window.removeEventListener('wheel', preventWheelOrTouch as EventListener);
      window.removeEventListener('touchmove', preventWheelOrTouch as EventListener);
      window.removeEventListener('keydown', preventScrollKeys as EventListener);
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen">
      <div ref={heroRef}>
        <Hero 
          onTryDemo={scrollToDemo} 
          onLearnMore={scrollToSolution} 
          onAuthSuccess={handleAuthSuccess} 
          user={user}
          isAuthenticated={isAuthenticated}
        />
      </div>
             {isAuthenticated && (
               <>
                 <Problem onScrollToBottom={scrollToBottom} slideIndex={1} />
                 <div ref={solutionRef}>
                   <Solution onScrollToBottom={scrollToBottom} slideIndex={2} />
                 </div>
                 <HowItWorks onScrollToBottom={scrollToBottom} slideIndex={3} />
                 <Technologies onScrollToBottom={scrollToBottom} slideIndex={4} />
                 <UseCases onScrollToBottom={scrollToBottom} slideIndex={5} />
                 <Impact onScrollToBottom={scrollToBottom} slideIndex={6} />
                 <div ref={demoRef}>
                   <Demo />
                 </div>
               </>
             )}
      {isAuthenticated && (
        <Footer 
          onHomeClick={scrollToHome} 
          onAboutClick={scrollToSolution} 
          onDemoClick={scrollToDemo} 
        />
      )}
    </div>
  );
};

export default Index;
