
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting a desired item category based on keywords.
 *
 * - suggestDesiredCategory - A function that handles the desired category suggestion process.
 * - SuggestDesiredCategoryInput - The input type for the suggestDesiredCategory function.
 * - SuggestDesiredCategoryOutput - The return type for the suggestDesiredCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDesiredCategoryInputSchema = z.object({
  keywords: z.string().describe('A comma-separated string of keywords describing items the user wants.'),
  availableCategories: z.array(z.string()).describe('The list of available categories to choose from.'),
});
export type SuggestDesiredCategoryInput = z.infer<typeof SuggestDesiredCategoryInputSchema>;

const SuggestDesiredCategoryOutputSchema = z.object({
    desiredCategory: z.string().describe('The single best-fitting category from the available list based on the keywords.')
});
export type SuggestDesiredCategoryOutput = z.infer<typeof SuggestDesiredCategoryOutputSchema>;


export async function suggestDesiredCategory(
  input: SuggestDesiredCategoryInput
): Promise<SuggestDesiredCategoryOutput> {
  return suggestDesiredCategoryFlow(input);
}


const prompt = ai.definePrompt({
  name: 'suggestDesiredCategoryPrompt',
  input: {schema: SuggestDesiredCategoryInputSchema},
  output: {schema: SuggestDesiredCategoryOutputSchema},
  prompt: `You are an expert in item categorization for a barter marketplace.

  A user has provided the following keywords for items they wish to receive in a trade:
  "{{{keywords}}}"

  Your task is to suggest the single most appropriate category for these desired items. You MUST choose one of the following available categories:
  {{{json availableCategories}}}

  Provide the response in the specified JSON format.`,
});


const suggestDesiredCategoryFlow = ai.defineFlow(
  {
    name: 'suggestDesiredCategoryFlow',
    inputSchema: SuggestDesiredCategoryInputSchema,
    outputSchema: SuggestDesiredCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
