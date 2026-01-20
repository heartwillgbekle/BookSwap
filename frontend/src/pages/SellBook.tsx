import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Navigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, CreateListingData, BookLookupResult } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Plus, Search, X, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Book cover component with graceful fallback
const BookCover = ({ 
  imageUrl, 
  title 
}: { 
  imageUrl: string | null | undefined; 
  title: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = imageUrl && imageUrl.trim() !== "" && !imageError;

  if (hasValidImage) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback: gradient background with logo and title
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center justify-center p-2 text-white">
      <img 
        src="/logo.jpeg" 
        alt="BookSwap" 
        className="w-10 h-10 mb-1 opacity-80" 
      />
      <span className="text-[10px] text-center font-medium leading-tight line-clamp-3">
        {title}
      </span>
    </div>
  );
};

// Schema for the listing form (after book is found)
const listingSchema = z.object({
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g., 45.00)"),
  category: z.enum(["STEM", "BUSINESS", "HUMANITIES"], {
    required_error: "Please select a category",
  }),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"], {
    required_error: "Please select condition",
  }),
});

type ListingForm = z.infer<typeof listingSchema>;

const Sell = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundBook, setFoundBook] = useState<BookLookupResult | null>(null);

  const form = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      price: "",
      category: undefined,
      condition: undefined,
    } as ListingForm,
  });

  // Book lookup
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter an ISBN",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const result = await api.lookupBook(searchQuery.trim());
      setFoundBook(result);
      toast({
        title: "Book found!",
        description: `"${result.title}" by ${result.author}`,
      });
    } catch (error) {
      toast({
        title: "Book not found",
        description: error instanceof Error ? error.message : "Please try a different search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearBook = () => {
    setFoundBook(null);
    setSearchQuery("");
    form.reset();
  };

  const createListing = useMutation({
    mutationFn: (data: CreateListingData) => api.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast({
        title: "Book listed!",
        description: "Your book has been added to the marketplace.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to list book",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ListingForm) => {
    if (!foundBook) return;

    createListing.mutate({
      title: foundBook.title,
      author: foundBook.author,
      isbn: foundBook.isbn,
      price: data.price,
      category: data.category,
      condition: data.condition,
      image_url: foundBook.image_url,
    });
  };

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="page-background" />
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sell Your Book</h1>
            <p className="text-muted-foreground">
              Search for your book, then set your price and condition
            </p>
          </div>

          {/* Step 1: Search for Book */}
          {!foundBook && (
            <div className="glass-card p-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter ISBN to Auto-fill
                  </label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="e.g., 9780262033848"
                      className="glass-input flex-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="glow"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Book Found - Show Details and Listing Form */}
          {foundBook && (
            <div className="glass-card p-8">
              {/* Found Book Preview */}
              <div className="flex gap-6 mb-8 pb-6 border-b border-border">
                <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                  <BookCover imageUrl={foundBook.image_url} title={foundBook.title} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{foundBook.title}</h2>
                      <p className="text-muted-foreground mb-2">{foundBook.author}</p>
                      <p className="text-sm text-muted-foreground">ISBN: {foundBook.isbn}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearBook}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Listing Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="45.00"
                              className="glass-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-input">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="STEM">STEM</SelectItem>
                              <SelectItem value="BUSINESS">Business</SelectItem>
                              <SelectItem value="HUMANITIES">Humanities</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-input">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NEW">New</SelectItem>
                              <SelectItem value="LIKE_NEW">Like New</SelectItem>
                              <SelectItem value="GOOD">Good</SelectItem>
                              <SelectItem value="FAIR">Fair</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full glow"
                    disabled={createListing.isPending}
                  >
                    {createListing.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Listing book...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        List Book for Sale
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sell;
