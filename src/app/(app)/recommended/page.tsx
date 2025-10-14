
'use client';

import { useState, useEffect } from 'react';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, getDocs, Timestamp } from 'firebase/firestore';

import { ItemCard } from '@/app/components/item-card';
import { ItemDetailDialog } from '@/app/components/item-detail-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Item, User } from '@/lib/types';
import { recommendItemsBasedOnInterests } from '@/ai/flows/recommend-items-based-on-interests';

// Helper to convert Firestore Timestamps to ISO strings safely
const serializeItems = (items: Item[]): Item[] => {
  return items.map(item => {
    const newItem = { ...item };
    if (newItem.createdAt && newItem.createdAt instanceof Timestamp) {
      newItem.createdAt = newItem.createdAt.toDate().toISOString() as any;
    }
    if (newItem.updatedAt && newItem.updatedAt instanceof Timestamp) {
      newItem.updatedAt = newItem.updatedAt.toDate().toISOString() as any;
    }
    return newItem;
  });
};

export default function RecommendedPage() {
  const { user: authUser, isUserLoading: isAuthUserLoading } = useUser();
  const firestore = useFirestore();

  const [recommendedItems, setRecommendedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // 1. Get current user's profile
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);

  // 2. Get current user's listed items
  const userItemsQuery = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'items'), where('ownerId', '==', authUser.uid), where('status', '==', 'active'));
  }, [firestore, authUser]);
  const { data: userItems, isLoading: areUserItemsLoading } = useCollection<Item>(userItemsQuery);

  useEffect(() => {
    const getRecommendations = async () => {
      if (!firestore || !authUser || !userProfile || userItems === null) {
        return;
      }
      
      setIsLoading(true);

      try {
        // 3. Get all active items, then filter client-side
        const allItemsQuery = query(
            collection(firestore, 'items'), 
            where('status', '==', 'active')
        );
        const allItemsSnapshot = await getDocs(allItemsQuery);
        const allItems = allItemsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Item))
            .filter(item => item.ownerId !== authUser.uid); // Filter client-side

        if (allItems.length === 0) {
            setRecommendedItems([]);
            setIsLoading(false);
            return;
        }

        // Serialize data before sending to the server action
        const serializableUserItems = serializeItems(userItems || []);
        const serializableAllItems = serializeItems(allItems);

        // 4. Call AI flow
        const aiRecommendations = await recommendItemsBasedOnInterests({
          userId: authUser.uid,
          userCity: userProfile.city,
          userPreferences: userProfile.preferences || [],
          userItems: serializableUserItems,
          allItems: serializableAllItems,
        });

        // 5. Filter and set recommended items
        const recommendedItemsMap = new Map(aiRecommendations.map(rec => [rec.itemId, rec.matchStrength]));
        
        const finalRecommendedItems = allItems
            .filter(item => recommendedItemsMap.has(item.id!))
            .map(item => ({
                ...item,
                matchStrength: recommendedItemsMap.get(item.id!) as Item['matchStrength'],
            }));
            
        setRecommendedItems(finalRecommendedItems);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthUserLoading && !isProfileLoading && !areUserItemsLoading) {
      getRecommendations();
    }
  }, [firestore, authUser, userProfile, userItems, isAuthUserLoading, isProfileLoading, areUserItemsLoading]);
  
  const showLoadingSkeleton = isLoading || isAuthUserLoading || isProfileLoading || areUserItemsLoading;

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Recommended For You</h1>
          <p className="text-muted-foreground">AI-powered recommendations based on your items and interests.</p>
        </div>
        
        {showLoadingSkeleton && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!showLoadingSkeleton && recommendedItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {recommendedItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} onSelect={() => setSelectedItem(item)} />
            ))}
          </div>
        )}

        {!showLoadingSkeleton && recommendedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recommendations for you yet. List more items to get started!</p>
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
