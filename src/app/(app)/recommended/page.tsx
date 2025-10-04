import { ItemCard } from "@/app/components/item-card";
import { items as allItems } from "@/lib/data";

export default function RecommendedPage() {
    const recommendedItems = allItems.filter(item => item.matchStrength);

  return (
    <div className="space-y-6">
       <div className="space-y-2">
            <h1 className="text-3xl font-bold">Recommended For You</h1>
            <p className="text-muted-foreground">AI-powered recommendations based on your items and interests.</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {recommendedItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
