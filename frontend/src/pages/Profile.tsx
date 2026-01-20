import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { User, Mail, BookOpen, Plus } from "lucide-react";

const Profile = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="page-background" />
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile header */}
          <div className="glass-card p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and listings
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/sell" className="block">
              <div className="glass-card p-6 hover:glow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">List a Book</h3>
                    <p className="text-sm text-muted-foreground">
                      Sell your textbooks
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/#browse" className="block">
              <div className="glass-card p-6 hover:glow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-stem/20 flex items-center justify-center group-hover:bg-stem/30 transition-colors">
                    <BookOpen className="w-6 h-6 text-stem" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Books</h3>
                    <p className="text-sm text-muted-foreground">
                      Find textbooks to buy
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Info card */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">How Contact Works</h3>
                <p className="text-sm text-muted-foreground">
                  When buyers click "Contact Seller" on your listings, they'll be
                  prompted to send you an email. Make sure your email is up to date
                  so you don't miss any inquiries!
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={logout}
              className="glass-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
