
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
  
  const mainImageSrc = useMemo(() => {
    if (!item?.images?.[0]) return null;
    const src = item.images[0];
    if (src.startsWith('data:')) return src;
    const placeholder = PlaceHolderImages.find(p => p.id === src);
    return placeholder ? placeholder.imageUrl : null;
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
        <DialogContent className="max-w-4xl w-full p-0 max-h-[90vh] flex flex-col md:grid md:grid-cols-2">
            <ScrollArea className="w-full h-full md:h-auto">
              {/* Left side: Image */}
              <div className="w-full h-auto md:h-full md:rounded-l-lg overflow-hidden flex items-center justify-center bg-muted/50">
                <div className="relative aspect-square w-full">
                  {mainImageSrc ? (
                    <Image 
                      src={mainImageSrc} 
                      alt={item.title} 
                      fill 
                      className="object-contain" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Details */}
              <div className="flex flex-col p-6 h-full">
                  <DialogHeader className="mb-4 text-left">
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

                  <DialogFooter className="mt-6 pt-6 border-t sm:justify-between">
                    <div>
                      <Button 
                          variant="outline" 
                          onClick={() => onOpenChange(false)}>
                              Close
                      </Button>
                    </div>
                    {!isOwnerOfItem && (
                        <Button onClick={() => setIsSwapRequestOpen(true)} className="bg-primary hover:bg-primary/90">
                            <Send className="mr-2" />
                            Request Swap
                        </Button>
                    )}
                  </DialogFooter>
              </div>
          </ScrollArea>
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
