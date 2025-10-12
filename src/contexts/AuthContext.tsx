import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { storageService } from '@/services/storage';

interface NGO {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  category: string;
  description: string;
  documents?: string[];
  status: 'Pending' | 'Verified' | 'Rejected';
  rejectionReason?: string;
}

interface AuthContextType {
  user: NGO | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (ngoData: Omit<NGO, 'id' | 'status' | 'rejectionReason'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NGO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = storageService.getUser();
    if (savedUser && storageService.getToken()) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      
      if (response.user && response.token) {
        // Store token and user data
        storageService.setToken(response.token);
        storageService.setUser(response.user);
        setUser(response.user);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (ngoData: Omit<NGO, 'id' | 'status' | 'rejectionReason'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.registerNGO(ngoData);
      
      if (response.user && response.token) {
        // Store token and user data
        storageService.setToken(response.token);
        storageService.setUser(response.user);
        setUser(response.user);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    storageService.clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
