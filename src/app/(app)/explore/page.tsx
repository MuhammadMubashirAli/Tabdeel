
'use client';

export const dynamic = 'force-dynamic';

import { ItemCard } from "@/app/components/item-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories, pakistaniCities } from "@/lib/data";
import type { Item } from "@/lib/types";
import { ListFilter, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { ItemDetailDialog } from "@/app/components/item-detail-dialog";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const conditions: Item['condition'][] = ['Like New', 'Good', 'Fair'];

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const [filters, setFilters] = useState({
    category: 'all',
    city: 'all',
    condition: 'all',
    search: '',
  });

  const firestore = useFirestore();

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'items'), where('status', '==', 'active'));
  }, [firestore]);

  const { data: allItems, isLoading } = useCollection<Item>(itemsQuery);
  
  // Update filters when URL search params change
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setFilters(prev => ({ ...prev, search }));
  }, [searchParams]);


  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  const resetFilters = () => {
    setFilters({ category: 'all', city: 'all', condition: 'all', search: filters.search });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => key !== 'search' && value !== 'all').length;

  const filteredItems = useMemo(() => {
    if (!allItems) return [];
    return allItems.filter(item => {
      const categoryMatch = filters.category === 'all' || item.category === filters.category;
      const cityMatch = filters.city === 'all' || item.city === filters.city;
      const conditionMatch = filters.condition === 'all' || item.condition === filters.condition;
      
      const searchMatch = filters.search === '' || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.category.toLowerCase().includes(filters.search.toLowerCase());

      return categoryMatch && cityMatch && conditionMatch && searchMatch;
    });
  }, [allItems, filters]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Explore Items</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 border-primary relative">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                   {activeFilterCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{activeFilterCount}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <ScrollArea className="h-96">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filters.category} onValueChange={(v) => handleFilterChange('category', v)} className="px-2">
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    {categories.map(c => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filters.city} onValueChange={(v) => handleFilterChange('city', v)} className="px-2">
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    {pakistaniCities.map(c => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Condition</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filters.condition} onValueChange={(v) => handleFilterChange('condition', v)} className="px-2">
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    {conditions.map(c => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                  </DropdownMenuRadioGroup>
                </ScrollArea>
                 {activeFilterCount > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                      <Button onClick={resetFilters} variant="secondary" size="sm" className="w-full">
                        <X className="mr-2 h-3.5 w-3.5" />
                        Reset Filters
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {filters.search && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} results for <strong>&quot;{filters.search}&quot;</strong>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && filteredItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredItems.map((item, index) => (
                    <ItemCard key={item.id} item={item} index={index} onSelect={() => setSelectedItem(item)} />
                ))}
            </div>
        )}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <p className="text-muted-foreground">
                {activeFilterCount > 0 || filters.search ? "No items match your criteria." : "No items have been listed yet. Be the first!"}
            </p>
          </div>
        )}
      </div>
      {selectedItem && (
        <ItemDetailDialog
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedItem(null);
            }
          }}
        />
      )}
    </>
  );
}
