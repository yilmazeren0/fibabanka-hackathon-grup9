'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getCategorizedTransactions } from '@/app/actions';
import type { Transaction, CategorizedTransaction } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface SpendingChartProps {
  transactions: Transaction[];
}

interface ChartData {
  name: string;
  total: number;
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const processTransactions = async () => {
      setIsLoading(true);
      try {
        const spendingTransactions = transactions.filter(t => t.amount < 0);
        const categorized = await getCategorizedTransactions(spendingTransactions);
        
        const spendingByCategory = spendingTransactions.reduce((acc, transaction) => {
          const categoryInfo = categorized.find((c: CategorizedTransaction) => c.id === transaction.id);
          const category = categoryInfo ? categoryInfo.category : 'diğer';
          const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
          
          if (!acc[capitalizedCategory]) {
            acc[capitalizedCategory] = 0;
          }
          acc[capitalizedCategory] += Math.abs(transaction.amount);
          return acc;
        }, {} as { [key: string]: number });
        
        const formattedData = Object.entries(spendingByCategory).map(([name, total]) => ({
          name,
          total,
        })).sort((a,b) => b.total - a.total);

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to process transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    processTransactions();
  }, [transactions]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Harcama Özeti</CardTitle>
        <CardDescription>Son 30 gündeki kategori bazlı harcamalarınız.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="w-full h-[300px] flex items-end gap-4 px-4">
             <Skeleton className="h-3/4 w-1/5" />
             <Skeleton className="h-full w-1/5" />
             <Skeleton className="h-1/2 w-1/5" />
             <Skeleton className="h-2/3 w-1/5" />
             <Skeleton className="h-1/3 w-1/5" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }), 'Toplam']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
