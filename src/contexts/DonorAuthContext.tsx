import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { storageService } from '@/services/storage';

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  isVerified: boolean;
}

interface DonorAuthContextType {
  donor: Donor | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (donorData: Omit<Donor, 'id' | 'isVerified'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  otpCode: string | null;
  generateOTP: (email: string) => void;
  verifyOTP: (code: string) => boolean;
  updateProfile: (updatedData: Partial<Donor>) => void;
}

const DonorAuthContext = createContext<DonorAuthContextType | undefined>(undefined);

export function DonorAuthProvider({ children }: { children: React.ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otpCode, setOtpCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if donor is logged in on app start
    const savedDonor = storageService.getUser();
    if (savedDonor && storageService.getToken() && savedDonor.role === 'donor') {
      setDonor(savedDonor);
    }
    setIsLoading(false);
  }, []);

  const generateOTP = (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    console.log(`OTP for ${email}: ${code}`); // In real app, integrate with email/SMS service
  };

  const verifyOTP = (code: string): boolean => {
    if (code === otpCode) {
      setOtpCode(null);
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      
      if (response.user && response.token && response.user.role === 'donor') {
        storageService.setToken(response.token);
        storageService.setUser(response.user);
        setDonor(response.user);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Donor login failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (donorData: Omit<Donor, 'id' | 'isVerified'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.registerDonor(donorData);
      
      if (response.user && response.token) {
        storageService.setToken(response.token);
        storageService.setUser(response.user);
        setDonor(response.user);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Donor registration failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const updateProfile = (updatedData: Partial<Donor>) => {
    if (!donor) return;
    
    const updatedDonor = { ...donor, ...updatedData };
    setDonor(updatedDonor);
    storageService.setUser(updatedDonor);
  };

  const logout = () => {
    setDonor(null);
    storageService.clearAuth();
  };

  return (
    <DonorAuthContext.Provider value={{ 
      donor, 
      login, 
      register, 
      logout, 
      isLoading, 
      otpCode, 
      generateOTP, 
      verifyOTP,
      updateProfile 
    }}>
      {children}
    </DonorAuthContext.Provider>
  );
}

export function useDonorAuth() {
  const context = useContext(DonorAuthContext);
  if (context === undefined) {
    throw new Error('useDonorAuth must be used within a DonorAuthProvider');
  }
  return context;
}
