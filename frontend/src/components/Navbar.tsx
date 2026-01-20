import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, User, LogOut } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.jpeg" 
            alt="BookSwap" 
            className="h-10 transition-transform group-hover:scale-105" 
          />
          <span className="text-xl font-bold gradient-text">BookSwap</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/sell">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Sell Book
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile">
                  <User className="w-4 h-4 mr-1.5" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="glow-sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
