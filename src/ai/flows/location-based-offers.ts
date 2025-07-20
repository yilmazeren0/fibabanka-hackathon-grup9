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
  locationCategory: z.string().describe('The category of the user\'s location (e.g., restoran, teknoloji, market).'),
});
export type LocationBasedOffersInput = z.infer<typeof LocationBasedOffersInputSchema>;

const LocationBasedOffersOutputSchema = z.object({
  offers: z.array(
    z.object({
      bank: z.string().describe('The name of the bank providing the offer.'),
      category: z.string().describe('The category of the offer.'),
      discount: z.number().describe('The discount percentage of the offer as a whole number (e.g., 5 for 5%).'),
      description: z.string().describe('A description of the offer. It should not include the discount amount in parenthesis.'),
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
  prompt: `Sen bir kişisel finans asistanısın. Kullanıcı şu anda '{{locationCategory}}' kategorisindeki bir konumda. Fibabanka, Abank ve Bbank'tan ilgili 3 kampanya öner.

Her banka, kullanıcının bulunduğu kategoriyle ilgili aynı türde bir kampanya sunmalıdır, ancak indirim oranları (discount) farklı olmalıdır. Örneğin, kullanıcı bir marketteyse, tüm bankalar market alışverişlerinde indirim teklif etmelidir, ancak farklı yüzdelerde (örn: 5, 7.5, 10). İndirim değerini tam sayı olarak döndür.

Tekliflerin kullanıcının konumuyla alakalı ve onun için ilgi çekici olduğundan emin ol.

Tekliflerin bir listesini içeren bir JSON nesnesi döndür. Her teklif banka adını, kategoriyi, indirimi ve kısa bir açıklamayı içermelidir. Açıklamalar Türkçe olmalıdır ve parantez içinde indirim oranını TEKRAR ETMEMELİDİR.`,
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
