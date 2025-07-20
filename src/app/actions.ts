'use server';

import { categorizeTransactions } from '@/ai/flows/transaction-categorization';
import { getLocationBasedOffers } from '@/ai/flows/location-based-offers';
import { detectLifeEvent } from '@/ai/flows/life-event-detection';
import { predictSpending } from '@/ai/flows/spending-prediction';
import { getFinancialRecommendation } from '@/ai/flows/financial-recommendations';
import { getOptimizedRecommendation } from '@/ai/flows/behavioral-optimization-agent';
import { db } from '@/lib/db';
import type { Transaction, User, Feedback, RecommendationFeedback } from '@/lib/types';

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function useCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cachedItem = cache.get(key);

  if (cachedItem && (now - cachedItem.timestamp) < CACHE_TTL) {
    console.log(`[Cache] HIT for key: ${key}`);
    return cachedItem.data as T;
  }

  console.log(`[Cache] MISS for key: ${key}`);
  const result = await fn();
  cache.set(key, { data: result, timestamp: now });
  return result;
}


export async function getCategorizedTransactions(transactions: Transaction[]) {
  const transactionsToCategorize = transactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    date: t.date,
  }));
  const cacheKey = `categorized-transactions:${JSON.stringify(transactionsToCategorize)}`;
  return useCache(cacheKey, () => categorizeTransactions({ transactions: transactionsToCategorize }));
}

export async function fetchLocalOffers() {
  const mockCategories = ["restoran", "teknoloji", "market", "diğer"];
  const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
  // NOTE: We don't cache this because we want fresh offers based on random category
  return await getLocationBasedOffers({ locationCategory: randomCategory });
}

export async function checkForLifeEvents(transactions: Transaction[]) {
  const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));

  const cacheKey = `life-events:${JSON.stringify(transactionHistory)}`;
  return useCache(cacheKey, () => detectLifeEvent({
    userId: 'user_1',
    transactionHistory,
  }));
}

export async function getSpendingPrediction(transactions: Transaction[]) {
   const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));

  const cacheKey = `spending-prediction:${JSON.stringify(transactionHistory)}`;
  return useCache(cacheKey, () => predictSpending({
    userId: 'user_1',
    transactionHistory,
  }));
}

export async function fetchFinancialRecommendation(transactions: Transaction[], user: User) {
  const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));
  
  const feedbackHistory = await db.getFeedback();
  const cacheKey = `financial-recommendation:${JSON.stringify(transactionHistory)}:${JSON.stringify(feedbackHistory)}`;

  return useCache(cacheKey, async () => {
    if (feedbackHistory.length > 0) {
      return await getOptimizedRecommendation({
        transactionHistory,
        userPreferences: user.preferences,
        feedbackHistory,
      });
    }

    return await getFinancialRecommendation({
      transactionHistory,
      userPreferences: user.preferences,
    });
  });
}

export async function saveRecommendationFeedback(feedback: RecommendationFeedback) {
  await db.saveFeedback(feedback);
  // Clear relevant cache after feedback is saved
  cache.forEach((value, key) => {
    if (key.startsWith('financial-recommendation:')) {
      cache.delete(key);
    }
  });
}