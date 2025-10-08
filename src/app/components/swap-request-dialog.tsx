
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Item } from '@/lib/types';
import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, serverTimestamp } from 'firebase/firestore';

type SwapRequestDialogProps = {
  targetItem: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SwapRequestDialog({ targetItem, open, onOpenChange }: SwapRequestDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userItemsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'items'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: userItems, isLoading } = useCollection<Item>(userItemsQuery);

  const handleSubmit = async () => {
    if (!selectedItemId) {
      toast({
        variant: "destructive",
        title: "No item selected",
        description: "Please choose one of your items to offer in the swap.",
      });
      return;
    }
    
    if (!firestore || !user || !targetItem.id) {
        toast({ variant: "destructive", title: "Error", description: "Cannot process request. Missing information." });
        return;
    }

    setIsSubmitting(true);

    const swapRequestData = {
      targetItemId: targetItem.id,
      targetOwnerId: targetItem.ownerId,
      requesterId: user.uid,
      offeredItemId: selectedItemId,
      message: message,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const swapRequestsCollection = collection(firestore, 'swapRequests');
    await addDocumentNonBlocking(swapRequestsCollection, swapRequestData);
    
    toast({
      title: "Request Sent!",
      description: `Your swap offer for "${targetItem.title}" has been sent.`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    setSelectedItemId(undefined);
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a Swap</DialogTitle>
          <DialogDescription>
            Offer one of your items in exchange for "{targetItem.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="item-select">Your Item to Offer</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId} disabled={isLoading}>
              <SelectTrigger id="item-select">
                <SelectValue placeholder={isLoading ? "Loading your items..." : "Select one of your items"} />
              </SelectTrigger>
              <SelectContent>
                {userItems && userItems.length > 0 ? (
                  userItems.map(item => (
                    <SelectItem key={item.id} value={item.id!}>{item.title}</SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    You have no items to offer. <br/> Please list an item first.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Add a message (optional)</Label>
            <Textarea 
              id="message" 
              placeholder="e.g. Hi! I saw your item and think we could make a great trade..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !userItems || userItems.length === 0 || isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
