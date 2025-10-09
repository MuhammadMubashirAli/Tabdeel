
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Edit, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ItemCardProps = {
  item: Item;
  index?: number;
  onSelect: () => void;
  onEdit?: () => void;
  isOwner?: boolean;
};

export function ItemCard({ item, index, onSelect, onEdit, isOwner = false }: ItemCardProps) {
  const image = PlaceHolderImages.find(p => p.id === item.images[0]);
  
  const conditionVariant = {
    'Like New': 'default',
    'Good': 'secondary',
    'Fair': 'outline'
  } as const;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent onSelect from firing if the edit button was clicked
    if ((e.target as HTMLElement).closest('[data-edit-button]')) {
      return;
    }
    onSelect();
  };

  const isEven = index !== undefined && index % 2 === 0;

  return (
    <Card 
      onClick={handleCardClick}
      className={cn(
        "w-full overflow-hidden transition-all duration-300 ease-in-out cursor-pointer",
        "hover:-translate-y-1",
        "hover-border-dance",
        "hover:shadow-[0_0_25px_hsl(var(--accent)),0_0_25px_hsl(var(--primary))]",
        isEven ? 'bg-primary/10' : 'bg-accent/10'
      )}
    >
      <div className="block">
        <div className="relative aspect-[4/3] w-full">
            {image && (
              <Image
                src={image.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={image.imageHint}
              />
            )}
            {item.matchStrength && (
                <Badge variant="destructive" className="absolute top-2 right-2 bg-accent text-accent-foreground">{item.matchStrength}</Badge>
            )}
             {isOwner && onEdit && (
                <Button 
                  data-edit-button
                  size="icon" 
                  variant="secondary"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    onEdit();
                  }}
                >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit item</span>
                </Button>
            )}
        </div>
        <CardContent className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">{item.category}</p>
            <h3 className="font-semibold text-lg truncate font-headline">{item.title}</h3>
            <div className="flex items-center justify-between text-sm">
                <Badge variant={conditionVariant[item.condition]}>{item.condition}</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{item.city}</span>
                </div>
            </div>
        </CardContent>
      </div>
    </Card>
  );
}
