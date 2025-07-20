'use server';

import { categorizeTransactions } from '@/ai/flows/transaction-categorization';
import { getLocationBasedOffers } from '@/ai/flows/location-based-offers';
import { detectLifeEvent } from '@/ai/flows/life-event-detection';
import { predictSpending } from '@/ai/flows/spending-prediction';
import { getFinancialRecommendation } from '@/ai/flows/financial-recommendations';
import type { Transaction, User } from '@/lib/types';

export async function getCategorizedTransactions(transactions: Transaction[]) {
  const transactionsToCategorize = transactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    date: t.date,
  }));
  return await categorizeTransactions({ transactions: transactionsToCategorize });
}

export async function fetchLocalOffers() {
  const mockCategories = ["restoran", "teknoloji", "market", "diğer"];
  const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];

  return await getLocationBasedOffers({ locationCategory: randomCategory });
}

export async function checkForLifeEvents(transactions: Transaction[]) {
  const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));

  return await detectLifeEvent({
    userId: 'user_1',
    transactionHistory,
  });
}

export async function getSpendingPrediction(transactions: Transaction[]) {
   const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));

  return await predictSpending({
    userId: 'user_1',
    transactionHistory,
  });
}

export async function fetchFinancialRecommendation(transactions: Transaction[], user: User) {
  const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));

  return await getFinancialRecommendation({
    transactionHistory,
    userPreferences: user.preferences,
  });
}
