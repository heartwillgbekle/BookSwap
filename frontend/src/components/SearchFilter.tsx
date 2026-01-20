import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  { value: "", label: "All Categories" },
  { value: "STEM", label: "STEM" },
  { value: "BUSINESS", label: "Business" },
  { value: "HUMANITIES", label: "Humanities" },
];

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchFilterProps) {
  return (
    <div className="glass-card p-4 space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 glass-input"
        />
      </div>
      
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.value
                ? "bg-primary text-primary-foreground glow-sm"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
