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
