import { ItemCard } from "@/app/components/item-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { items as allItems, categories, pakistaniCities } from "@/lib/data";
import { ListFilter } from "lucide-react";

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
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {categories.map(c => <DropdownMenuRadioItem key={c} value={c.toLowerCase()}>{c}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
               <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
               <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {pakistaniCities.map(c => <DropdownMenuRadioItem key={c} value={c.toLowerCase()}>{c}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
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
