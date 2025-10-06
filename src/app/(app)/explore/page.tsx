import { ItemCard } from "@/app/components/item-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { items as allItems, categories, pakistaniCities } from "@/lib/data";
import type { Item } from "@/lib/types";
import { ListFilter } from "lucide-react";

const conditions: Item['condition'][] = ['Like New', 'Good', 'Fair'];

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Explore Items</h1>
        <div className="flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <ScrollArea className="h-96">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value="all" className="px-2">
                        <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                        {categories.map(c => <DropdownMenuRadioItem key={c} value={c.toLowerCase()}>{c}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value="all" className="px-2">
                        <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                        {pakistaniCities.map(c => <DropdownMenuRadioItem key={c} value={c.toLowerCase()}>{c}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Condition</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value="all" className="px-2">
                        <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                        {conditions.map(c => <DropdownMenuRadioItem key={c} value={c.toLowerCase().replace(' ', '-')}>{c}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {allItems.map((item, index) => (
          <ItemCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
