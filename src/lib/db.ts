import type { User, Transaction, RecommendationFeedback } from '@/lib/types';

// In-memory store to simulate a database
let users: User[] = [
  {
    id: 'user_1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatar: 'https://placehold.co/100x100.png',
    preferences: 'Yeni bir araba için para biriktirmeye ve dışarıda yeme harcamalarımı azaltmaya çalışıyorum.',
  }
];

let transactions: Transaction[] = [
    { id: 't1', user_id: 'user_1', amount: -24.50, description: 'BIM Market', date: '2024-07-15', bank: 'Fibabanka' },
    { id: 't2', user_id: 'user_1', amount: -1200.00, description: 'MediaMarkt TV', date: '2024-07-14', bank: 'Abank' },
    { id: 't3', user_id: 'user_1', amount: -89.99, description: 'Zara Giyim', date: '2024-07-14', bank: 'Bbank' },
    { id: 't4', user_id: 'user_1', amount: -45.30, description: 'Big Chefs Restoran', date: '2024-07-13', bank: 'Fibabanka' },
    { id: 't5', user_id: 'user_1', amount: -250.00, description: 'Pegasus Uçak Bileti', date: '2024-07-12', bank: 'Abank' },
    { id: 't6', user_id: 'user_1', amount: 5000.00, description: 'Maaş', date: '2024-07-10', bank: 'Fibabanka' },
    { id: 't7', user_id: 'user_1', amount: -15.00, description: 'A101 Market Alışverişi', date: '2024-07-10', bank: 'Bbank' },
    { id: 't8', user_id: 'user_1', amount: -350.50, description: 'Vatan Bilgisayar', date: '2024-07-09', bank: 'Fibabanka' },
    { id: 't9', user_id: 'user_1', amount: -75.00, description: 'LC Waikiki', date: '2024-07-08', bank: 'Abank' },
    { id: 't10', user_id: 'user_1', amount: -60.00, description: 'Nusret Steakhouse', date: '2024-07-07', bank: 'Bbank' },
    { id: 't11', user_id: 'user_1', amount: -500.00, description: 'THY Bilet', date: '2024-07-06', bank: 'Fibabanka' },
    { id: 't12', user_id: 'user_1', amount: -18.75, description: 'Migros', date: '2024-07-05', bank: 'Abank' },
    { id: 't13', user_id: 'user_1', amount: -800.00, description: 'Teknosa Laptop', date: '2024-07-04', bank: 'Bbank' },
    { id: 't14', user_id: 'user_1', amount: -120.00, description: 'Mavi Jeans', date: '2024-07-03', bank: 'Fibabanka' },
    { id: 't15', user_id: 'user_1', amount: -35.00, description: 'Sultanahmet Köftecisi', date: '2024-07-02', bank: 'Abank' },
    { id: 't16', user_id: 'user_1', amount: -180.00, description: 'AnadoluJet', date: '2024-07-01', bank: 'Bbank' },
    { id: 't17', user_id: 'user_1', amount: -33.20, description: 'ŞOK Market', date: '2024-06-28', bank: 'Fibabanka' },
    { id: 't18', user_id: 'user_1', amount: -2200.00, description: 'Apple Store iPhone', date: '2024-06-25', bank: 'Abank' },
    { id: 't19', user_id: 'user_1', amount: -250.00, description: 'H&M', date: '2024-06-22', bank: 'Bbank' },
    { id: 't20', user_id: 'user_1', amount: -55.00, description: 'Cookshop', date: '2024-06-20', bank: 'Fibabanka' },
    { id: 't21', user_id: 'user_1', amount: -300.00, description: 'Otel Rezervasyonu - Booking', date: '2024-06-18', bank: 'Abank' },
    { id: 't22', user_id: 'user_1', amount: -50.00, description: 'CarrefourSA', date: '2024-06-15', bank: 'Bbank' },
    { id: 't23', user_id: 'user_1', amount: -450.00, description: 'Monster Notebook Aksesuar', date: '2024-06-12', bank: 'Fibabanka' },
    { id: 't24', user_id: 'user_1', amount: -95.00, description: 'Koton', date: '2024-06-10', bank: 'Abank' },
    { id: 't25', user_id: 'user_1', amount: -80.00, description: 'Develi Restoran', date: '2024-06-08', bank: 'Bbank' },
    { id: 't26', user_id: 'user_1', amount: -600.00, description: 'SunExpress Uçuş', date: '2024-06-05', bank: 'Fibabanka' },
    { id: 't27', user_id: 'user_1', amount: 5000.00, description: 'Maaş', date: '2024-06-10', bank: 'Fibabanka' },
    { id: 't28', user_id: 'user_1', amount: -45.00, description: 'Getir Siparişi', date: '2024-06-04', bank: 'Abank' },
    { id: 't29', user_id: 'user_1', amount: -99.99, description: 'Spotify Abonelik', date: '2024-06-01', bank: 'Bbank' },
    { id: 't30', user_id: 'user_1', amount: -25.00, description: 'Starbucks Kahve', date: '2024-05-30', bank: 'Fibabanka' },
    { id: 't31', user_id: 'user_1', amount: -150.00, description: 'Sinema Bileti - Paribu Cineverse', date: '2024-05-28', bank: 'Abank' },
    { id: 't32', user_id: 'user_1', amount: -65.00, description: 'Yemeksepeti Siparişi', date: '2024-05-25', bank: 'Bbank' },
    { id: 't33', user_id: 'user_1', amount: 5150.00, description: 'Maaş', date: '2024-05-10', bank: 'Fibabanka' },
    { id: 't34', user_id: 'user_1', amount: -75.50, description: 'Benzin - Shell', date: '2024-05-08', bank: 'Abank' },
    { id: 't35', user_id: 'user_1', amount: -250.00, description: 'Hepsiburada Siparişi', date: '2024-05-05', bank: 'Bbank' },
    { id: 't36', user_id: 'user_1', amount: -12.99, description: 'Netflix Abonelik', date: '2024-05-01', bank: 'Fibabanka' }
];

let feedback: RecommendationFeedback[] = [];

// Simulate async operations
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  getUser: async (id: string = 'user_1'): Promise<User> => {
    await delay(50);
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },
  getTransactions: async (userId: string = 'user_1'): Promise<Transaction[]> => {
    await delay(50);
    return transactions.filter(t => t.user_id === userId);
  },
  saveFeedback: async (newFeedback: RecommendationFeedback): Promise<void> => {
    await delay(50);
    feedback.push(newFeedback);
    console.log('Current Feedback DB:', feedback);
  },
  getFeedback: async (): Promise<RecommendationFeedback[]> => {
    await delay(50);
    return feedback;
  },
};
