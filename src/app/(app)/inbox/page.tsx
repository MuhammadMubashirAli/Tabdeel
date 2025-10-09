
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CornerDownLeft, ThumbsDown, ArrowDown, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo, useEffect } from "react";
import type { Message, SwapRequest, User, Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, doc, query, where, serverTimestamp, orderBy, Timestamp, and, or, limit, updateDoc, addDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

function SwapRequestCard({ 
    request,
    currentUserId,
    onAccept,
    onDecline,
    onStartConversation
}: { 
    request: SwapRequest,
    currentUserId: string,
    onAccept: (id: string) => void,
    onDecline: (id: string) => void,
    onStartConversation: (id: string) => void,
}) {
  const firestore = useFirestore();
  const isReceiver = request.targetOwnerId === currentUserId;
  const otherUserId = isReceiver ? request.requesterId : request.targetOwnerId;

  const otherUserRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', otherUserId) : null, [firestore, otherUserId]);
  const requestedItemRef = useMemoFirebase(() => firestore ? doc(firestore, 'items', request.targetItemId) : null, [firestore, request.targetItemId]);
  const offeredItemRef = useMemoFirebase(() => firestore ? doc(firestore, 'items', request.offeredItemId) : null, [firestore, request.offeredItemId]);

  const { data: otherUser, isLoading: otherUserLoading } = useDoc<User>(otherUserRef);
  const { data: requestedItem, isLoading: requestedItemLoading } = useDoc<Item>(requestedItemRef);
  const { data: offeredItem, isLoading: offeredItemLoading } = useDoc<Item>(offeredItemRef);

  // Determine which item is "yours" and which is "theirs" from the current user's perspective
  const yourItem = isReceiver ? requestedItem : offeredItem;
  const theirItem = isReceiver ? offeredItem : requestedItem;
  const yourItemImage = yourItem ? PlaceHolderImages.find(p => p.id === yourItem.images[0]) : null;
  const theirItemImage = theirItem ? PlaceHolderImages.find(p => p.id === theirItem.images[0]) : null;
  
  const isLoading = otherUserLoading || requestedItemLoading || offeredItemLoading;

  if (isLoading) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-4 bg-muted/40">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-28" />
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

  if (!otherUser || !requestedItem || !offeredItem) return null;

  const statusBadgeVariant = {
      pending: 'secondary',
      accepted: 'default',
      declined: 'destructive'
  } as const;


  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 p-4 bg-muted/40">
        <div className="space-y-1">
          <p className="font-semibold text-sm">
             {isReceiver ? 'Received Request' : 'Sent Request'} {isReceiver ? 'from' : 'to'} <span className="font-bold">{otherUser.name}</span>
          </p>
           {request.createdAt && <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
          </p>}
        </div>
        <Badge variant={statusBadgeVariant[request.status]} className="capitalize">
            Request {request.status}
        </Badge>
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
                    {theirItemImage && <Image src={theirItemImage.imageUrl} alt={theirItem.title} fill className="object-cover" data-ai-hint={theirItemImage.imageHint} />}
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium">{theirItem.title}</p>
                    <p className="text-xs text-muted-foreground">{theirItem.category}</p>
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
                    {yourItemImage && <Image src={yourItemImage.imageUrl} alt={yourItem.title} fill className="object-cover" data-ai-hint={yourItemImage.imageHint}/>}
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium">{yourItem.title}</p>
                    <p className="text-xs text-muted-foreground">{yourItem.category}</p>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
      {/* --- DYNAMIC BUTTONS --- */}
      {request.status === 'pending' && isReceiver && (
          <div className="flex items-center p-4 border-t bg-muted/40">
            <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50" onClick={() => onDecline(request.id!)}>
                <ThumbsDown className="mr-2" />
                Decline
            </Button>
            <Button size="sm" className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => onAccept(request.id!)}>
                Accept
                <Check className="mr-2" />
            </Button>
          </div>
      )}
      {request.status === 'accepted' && (
          <div className="flex items-center p-4 border-t bg-muted/40 justify-end">
              <Button size="sm" onClick={() => onStartConversation(request.id!)}>
                  <MessageSquare className="mr-2" />
                  Start Conversation
              </Button>
          </div>
      )}
    </Card>
  );
}


