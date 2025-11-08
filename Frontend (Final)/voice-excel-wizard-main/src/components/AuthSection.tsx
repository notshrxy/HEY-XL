import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp, signIn, resetPassword, signInWithGoogle, signInWithGitHub, clearGoogleAuthCache } from "@/lib/authService";

interface AuthSectionProps {
  onAuthSuccess: (user: any) => void;
}

const AuthSection = ({ onAuthSuccess }: AuthSectionProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);

    try {
      console.log('Attempting Google sign in...');
      const userData = await signInWithGoogle();
      console.log('Google sign in successful:', userData);
      onAuthSuccess(userData);
    } catch (error: any) {
      console.error('Google authentication error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearGoogleCache = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      await clearGoogleAuthCache();
      setError("✅ Google cache cleared! You can now try signing in with a different account.");
    } catch (error: any) {
      setError("❌ Failed to clear cache. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    setError("");
    setIsLoading(true);

    try {
      console.log('Attempting GitHub sign in...');
      const userData = await signInWithGitHub();
      console.log('GitHub sign in successful:', userData);
      onAuthSuccess(userData);
    } catch (error: any) {
      console.error('GitHub authentication error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('Form submission started:', { isSignUp, formData });

      if (isSignUp) {
        // Sign up
        if (!formData.firstName || !formData.lastName || !formData.role) {
          throw new Error("Please fill in all required fields");
        }
        
        console.log('Attempting sign up...');
        const userData = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.role
        );
        console.log('Sign up successful:', userData);
        onAuthSuccess(userData);
      } else {
        // Sign in
        console.log('Attempting sign in...');
        const userData = await signIn(formData.email, formData.password);
        console.log('Sign in successful:', userData);
        onAuthSuccess(userData);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(formData.email);
      setError("");
      alert("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-elegant max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-light">
            {isSignUp ? "Sign Up Account" : "Sign In"}
          </CardTitle>
          <p className="text-sm text-lighter">
            {isSignUp 
              ? "Enter your personal data to create your account." 
              : "Welcome back! Please sign in to continue."
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    ) : (
                      <Mail className="w-5 h-5 mr-3" />
                    )}
                    Google
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-lighter hover:text-light"
                    onClick={handleClearGoogleCache}
                    disabled={isLoading}
                  >
                    Clear Google Cache
                  </Button>
            <Button
              variant="outline"
              className="w-full h-12 bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleGitHubAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Github className="w-5 h-5 mr-3" />
              )}
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-lighter">OR</span>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSignUp 
                  ? "bg-primary text-primary-foreground" 
                  : "text-lighter hover:text-light"
              }`}
              onClick={() => setIsSignUp(true)}
            >
              Register
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isSignUp 
                  ? "bg-primary text-primary-foreground" 
                  : "text-lighter hover:text-light"
              }`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-card border-border text-light placeholder:text-lighter"
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-card border-border text-light placeholder:text-lighter"
                  required
                />
              </div>
            )}

            <Input
              type="email"
              placeholder="your.email@sathyabama.ac.in"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-card border-border text-light placeholder:text-lighter"
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="YourBestPassword"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-card border-border text-light placeholder:text-lighter pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lighter hover:text-light"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isSignUp && (
              <>
                <p className="text-xs text-lighter">Must be at least 8 characters.</p>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="bg-card border-border text-light">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                isSignUp ? "Sign Up" : "Sign In"
              )}
            </Button>
          </form>

          {/* Forgot Password & Login Link */}
          <div className="text-center space-y-2">
            {!isSignUp && (
              <button
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            )}
            <p className="text-sm text-lighter">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSection;
