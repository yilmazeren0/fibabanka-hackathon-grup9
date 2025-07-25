'use server';

/**
 * @fileOverview The main orchestrator for the financial AI assistant.
 * This flow acts as a "Model Context Protocol" (MCP) by invoking
 * multiple specialized AI agents in parallel to gather a comprehensive
 * financial overview for the user.
 *
 * - getFinancialContext - The main function to get the complete financial context.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { predictSpending, type PredictSpendingOutput } from './spending-prediction';
import { getFinancialRecommendation, type FinancialRecommendationOutput } from './financial-recommendations';
import { getLocationBasedOffers, type LocationBasedOffersOutput } from './location-based-offers';
import { detectLifeEvent, type LifeEventDetectionOutput } from './life-event-detection';
import type {Transaction, User} from '@/lib/types';
import { getOptimizedRecommendation } from './behavioral-optimization-agent';
import { db } from '@/lib/db';

const ModelContextProtocolInputSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      amount: z.number(),
      date: z.string(),
      bank: z.string(),
      user_id: z.string(),
      category: z.optional(z.string()),
    })
  ).describe("The user's transaction history."),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    preferences: z.string(),
  }).describe('The user data.'),
});
type ModelContextProtocolInput = z.infer<
  typeof ModelContextProtocolInputSchema
>;

const ModelContextProtocolOutputSchema = z.object({
  spendingPrediction: z.object({
    predictedSpending: z.number(),
    explanation: z.string(),
  }),
  financialRecommendation: z.object({
    recommendation: z.string(),
  }),
  localOffers: z.object({
    offers: z.array(
      z.object({
        bank: z.string(),
        category: z.string(),
        discount: z.number(),
        description: z.string(),
      })
    ),
  }),
  lifeEvent: z.object({
    lifeEvent: z.string().nullable(),
    loanOffers: z.array(
      z.object({
        bank: z.string(),
        eventType: z.string(),
        offerDetails: z.string(),
        isRecommended: z.boolean(),
      })
    ),
  }),
});
export type ModelContextProtocolOutput = z.infer<
  typeof ModelContextProtocolOutputSchema
>;

export async function getFinancialContext(
  input: ModelContextProtocolInput
): Promise<ModelContextProtocolOutput> {
  return modelContextProtocolFlow(input);
}

const modelContextProtocolFlow = ai.defineFlow(
  {
    name: 'modelContextProtocolFlow',
    inputSchema: ModelContextProtocolInputSchema,
    outputSchema: ModelContextProtocolOutputSchema,
  },
  async ({transactions, user}) => {
    const transactionHistory = JSON.stringify(
      transactions.map(t => ({
        description: t.description,
        amount: t.amount,
        date: t.date,
      }))
    );

    const feedbackHistory = await db.getFeedback();

    const mockCategories = ['restoran', 'teknoloji', 'market', 'diğer'];
    const randomCategory =
      mockCategories[Math.floor(Math.random() * mockCategories.length)];

    // Run all AI agents in parallel
    const [
      spendingPrediction,
      financialRecommendation,
      localOffers,
      lifeEvent,
    ] = await Promise.all([
      predictSpending({
        userId: user.id,
        transactionHistory,
      }),
      feedbackHistory.length > 0 
        ? getOptimizedRecommendation({
            transactionHistory,
            userPreferences: user.preferences,
            feedbackHistory,
        })
        : getFinancialRecommendation({
            transactionHistory,
            userPreferences: user.preferences,
        }),
      getLocationBasedOffers({locationCategory: randomCategory}),
      detectLifeEvent({
        userId: user.id,
        transactionHistory,
      }),
    ]);

    return {
      spendingPrediction,
      financialRecommendation,
      localOffers,
      lifeEvent,
    };
  }
);
