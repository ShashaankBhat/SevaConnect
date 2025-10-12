// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

export interface Need {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  urgency: 'High' | 'Medium' | 'Low';
  expiryDate: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    category: string;
  }>;
  status: 'pending' | 'confirmed' | 'received' | 'delivered';
  donatedAt: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  currentStock: number;
  urgency: string;
  targetQuantity?: string;
  description?: string;
  expiryDate?: string;
  addedAt: string;
}

export interface Alert {
  id: string;
  type: 'Low Stock' | 'Expiry' | 'New Donation' | 'Volunteer Request';
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface AppContextType {
  needs: Need[];
  donations: Donation[];
  inventory: InventoryItem[];
  alerts: Alert[];
  addNeed: (need: Omit<Need, 'id' | 'createdAt'>) => void;
  updateNeed: (id: string, need: Partial<Need>) => void;
  deleteNeed: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'addedAt'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  confirmDonation: (donationId: string) => Promise<void>;
  markAlertAsRead: (alertId: string) => void;
  getUnreadAlerts: () => Alert[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load NGO data when user logs in
  useEffect(() => {
    if (user) {
      loadNGOData();
    } else {
      setDonations([]);
      setInventory([]);
      setAlerts([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadNGOData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load donations for this NGO
      const donationsResponse = await apiService.getNGODonations(user.id);
      const transformedDonations = (donationsResponse.donations || []).map((donation: any) => ({
        id: donation._id,
        donorName: donation.donorId?.name || 'Anonymous Donor',
        donorEmail: donation.donorId?.email || '',
        items: donation.items || [],
        status: donation.status,
        donatedAt: donation.donationDate || donation.createdAt,
        notes: donation.notes
      }));
      
      setDonations(transformedDonations);

      // Mock inventory data with proper structure
      const mockInventory: InventoryItem[] = [
        {
          id: '1',
          name: 'Blankets',
          category: 'Clothing',
          quantity: 25,
          currentStock: 25,
          urgency: 'Low',
          targetQuantity: '30',
          description: 'Warm blankets for winter',
          addedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '2',
          name: 'Canned Food',
          category: 'Food',
          quantity: 50,
          currentStock: 3,
          urgency: 'High',
          targetQuantity: '100',
          description: 'Non-perishable food items',
          expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          addedAt: new Date(Date.now() - 432000000).toISOString(),
        },
      ];

      setInventory(mockInventory);

      // Generate alerts based on current data
      generateAlerts(transformedDonations, mockInventory);
    } catch (error) {
      console.error('Failed to load NGO data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadNGOData();
  };

  const generateAlerts = (donationsList: Donation[], inventoryList: InventoryItem[]) => {
    const newAlerts: Alert[] = [];
    
    // Check for low stock items
    inventoryList.forEach(item => {
      if (item.currentStock < 5) {
        newAlerts.push({
          id: `low-stock-${item.id}`,
          type: 'Low Stock',
          message: `${item.name} is running low (${item.currentStock} remaining)`,
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    });

    // Check for new donations
    donationsList.forEach(donation => {
      if (donation.status === 'pending') {
        newAlerts.push({
          id: `new-donation-${donation.id}`,
          type: 'New Donation',
          message: `New donation from ${donation.donorName}: ${donation.items.map(item => item.name).join(', ')}`,
          createdAt: donation.donatedAt,
          isRead: false,
        });
      }
    });

    setAlerts(newAlerts);
  };

  const addNeed = (need: Omit<Need, 'id' | 'createdAt'>) => {
    const newNeed: Need = {
      ...need,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNeeds(prev => [...prev, newNeed]);
  };

  const updateNeed = (id: string, updatedNeed: Partial<Need>) => {
    setNeeds(prev => prev.map(need => 
      need.id === id ? { ...need, ...updatedNeed } : need
    ));
  };

  const deleteNeed = (id: string) => {
    setNeeds(prev => prev.filter(need => need.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'addedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    setInventory(prev => [...prev, newItem]);
    generateAlerts(donations, [...inventory, newItem]);
  };

  const updateInventoryItem = (id: string, updatedItem: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const confirmDonation = async (donationId: string) => {
    try {
      await apiService.updateDonationStatus(donationId, 'received');
      
      // Update local state
      setDonations(prev => prev.map(donation => {
        if (donation.id === donationId && donation.status === 'pending') {
          // Add to inventory
          const newInventoryItem: InventoryItem = {
            id: Date.now().toString(),
            name: donation.items[0]?.name || 'Donated Item',
            category: 'Donated Items',
            quantity: donation.items.reduce((sum, item) => sum + item.quantity, 0),
            currentStock: donation.items.reduce((sum, item) => sum + item.quantity, 0),
            urgency: 'Medium',
            addedAt: new Date().toISOString(),
          };
          setInventory(prevInventory => [...prevInventory, newInventoryItem]);
          
          return { ...donation, status: 'received' as const };
        }
        return donation;
      }));

      // Refresh alerts
      refreshData();
    } catch (error) {
      console.error('Failed to confirm donation:', error);
      throw error;
    }
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const getUnreadAlerts = () => {
    return alerts.filter(alert => !alert.isRead);
  };

  return (
    <AppContext.Provider value={{
      needs,
      donations,
      inventory,
      alerts,
      addNeed,
      updateNeed,
      deleteNeed,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      confirmDonation,
      markAlertAsRead,
      getUnreadAlerts,
      isLoading,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}