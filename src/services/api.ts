import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    const token = localStorage.getItem('sevaconnect_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
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

  async login(credentials: any) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // NGOs
  async searchNGOs(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    return this.request(`/search/ngos?${params.toString()}`);
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
}

export const apiService = new ApiService();

// Hooks
export const useNGOs = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.searchNGOs();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    ngos: data?.ngos || [],
    totalCount: data?.totalCount || 0,
    filters: data?.filters || {},
    isLoading,
    error
  };
};

export const useCreateDonation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createDonation = async (donationData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      return await apiService.createDonation(donationData);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createDonation, isLoading, error };
};
