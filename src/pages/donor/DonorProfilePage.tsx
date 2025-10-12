import { useState, useEffect } from 'react';
import { useDonorAuth } from '@/contexts/DonorAuthContext';
import { useDonorApp } from '@/contexts/DonorAppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, User, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function DonorProfilePage() {
  const { donor, updateProfile } = useDonorAuth();
  const { donations } = useDonorApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Load current donor data
  useEffect(() => {
    if (donor) {
      setFormData({
        name: donor.name || '',
        email: donor.email || '',
        phone: donor.phone || '',
        address: donor.address || ''
      });
    }
  }, [donor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateProfile(formData);
      
      toast({
        title: "Profile Updated",
        description: "Your donor profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!donor) {
    return <div>Loading...</div>;
  }

  const totalDonations = donations.length;
  const completedDonations = donations.filter(d => d.status === 'Delivered' || d.status === 'Confirmed').length;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Donor Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and view your impact</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Donation Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Donations</span>
                <Badge variant="default">{totalDonations}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Completed Donations</span>
                <Badge variant="default">{completedDonations}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Pending Donations</span>
                <Badge variant="secondary">{pendingDonations}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Verification Status</span>
                <Badge variant={donor.isVerified ? "default" : "secondary"}>
                  {donor.isVerified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{donor.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{donor.phone}</span>
              </div>
              
              {donor.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{donor.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
