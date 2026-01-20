import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, generateMailtoLink, conditionLabels, conditionColors, categoryLabels, categoryColors } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Loader2, AlertCircle } from "lucide-react";

// Safe helper to get user name
const getSellerUsername = (email: string) => {
  if (!email) return "Unknown Seller";
  return email.split("@")[0];
};

const BookDetails = () => {
  const { id } = useParams();
  
  const { data: book, isLoading, error } = useQuery({
    queryKey: ["book", id],
    queryFn: () => api.getListing(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-2xl font-bold">Book not found</h2>
        <p className="text-muted-foreground">The book you are looking for does not exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to Browse</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="page-background" />
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden glass-card shadow-xl">
             {book.cover_image_url ? (
                <img 
                  src={book.cover_image_url} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
             ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
             )}
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </div>

            <div className="glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-baseline justify-between border-b border-border pb-6">
                <p className="text-3xl font-bold text-primary">${book.price}</p>
                
                {/* SAFE RENDERING FOR CONDITION */}
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${conditionColors[book.condition] || 'bg-gray-500'}`}>
                  {conditionLabels[book.condition] || book.condition || "Unknown"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  {/* SAFE RENDERING FOR CATEGORY */}
                  <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${categoryColors[book.category] || 'bg-gray-500'}`}>
                     {categoryLabels[book.category] || book.category || "General"}
                  </span>
                </div>
              </div>

              {book.description && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Seller's Notes</p>
                  <p className="text-foreground">{book.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sold by: <span className="text-foreground font-medium">{getSellerUsername(book.seller_email)}</span>
              </p>
              
              <Button asChild size="lg" className="w-full md:w-auto glow text-lg">
                <a href={generateMailtoLink(book)}>
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Seller
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;