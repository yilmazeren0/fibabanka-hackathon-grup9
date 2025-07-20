import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard, Activity } from 'lucide-react';
import type { Transaction } from '@/lib/types';

interface SummaryCardsProps {
    transactions: Transaction[];
    balance: number;
}

export function SummaryCards({ transactions, balance }: SummaryCardsProps) {
  const totalSpending = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Bakiye</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">
            {balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>
          <p className="text-xs text-muted-foreground">Tüm işlemlere göre</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Harcama (Son 30 gün)</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline text-red-600">
             {Math.abs(totalSpending).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>
           <p className="text-xs text-muted-foreground">
            {transactions.filter(t => t.amount < 0).length} harcama işlemi
            </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gelir (Son 30 gün)</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline text-green-600">
            +{totalIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>
          <p className="text-xs text-muted-foreground">
             {transactions.filter(t => t.amount > 0).length} gelir işlemi
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam İşlem</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">
            {transactions.length}
          </div>
          <p className="text-xs text-muted-foreground">Son 30 gün içinde</p>
        </CardContent>
      </Card>
    </>
  );
}
