import { useState } from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchFilters } from '@/hooks/useNGOSearch';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORIES = [
  'Food',
  'Clothes', 
  'Medicine',
  'Education',
  'Environment',
  'Animal Welfare',
  'Other'
];

const COMMON_NEEDS = [
  'Rice', 'Dal', 'Blankets', 'Winter Clothes', 'Medicines',
  'Books', 'Stationery', 'First Aid', 'Food Grains', 'Milk',
  'Vegetables', 'Fruits', 'Sanitary Pads', 'Soap', 'Shampoo'
];

const SORT_OPTIONS = [
  { value: 'distance', label: 'Distance (Nearest First)' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'needs', label: 'Most Needs' }
];

export function AdvancedFilters({ filters, onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      category: '',
      city: '',
      state: '',
      maxDistance: undefined,
      needs: [],
      sortBy: 'distance' as const
    };
    setLocalFilters(prev => ({ ...prev, ...resetFilters }));
    onFiltersChange(resetFilters);
  };

  const toggleNeed = (need: string) => {
    const newNeeds = localFilters.needs.includes(need)
      ? localFilters.needs.filter(n => n !== need)
      : [...localFilters.needs, need];
    
    setLocalFilters(prev => ({ ...prev, needs: newNeeds }));
  };

  const hasActiveFilters = 
    localFilters.category || 
    localFilters.city || 
    localFilters.state || 
    localFilters.maxDistance || 
    localFilters.needs.length > 0;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
            {[
              localFilters.category ? 1 : 0,
              localFilters.city ? 1 : 0,
              localFilters.state ? 1 : 0,
              localFilters.maxDistance ? 1 : 0,
              localFilters.needs.length
            ].reduce((a, b) => a + b, 0)}
          </Badge>
        )}
      </Button>

      {/* Filters Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </h3>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={localFilters.category}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filters */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <input
                      type="text"
                      value={localFilters.city}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">State</label>
                    <input
                      type="text"
                      value={localFilters.state}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                </div>

                {/* Distance Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Maximum Distance: {localFilters.maxDistance ? `${localFilters.maxDistance} km` : 'Any'}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={localFilters.maxDistance || 0}
                    onChange={(e) => setLocalFilters(prev => ({ 
                      ...prev, 
                      maxDistance: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 km</span>
                    <span>100 km</span>
                  </div>
                </div>

                {/* Needs Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Specific Needs</label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {COMMON_NEEDS.map(need => (
                      <Badge
                        key={need}
                        variant={localFilters.needs.includes(need) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleNeed(need)}
                      >
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => setLocalFilters(prev => ({ 
                      ...prev, 
                      sortBy: e.target.value as SearchFilters['sortBy'] 
                    }))}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
