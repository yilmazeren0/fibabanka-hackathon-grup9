'use server';
/**
 * @fileOverview Detects life events from transaction history and offers tailored loan options.
 *
 * - detectLifeEvent - A function that handles the life event detection process.
 * - LifeEventDetectionInput - The input type for the detectLifeEvent function.
 * - LifeEventDetectionOutput - The return type for the detectLifeEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LifeEventDetectionInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe('The transaction history of the user as a JSON string.'),
  userId: z.string().describe('The ID of the user.'),
});
export type LifeEventDetectionInput = z.infer<typeof LifeEventDetectionInputSchema>;

const LoanOfferSchema = z.object({
  bank: z.string().describe('The name of the bank offering the loan.'),
  eventType: z.string().describe('The type of life event the loan is tailored for.'),
  offerDetails: z.string().describe('Details of the loan offer, including interest rates and terms.'),
  isRecommended: z.boolean().describe('Whether this offer is the recommended one among the options.'),
});

const LifeEventDetectionOutputSchema = z.object({
  lifeEvent: z
    .string()
    .nullable()
    .describe('The detected life event, if any (e.g., Moving, New Car, Wedding). If no event is detected, return null.'),
  loanOffers: z.array(LoanOfferSchema).describe('Tailored loan offers based on the detected life event. The most advantageous offer should have isRecommended set to true.'),
});
export type LifeEventDetectionOutput = z.infer<typeof LifeEventDetectionOutputSchema>;

export async function detectLifeEvent(input: LifeEventDetectionInput): Promise<LifeEventDetectionOutput> {
  return detectLifeEventFlow(input);
}

const detectLifeEventPrompt = ai.definePrompt({
  name: 'detectLifeEventPrompt',
  input: {schema: LifeEventDetectionInputSchema},
  output: {schema: LifeEventDetectionOutputSchema},
  prompt: `You are an AI agent that analyzes a user's transaction history to detect potential life events and suggest relevant loan offers.

  Analyze the following transaction history for user ID {{{userId}}} and detect any significant life events.

  Transaction History:
  {{{transactionHistory}}}

  Possible life events to detect include, but are not limited to:
  - Moving to a new location (e.g., rental deposits, moving company charges, new furniture)
  - Purchasing a new car (e.g., down payments, car-related services)
  - Planning a wedding (e.g., payments to venues, photographers, caterers)
  - Having a baby (e.g., purchases from baby stores, hospital bills)
  - Starting a new job (e.g., changes in salary deposit patterns)

  If a life event is detected, generate relevant loan offers from the available banks: Fibabanka, Abank, and Bbank. Each bank should provide a competitive but slightly different offer (e.g., different interest rates, terms).
  
  Critically evaluate the offers you generate and mark the single best offer with 'isRecommended: true'. The "best" offer should be the most financially advantageous for the user (e.g., lowest interest rate, best terms). All other offers must have 'isRecommended: false'.

  Return a JSON object with the detected life event (or null if none is detected) and an array of tailored loan offers.
  Ensure the JSON is parsable.
  `,
});

const detectLifeEventFlow = ai.defineFlow(
  {
    name: 'detectLifeEventFlow',
    inputSchema: LifeEventDetectionInputSchema,
    outputSchema: LifeEventDetectionOutputSchema,
  },
  async input => {
    try {
      const {output} = await detectLifeEventPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error in detectLifeEventFlow:', error);
      // Return a default "no event" response in case of parsing or other errors
      return { lifeEvent: null, loanOffers: [] };
    }
  }
);
