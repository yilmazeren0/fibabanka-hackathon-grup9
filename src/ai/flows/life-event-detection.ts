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
  bank: z.string().describe('Kredi teklifini sunan bankanın adı.'),
  eventType: z.string().describe('Kredinin uygun olduğu hayat olayının türü.'),
  offerDetails: z.string().describe('Faiz oranları ve vade gibi kredi teklifi detayları.'),
  isRecommended: z.boolean().describe('Bu teklifin, seçenekler arasında önerilen olup olmadığı.'),
});

const LifeEventDetectionOutputSchema = z.object({
  lifeEvent: z
    .string()
    .nullable()
    .describe('Tespit edilen hayat olayı (örn: Evlilik, Yeni Araba, Taşınma). Olay tespit edilmezse null döner.'),
  loanOffers: z.array(LoanOfferSchema).describe('Tespit edilen hayat olayına göre hazırlanmış kredi teklifleri. En avantajlı teklif için isRecommended true olmalıdır.'),
});
export type LifeEventDetectionOutput = z.infer<typeof LifeEventDetectionOutputSchema>;

export async function detectLifeEvent(input: LifeEventDetectionInput): Promise<LifeEventDetectionOutput> {
  return detectLifeEventFlow(input);
}

const detectLifeEventPrompt = ai.definePrompt({
  name: 'detectLifeEventPrompt',
  input: {schema: LifeEventDetectionInputSchema},
  output: {schema: LifeEventDetectionOutputSchema},
  prompt: `Sen, bir kullanıcının işlem geçmişini analiz ederek potansiyel hayat olaylarını tespit eden ve ilgili kredi teklifleri sunan bir yapay zeka ajanısın.

  Kullanıcı ID'si {{{userId}}} olan kullanıcının aşağıdaki işlem geçmişini analiz et ve önemli hayat olaylarını tespit et.

  İşlem Geçmişi:
  {{{transactionHistory}}}

  Tespit edilebilecek olası hayat olayları şunları içerir, ancak bunlarla sınırlı değildir:
  - Yeni bir yere taşınma (örn: kira depozitoları, nakliye şirketi ücretleri, yeni mobilya)
  - Yeni bir araba satın alma (örn: peşinatlar, araba ile ilgili hizmetler)
  - Düğün planlama (örn: mekanlara, fotoğrafçılara, catering firmalarına yapılan ödemeler)
  - Bebek sahibi olma (örn: bebek mağazalarından yapılan alışverişler, hastane faturaları)
  - Yeni bir işe başlama (örn: maaş yatırma düzenindeki değişiklikler)

  Bir hayat olayı tespit edilirse, mevcut bankalardan (Fibabanka, Abank, Bbank) ilgili kredi teklifleri oluştur. Her banka rekabetçi ancak biraz farklı bir teklif sunmalıdır (örn: farklı faiz oranları, vadeler).
  
  Oluşturduğun teklifleri eleştirel bir şekilde değerlendir ve kullanıcı için finansal olarak en avantajlı (örn: en düşük faiz oranı, en iyi koşullar) olan tek bir teklifi 'isRecommended: true' olarak işaretle. Diğer tüm teklifler 'isRecommended: false' olmalıdır.

  Tüm açıklamalar ve teklif detayları Türkçe olmalıdır.

  Tespit edilen hayat olayını (veya hiçbiri tespit edilmediyse null) ve özel olarak hazırlanmış kredi teklifleri dizisini içeren bir JSON nesnesi döndür.
  JSON'un ayrıştırılabilir olduğundan emin ol.
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