function ConversationListItem({ 
    conversation, 
    onClick, 
    isSelected,
    currentUserId
}: { 
    conversation: SwapRequest, 
    onClick: () => void, 
    isSelected: boolean,
    currentUserId: string
}) {
    const firestore = useFirestore();
    
    // Correctly determine the other user's ID
    const otherUserId = currentUserId === conversation.requesterId ? conversation.targetOwnerId : conversation.requesterId;

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
                <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || "Swap request accepted. Start chatting!"}</p>
            </div>
        </button>
    )
}

function MessagesView({
    selectedConversationId,
    setSelectedConversationId,
}: {
    selectedConversationId: string | null;
    setSelectedConversationId: (id: string | null) => void;
}) {
    const { user: authUser } = useUser();
    const firestore = useFirestore();
    const [conversations, setConversations] = useState<SwapRequest[]>([]);
    const [conversationsLoading, setConversationsLoading] = useState(true);

    // Get full user profile from 'users' collection
    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !authUser) return null;
        return doc(firestore, 'users', authUser.uid);
    }, [firestore, authUser]);
    const { data: currentUser, isLoading: isUserLoading } = useDoc<User>(userProfileRef);

    // --- NEW QUERIES ---
    // 1. Fetch accepted swap requests where the user is the requester
    const sentConversationsQuery = useMemoFirebase(() => {
        if (!authUser || !firestore) return null;
        return query(
            collection(firestore, 'swapRequests'),
            where('status', '==', 'accepted'),
            where('requesterId', '==', authUser.uid)
        );
    }, [authUser, firestore]);
    const { data: sentConversations, isLoading: sentLoading } = useCollection<SwapRequest>(sentConversationsQuery);

    // 2. Fetch accepted swap requests where the user is the target
    const receivedConversationsQuery = useMemoFirebase(() => {
        if (!authUser || !firestore) return null;
        return query(
            collection(firestore, 'swapRequests'),
            where('status', '==', 'accepted'),
            where('targetOwnerId', '==', authUser.uid)
        );
    }, [authUser, firestore]);
    const { data: receivedConversations, isLoading: receivedLoading } = useCollection<SwapRequest>(receivedConversationsQuery);
    
    // 3. Combine and sort the conversations
    useEffect(() => {
        setConversationsLoading(sentLoading || receivedLoading);
        if (sentConversations && receivedConversations) {
            const allConversations = [...sentConversations, ...receivedConversations];
            const uniqueConversations = Array.from(new Map(allConversations.map(item => [item.id, item])).values());
            uniqueConversations.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
            setConversations(uniqueConversations);
        } else if (sentConversations) {
             setConversations(sentConversations.sort((a,b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0)));
        } else if (receivedConversations) {
             setConversations(receivedConversations.sort((a,b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0)));
        }
         else {
            setConversations([]);
        }
    }, [sentConversations, receivedConversations, sentLoading, receivedLoading]);


    // Fetch messages for the selected conversation
    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !selectedConversationId) return null;
        return query(
            collection(firestore, 'swapRequests', selectedConversationId, 'messages'),
            orderBy('createdAt', 'asc')
        );
    }, [firestore, selectedConversationId]);

    const { data: messages, isLoading: messagesLoading } = useCollection<Message>(messagesQuery);
    const selectedConversation = useMemo(() => conversations?.find(c => c.id === selectedConversationId), [conversations, selectedConversationId]);
    
    // Fetch details for the selected conversation (other user and items)
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

    const handleSendMessage = async (form: HTMLFormElement) => {
        const input = form.querySelector('textarea[name="message"]');

        if (input instanceof HTMLTextAreaElement && input.value.trim() !== '' && authUser && selectedConversationId && firestore) {
            const messagesCollection = collection(firestore, 'swapRequests', selectedConversationId, 'messages');
            const newMessage: Omit<Message, 'id'|'createdAt'> = {
                senderId: authUser.uid,
                swapRequestId: selectedConversationId,
                text: input.value.trim(),
            };
            
            const messageData = { ...newMessage, createdAt: serverTimestamp() };
            
            // Also update the parent swapRequest's updatedAt field
            const swapRequestRef = doc(firestore, 'swapRequests', selectedConversationId);
            
            await addDoc(messagesCollection, messageData);
            await updateDoc(swapRequestRef, { updatedAt: serverTimestamp() });

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
                                currentUserId={authUser!.uid}
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

function SwapRequestsView({ 
    setActiveTab, 
    setSelectedConversationId 
} : {
    setActiveTab: (tab: 'requests' | 'messages') => void;
    setSelectedConversationId: (id: string) => void;
}) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Query for requests where the user is the receiver
    const receivedRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'swapRequests'), where('targetOwnerId', '==', user.uid));
    }, [firestore, user]);

    // Query for requests where the user is the sender
    const sentRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'swapRequests'), where('requesterId', '==', user.uid));
    }, [firestore, user]);

    const { data: receivedRequests, isLoading: receivedLoading } = useCollection<SwapRequest>(receivedRequestsQuery);
    const { data: sentRequests, isLoading: sentLoading } = useCollection<SwapRequest>(sentRequestsQuery);

    useEffect(() => {
        setIsLoading(receivedLoading || sentLoading);
        if (receivedRequests && sentRequests) {
            const allRequests = [...receivedRequests, ...sentRequests];
            const uniqueRequests = Array.from(new Map(allRequests.map(item => [item.id, item])).values());
            uniqueRequests.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
            setSwapRequests(uniqueRequests);
        } else if (receivedRequests) {
            setSwapRequests(receivedRequests.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
        } else if (sentRequests) {
            setSwapRequests(sentRequests.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
        } else {
            setSwapRequests([]);
        }

    }, [receivedRequests, sentRequests, receivedLoading, sentLoading]);
    
    const handleUpdateRequest = async (id: string, status: 'accepted' | 'declined') => {
        if (!firestore) return;
        const requestRef = doc(firestore, 'swapRequests', id);
        try {
            await updateDoc(requestRef, { status, updatedAt: serverTimestamp() });
            
            if (status === 'accepted') {
                toast({
                    title: `Request Accepted!`,
                    description: `The swap request has been accepted. You can now start a conversation.`,
                });
            } else {
                 toast({
                    title: `Request Declined`,
                    description: `The swap request has been declined.`,
                });
            }
        } catch (error) {
            console.error(`Error updating request:`, error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update the swap request.',
            });
        }
    };
    
    const handleStartConversation = (id: string) => {
        setActiveTab('messages');
        setSelectedConversationId(id);
    }

    if (!user) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Swap Requests</CardTitle>
                    <CardDescription>
                        All your sent and received swap requests.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Please log in to see your requests.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Swap Requests</CardTitle>
                <CardDescription>
                    All your sent and received swap requests.
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
                            currentUserId={user!.uid}
                            onAccept={(id) => handleUpdateRequest(id, 'accepted')}
                            onDecline={(id) => handleUpdateRequest(id, 'declined')}
                            onStartConversation={handleStartConversation}
                        />
                    ))
                ) : (
                    !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You have no swap requests yet.</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}


export default function InboxPage() {
  const { user, isUserLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'requests' | 'messages'>('requests');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  if (isUserLoading) {
      return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages & Requests</h1>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'requests' | 'messages')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
               <SwapRequestsView setActiveTab={setActiveTab} setSelectedConversationId={setSelectedConversationId} />
            </TabsContent>
            <TabsContent value="messages">
                 <MessagesView selectedConversationId={selectedConversationId} setSelectedConversationId={setSelectedConversationId} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
