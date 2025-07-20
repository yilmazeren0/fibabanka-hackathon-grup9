import { db } from '@/lib/db';
import { Header } from '@/components/dashboard/Header';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { SidePanel } from '@/components/dashboard/SidePanel';
import { 
  getSpendingPrediction,
  fetchFinancialRecommendation,
  fetchLocalOffers,
  checkForLifeEvents 
} from '@/app/actions';

export default async function Home() {
  const user = await db.getUser();
  const transactions = await db.getTransactions();
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  // Fetch all AI data in the parent component (Presenter)
  const spendingPrediction = await getSpendingPrediction(transactions);
  const financialRecommendation = await fetchFinancialRecommendation(transactions, user);
  const localOffers = await fetchLocalOffers();
  const lifeEvent = await checkForLifeEvents(transactions);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header user={user} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
           <SummaryCards transactions={transactions} balance={balance} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <SpendingChart transactions={transactions} />
          </div>
          <div className="lg:col-span-3">
            <SidePanel 
              transactions={transactions} 
              user={user}
              spendingPrediction={spendingPrediction}
              financialRecommendation={financialRecommendation}
              localOffers={localOffers}
              lifeEvent={lifeEvent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
