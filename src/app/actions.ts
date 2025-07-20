'use server';

import { categorizeTransactions } from '@/ai/flows/transaction-categorization';
import { getFinancialContext as getFinancialContextFromFlow } from '@/ai/flows/model-context-protocol';
import { db } from '@/lib/db';
import type { Transaction, User, RecommendationFeedback } from '@/lib/types';
import { getFinancialRecommendation } from '@/ai/flows/financial-recommendations';
import { getOptimizedRecommendation } from '@/ai/flows/behavioral-optimization-agent';


export async function getCategorizedTransactions(transactions: Transaction[]) {
  const transactionsToCategorize = transactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    date: t.date,
  }));
  return await categorizeTransactions({ transactions: transactionsToCategorize });
}

export async function getFinancialContext(transactions: Transaction[], user: User) {
  return await getFinancialContextFromFlow({ transactions, user });
}

// This function is now used for re-fetching recommendations after feedback.
export async function fetchFinancialRecommendation(transactions: Transaction[], user: User) {
  const transactionHistory = JSON.stringify(transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
  })));
  
  const feedbackHistory = await db.getFeedback();

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
}

export async function saveRecommendationFeedback(feedback: RecommendationFeedback) {
  await db.saveFeedback(feedback);
}
