
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Item } from '@/lib/types';
import { items as allItems } from '@/lib/data';
import { useState } from 'react';

type SwapRequestDialogProps = {
  targetItem: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// This should be dynamically determined by the logged-in user
const CURRENT_USER_ID = 'user-2'; 

export function SwapRequestDialog({ targetItem, open, onOpenChange }: SwapRequestDialogProps) {
  const { toast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [message, setMessage] = useState('');

  // Filter for items owned by the current user, excluding the item they are requesting
  const userItems = allItems.filter(item => item.ownerId === CURRENT_USER_ID && item.id !== targetItem.id);

  const handleSubmit = () => {
    if (!selectedItemId) {
      toast({
        variant: "destructive",
        title: "No item selected",
        description: "Please choose one of your items to offer in the swap.",
      });
      return;
    }
    
    // In a real app, this would trigger an API call to save the swap request.
    console.log({
      fromUserId: CURRENT_USER_ID,
      toUserId: targetItem.ownerId,
      requestedItemId: targetItem.id,
      offeredItemId: selectedItemId,
      message,
    });
    
    toast({
      title: "Request Sent!",
      description: `Your swap offer for "${targetItem.title}" has been sent.`,
    });
    
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
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger id="item-select">
                <SelectValue placeholder="Select one of your items" />
              </SelectTrigger>
              <SelectContent>
                {userItems.length > 0 ? (
                  userItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
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
          <Button onClick={handleSubmit} disabled={userItems.length === 0}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
