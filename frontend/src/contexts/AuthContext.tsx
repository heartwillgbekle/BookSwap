import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, UserCredentials, RegistrationData } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    setIsAuthenticated(api.isAuthenticated());
    setIsLoading(false);
  }, []);

  const login = async (credentials: UserCredentials) => {
    await api.login(credentials);
    setIsAuthenticated(true);
  };

  const register = async (data: RegistrationData) => {
    try {
      await api.register(data);
      setIsAuthenticated(true);
    } catch (error) {
      // api.register already extracts field-level error messages from 400 responses
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Registration failed";

      toast({
        title: message,
        variant: "destructive",
      });

      throw error;
    }
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
