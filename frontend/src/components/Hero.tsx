import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stem/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>The student-to-student textbook marketplace</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Buy & Sell Textbooks
            <span className="block gradient-text">Without the Middleman</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Save money on textbooks by connecting directly with other students.
            Find the books you need or sell the ones you don't.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="glow text-lg px-8">
              <a href="#browse">
                Browse Books
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            {!isAuthenticated && (
              <Button asChild variant="outline" size="lg" className="text-lg px-8 glass-card">
                <Link to="/signup">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
