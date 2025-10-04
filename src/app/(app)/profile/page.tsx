import { ItemCard } from "@/app/components/item-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { items as allItems, users } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Edit, MapPin } from "lucide-react";

export default function ProfilePage() {
  const user = users.find(u => u.id === 'user-2');
  const userItems = allItems.filter(item => item.ownerId === user?.id);
  const avatarImage = PlaceHolderImages.find(p => p.id === user?.avatarUrl);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
                {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={user.name} data-ai-hint={avatarImage.imageHint}/>}
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="size-4" /> {user.city}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Loves music and outdoor adventures. Looking to trade for cool tech!</p>
            </div>
            <Button variant="outline" className="ml-auto">
                <Edit className="mr-2 size-4" /> Edit Profile
            </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="listed" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="listed">Listed Items</TabsTrigger>
                <TabsTrigger value="history">Exchange History</TabsTrigger>
            </TabsList>
            <TabsContent value="listed">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {userItems.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
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
  );
}
