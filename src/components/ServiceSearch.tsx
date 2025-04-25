import React, { useState, useEffect } from 'react';
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Search, Star } from 'lucide-react';
import { offices as importedOffices, currentUser, directions as importedDirections } from '../utils/data';

interface ServiceResult {
  type: 'office' | 'service';
  title: string;
  id: string;
  isRecommended?: boolean;
  organizationId?: string;
}

interface ServiceSearchProps {
  onResultSelect: (result: ServiceResult) => void;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          <h2>Произошла ошибка: {this.state.error}</h2>
          <p>Пожалуйста, проверьте консоль для подробностей.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ServiceSearch: React.FC<ServiceSearchProps> = ({ onResultSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ServiceResult[]>([]);

  const offices = Array.isArray(importedOffices) ? importedOffices : [];
  const directions = Array.isArray(importedDirections) ? importedDirections : [];

  const isOfficeRecommended = (officeAddress: string) => {
    if (!currentUser?.address || typeof officeAddress !== 'string') return false;

    const userStreet = currentUser.address
      .toLowerCase()
      .split(',')
      .map((part) => part.trim())
      .find((part) => part.includes('ул.') || part.includes('пр.')) || '';

    const officeStreet = officeAddress
      .toLowerCase()
      .split(',')
      .map((part) => part.trim())
      .find((part) => part.includes('ул.') || part.includes('пр.')) || '';

    return userStreet && officeStreet && userStreet === officeStreet;
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();

    const matchingServices = directions
      .filter((direction) => typeof direction === 'string' && direction.toLowerCase().includes(query))
      .map((direction) => ({
        type: 'service' as const,
        title: direction,
        id: direction,
      }));

    const matchingOffices = offices
      .filter(
        (office) =>
          office &&
          typeof office.name === 'string' &&
          typeof office.address === 'string' &&
          typeof office.id === 'string' &&
          (office.name.toLowerCase().includes(query) || office.address.toLowerCase().includes(query))
      )
      .map((office) => ({
        type: 'office' as const,
        title: `${office.name} (${office.address})`,
        id: office.id,
        organizationId: office.organizationId,
        isRecommended: isOfficeRecommended(office.address),
      }));

    const combinedResults = [...matchingServices, ...matchingOffices];
    setResults(combinedResults);
    console.log('[ServiceSearch] Search results:', combinedResults);
  }, [searchQuery]);

  return (
    <ErrorBoundary>
      <div className="w-full max-w-2xl mx-auto">
        <Command className="rounded-lg border shadow-md">
          <div className="p-3">
            <input
              type="text"
              placeholder="Поиск услуг и офисов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {results.length > 0 && (
            <CommandList>
              <CommandGroup heading="Результаты поиска">
                {results.map((result) => (
                  <CommandItem
                    key={`${result.type}-${result.id}`}
                    onSelect={() => {
                      console.log('[ServiceSearch] Selected result:', result);
                      onResultSelect(result);
                    }}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{result.title}</span>
                    </div>
                    {result.isRecommended && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        Рекомендовано
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
          {searchQuery.trim() && results.length === 0 && (
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              Ничего не найдено
            </CommandEmpty>
          )}
        </Command>
      </div>
    </ErrorBoundary>
  );
};

export default ServiceSearch;