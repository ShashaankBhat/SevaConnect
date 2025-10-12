import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { storageService } from '@/services/storage';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app start
    const savedUser = storageService.getUser();
    if (savedUser && storageService.getToken() && savedUser.role === 'admin') {
      setAdmin(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      
      if (response.user && response.token && response.user.role === 'admin') {
        // Store token and admin data
        storageService.setToken(response.token);
        storageService.setUser(response.user);
        setAdmin(response.user);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Admin login failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setAdmin(null);
    storageService.clearAuth();
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
