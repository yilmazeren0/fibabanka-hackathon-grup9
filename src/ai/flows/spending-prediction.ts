// src/ai/flows/spending-prediction.ts
'use server';
/**
 * @fileOverview A flow to predict a user's spending for the next month.
 *
 * - predictSpending - A function that handles the spending prediction process.
 * - PredictSpendingInput - The input type for the predictSpending function.
 * - PredictSpendingOutput - The return type for the predictSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictSpendingInputSchema = z.object({
  userId: z.string().describe('The ID of the user to predict spending for.'),
  transactionHistory: z.string().describe('The transaction history of the user.'),
});
export type PredictSpendingInput = z.infer<typeof PredictSpendingInputSchema>;

const PredictSpendingOutputSchema = z.object({
  predictedSpending: z.number().describe('Gelecek ay için tahmin edilen harcama.'),
  explanation: z.string().describe('Tahminin nasıl yapıldığına dair bir açıklama.'),
});
export type PredictSpendingOutput = z.infer<typeof PredictSpendingOutputSchema>;

export async function predictSpending(input: PredictSpendingInput): Promise<PredictSpendingOutput> {
  return predictSpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSpendingPrompt',
  input: {schema: PredictSpendingInputSchema},
  output: {schema: PredictSpendingOutputSchema},
  prompt: `You are a financial advisor who predicts future spending based on past transaction history.

  Given the following transaction history for a user, predict their spending for the next month and explain your reasoning.

  Transaction History:
  {{transactionHistory}}

  Respond with a JSON object that contains the predicted spending amount and a clear, concise explanation in Turkish of how you arrived at that prediction. The explanation should not be more than one sentence long.
  `,
});

const predictSpendingFlow = ai.defineFlow(
  {
    name: 'predictSpendingFlow',
    inputSchema: PredictSpendingInputSchema,
    outputSchema: PredictSpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
