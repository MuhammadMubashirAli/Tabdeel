
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, User, Send } from 'lucide-react';
import type { Item } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { users } from '@/lib/data';
import { SwapRequestDialog } from './swap-request-dialog';

type ItemDetailDialogProps = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ItemDetailDialog({ item, open, onOpenChange }: ItemDetailDialogProps) {
  const [isSwapRequestOpen, setIsSwapRequestOpen] = useState(false);
  const owner = users.find(u => u.id === item.ownerId);
  const ownerAvatar = PlaceHolderImages.find(p => p.id === owner?.avatarUrl);

  const images = item.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  const conditionVariant = {
    'Like New': 'default',
    'Good': 'secondary',
    'Fair': 'outline'
  } as const;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side: Image Carousel */}
            <div className="w-full md:rounded-l-lg overflow-hidden h-[400px] md:h-auto">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-full min-h-[400px]">
                        {image && <Image src={image.imageUrl} alt={item.title} fill className="object-cover" data-ai-hint={image.imageHint} />}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-4" />
                        <CarouselNext className="absolute right-4" />
                    </>
                )}
              </Carousel>
            </div>

            {/* Right side: Details */}
            <div className="flex flex-col p-6 max-h-[90vh] md:max-h-none">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-3xl font-headline mb-2">{item.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-4" /> {item.city}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                <div className="flex items-center gap-4">
                  <Badge variant={conditionVariant[item.condition]}>{item.condition}</Badge>
                  <span className="text-sm text-muted-foreground">{item.category}</span>
                </div>

                <p className="text-foreground">{item.description}</p>
                
                <div>
                    <h4 className="font-semibold mb-2">Owner</h4>
                     {owner && (
                        <div className="flex items-center gap-3">
                            <Avatar>
                                {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} data-ai-hint={ownerAvatar.imageHint} />}
                                <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{owner.name}</p>
                                <p className="text-sm text-muted-foreground">Member since 2023</p>
                            </div>
                        </div>
                     )}
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Looking for</h4>
                    <div className="flex flex-wrap gap-2">
                        {item.desiredKeywords.split(',').map(keyword => (
                            <Badge key={keyword} variant="outline">{keyword.trim()}</Badge>
                        ))}
                    </div>
                </div>

              </div>

              <DialogFooter className="mt-6 pt-6 border-t">
                <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}>
                        Close
                </Button>
                <Button onClick={() => setIsSwapRequestOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Send className="mr-2" />
                  Request Swap
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <SwapRequestDialog
        targetItem={item}
        open={isSwapRequestOpen}
        onOpenChange={setIsSwapRequestOpen}
      />
    </>
  );
}
