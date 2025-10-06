import type { Item, User, Testimonial, FaqItem, SwapRequest, Message, Conversation } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Ahmed Khan', avatarUrl: 'user-avatar-1', city: 'Karachi' },
  { id: 'user-2', name: 'Ahmed Ali', avatarUrl: 'user-avatar-2', city: 'Lahore' },
  { id: 'user-3', name: 'Zainab Begum', avatarUrl: 'user-avatar-3', city: 'Islamabad' },
];

export const items: Item[] = [
  {
    id: 'item-1',
    title: 'Vintage Leather Cricket Ball',
    description: 'A slightly used, high-quality leather cricket ball. Perfect for practice sessions. Has a great feel and seam. Minor scuffs but otherwise in excellent shape.',
    images: ['item-cricket-ball-1', 'item-cricket-ball-2'],
    category: 'Sports Equipment',
    condition: 'Good',
    city: 'Karachi',
    desiredKeywords: 'GoPro, drone, camera',
    desiredCategories: ['Electronics'],
    status: 'active',
    ownerId: 'user-1',
    createdAt: '2024-05-20T10:00:00Z',
    matchStrength: 'Good match',
  },
  {
    id: 'item-2',
    title: 'Classic acoustic guitar',
    description: 'A beautiful Yamaha acoustic guitar. Has a rich, warm tone. Comes with a soft case and some picks. One minor scratch on the back, otherwise like new.',
    images: ['item-guitar-1', 'item-guitar-2'],
    category: 'Musical Instruments',
    condition: 'Like New',
    city: 'Lahore',
    desiredKeywords: 'keyboard, PS5, gaming chair',
    desiredCategories: ['Electronics', 'Furniture'],
    status: 'active',
    ownerId: 'user-2',
    createdAt: '2024-05-21T11:30:00Z',
    matchStrength: 'Mutual interest',
  },
  {
    id: 'item-3',
    title: 'Professional Football',
    description: 'Official size 5 football. Barely used, holds air perfectly. Ideal for matches or training. Brand is Adidas.',
    images: ['item-football-1'],
    category: 'Sports Equipment',
    condition: 'Like New',
    city: 'Karachi',
    desiredKeywords: 'cricket bat, helmet',
    desiredCategories: ['Sports Equipment'],
    status: 'active',
    ownerId: 'user-3',
    createdAt: '2024-05-22T09:00:00Z',
    matchStrength: 'Nearby',
  },
  {
    id: 'item-4',
    title: 'Set of 5 Fantasy Novels',
    description: 'A collection of popular fantasy novels including works by Tolkien and George R.R. Martin. All are paperbacks and in fair condition, with some wear on the spines.',
    images: ['item-books-1'],
    category: 'Books',
    condition: 'Fair',
    city: 'Islamabad',
    desiredKeywords: 'sci-fi comics, graphic novels',
    desiredCategories: ['Books'],
    status: 'active',
    ownerId: 'user-3',
    createdAt: '2024-05-19T14:00:00Z',
  },
  {
    id: 'item-5',
    title: 'Portable Bluetooth Speaker',
    description: 'JBL Go 2 speaker in blue. Compact, waterproof, and has great sound for its size. Comes with charging cable. Battery life is still excellent.',
    images: ['item-speaker-1'],
    category: 'Electronics',
    condition: 'Good',
    city: 'Lahore',
    desiredKeywords: 'power bank, headphones, smartwatch',
    desiredCategories: ['Electronics'],
    status: 'active',
    ownerId: 'user-1',
    createdAt: '2024-05-22T15:00:00Z',
  },
  {
    id: 'item-6',
    title: 'Men\'s Hiking Backpack',
    description: 'A 50L hiking backpack, perfect for weekend trips. Lots of compartments and very comfortable. Used on a couple of treks, still in great condition.',
    images: ['item-backpack-1'],
    category: 'Outdoor Gear',
    condition: 'Good',
    city: 'Islamabad',
    desiredKeywords: 'camping tent, sleeping bag',
    desiredCategories: ['Outdoor Gear'],
    status: 'active',
    ownerId: 'user-2',
    createdAt: '2024-05-18T18:00:00Z',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Aisha R.',
    city: 'Karachi',
    avatarImageId: 'user-avatar-1',
    quote: 'Tabdeel is amazing! I swapped an old phone for a guitar I\'d always wanted. The process was so simple and safe. Highly recommend!',
  },
  {
    id: 'testimonial-2',
    name: 'Bilal S.',
    city: 'Lahore',
    avatarImageId: 'user-avatar-2',
    quote: 'Finally, a platform for pure barter in Pakistan. I cleared out so much stuff I wasn\'t using and got things I actually needed. No cash involved!',
  },
  {
    id: 'testimonial-3',
    name: 'Sana M.',
    city: 'Islamabad',
    avatarImageId: 'user-avatar-3',
    quote: 'I was hesitant at first, but the community is great. I met a nice person and exchanged my books for a lovely plant. It feels good to reuse and connect.',
  },
];

