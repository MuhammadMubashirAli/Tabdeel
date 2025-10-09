import type { Timestamp } from 'firebase/firestore';

export type Item = {
  id?: string;
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
  createdAt: Timestamp | object;
  updatedAt: Timestamp | object;
  matchStrength?: 'Good match' | 'Mutual interest' | 'Nearby';
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  city: string;
  preferences?: string[];
  email?: string;
  createdAt?: string;
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
  id?: string;
  swapRequestId: string;
  senderId: string;
  text: string;
  createdAt: Timestamp | object;
};

export type SwapRequest = {
  id?: string;
  targetItemId: string;
  targetOwnerId: string;
  requesterId: string;
  offeredItemId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Timestamp | object;
  updatedAt: Timestamp | object;
};


export type Conversation = {
    id: string;
    participant: User;
    item: Item;
    lastMessage: Message;
    unreadCount: number;
}
