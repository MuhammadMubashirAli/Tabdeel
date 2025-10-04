import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InboxPage() {
  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages & Requests</h1>
        <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
                <Card>
                    <CardHeader>
                        <CardTitle>Swap Requests</CardTitle>
                        <CardDescription>
                            Incoming offers for your items.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-center py-12">
                       <p className="text-muted-foreground">You have no new swap requests.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="messages">
                 <Card>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>
                            Your ongoing conversations about swaps.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-center py-12">
                       <p className="text-muted-foreground">You have no new messages.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