export const faqItems: FaqItem[] = [
    {
        id: 'faq-1',
        question: 'Is Tabdeel completely free?',
        answer: 'Yes, absolutely. There are no fees for listing, swapping, or messaging. We are a 100% cashless platform designed to promote community and reuse.'
    },
    {
        id: 'faq-2',
        question: 'How do I know if an item is a fair trade?',
        answer: 'Fairness is subjective and decided between the two users. Since there are no prices, you should trade for items you genuinely want and feel are a good exchange for what you are offering. Communication is key!'
    },
    {
        id: 'faq-3',
        question: 'What cities do you operate in?',
        answer: 'Tabdeel is available all across Pakistan. You can filter items by your city to find local swaps and make exchanges easier.'
    },
    {
        id: 'faq-4',
        question: 'What happens after I accept a swap request?',
        answer: 'After you accept, you should coordinate with the other person via the built-in chat to arrange a safe meeting spot and time for the exchange. Once you\'ve completed the swap, mark the item as \'Exchanged\' in your profile.'
    }
]

export const categories = [
  'Electronics',
  'Books',
  'Clothing & Accessories',
  'Home & Garden',
  'Sports Equipment',
  'Musical Instruments',
  'Outdoor Gear',
  'Toys & Games',
  'Other',
];

export const pakistaniCities = [
  "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar", "Multan", "Hyderabad", "Islamabad", "Quetta", "Sialkot", "Bahawalpur"
]

export const swapRequests: SwapRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'user-1',
    toUserId: 'user-2',
    requestedItemId: 'item-2', // Ahmed Ali's Guitar
    offeredItemId: 'item-1', // Ahmed Khan's Cricket Ball
    status: 'pending',
    createdAt: '2024-05-23T10:00:00Z',
    message: "Hey! I saw you're looking for sports gear. Would you be interested in swapping your guitar for my vintage cricket ball?",
  },
  {
    id: 'req-2',
    fromUserId: 'user-3',
    toUserId: 'user-2',
    requestedItemId: 'item-6', // Ahmed Ali's Backpack
    offeredItemId: 'item-4', // Zainab's Books
    status: 'pending',
    createdAt: '2024-05-22T18:30:00Z',
    message: "Hi, I'm interested in your hiking backpack. I have a set of fantasy novels if you're into reading.",
  }
];

const conversationMessages: Message[] = [
    { id: 'msg-1', senderId: 'user-1', text: 'Hey, is the guitar still available?', timestamp: '2024-05-24T09:00:00Z' },
    { id: 'msg-2', senderId: 'user-2', text: 'Yes it is! What are you thinking of offering?', timestamp: '2024-05-24T09:05:00Z' },
    { id: 'msg-3', senderId: 'user-1', text: 'I have a vintage leather cricket ball, interested?', timestamp: '2024-05-24T09:10:00Z' },
];

export const conversations: Conversation[] = [
    {
        id: 'conv-1',
        participant: users.find(u => u.id === 'user-1')!,
        item: items.find(i => i.id === 'item-2')!,
        lastMessage: conversationMessages[conversationMessages.length - 1],
        unreadCount: 0
    },
    {
        id: 'conv-2',
        participant: users.find(u => u.id === 'user-3')!,
        item: items.find(i => i.id === 'item-5')!,
        lastMessage: {
            id: 'msg-4',
            senderId: 'user-3',
            text: 'I can meet tomorrow to trade the speaker.',
            timestamp: '2024-05-23T18:00:00Z'
        },
        unreadCount: 2
    },
]

export const activeConversationMessages = conversationMessages;
