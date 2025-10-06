
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users, items, swapRequests, conversations as initialConversations, activeConversationMessages } from "@/lib/data";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, ThumbsDown, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { Conversation, Message, SwapRequest, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";


function SwapRequestCard({ request }: { request: SwapRequest }) {
  const fromUser = users.find(u => u.id === request.fromUserId);
  const toUser = users.find(u => u.id === request.toUserId);
  const requestedItem = items.find(i => i.id === request.requestedItemId);
  const offeredItem = items.find(i => i.id === request.offeredItemId);

  const fromUserAvatar = PlaceHolderImages.find(p => p.id === fromUser?.avatarUrl);
  const requestedItemImage = PlaceHolderImages.find(p => p.id === requestedItem?.images[0]);
  const offeredItemImage = PlaceHolderImages.find(p => p.id === offeredItem?.images[0]);

  if (!fromUser || !toUser || !requestedItem || !offeredItem) return null;

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
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </p>
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
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-semibold text-sm">You Get</p>
            <div className="w-24 h-24 rounded-lg overflow-hidden relative border">
                {offeredItemImage && <Image src={offeredItemImage.imageUrl} alt={offeredItem.title} fill className="object-cover" data-ai-hint={offeredItemImage.imageHint} />}
            </div>
            <p className="text-sm font-medium truncate max-w-24">{offeredItem.title}</p>
          </div>

          <ArrowRight className="size-6 text-muted-foreground hidden md:block" />

          {/* Item You Give */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-semibold text-sm">You Give</p>
            <div className="w-24 h-24 rounded-lg overflow-hidden relative border">
                {requestedItemImage && <Image src={requestedItemImage.imageUrl} alt={requestedItem.title} fill className="object-cover" data-ai-hint={requestedItemImage.imageHint}/>}
            </div>
            <p className="text-sm font-medium truncate max-w-24">{requestedItem.title}</p>
          </div>
        </div>
      </CardContent>
      <div className="flex items-center p-4 border-t bg-muted/40">
        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
            <ThumbsDown className="mr-2" />
            Decline
        </Button>
        <Button size="sm" className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            Accept & Message
            <Check className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}


function MessagesView() {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>(activeConversationMessages);
    const currentUser = users.find(u => u.id === 'user-2');

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector('textarea[name="message"]');
        if (input instanceof HTMLTextAreaElement && input.value.trim() !== '' && currentUser) {
            const newMessage: Message = {
                id: `msg-${messages.length + 1}`,
                senderId: currentUser.id,
                text: input.value.trim(),
                timestamp: new Date().toISOString(),
            };
            setMessages([...messages, newMessage]);
            
            // Also update the last message in the conversation list
            if (selectedConversation) {
                const updatedConversations = conversations.map(c => 
                    c.id === selectedConversation.id ? { ...c, lastMessage: newMessage } : c
                );
                setConversations(updatedConversations);
            }
            input.value = '';
        }
    };
    
    // Mobile-specific view management
    const isMobileView = selectedConversation !== null;

    if (!currentUser) return null;

    return (
        <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
                {/* Conversation List - Hidden on mobile when a chat is open */}
                <div className={cn(
                    "border-r flex-col h-full",
                    isMobileView ? "hidden md:flex" : "flex"
                )}>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Your active conversations.</CardDescription>
                    </CardHeader>
                    <Separator />
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => {
                            const participantAvatar = PlaceHolderImages.find(p => p.id === convo.participant.avatarUrl);
                            return (
                                <button
                                    key={convo.id}
                                    className={cn(
                                        "flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/50",
                                        selectedConversation?.id === convo.id && "bg-muted"
                                    )}
                                    onClick={() => setSelectedConversation(convo)}
                                >
                                    <Avatar>
                                        {participantAvatar && <AvatarImage src={participantAvatar.imageUrl} alt={convo.participant.name} data-ai-hint={participantAvatar.imageHint} />}
                                        <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{convo.participant.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(convo.lastMessage.timestamp), { addSuffix: true })}</p>
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
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
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
                                {messages.map(msg => {
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
                                                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
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
                            Incoming offers for your items. Review and respond to them here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {swapRequests.length > 0 ? (
                            swapRequests.map(req => <SwapRequestCard key={req.id} request={req} />)
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">You have no new swap requests.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="messages">
                 <MessagesView />
            </TabsContent>
        </Tabs>
    </div>
  );
}
