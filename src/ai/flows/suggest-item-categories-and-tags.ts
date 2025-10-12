
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting an item category and description based on the item title and uploaded images.
 *
 * - suggestItemCategory - A function that handles the item categorization process.
 * - SuggestItemCategoryInput - The input type for the suggestItemCategory function.
 * - SuggestItemCategoryOutput - The return type for the suggestItemCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestItemCategoryInputSchema = z.object({
  title: z.string().describe('The title of the item.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  availableCategories: z.array(z.string()).describe('The list of available categories for the item.'),
});
export type SuggestItemCategoryInput = z.infer<typeof SuggestItemCategoryInputSchema>;

const SuggestItemCategoryOutputSchema = z.object({
  category: z.string().describe('The suggested category for the item.'),
  description: z.string().describe('A two-line suggested description for the item based on the image.'),
  desiredCategory: z.string().describe('A suggested category the user might want in exchange for their item.'),
});
export type SuggestItemCategoryOutput = z.infer<typeof SuggestItemCategoryOutputSchema>;

export async function suggestItemCategory(
  input: SuggestItemCategoryInput
): Promise<SuggestItemCategoryOutput> {
  return suggestItemCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemCategoryPrompt',
  input: {schema: SuggestItemCategoryInputSchema},
  output: {schema: SuggestItemCategoryOutputSchema},
  prompt: `You are an expert in item categorization and copywriting for a barter marketplace.

  Given the following item title, photo, and a list of available categories, perform the following tasks:
  1. Suggest the single most appropriate category for the item.
  2. Write a compelling, concise, two-line description for the item based on the image and title.
  3. Suggest a plausible category of items that the owner of this item might want in exchange. For example, if the item is a 'Cricket Bat', a good desired category might be 'Sports Equipment' or 'Electronics'.

  Title: {{{title}}}
  Photo: {{media url=photoDataUri}}
  
  You MUST choose one of the following categories for both the item's category and the desired category:
  {{{json availableCategories}}}

  Please provide the response in the specified JSON format.`,
});

const suggestItemCategoryFlow = ai.defineFlow(
  {
    name: 'suggestItemCategoryFlow',
    inputSchema: SuggestItemCategoryInputSchema,
    outputSchema: SuggestItemCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


