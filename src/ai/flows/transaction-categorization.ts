// transaction-categorization.ts
'use server';
/**
 * @fileOverview Transaction categorization AI agent.
 *
 * - categorizeTransactions - A function that categorizes a list of transactions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionsInputSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      amount: z.number(),
      date: z.string(),
    })
  ).describe('A list of transactions to categorize.'),
});
type CategorizeTransactionsInput = z.infer<typeof CategorizeTransactionsInputSchema>;

const CategorizeTransactionsOutputSchema = z.array(
  z.object({
    id: z.string(),
    category: z.string().describe('The category of the transaction.'),
  })
);
export type CategorizeTransactionsOutput = z.infer<typeof CategorizeTransactionsOutputSchema>;

export async function categorizeTransactions(input: CategorizeTransactionsInput): Promise<CategorizeTransactionsOutput> {
  return categorizeTransactionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionsPrompt',
  input: {schema: CategorizeTransactionsInputSchema},
  output: {schema: CategorizeTransactionsOutputSchema},
  prompt: `You are a personal finance expert. Your task is to categorize a list of bank transactions into predefined categories.
  The possible categories are: market, elektronik, giyim, restoran, seyahat.
  For each transaction, determine the most appropriate category.

  Transactions:
  {{#each transactions}}
  - ID: {{id}}, Description: {{description}}, Amount: {{amount}}, Date: {{date}}
  {{/each}}

  Provide a JSON array where each object has the transaction ID and the determined category.
  Example: [{\"id\": \"transaction1\", \"category\": \"market\"}, {\"id\": \"transaction2\", \"category\": \"restoran\"}]`,
});

const categorizeTransactionsFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionsFlow',
    inputSchema: CategorizeTransactionsInputSchema,
    outputSchema: CategorizeTransactionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
