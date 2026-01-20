import { Book, generateMailtoLink, conditionLabels, conditionColors, categoryLabels, categoryColors } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface BookCardProps {
  book: Book;
}

const PLACEHOLDER_IMAGE = "https://placehold.co/400x600?text=No+Cover+Found";

// Helper to get the full image URL
function getImageUrl(url: string | undefined): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith("/media/")) {
    return `https://swaphub.me${url}`;
  }
  return url;
}

export function BookCard({ book }: BookCardProps) {
  const imageUrl = getImageUrl(book.cover_image_url);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  return (
    <div className="glass-card group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:glow-sm">
      <Link to={`/book/${book.id}`} className="block">
        <div className="aspect-[3/4] relative overflow-hidden bg-secondary/50">
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Category badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium text-white ${categoryColors[book.category]}`}
          >
            {categoryLabels[book.category] || book.category}
          </span>
          
          {/* Condition badge */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium text-white ${conditionColors[book.condition]}`}
          >
            {conditionLabels[book.condition] || book.condition}
          </span>
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        </Link>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-primary">${book.price}</span>
          <Button
            asChild
            size="sm"
            className="glow-sm"
          >
            <a href={generateMailtoLink(book)}>
              <Mail className="w-4 h-4 mr-1.5" />
              Contact
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
