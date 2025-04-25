
import React, { useState, useEffect } from 'react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Star } from 'lucide-react'
import { directions, offices, currentUser } from '../utils/data'

interface ServiceResult {
  type: 'service' | 'office'
  title: string
  id: string
  isRecommended?: boolean
}

const ServiceSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<ServiceResult[]>([])

  // Helper function to determine if an office is recommended based on user's address
  const isOfficeRecommended = (officeAddress: string) => {
    const userDistrict = currentUser.address.toLowerCase().split(',')[1]?.trim() || ''
    const officeDistrict = officeAddress.toLowerCase().split(',')[1]?.trim() || ''
    return userDistrict === officeDistrict
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase()

    // Search in services
    const matchingServices = directions
      .filter(direction => direction.toLowerCase().includes(query))
      .map(direction => ({
        type: 'service' as const,
        title: direction,
        id: direction,
      }))

    // Search in offices
    const matchingOffices = offices
      .filter(office => 
        office.name.toLowerCase().includes(query) || 
        office.address.toLowerCase().includes(query)
      )
      .map(office => ({
        type: 'office' as const,
        title: `${office.name} (${office.address})`,
        id: office.id,
        isRecommended: isOfficeRecommended(office.address)
      }))

    setResults([...matchingServices, ...matchingOffices])
  }, [searchQuery])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Поиск услуг и офисов..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="h-12"
        />
        {results.length > 0 && (
          <CommandList>
            <CommandGroup heading="Результаты поиска">
              {results.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
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
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          Ничего не найдено
        </CommandEmpty>
      </Command>
    </div>
  )
}

export default ServiceSearch
