
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CornerDownLeft, ThumbsDown, ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo } from "react";
import type { Message, SwapRequest, User, Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, where, serverTimestamp, or, orderBy, Timestamp, and, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
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


function ConversationListItem({ 
    conversation, 
    onClick, 
    isSelected,
    currentUser
}: { 
    conversation: SwapRequest, 
    onClick: () => void, 
    isSelected: boolean,
    currentUser: User
}) {
    const firestore = useFirestore();
    const { user: authUser } = useUser();
    
    // Correctly determine the other user's ID
    const otherUserId = authUser?.uid === conversation.requesterId ? conversation.targetOwnerId : conversation.requesterId;

    const otherUserRef = useMemoFirebase(() => firestore && otherUserId ? doc(firestore, 'users', otherUserId) : null, [firestore, otherUserId]);
    const { data: otherUser, isLoading: isUserLoading } = useDoc<User>(otherUserRef);

    const lastMessageQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'swapRequests', conversation.id!, 'messages'),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
    }, [firestore, conversation.id]);

    const { data: lastMessageArr } = useCollection<Message>(lastMessageQuery);
    const lastMessage = lastMessageArr?.[0];

    if (isUserLoading) {
        return (
             <div className="flex items-start gap-4 p-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </div>
        );
    }
    
    if (!otherUser) {
        return null; // Or some fallback UI
    }
    
    const participantAvatar = PlaceHolderImages.find(p => p.id === otherUser.avatarUrl);
    
    return (
        <button
            key={conversation.id}
            className={cn(
                "flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/50",
                isSelected && "bg-muted"
            )}
            onClick={onClick}
        >
            <Avatar>
                {participantAvatar && <AvatarImage src={participantAvatar.imageUrl} alt={otherUser.name} data-ai-hint={participantAvatar.imageHint} />}
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{otherUser.name}</p>
                    {lastMessage?.createdAt && (
                        <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                           {formatDistanceToNow((lastMessage.createdAt as Timestamp).toDate(), { addSuffix: true })}
                        </p>
                    )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || "Accepted swap request."}</p>
            </div>
        </button>
    )
}

