
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CornerDownLeft, ThumbsDown, ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { Conversation, Message, SwapRequest, User, Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, where, updateDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { conversations as initialConversations, activeConversationMessages, users } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";


function SwapRequestCard({ 
    request, 
    onAccept,
    onDecline
}: { 
    request: SwapRequest,
    onAccept: (id: string) => void,
    onDecline: (id: string) => void 
}) {
  const firestore = useFirestore();

  const fromUserRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', request.requesterId) : null, [firestore, request.requesterId]);
  const requestedItemRef = useMemoFirebase(() => firestore ? doc(firestore, 'items', request.targetItemId) : null, [firestore, request.targetItemId]);
  const offeredItemRef = useMemoFirebase(() => firestore ? doc(firestore, 'items', request.offeredItemId) : null, [firestore, request.offeredItemId]);

  const { data: fromUser, isLoading: fromUserLoading } = useDoc<User>(fromUserRef);
  const { data: requestedItem, isLoading: requestedItemLoading } = useDoc<Item>(requestedItemRef);
  const { data: offeredItem, isLoading: offeredItemLoading } = useDoc<Item>(offeredItemRef);

  const fromUserAvatar = PlaceHolderImages.find(p => p.id === fromUser?.avatarUrl);
  const requestedItemImage = requestedItem ? PlaceHolderImages.find(p => p.id === requestedItem.images[0]) : null;
  const offeredItemImage = offeredItem ? PlaceHolderImages.find(p => p.id === offeredItem.images[0]) : null;
  
  const isLoading = fromUserLoading || requestedItemLoading || offeredItemLoading;

  if (isLoading) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 bg-muted/40">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center justify-items-center gap-4">
                    <Skeleton className="h-24 w-full" />
                    <ArrowLeft className="size-6 text-muted-foreground hidden md:block rotate-180" />
                    <ArrowDown className="size-6 text-muted-foreground md:hidden" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </CardContent>
        </Card>
    )
  }

  if (!fromUser || !requestedItem || !offeredItem) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 bg-muted/40">
        <Avatar>
          {fromUserAvatar && <AvatarImage src={fromUserAvatar.imageUrl} alt={fromUser.name} data-ai-hint={fromUserAvatar.imageHint} />}
          <AvatarFallback>{fromUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="font-semibold">
            <span className="font-bold">{fromUser.name}</span> wants to swap with you
          </p>
           {request.createdAt && <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
          </p>}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {request.message && (
            <div className="relative rounded-lg border bg-background p-3">
                <p className="text-sm text-muted-foreground italic">“{request.message}”</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center justify-items-center gap-4">
          {/* Item You Get */}
          <div className="flex flex-col items-center gap-2 text-center w-full">
            <p className="font-semibold text-sm w-full text-center md:text-left">You Get</p>
             <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden relative border shrink-0">
                    {offeredItemImage && <Image src={offeredItemImage.imageUrl} alt={offeredItem.title} fill className="object-cover" data-ai-hint={offeredItemImage.imageHint} />}
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium">{offeredItem.title}</p>
                    <p className="text-xs text-muted-foreground">{offeredItem.category}</p>
                </div>
             </div>
          </div>

          {/* Desktop Arrow */}
          <ArrowLeft className="size-6 text-muted-foreground hidden md:block rotate-180" />
          {/* Mobile Arrow */}
          <ArrowDown className="size-6 text-muted-foreground md:hidden" />

          {/* Item You Give */}
          <div className="flex flex-col items-center gap-2 text-center w-full">
            <p className="font-semibold text-sm w-full text-center md:text-left">You Give</p>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden relative border shrink-0">
                    {requestedItemImage && <Image src={requestedItemImage.imageUrl} alt={requestedItem.title} fill className="object-cover" data-ai-hint={requestedItemImage.imageHint}/>}
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium">{requestedItem.title}</p>
                    <p className="text-xs text-muted-foreground">{requestedItem.category}</p>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="flex items-center p-4 border-t bg-muted/40">
        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50" onClick={() => onDecline(request.id!)}>
            <ThumbsDown className="mr-2" />
            Decline
        </Button>
        <Button size="sm" className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => onAccept(request.id!)}>
            Accept & Message
            <Check className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}


function MessagesView() {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<{[key: string]: Message[]}>({ 'conv-1': activeConversationMessages, 'conv-2': [] });
    
    const currentUser = users.find(u => u.id === 'user-2');
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);
    
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector('textarea[name="message"]');

        if (input instanceof HTMLTextAreaElement && input.value.trim() !== '' && currentUser && selectedConversation) {
            const newMessage: Message = {
                id: `msg-${Date.now()}`,
                senderId: currentUser.id,
                swapRequestId: '', // This needs to be associated with a real swap request
                text: input.value.trim(),
                createdAt: new Date(),
            };

            // Update messages for the current conversation
            setMessages(prev => ({
                ...prev,
                [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
            }));
            
            // Update the last message in the conversation list
            setConversations(prev => prev.map(c => 
                c.id === selectedConversation.id ? { ...c, lastMessage: newMessage } : c
            ));
            
            input.value = '';
        }
    };
    
    // Mobile-specific view management
    const isMobileView = selectedConversationId !== null;
    const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];

    if (!currentUser) return null;

    return (
        <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
                {/* Conversation List - Hidden on mobile when a chat is open */}
                <div className={cn(
                    "border-r flex-col h-full overflow-x-hidden",
                    isMobileView ? "hidden md:flex" : "flex"
                )}>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Your active conversations.</CardDescription>
                    </CardHeader>
                    <Separator />
                    <div className="flex-1 overflow-y-auto">
                        {conversations.sort((a, b) => new Date(b.lastMessage.createdAt as Date).getTime() - new Date(a.lastMessage.createdAt as Date).getTime()).map(convo => {
                            const participantAvatar = PlaceHolderImages.find(p => p.id === convo.participant.avatarUrl);
                            return (
                                <button
                                    key={convo.id}
                                    className={cn(
                                        "flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/50",
                                        selectedConversationId === convo.id && "bg-muted"
                                    )}
                                    onClick={() => setSelectedConversationId(convo.id)}
                                >
                                    <Avatar>
                                        {participantAvatar && <AvatarImage src={participantAvatar.imageUrl} alt={convo.participant.name} data-ai-hint={participantAvatar.imageHint} />}
                                        <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold truncate">{convo.participant.name}</p>
                                            <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">{formatDistanceToNow(new Date(convo.lastMessage.createdAt as Date), { addSuffix: true })}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
                                    </div>
                                    {convo.unreadCount > 0 && <Badge className="bg-primary text-primary-foreground">{convo.unreadCount}</Badge>}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Message View - Hidden on mobile until a chat is selected */}
                <div className={cn("flex-col h-full", isMobileView ? "flex" : "hidden md:flex")}>
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center gap-4 p-3 border-b">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversationId(null)}>
                                    <ArrowLeft />
                                </Button>
                                <Avatar>
                                    <AvatarImage src={PlaceHolderImages.find(p => p.id === selectedConversation.participant.avatarUrl)?.imageUrl} />
                                    <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selectedConversation.participant.name}</p>
                                    <p className="text-sm text-muted-foreground">Regarding: {selectedConversation.item.title}</p>
                                </div>
                            </div>
                            
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {currentMessages.map(msg => {
                                    const isSent = msg.senderId === currentUser.id;
                                    const sender = isSent ? currentUser : selectedConversation.participant;
                                    const senderAvatar = PlaceHolderImages.find(p => p.id === sender.avatarUrl);
                                    return (
                                        <div key={msg.id} className={cn("flex items-end gap-2", isSent ? "justify-end" : "justify-start")}>
                                            {!isSent && (
                                                <Avatar className="size-8">
                                                    {senderAvatar && <AvatarImage src={senderAvatar.imageUrl} alt={sender.name} data-ai-hint={senderAvatar.imageHint} />}
                                                    <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                                                isSent ? "bg-primary text-primary-foreground" : "bg-muted"
                                            )}>
                                                <p className="text-sm">{msg.text}</p>
                                                <p className={cn("text-xs mt-1", isSent ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                                    {formatDistanceToNow(new Date(msg.createdAt as Date), { addSuffix: true })}
                                                </p>
                                            </div>
                                             {isSent && (
                                                <Avatar className="size-8">
                                                    {senderAvatar && <AvatarImage src={senderAvatar.imageUrl} alt={sender.name} data-ai-hint={senderAvatar.imageHint} />}
                                                    <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t">
                                <form className="relative" onSubmit={handleSendMessage}>
                                    <Textarea
                                        name="message"
                                        placeholder="Type your message..."
                                        className="pr-16 resize-none"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e.currentTarget.form as HTMLFormElement);
                                            }
                                        }}
                                    />
                                    <Button type="submit" size="icon" className="absolute top-1/2 right-3 -translate-y-1/2">
                                        <CornerDownLeft className="size-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-col items-center justify-center h-full text-center hidden md:flex">
                            <p className="text-muted-foreground">Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

function SwapRequestsView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const swapRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'swapRequests'), 
            where('targetOwnerId', '==', user.uid),
            where('status', '==', 'pending') // Only show pending requests
        );
    }, [firestore, user]);

    const { data: swapRequests, isLoading } = useCollection<SwapRequest>(swapRequestsQuery);

    const handleUpdateRequest = async (id: string, status: 'accepted' | 'declined') => {
        if (!firestore) return;
        const requestRef = doc(firestore, 'swapRequests', id);
        try {
            await updateDoc(requestRef, { status });
            toast({
                title: `Request ${status}`,
                description: `The swap request has been ${status}.`,
            });
        } catch (error) {
            console.error(`Error updating request:`, error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update the swap request.',
            });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Swap Requests</CardTitle>
                <CardDescription>
                    Incoming offers for your items. Review and respond to them here.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                    <>
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </>
                )}
                {!isLoading && swapRequests && swapRequests.length > 0 ? (
                    swapRequests.map(req => (
                        <SwapRequestCard 
                            key={req.id} 
                            request={req}
                            onAccept={() => handleUpdateRequest(req.id!, 'accepted')}
                            onDecline={() => handleUpdateRequest(req.id!, 'declined')}
                        />
                    ))
                ) : (
                    !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You have no new swap requests.</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}


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
               <SwapRequestsView />
            </TabsContent>
            <TabsContent value="messages">
                 <MessagesView />
            </TabsContent>
        </Tabs>
    </div>
  );
}

    

    