import { useState, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onLocationClick: () => void;
  isLoading?: boolean;
}

export function SearchBar({ query, onQueryChange, onLocationClick, isLoading }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearSearch = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`
        relative flex items-center bg-background border rounded-lg transition-all duration-200
        ${isFocused ? 'ring-2 ring-primary ring-opacity-50 border-primary' : 'border-input'}
        ${isLoading ? 'opacity-70' : ''}
      `}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search NGOs by name, category, or needs..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-20 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
        />
        
        <div className="absolute right-2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-7 w-7 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onLocationClick}
            className="h-7 px-2 text-xs flex items-center gap-1"
            disabled={isLoading}
          >
            <MapPin className="h-3 w-3" />
            Near Me
          </Button>
        </div>
      </div>

      {/* Search suggestions */}
      {isFocused && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-2 py-1">
              Try searching for:
            </div>
            <div className="flex flex-wrap gap-1 px-2 py-1">
              {['Food', 'Clothes', 'Medicine', 'Education', 'Books', 'Winter'].map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                  onClick={() => onQueryChange(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
