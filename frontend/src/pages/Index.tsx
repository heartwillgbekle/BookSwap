import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Book } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SearchFilter } from "@/components/SearchFilter";
import { BookCard } from "@/components/BookCard";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: () => api.getListings(),
  });

  const filteredBooks = useMemo(() => {
    return books.filter((book: Book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen">
      <div className="page-background" />
      <Navbar />
      <Hero />
      <section id="browse" className="py-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Browse Books</h2>
            <p className="text-muted-foreground">Find the textbooks you need from fellow students</p>
          </div>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="glass-card p-8 text-center">
              <p className="text-destructive">Failed to load books. Please try again later.</p>
            </div>
          )}
          {!isLoading && !error && (
            filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book: Book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {searchQuery || selectedCategory ? "No books match your search criteria." : "No books available yet. Be the first to list one!"}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
