'use server';

/**
 * @fileOverview AI agent for providing personalized micro financial suggestions based on user spending behavior.
 *
 * - getFinancialRecommendation - A function that generates financial recommendations.
 * - FinancialRecommendationInput - The input type for the getFinancialRecommendation function.
 * - FinancialRecommendationOutput - The return type for the getFinancialRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialRecommendationInputSchema = z.object({
  transactionHistory: z.string().describe('The user transaction history.'),
  userPreferences: z.string().describe('The user preferences.'),
});

export type FinancialRecommendationInput = z.infer<typeof FinancialRecommendationInputSchema>;

export const FinancialRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('A personalized financial recommendation.'),
});

export type FinancialRecommendationOutput = z.infer<typeof FinancialRecommendationOutputSchema>;

export async function getFinancialRecommendation(input: FinancialRecommendationInput): Promise<FinancialRecommendationOutput> {
  return financialRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialRecommendationPrompt',
  input: {schema: FinancialRecommendationInputSchema},
  output: {schema: FinancialRecommendationOutputSchema},
  prompt: `You are a financial advisor providing personalized micro financial suggestions to users based on their spending behavior and preferences.

  Analyze the following transaction history and user preferences to generate a relevant financial recommendation.

  Transaction History: {{{transactionHistory}}}
  User Preferences: {{{userPreferences}}}

  Based on this information, what is the single best financial recommendation for the user?`,
});

const financialRecommendationFlow = ai.defineFlow(
  {
    name: 'financialRecommendationFlow',
    inputSchema: FinancialRecommendationInputSchema,
    outputSchema: FinancialRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
