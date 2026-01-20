// SwapHub API Service Layer
const API_BASE_URL = "";

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: string;
  category: "STEM" | "BUSINESS" | "HUMANITIES";
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
  cover_image_url: string;
  seller_email: string;
  description?: string;
  created_at?: string;
}

export interface AuthResponse {
  key: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface CreateListingData {
  title: string;
  author: string;
  isbn: string;
  price: string;
  category: string;
  condition: string;
  image_url: string;
}

export interface BookLookupResult {
  title: string;
  author: string;
  isbn: string;
  image_url: string;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: UserCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/dj-rest-auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("auth_token", response.key);
    return response;
  }

  async register(data: RegistrationData): Promise<AuthResponse> {
    const token = this.getAuthToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/dj-rest-auth/registration/`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Handle field-specific errors from 400 responses
      const firstErrorKey = Object.keys(errorData)[0];
      if (firstErrorKey && Array.isArray(errorData[firstErrorKey])) {
        throw new Error(errorData[firstErrorKey][0]);
      }
      throw new Error(errorData.detail || `Registration failed: ${response.status}`);
    }

    const result: AuthResponse = await response.json();
    localStorage.setItem("auth_token", result.key);
    return result;
  }

  logout(): void {
    localStorage.removeItem("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Listing endpoints
  async getListings(): Promise<Book[]> {
    return this.request<Book[]>("/api/listings/");
  }

  async getListing(id: number): Promise<Book> {
    return this.request<Book>(`/api/listings/${id}/`);
  }

  async createListing(data: CreateListingData): Promise<Book> {
    const token = this.getAuthToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/listings/create/`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Create listing error response:", errorData);
      const firstErrorKey = Object.keys(errorData)[0];
      if (firstErrorKey && Array.isArray(errorData[firstErrorKey])) {
        throw new Error(errorData[firstErrorKey][0]);
      }
      throw new Error(errorData.detail || `Failed to create listing: ${response.status}`);
    }

    return response.json();
  }

  // Book lookup endpoint by ISBN
  async lookupBook(isbn: string): Promise<BookLookupResult> {
    return this.request<BookLookupResult>(`/api/books/lookup/?isbn=${encodeURIComponent(isbn)}`);
  }
}

export const api = new ApiClient();

// Helper to generate mailto link
export function generateMailtoLink(book: Book): string {
  const subject = encodeURIComponent(`SwapHub Interest: ${book.title}`);
  const body = encodeURIComponent(
    `Hi, I saw your listing for ${book.title} on SwapHub and I'm interested in buying it!`
  );
  return `mailto:${book.seller_email}?subject=${subject}&body=${body}`;
}

// Condition display helpers
export const conditionLabels: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
};

export const conditionColors: Record<string, string> = {
  NEW: "bg-condition-new",
  LIKE_NEW: "bg-condition-like-new",
  GOOD: "bg-condition-good",
  FAIR: "bg-condition-fair",
};

// Category display helpers
export const categoryLabels: Record<string, string> = {
  STEM: "STEM",
  BUSINESS: "Business",
  HUMANITIES: "Humanities",
};

export const categoryColors: Record<string, string> = {
  STEM: "bg-stem",
  BUSINESS: "bg-business",
  HUMANITIES: "bg-humanities",
};
