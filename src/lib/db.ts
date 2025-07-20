import type { User, Transaction, RecommendationFeedback } from '@/lib/types';

// In-memory store to simulate a database
let users: User[] = [
  {
    id: 'user_1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatar: 'https://placehold.co/100x100.png',
    preferences: 'Yeni bir evlilik hazırlığındayım ve masraflarım için uygun kredi seçenekleri arıyorum. Düğün ve ev eşyası harcamalarımı kontrol altında tutmak istiyorum.',
  }
];

let transactions: Transaction[] = [
    // Wedding-related expenses
    { id: 't50', user_id: 'user_1', amount: -45000.00, description: 'Gelinlik Mağazası A', date: '2024-07-20', bank: 'Fibabanka' },
    { id: 't51', user_id: 'user_1', amount: -30000.00, description: 'Düğün Salonu Kapora', date: '2024-07-19', bank: 'Abank' },
    { id: 't52', user_id: 'user_1', amount: -20000.00, description: 'Düğün Fotoğrafçısı', date: '2024-07-18', bank: 'Bbank' },
    { id: 't53', user_id: 'user_1', amount: -18000.00, description: 'Damatlık Alışverişi', date: '2024-07-17', bank: 'Fibabanka' },
    { id: 't54', user_id: 'user_1', amount: -5000.00, description: 'Davetiye Baskısı', date: '2024-07-16', bank: 'Abank' },
    
    // Regular transactions
    { id: 't1', user_id: 'user_1', amount: -750.50, description: 'BIM Market', date: '2024-07-15', bank: 'Fibabanka' },
    { id: 't2', user_id: 'user_1', amount: -28000.00, description: 'MediaMarkt TV', date: '2024-07-14', bank: 'Abank' },
    { id: 't3', user_id: 'user_1', amount: -2500.00, description: 'Zara Giyim', date: '2024-07-14', bank: 'Bbank' },
    { id: 't4', user_id: 'user_1', amount: -1250.00, description: 'Big Chefs Restoran', date: '2024-07-13', bank: 'Fibabanka' },
    { id: 't5', user_id: 'user_1', amount: -4500.00, description: 'Pegasus Uçak Bileti', date: '2024-07-12', bank: 'Abank' },
    { id: 't6', user_id: 'user_1', amount: 60000.00, description: 'Maaş', date: '2024-07-10', bank: 'Fibabanka' },
    { id: 't7', user_id: 'user_1', amount: -550.00, description: 'A101 Market Alışverişi', date: '2024-07-10', bank: 'Bbank' },
    { id: 't8', user_id: 'user_1', amount: -8500.00, description: 'Vatan Bilgisayar', date: '2024-07-09', bank: 'Fibabanka' },
    { id: 't9', user_id: 'user_1', amount: -1800.00, description: 'LC Waikiki', date: '2024-07-08', bank: 'Abank' },
    { id: 't10', user_id: 'user_1', amount: -2100.00, description: 'Nusret Steakhouse', date: '2024-07-07', bank: 'Bbank' },
    { id: 't11', user_id: 'user_1', amount: -5200.00, description: 'THY Bilet', date: '2024-07-06', bank: 'Fibabanka' },
    { id: 't12', user_id: 'user_1', amount: -680.00, description: 'Migros', date: '2024-07-05', bank: 'Abank' },
    { id: 't13', user_id: 'user_1', amount: -35000.00, description: 'Teknosa Laptop', date: '2024-07-04', bank: 'Bbank' },
    { id: 't14', user_id: 'user_1', amount: -2200.00, description: 'Mavi Jeans', date: '2024-07-03', bank: 'Fibabanka' },
    { id: 't15', user_id: 'user_1', amount: -950.00, description: 'Sultanahmet Köftecisi', date: '2024-07-02', bank: 'Abank' },
    { id: 't16', user_id: 'user_1', amount: -3800.00, description: 'AnadoluJet', date: '2024-07-01', bank: 'Bbank' },
    { id: 't17', user_id: 'user_1', amount: -830.00, description: 'ŞOK Market', date: '2024-06-28', bank: 'Fibabanka' },
    { id: 't18', user_id: 'user_1', amount: -45000.00, description: 'Apple Store iPhone', date: '2024-06-25', bank: 'Abank' },
    { id: 't19', user_id: 'user_1', amount: -3500.00, description: 'H&M', date: '2024-06-22', bank: 'Bbank' },
    { id: 't20', user_id: 'user_1', amount: -1550.00, description: 'Cookshop', date: '2024-06-20', bank: 'Fibabanka' },
    { id: 't21', user_id: 'user_1', amount: -9300.00, description: 'Otel Rezervasyonu - Booking', date: '2024-06-18', bank: 'Abank' },
    { id: 't22', user_id: 'user_1', amount: -1250.00, description: 'CarrefourSA', date: '2024-06-15', bank: 'Bbank' },
    { id: 't23', user_id: 'user_1', amount: -7450.00, description: 'Monster Notebook Aksesuar', date: '2024-06-12', bank: 'Fibabanka' },
    { id: 't24', user_id: 'user_1', amount: -1950.00, description: 'Koton', date: '2024-06-10', bank: 'Abank' },
    { id: 't25', user_id: 'user_1', amount: -2800.00, description: 'Develi Restoran', date: '2024-06-08', bank: 'Bbank' },
    { id: 't26', user_id: 'user_1', amount: -6600.00, description: 'SunExpress Uçuş', date: '2024-06-05', bank: 'Fibabanka' },
    { id: 't27', user_id: 'user_1', amount: 60000.00, description: 'Maaş', date: '2024-06-10', bank: 'Fibabanka' },
    { id: 't28', user_id: 'user_1', amount: -450.00, description: 'Getir Siparişi', date: '2024-06-04', bank: 'Abank' },
    { id: 't29', user_id: 'user_1', amount: -199.99, description: 'Spotify Abonelik', date: '2024-06-01', bank: 'Bbank' },
    { id: 't30', user_id: 'user_1', amount: -225.00, description: 'Starbucks Kahve', date: '2024-05-30', bank: 'Fibabanka' },
    { id: 't31', user_id: 'user_1', amount: -550.00, description: 'Sinema Bileti - Paribu Cineverse', date: '2024-05-28', bank: 'Abank' },
    { id: 't32', user_id: 'user_1', amount: -650.00, description: 'Yemeksepeti Siparişi', date: '2024-05-25', bank: 'Bbank' },
    { id: 't33', user_id: 'user_1', amount: 60000.00, description: 'Maaş', date: '2024-05-10', bank: 'Fibabanka' },
    { id: 't34', user_id: 'user_1', amount: -2750.50, description: 'Benzin - Shell', date: '2024-05-08', bank: 'Abank' },
    { id: 't35', user_id: 'user_1', amount: -3250.00, description: 'Hepsiburada Siparişi', date: '2024-05-05', bank: 'Bbank' },
    { id: 't36', user_id: 'user_1', amount: -212.99, description: 'Netflix Abonelik', date: '2024-05-01', bank: 'Fibabanka' }
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
