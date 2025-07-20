import { config } from 'dotenv';
config();

import '@/ai/flows/spending-prediction.ts';
import '@/ai/flows/transaction-categorization.ts';
import '@/ai/flows/life-event-detection.ts';
import '@/ai/flows/location-based-offers.ts';
import '@/ai/flows/financial-recommendations.ts';
import '@/ai/flows/behavioral-optimization-agent.ts';