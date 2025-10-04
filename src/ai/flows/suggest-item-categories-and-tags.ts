'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting item categories and tags based on the item description and uploaded images.
 *
 * - suggestItemCategoriesAndTags - A function that handles the item categorization and tagging process.
 * - SuggestItemCategoriesAndTagsInput - The input type for the suggestItemCategoriesAndTags function.
 * - SuggestItemCategoriesAndTagsOutput - The return type for the suggestItemCategoriesAndTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestItemCategoriesAndTagsInputSchema = z.object({
  description: z.string().describe('The description of the item.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestItemCategoriesAndTagsInput = z.infer<typeof SuggestItemCategoriesAndTagsInputSchema>;

const SuggestItemCategoriesAndTagsOutputSchema = z.object({
  category: z.string().describe('The suggested category for the item.'),
  tags: z.array(z.string()).describe('The suggested tags for the item.'),
});
export type SuggestItemCategoriesAndTagsOutput = z.infer<typeof SuggestItemCategoriesAndTagsOutputSchema>;

export async function suggestItemCategoriesAndTags(
  input: SuggestItemCategoriesAndTagsInput
): Promise<SuggestItemCategoriesAndTagsOutput> {
  return suggestItemCategoriesAndTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemCategoriesAndTagsPrompt',
  input: {schema: SuggestItemCategoriesAndTagsInputSchema},
  output: {schema: SuggestItemCategoriesAndTagsOutputSchema},
  prompt: `You are an expert in item categorization and tagging.

  Given the following item description and photo, suggest a category and a list of tags for the item.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}

  Please provide the category and tags in the following JSON format:
  {
    "category": "suggested category",
    "tags": ["tag1", "tag2", "tag3"]
  }`,
});

const suggestItemCategoriesAndTagsFlow = ai.defineFlow(
  {
    name: 'suggestItemCategoriesAndTagsFlow',
    inputSchema: SuggestItemCategoriesAndTagsInputSchema,
    outputSchema: SuggestItemCategoriesAndTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
