
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Send } from 'lucide-react';
import type { Item, User } from '@/lib/types';
import { SwapRequestDialog } from './swap-request-dialog';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';

type ItemDetailDialogProps = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ItemDetailDialog({ item, open, onOpenChange }: ItemDetailDialogProps) {
  const [isSwapRequestOpen, setIsSwapRequestOpen] = useState(false);
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const ownerRef = useMemoFirebase(() => {
    if (!firestore || !item.ownerId) return null;
    return doc(firestore, 'users', item.ownerId);
  }, [firestore, item.ownerId]);

  const { data: owner, isLoading: isOwnerLoading } = useDoc<User>(ownerRef);

  const ownerAvatarSrc = owner?.avatarUrl;
  const ownerAvatar = ownerAvatarSrc?.startsWith('data:') ? ownerAvatarSrc : PlaceHolderImages.find(p => p.id === ownerAvatarSrc)?.imageUrl;

  const images = useMemo(() => {
    if (!item?.images) return [];
    return item.images.map(imgSrc => {
      if (!imgSrc) return null;
      if (imgSrc.startsWith('data:')) {
        return imgSrc;
      }
      const placeholder = PlaceHolderImages.find(p => p.id === imgSrc);
      return placeholder ? placeholder.imageUrl : null;
    }).filter(Boolean) as string[];
  }, [item]);


  const conditionVariant = {
    'Like New': 'default',
    'Good': 'secondary',
    'Fair': 'outline'
  } as const;
  
  const isOwnerOfItem = currentUser?.uid === item.ownerId;

  const getInitials = (name: string | undefined) => name ? name.split(' ').map(n => n[0]).join('') : 'U';

  const formatTimestamp = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    // Fallback for string or number timestamps
    return new Date(timestamp);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full p-0 max-h-[90vh] flex flex-col">
          <div className="md:grid md:grid-cols-2 flex-1 min-h-0">
            {/* Left side: Image Carousel */}
            <div className="w-full md:rounded-l-lg overflow-hidden h-[300px] md:h-auto flex items-center justify-center bg-muted/50 md:sticky md:top-0">
              <Carousel className="w-full h-full max-w-md">
                <CarouselContent className="h-full">
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <CarouselItem key={index} className="flex items-center justify-center h-full">
                        <div className="relative w-full h-full">
                          {image && <Image src={image} alt={item.title} fill className="object-contain" />}
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No image available
                    </div>
                  )}
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
            <ScrollArea className="flex-1">
              <div className="flex flex-col p-6 h-full">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-3xl font-headline mb-2">{item.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-4" /> {item.city}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 flex-grow">
                  <div className="flex items-center gap-4">
                    <Badge variant={conditionVariant[item.condition]}>{item.condition}</Badge>
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                  </div>

                  <p className="text-foreground">{item.description}</p>
                  
                  <div>
                      <h4 className="font-semibold mb-2">Owner</h4>
                      {isOwnerLoading && (
                          <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className='space-y-2'>
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-3 w-32" />
                              </div>
                          </div>
                      )}
                       {owner && (
                          <div className="flex items-center gap-3">
                              <Avatar>
                                  {ownerAvatar && <AvatarImage src={ownerAvatar} alt={owner.name} />}
                                  <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-medium">{owner.name}</p>
                                  {owner.createdAt && <p className="text-sm text-muted-foreground">Member since {formatDistanceToNow(formatTimestamp(owner.createdAt), { addSuffix: true })}</p>}
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

                <DialogFooter className="mt-6 pt-6 border-t sticky bottom-0 bg-background py-4 px-6 -mx-6">
                  <Button 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}>
                          Close
                  </Button>
                  {!isOwnerOfItem && (
                      <Button onClick={() => setIsSwapRequestOpen(true)} className="bg-primary hover:bg-primary/90">
                          <Send className="mr-2" />
                          Request Swap
                      </Button>
                  )}
                </DialogFooter>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      {!isOwnerOfItem && (
        <SwapRequestDialog
          targetItem={item}
          open={isSwapRequestOpen}
          onOpenChange={setIsSwapRequestOpen}
        />
      )}
    </>
  );
}
