export type Item = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: 'Like New' | 'Good' | 'Fair';
  city: string;
  desiredKeywords: string;
  desiredCategories: string[];
  status: 'active' | 'exchanged' | 'removed';
  ownerId: string;
  createdAt: string;
  matchStrength?: 'Good match' | 'Mutual interest' | 'Nearby';
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  city: string;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  avatarImageId: string;
  quote: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type SwapRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  requestedItemId: string;
  offeredItemId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  message?: string;
};

export type Conversation = {
    id: string;
    participant: User;
    item: Item;
    lastMessage: Message;
    unreadCount: number;
}