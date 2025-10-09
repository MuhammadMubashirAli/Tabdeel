
'use client';

import { useMemo, useState } from 'react';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from 'firebase/firestore';

import { ItemCard } from "@/app/components/item-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, MapPin } from "lucide-react";
import type { Item, User } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { EditProfileDialog } from '@/app/components/edit-profile-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { EditItemDialog } from '@/app/components/edit-item-dialog';
import { ItemDetailDialog } from '@/app/components/item-detail-dialog';

export default function ProfilePage() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  // Memoize the document reference for the user's profile
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  // Memoize the query for the user's items
  const userItemsQuery = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'items'), where('ownerId', '==', authUser.uid));
  }, [firestore, authUser]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);
  const { data: userItems, isLoading: areItemsLoading } = useCollection<Item>(userItemsQuery);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "AA";
    return name.split(' ').map(n => n[0]).join('');
  }
  
  const userAvatar = PlaceHolderImages.find(p => p.id === userProfile?.avatarUrl);

  const isLoading = isAuthLoading || isProfileLoading || areItemsLoading;

  const handleEditItem = (item: Item) => {
    setItemToEdit(item);
    setIsEditItemDialogOpen(true);
  };
  
  if (isLoading) {
    return (
        <div className="space-y-6">
             <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Could not load user profile. Try signing up again.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                  <AvatarImage src={userAvatar?.imageUrl || userProfile.avatarUrl} alt={userProfile.name} />
                  <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-grow">
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                      <MapPin className="size-4" /> {userProfile.city || 'City not set'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground max-w-prose">
                    {userProfile.bio || 'No bio yet. Click "Edit Profile" to add one!'}
                  </p>
              </div>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 size-4" /> Edit Profile
              </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="listed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="listed">Listed Items ({userItems?.length || 0})</TabsTrigger>
                  <TabsTrigger value="history">Exchange History</TabsTrigger>
              </TabsList>
              <TabsContent value="listed">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {userItems && userItems.length > 0 ? (
                          userItems.map((item, index) => (
                              <ItemCard 
                                key={item.id} 
                                item={item} 
                                index={index} 
                                onSelect={() => setSelectedItem(item)}
                                onEdit={() => handleEditItem(item)}
                                isOwner={true}
                              />
                          ))
                      ) : (
                           <div className="text-center py-12 col-span-full">
                              <p className="text-muted-foreground">You haven't listed any items yet.</p>
                          </div>
                      )}
                  </div>
              </TabsContent>
              <TabsContent value="history">
                   <Card>
                      <CardHeader>
                          <CardTitle>Exchange History</CardTitle>
                          <CardDescription>
                              Items you have successfully swapped.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-center py-12">
                         <p className="text-muted-foreground">You have no completed exchanges yet.</p>
                      </CardContent>
                  </Card>
              </TabsContent>
          </Tabs>
      </div>

      {userProfile && (
        <EditProfileDialog
          user={userProfile}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      {itemToEdit && (
        <EditItemDialog
          item={itemToEdit}
          open={isEditItemDialogOpen}
          onOpenChange={setIsEditItemDialogOpen}
        />
      )}

      {selectedItem && (
        <ItemDetailDialog
            item={selectedItem}
            open={!!selectedItem}
            onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}
        />
      )}
    </>
  );
}
