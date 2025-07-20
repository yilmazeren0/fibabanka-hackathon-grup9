//location-based-offers.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing location-based offers to users.
 *
 * - getLocationBasedOffers - A function that handles the process of retrieving location-based offers.
 * - LocationBasedOffersInput - The input type for the getLocationBasedOffers function.
 * - LocationBasedOffersOutput - The return type for the getLocationBasedOffers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocationBasedOffersInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
});
export type LocationBasedOffersInput = z.infer<typeof LocationBasedOffersInputSchema>;

const LocationBasedOffersOutputSchema = z.object({
  offers: z.array(
    z.object({
      bank: z.string().describe('The name of the bank providing the offer.'),
      category: z.string().describe('The category of the offer.'),
      discount: z.number().describe('The discount percentage of the offer.'),
      description: z.string().describe('A description of the offer.'),
    })
  ).describe('A list of location-based offers.'),
});
export type LocationBasedOffersOutput = z.infer<typeof LocationBasedOffersOutputSchema>;

export async function getLocationBasedOffers(input: LocationBasedOffersInput): Promise<LocationBasedOffersOutput> {
  return locationBasedOffersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locationBasedOffersPrompt',
  input: {schema: LocationBasedOffersInputSchema},
  output: {schema: LocationBasedOffersOutputSchema},
  prompt: `You are a personal financial assistant. The user is currently located at latitude {{latitude}} and longitude {{longitude}}. Recommend 3 relevant offers from nearby banks.

Return a JSON object containing a list of offers. Each offer should include the bank name, category, discount, and a brief description.

Ensure that the offers are relevant to the user's location and likely to be of interest to them.`, // Updated prompt
});

const locationBasedOffersFlow = ai.defineFlow(
  {
    name: 'locationBasedOffersFlow',
    inputSchema: LocationBasedOffersInputSchema,
    outputSchema: LocationBasedOffersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
