export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category?: 'market' | 'elektronik' | 'giyim' | 'restoran' | 'seyahat' | 'diğer';
  date: string;
  bank: 'Fibabanka' | 'Abank' | 'Bbank';
}

export interface CategorizedTransaction {
  id: string;
  category: string;
}

export interface Offer {
  bank: string;
  category: string;
  discount: number;
  description: string;
}

export interface LoanOffer {
  bank: string;
  eventType: string;
  offerDetails: string;
  isRecommended: boolean;
}

export interface Feedback {
  id: string;
  feedback: 'liked' | 'disliked';
}

export interface RecommendationFeedback {
  recommendation: string;
  feedback: 'liked' | 'disliked';
}
