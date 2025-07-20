// src/ai/flows/spending-prediction.ts
'use server';
/**
 * @fileOverview A flow to predict a user's spending for the next month.
 *
 * - predictSpending - A function that handles the spending prediction process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictSpendingInputSchema = z.object({
  userId: z.string().describe('The ID of the user to predict spending for.'),
  transactionHistory: z.string().describe('The transaction history of the user.'),
});
type PredictSpendingInput = z.infer<typeof PredictSpendingInputSchema>;

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

  Analyze the user's transaction history. Identify regular spending patterns versus one-time, large expenditures (like wedding expenses, major electronics purchases, etc.).

  Base your prediction for the next month primarily on the user's recurring, regular spending habits. Do not let large, likely non-recurring expenses from the past month disproportionately influence the prediction. For example, if there are many wedding-related expenses this month, assume they won't happen again next month and predict a return to a more normal spending level.

  Transaction History:
  {{transactionHistory}}

  Respond with a JSON object that contains the predicted spending amount and a clear, concise explanation in Turkish of how you arrived at that prediction. The explanation should be not more than one or two sentences long and should justify why the prediction might be lower or higher than the previous month's total. For example: "Bu tahmin, düğün gibi tek seferlik büyük harcamaların gelecek ay tekrarlanmayacağı varsayımına dayanarak, düzenli harcama alışkanlıklarınız analiz edilerek oluşturulmuştur."
  `,
});

const predictSpendingFlow = ai.defineFlow(
  {
    name: 'predictSpendingFlow',
    inputSchema: PredictSpendingInputSchema,
    outputSchema: PredictSpendingOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (output) {
        output.predictedSpending = output.predictedSpending * 10;
      }
      return output!;
    } catch (e) {
        console.error("Error in spending prediction flow", e);
        return { predictedSpending: 0, explanation: "Harcama tahmini yapılırken bir hata oluştu." };
    }
  }
);