function MessagesView() {
    const { user: authUser } = useUser();
    const firestore = useFirestore();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    // Get full user profile from 'users' collection
    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !authUser) return null;
        return doc(firestore, 'users', authUser.uid);
    }, [firestore, authUser]);
    const { data: currentUser, isLoading: isUserLoading } = useDoc<User>(userProfileRef);


    // 1. Fetch all accepted swap requests where the current user is involved
    const conversationsQuery = useMemoFirebase(() => {
        if (!authUser || !firestore) return null;
        return query(
            collection(firestore, 'swapRequests'),
            and(
                where('status', '==', 'accepted'),
                or(
                    where('requesterId', '==', authUser.uid),
                    where('targetOwnerId', '==', authUser.uid)
                )
            )
        );
    }, [authUser, firestore]);
    
    const { data: conversations, isLoading: conversationsLoading } = useCollection<SwapRequest>(conversationsQuery);
    
    // 2. Fetch messages for the selected conversation
    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !selectedConversationId) return null;
        return query(
            collection(firestore, 'swapRequests', selectedConversationId, 'messages'),
            orderBy('createdAt', 'asc')
        );
    }, [firestore, selectedConversationId]);

    const { data: messages, isLoading: messagesLoading } = useCollection<Message>(messagesQuery);
    const selectedConversation = useMemo(() => conversations?.find(c => c.id === selectedConversationId), [conversations, selectedConversationId]);
    
    // 3. Fetch details for the selected conversation (other user and items)
    const otherUserId = useMemo(() => {
      if (!selectedConversation || !authUser) return null;
      return selectedConversation.requesterId === authUser.uid ? selectedConversation.targetOwnerId : selectedConversation.requesterId;
    }, [selectedConversation, authUser]);

    const otherUserRef = useMemoFirebase(() => firestore && otherUserId ? doc(firestore, 'users', otherUserId) : null, [firestore, otherUserId]);
    const { data: otherUser } = useDoc<User>(otherUserRef);

    const targetItemRef = useMemoFirebase(() => firestore && selectedConversation ? doc(firestore, 'items', selectedConversation.targetItemId) : null, [firestore, selectedConversation]);
    const { data: targetItem } = useDoc<Item>(targetItemRef);
    
    const offeredItemRef = useMemoFirebase(() => firestore && selectedConversation ? doc(firestore, 'items', selectedConversation.offeredItemId) : null, [firestore, selectedConversation]);
    const { data: offeredItem } = useDoc<Item>(offeredItemRef);

    const handleSendMessage = (form: HTMLFormElement) => {
        const input = form.querySelector('textarea[name="message"]');

        if (input instanceof HTMLTextAreaElement && input.value.trim() !== '' && authUser && selectedConversationId && firestore) {
            const messagesCollection = collection(firestore, 'swapRequests', selectedConversationId, 'messages');
            const newMessage: Omit<Message, 'id' | 'createdAt'> = {
                senderId: authUser.uid,
                swapRequestId: selectedConversationId,
                text: input.value.trim(),
                createdAt: serverTimestamp(),
            };
            
            addDocumentNonBlocking(messagesCollection, newMessage);
            input.value = '';
        }
    };
    
    const isMobileChatView = selectedConversationId !== null;

    if (conversationsLoading || isUserLoading || !currentUser) {
        return (
            <Card className="h-[calc(100vh-200px)] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
                    <div className="border-r h-full overflow-y-auto p-4 space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                     <div className="hidden md:flex flex-col items-center justify-center h-full">
                        <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
                {/* Conversation List - Hidden on mobile when a chat is open */}
                <div className={cn(
                    "border-r flex-col h-full overflow-x-hidden",
                    isMobileChatView ? "hidden md:flex" : "flex"
                )}>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Your active conversations.</CardDescription>
                    </CardHeader>
                    <Separator />
                    <div className="flex-1 overflow-y-auto">
                        {conversations && conversations.length > 0 ? conversations.map(convo => (
                            <ConversationListItem 
                                key={convo.id}
                                conversation={convo}
                                onClick={() => setSelectedConversationId(convo.id!)}
                                isSelected={selectedConversationId === convo.id}
                                currentUser={currentUser}
                            />
                        )) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">No active conversations.</div>
                        )}
                    </div>
                </div>

                {/* Message View - Hidden on mobile until a chat is selected */}
                <div className={cn("flex-col h-full", isMobileChatView ? "flex" : "hidden md:flex")}>
                    {selectedConversation && otherUser && targetItem && offeredItem ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center gap-4 p-3 border-b">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversationId(null)}>
                                    <ArrowLeft />
                                </Button>
                                <Avatar>
                                    <AvatarImage src={PlaceHolderImages.find(p => p.id === otherUser.avatarUrl)?.imageUrl} />
                                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{otherUser.name}</p>
                                    <p className="text-sm text-muted-foreground">Regarding: {selectedConversation.requesterId === authUser?.uid ? targetItem.title : offeredItem.title}</p>
                                </div>
                            </div>
                            
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messagesLoading && <div className="text-center text-muted-foreground">Loading messages...</div>}
                                {messages && messages.map(msg => {
                                    const isSent = msg.senderId === authUser?.uid;
                                    const sender = isSent ? currentUser : otherUser;
                                    const senderAvatar = PlaceHolderImages.find(p => p.id === (sender?.avatarUrl));
                                    return (
                                        <div key={msg.id} className={cn("flex items-end gap-2", isSent ? "justify-end" : "justify-start")}>
                                            {!isSent && (
                                                <Avatar className="size-8">
                                                    {senderAvatar && <AvatarImage src={senderAvatar.imageUrl} alt={sender.name!} data-ai-hint={senderAvatar.imageHint} />}
                                                    <AvatarFallback>{sender.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                                                isSent ? "bg-primary text-primary-foreground" : "bg-muted"
                                            )}>
                                                <p className="text-sm">{msg.text}</p>
                                                {msg.createdAt && <p className={cn("text-xs mt-1", isSent ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                                     {formatDistanceToNow((msg.createdAt as Timestamp).toDate(), { addSuffix: true })}
                                                </p>}
                                            </div>
                                             {isSent && (
                                                <Avatar className="size-8">
                                                    {senderAvatar && <AvatarImage src={senderAvatar.imageUrl} alt={sender.name!} data-ai-hint={senderAvatar.imageHint} />}
                                                    <AvatarFallback>{sender.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t">
                                <form className="relative" onSubmit={(e) => { e.preventDefault(); handleSendMessage(e.currentTarget); }}>
                                    <Textarea
                                        name="message"
                                        placeholder="Type your message..."
                                        className="pr-16 resize-none"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                const form = e.currentTarget.form as HTMLFormElement;
                                                if (form) handleSendMessage(form);
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
            // Non-blocking update
            updateDocumentNonBlocking(requestRef, { status, updatedAt: serverTimestamp() });
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
  const { user, isUserLoading } = useUser();
  if (isUserLoading) {
      return <div>Loading...</div>
  }

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

    

    