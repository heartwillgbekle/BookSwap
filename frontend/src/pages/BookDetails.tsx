import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, generateMailtoLink, conditionLabels, conditionColors, categoryLabels, categoryColors } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Loader2, AlertCircle } from "lucide-react";

// Book cover component with graceful gradient fallback
const BookCover = ({
  imageUrl,
  title,
}: {
  imageUrl: string | null | undefined;
  title: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = imageUrl && imageUrl.trim() !== "" && !imageError;

  // Helper to get the full image URL
  const getImageUrl = (url: string): string => {
    if (url.startsWith("/media/")) {
      return `https://swaphub.me${url}`;
    }
    return url;
  };

  if (hasValidImage) {
    return (
      <img
        src={getImageUrl(imageUrl)}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback: gradient background with logo and title
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center justify-center p-6 text-white">
      <img 
        src="/logo.jpeg" 
        alt="BookSwap" 
        className="w-20 h-20 mb-4 opacity-80" 
      />
      <span className="text-lg text-center font-medium leading-tight line-clamp-4">
        {title}
      </span>
    </div>
  );
};

// Helper to extract username from email
const getSellerUsername = (email: string): string => {
  if (!email) return "Unknown Seller";
  const username = email.split("@")[0];
  return `@${username}`;
};

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => api.getListing(id!), // Using id directly
    enabled: !!id,
  });

  return (
    <div className="min-h-screen">
      <div className="page-background" />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Link>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading book details...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Book Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find this book listing. It may have been removed or the link is incorrect.
            </p>
            <Button asChild>
              <Link to="/">Browse All Books</Link>
            </Button>
          </div>
        )}

        {/* Book details - Two Column Layout */}
        {book && (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side: Book Cover */}
            <div className="glass-card overflow-hidden bg-secondary/50 p-4 flex items-center justify-center">
              <div className="w-full max-w-sm aspect-[3/4]">
                <BookCover imageUrl={book.cover_image_url} title={book.title} />
              </div>
            </div>

            {/* Right Side: Book Details */}
            <div className="space-y-6">
              {/* Category & Condition Badges */}
              <div className="flex flex-wrap gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${categoryColors[book.category] || 'bg-gray-500'}`}
                >
                  {categoryLabels[book.category] || book.category}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${conditionColors[book.condition] || 'bg-gray-500'}`}
                >
                  {conditionLabels[book.condition] || book.condition}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-xl text-muted-foreground">
                by {book.author}
              </p>

              {/* Price */}
              <div className="glass-card p-6 inline-block">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-4xl font-bold text-green-500">${book.price}</p>
              </div>

              {/* Details Grid */}
              <div className="glass-card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <p className="font-medium">{book.isbn || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">{conditionLabels[book.condition] || book.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{categoryLabels[book.category] || book.category}</p>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Seller's Notes</p>
                    <p className="text-foreground">{book.description}</p>
                  </div>
                )}
              </div>

              {/* Seller Info & Contact Button */}
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

                <p className="text-xs text-muted-foreground">
                  Clicking this button will open your email client with a pre-filled message.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;