'use server';

/**
 * @fileOverview Behavioral optimization AI agent that refines financial recommendations based on user feedback.
 *
 * - getOptimizedRecommendation - A function that generates optimized financial recommendations.
 * - BehavioralOptimizationInput - The input type for the getOptimizedRecommendation function.
 * - BehavioralOptimizationOutput - The return type for the getOptimizedRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeedbackSchema = z.object({
  recommendation: z.string().describe('The recommendation that was given.'),
  feedback: z.enum(['liked', 'disliked']).describe('The user\'s feedback on the recommendation.'),
});

const BehavioralOptimizationInputSchema = z.object({
  transactionHistory: z.string().describe('The user transaction history as a JSON string.'),
  userPreferences: z.string().describe('The user preferences.'),
  feedbackHistory: z.array(FeedbackSchema).describe('A history of previous recommendations and the user\'s feedback on them.'),
});

type BehavioralOptimizationInput = z.infer<typeof BehavioralOptimizationInputSchema>;

const BehavioralOptimizationOutputSchema = z.object({
  recommendation: z.string().describe('A new, personalized financial recommendation, optimized based on past feedback.'),
});

type BehavioralOptimizationOutput = z.infer<typeof BehavioralOptimizationOutputSchema>;

export async function getOptimizedRecommendation(input: BehavioralOptimizationInput): Promise<BehavioralOptimizationOutput> {
  return behavioralOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'behavioralOptimizationPrompt',
  input: {schema: BehavioralOptimizationInputSchema},
  output: {schema: BehavioralOptimizationOutputSchema},
  prompt: `You are a sophisticated financial advisor AI that learns from user feedback to provide increasingly personalized and effective financial advice.

  Analyze the user's transaction history, their stated preferences, and crucially, their feedback on past recommendations. Use this feedback to understand what the user finds helpful and what they dislike.

  User Preferences: {{{userPreferences}}}
  Transaction History: {{{transactionHistory}}}

  Feedback on Previous Recommendations:
  {{#each feedbackHistory}}
  - Recommendation: "{{recommendation}}"
    User Feedback: {{feedback}}
  {{else}}
  No feedback history yet.
  {{/each}}

  Based on a deep analysis of all this information, generate a new, highly relevant, and actionable financial recommendation for the user. Avoid making recommendations similar to ones the user has disliked. Double down on the types of recommendations the user has liked.`,
});

const behavioralOptimizationFlow = ai.defineFlow(
  {
    name: 'behavioralOptimizationFlow',
    inputSchema: BehavioralOptimizationInputSchema,
    outputSchema: BehavioralOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
