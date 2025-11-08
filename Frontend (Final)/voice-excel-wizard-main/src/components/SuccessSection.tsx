import { CheckCircle, Mic, FolderOpen, Shield, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SuccessSection = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-elegant">
        <CardContent className="p-8 space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-light mb-2">
                Login Successful! 🎉
              </h3>
              <p className="text-sm text-lighter">
                Welcome to HEY-XL Voice Assistant
              </p>
            </div>
          </div>

          {/* Permission Requirements */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-light text-center">
              Required Permissions
            </h4>
            
            <div className="space-y-3">
              {/* Microphone Permission */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-light">Microphone Access</p>
                  <p className="text-xs text-lighter">Required for voice commands</p>
                </div>
              </div>

              {/* File Access Permission */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-light">File Access</p>
                  <p className="text-xs text-lighter">To read and update Excel files</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-primary">95%</div>
              <div className="text-xs text-lighter">Time Saved</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5">
              <Users className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-lg font-bold text-accent">100%</div>
              <div className="text-xs text-lighter">Hands-Free</div>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-light">Secure & Private</p>
              <p className="text-xs text-lighter">
                Your data is processed locally and never stored on external servers.
              </p>
            </div>
          </div>

          {/* Ready to Use */}
          <div className="text-center">
            <p className="text-sm text-lighter">
              You're all set! Scroll down to start using the voice assistant.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessSection;
