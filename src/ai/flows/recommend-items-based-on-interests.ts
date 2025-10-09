
'use server';
/**
 * @fileOverview Recommends items to a user based on their interests and listed items.
 *
 * - recommendItemsBasedOnInterests - A function that handles the item recommendation process.
 * - RecommendItemsBasedOnInterestsInput - The input type for the recommendItemsBasedOnInterests function.
 * - RecommendItemsBasedOnInterestsOutput - The return type for the recommendItemsBasedOnInterests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItemSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  category: z.string(),
  condition: z.enum(['Like New', 'Good', 'Fair']),
  city: z.string(),
  desiredKeywords: z.string(),
  desiredCategories: z.array(z.string()),
  status: z.enum(['active', 'exchanged', 'removed']),
  ownerId: z.string(),
  createdAt: z.any(),
  updatedAt: z.any(),
  matchStrength: z.enum(['Good match', 'Mutual interest', 'Nearby']).optional(),
});


const RecommendItemsBasedOnInterestsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  userCity: z.string().describe('The city of the user.'),
  userPreferences: z.array(z.string()).describe('The categories the user is interested in.'),
  userItems: z.array(ItemSchema).describe('The items listed by the user.'),
  allItems: z.array(ItemSchema).describe('The full list of all available items to recommend from.'),
});
export type RecommendItemsBasedOnInterestsInput = z.infer<typeof RecommendItemsBasedOnInterestsInputSchema>;

const RecommendedItemSchema = z.object({
  itemId: z.string().describe('The ID of the recommended item.'),
  matchStrength: z.string().describe('A label indicating the strength of the match (e.g., \'Good match\', \'Mutual interest\', \'Nearby\').'),
});

const RecommendItemsBasedOnInterestsOutputSchema = z.array(RecommendedItemSchema);
export type RecommendItemsBasedOnInterestsOutput = z.infer<typeof RecommendItemsBasedOnInterestsOutputSchema>;

export async function recommendItemsBasedOnInterests(input: RecommendItemsBasedOnInterestsInput): Promise<RecommendItemsBasedOnInterestsOutput> {
  return recommendItemsBasedOnInterestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendItemsBasedOnInterestsPrompt',
  input: {schema: RecommendItemsBasedOnInterestsInputSchema},
  output: {schema: RecommendItemsBasedOnInterestsOutputSchema},
  prompt: `You are an expert recommendation engine for a barter marketplace.

  Your goal is to recommend items to a user. You will be given a list of all available items to choose from.
  Here is the list of all available items:
  {{{json allItems}}}

  You must make recommendations based on the current user's profile.
  - User's City: {{{userCity}}}
  - User's preferred categories: {{{json userPreferences}}}
  - User's currently listed items: {{{json userItems}}}

  Consider the following factors when generating recommendations, in order of importance:
  1.  **Mutual Interest:** Prioritize items where the other user's desired items/categories match what the current user has listed. This is the strongest signal for a good swap.
  2.  **User Preferences:** Recommend items from the user's preferred categories ({{{userPreferences}}}).
  3.  **Semantic Similarity:** Match items from the "all items" list to the user's own listed items based on description and category.
  4.  **Location:** Prefer items where the city matches the user's city ({{{userCity}}}).
  5.  **Condition:** Prefer items with a better condition (Like New > Good > Fair).

  For each recommended item, you MUST provide the item ID and a label for 'matchStrength' indicating the primary reason for the recommendation (e.g., "Mutual interest", "Good match", "Nearby"). If there are very few items to choose from, be more lenient with your recommendations to ensure the user has something to see.`,
});

const recommendItemsBasedOnInterestsFlow = ai.defineFlow(
  {
    name: 'recommendItemsBasedOnInterestsFlow',
    inputSchema: RecommendItemsBasedOnInterestsInputSchema,
    outputSchema: RecommendItemsBasedOnInterestsOutputSchema,
  },
  async input => {
    // If there are no items to recommend from, return an empty array.
    if (!input.allItems || input.allItems.length === 0) {
      return [];
    }
    const {output} = await prompt(input);
    return output || [];
  }
);

