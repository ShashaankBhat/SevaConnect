import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';

export function DonationsPage() {
  const { donations, confirmDonation, isLoading } = useApp();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Received': return <Package className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Received': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Donations</h1>
        <p className="text-muted-foreground">Manage incoming donations from donors</p>
      </div>

      <div className="grid gap-6">
        {donations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No donations yet. Donations will appear here when donors contribute.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          donations.map((donation) => (
            <Card key={donation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{donation.donorName}</CardTitle>
                    <CardDescription className="mt-1">
                      Donated on {new Date(donation.donatedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(donation.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(donation.status)}
                      {donation.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Item</p>
                    <p className="text-lg font-semibold">{donation.item}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                    <p className="text-lg font-semibold">{donation.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <Badge variant="outline">{donation.type || 'Goods'}</Badge>
                  </div>
                </div>

                {donation.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm">{donation.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {donation.status === 'Pending' && (
                    <>
                      <Button 
                        onClick={() => confirmDonation(donation.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirm Receipt
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Decline
                      </Button>
                    </>
                  )}
                  {donation.status === 'Confirmed' && (
                    <Button variant="outline" disabled>
                      Awaiting Delivery
                    </Button>
                  )}
                  {donation.status === 'Received' && (
                    <Button variant="outline" disabled>
                      Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
