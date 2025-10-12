import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('sevaconnect_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Create clean headers object without undefined values
    const baseHeaders = this.getAuthHeaders();
    const optionHeaders = options.headers as Record<string, string> || {};
    
    const headers = {
      ...baseHeaders,
      ...optionHeaders
    };

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // NGO Authentication
  async registerNGO(ngoData: any) {
    return this.request('/auth/ngo-register', {
      method: 'POST',
      body: JSON.stringify(ngoData),
    });
  }

  async registerDonor(donorData: any) {
    return this.request('/auth/donor-register', {
      method: 'POST',
      body: JSON.stringify(donorData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Donations
  async createDonation(donationData: any) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async getDonorDonations(donorId: string) {
    return this.request(`/donations/donor/${donorId}`);
  }

  async getNGODonations(ngoId: string) {
    return this.request(`/donations/ngo/${ngoId}`);
  }

  async updateDonationStatus(donationId: string, status: string) {
    return this.request(`/donations/${donationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // NGOs
  async getAllNGOs() {
    return this.request('/ngos');
  }

  async getNGOById(ngoId: string) {
    return this.request(`/ngos/${ngoId}`);
  }

  async addNgoNeed(ngoId: string, need: string) {
    return this.request(`/ngos/${ngoId}/needs`, {
      method: 'POST',
      body: JSON.stringify({ need }),
    });
  }

  // Search NGOs with filters
  async searchNGOs(filters: {
    query?: string;
    category?: string;
    city?: string;
    state?: string;
    needs?: string[];
    sortBy?: 'distance' | 'name' | 'needs';
    userLat?: number;
    userLng?: number;
    maxDistance?: number;
  } = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return this.request(`/search/ngos?${params.toString()}`);
  }

  // Get search suggestions
  async getSearchSuggestions(query: string) {
    return this.request(`/search/suggestions?query=${encodeURIComponent(query)}`);
  }

  // Admin
  async getPendingNGOs() {
    return this.request('/admin/ngos/pending');
  }

  async verifyNGO(ngoId: string) {
    return this.request(`/admin/ngos/${ngoId}/verify`, {
      method: 'PUT',
    });
  }

  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getPlatformOverview() {
    return this.request('/admin/overview');
  }
}

export const apiService = new ApiService();

// Custom hook for NGOs
export const useNGOs = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiService.searchNGOs();
        setData(result);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch NGOs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  // Safe access to prevent errors
  const safeData = data || { ngos: [], totalCount: 0, filters: {} };
  
  return {
    ngos: safeData.ngos || [],
    totalCount: safeData.totalCount || 0,
    filters: safeData.filters || {},
    isLoading,
    error
  };
};

// Hook for creating donations
export const useCreateDonation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createDonation = async (donationData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiService.createDonation(donationData);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createDonation, isLoading, error };
};

// Hook for getting donor donations
export const useDonorDonations = (donorId: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiService.getDonorDonations(donorId);
        setData(result.donations || result || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (donorId) {
      fetchDonations();
    }
  }, [donorId]);

  return { donations: data, isLoading, error };
};

// Hook for search with filters
export const useNGOSearch = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (filters: any = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiService.searchNGOs(filters);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    data: data || { ngos: [], totalCount: 0, filters: {} }, 
    search, 
    isLoading, 
    error 
  };
};
