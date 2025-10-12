// src/pages/InventoryPage.tsx
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { AddInventoryForm } from '@/components/inventory/AddInventoryForm';

export function InventoryPage() {
  const { inventory, isLoading } = useApp();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Medium': return <AlertTriangle className="h-4 w-4" />;
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const lowStockItems = inventory.filter(item => item.currentStock < 5);
  const expiringSoon = inventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return expiry <= sevenDaysFromNow;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your organization's supplies and resources</p>
        </div>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || expiringSoon.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>
                  {lowStockItems.length} item(s) running low
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <Badge variant="destructive">Only {item.currentStock} left</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {expiringSoon.length > 0 && (
            <Card className="border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  Expiring Soon
                </CardTitle>
                <CardDescription>
                  {expiringSoon.length} item(s) expiring within 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringSoon.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <Badge variant="outline" className="text-yellow-700">
                        {new Date(item.expiryDate!).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge className={getUrgencyColor(item.urgency)}>
                  <div className="flex items-center gap-1">
                    {getUrgencyIcon(item.urgency)}
                    {item.urgency}
                  </div>
                </Badge>
              </div>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Stock</p>
                  <p className={`font-semibold ${item.currentStock < 5 ? 'text-red-600' : ''}`}>
                    {item.currentStock}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-semibold">{item.targetQuantity || 'N/A'}</p>
                </div>
              </div>
              
              {item.expiryDate && (
                <div>
                  <p className="text-muted-foreground text-sm">Expires</p>
                  <p className="text-sm font-medium">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {inventory.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No inventory items yet. Add your first item to get started.</p>
              <Button 
                onClick={() => setIsAddFormOpen(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AddInventoryForm 
        open={isAddFormOpen} 
        onOpenChange={setIsAddFormOpen} 
      />
    </div>
  );
}