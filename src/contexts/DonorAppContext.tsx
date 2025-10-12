import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useDonorAuth } from './DonorAuthContext';

export interface NGO {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  needs: string[];
  contact: string;
  category: string;
}

export interface Donation {
  id: string;
  ngoId: string;
  ngoName: string;
  item: string;
  quantity: number;
  notes: string;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  date: string;
}

export interface VolunteerBooking {
  id: string;
  ngoId: string;
  ngoName: string;
  pickupAddress: string;
  dropAddress: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

interface DonorAppContextType {
  ngos: NGO[];
  donations: Donation[];
  volunteerBookings: VolunteerBooking[];
  addDonation: (donation: Omit<Donation, 'id' | 'date'>) => Promise<boolean>;
  updateDonationStatus: (id: string, status: Donation['status']) => void;
  addVolunteerBooking: (booking: Omit<VolunteerBooking, 'id' | 'status'>) => void;
  isLoading: boolean;
}

const DonorAppContext = createContext<DonorAppContextType | undefined>(undefined);

export function DonorAppProvider({ children }: { children: React.ReactNode }) {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteerBookings, setVolunteerBookings] = useState<VolunteerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { donor } = useDonorAuth();

  // Load donor data when donor logs in
  useEffect(() => {
    if (donor) {
      loadDonorData();
    } else {
      setDonations([]);
      setVolunteerBookings([]);
      setIsLoading(false);
    }
  }, [donor]);

  const loadDonorData = async () => {
    if (!donor) return;
    
    setIsLoading(true);
    try {
      // Load all NGOs
      const ngosResponse = await apiService.getAllNGOs();
      
      // Transform the NGO data to match the frontend interface
      const transformedNGOs = (ngosResponse.ngos || []).map((ngo: any) => ({
        id: ngo._id,
        name: ngo.organizationName,
        address: ngo.address,
        lat: ngo.location?.lat || 19.0760, // Default to Mumbai if no coordinates
        lng: ngo.location?.lng || 72.8777,
        needs: ngo.needs || [],
        contact: ngo.contact,
        category: ngo.category
      }));
      
      setNgos(transformedNGOs);

      // Load donor's donations
      const donationsResponse = await apiService.getDonorDonations(donor.id);
      setDonations(donationsResponse.donations || []);

      // TODO: Load volunteer bookings when API is ready
      const mockVolunteerBookings: VolunteerBooking[] = [
        {
          id: '1',
          ngoId: '1',
          ngoName: 'Food for All Foundation',
          pickupAddress: '123 My Address, Mumbai',
          dropAddress: '123 Charity Street, Mumbai, Maharashtra',
          date: '2024-01-20',
          time: '10:00',
          status: 'Scheduled'
        }
      ];
      setVolunteerBookings(mockVolunteerBookings);
    } catch (error) {
      console.error('Failed to load donor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addDonation = async (donation: Omit<Donation, 'id' | 'date'>): Promise<boolean> => {
    if (!donor) return false;

    try {
      const donationData = {
        donorId: donor.id,
        ngoId: donation.ngoId,
        items: [{
          name: donation.item,
          quantity: donation.quantity,
          category: 'General'
        }],
        notes: donation.notes,
        type: 'goods' as const
      };

      const response = await apiService.createDonation(donationData);
      
      if (response.donationId) {
        const newDonation: Donation = {
          ...donation,
          id: response.donationId,
          date: new Date().toISOString().split('T')[0],
        };
        setDonations(prev => [...prev, newDonation]);
        return true;
      }
    } catch (error) {
      console.error('Failed to create donation:', error);
    }
    
    return false;
  };

  const updateDonationStatus = (id: string, status: Donation['status']) => {
    setDonations(prev => 
      prev.map(donation => 
        donation.id === id ? { ...donation, status } : donation
      )
    );
  };

  const addVolunteerBooking = (booking: Omit<VolunteerBooking, 'id' | 'status'>) => {
    const newBooking: VolunteerBooking = {
      ...booking,
      id: Date.now().toString(),
      status: 'Scheduled'
    };
    setVolunteerBookings(prev => [...prev, newBooking]);
  };

  return (
    <DonorAppContext.Provider value={{
      ngos,
      donations,
      volunteerBookings,
      addDonation,
      updateDonationStatus,
      addVolunteerBooking,
      isLoading,
    }}>
      {children}
    </DonorAppContext.Provider>
  );
}

export function useDonorApp() {
  const context = useContext(DonorAppContext);
  if (context === undefined) {
    throw new Error('useDonorApp must be used within a DonorAppProvider');
  }
  return context;
}
