
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
  userListedItemIds: z.array(z.string()).describe('The IDs of the items listed by the user.'),
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

  You must recommend items from the provided list of all available items.
  Here is the list of all available items:
  {{{json allItems}}}

  Based on the user's interests ({{{userPreferences}}}), their location ({{{userCity}}}), and the items they have listed ({{{userListedItemIds}}}), recommend relevant items for them to barter for from the list provided.

  Consider the following factors when generating recommendations:

  *   Prioritize items where the city matches the user's city.
  *   Prioritize items with better condition (Like New > Good > Fair).
  *   Use semantic similarity to match items to the user's interests and listed items.
  *   Give extra weight to mutual swap opportunities (where the desired items of one user match the listed items of another user).

  For each recommended item, provide the item ID and a label indicating the strength of the match (e.g., \"Good match\", \"Mutual interest\", \"Nearby\").`,
});

const recommendItemsBasedOnInterestsFlow = ai.defineFlow(
  {
    name: 'recommendItemsBasedOnInterestsFlow',
    inputSchema: RecommendItemsBasedOnInterestsInputSchema,
    outputSchema: RecommendItemsBasedOnInterestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
