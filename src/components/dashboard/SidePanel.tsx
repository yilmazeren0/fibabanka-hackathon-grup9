'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowUpCircle, Banknote, Gift, HeartHandshake, Sparkles, TrendingUp } from 'lucide-react';
import {
  getSpendingPrediction,
  fetchFinancialRecommendation,
  fetchLocalOffers,
  checkForLifeEvents,
} from '@/app/actions';
import type { Transaction, User, Offer, LoanOffer } from '@/lib/types';

interface SidePanelProps {
  transactions: Transaction[];
  user: User;
}

interface Feedback {
  [key: string]: 'liked' | 'disliked' | null;
}

export function SidePanel({ transactions, user }: SidePanelProps) {
  const [prediction, setPrediction] = React.useState<{ amount: number; explanation: string } | null>(null);
  const [recommendation, setRecommendation] = React.useState<string | null>(null);
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [lifeEvent, setLifeEvent] = React.useState<{ event: string | null; loans: LoanOffer[] } | null>(null);
  
  const [loading, setLoading] = React.useState({
    prediction: false,
    recommendation: false,
    offers: false,
    lifeEvent: false,
  });

  const [feedback, setFeedback] = React.useState<Feedback>({});

  const handleFeedback = (id: string, newFeedback: 'liked' | 'disliked') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === newFeedback ? null : newFeedback,
    }));
  };

  const runPrediction = async () => {
    setLoading(p => ({ ...p, prediction: true }));
    try {
      const result = await getSpendingPrediction(transactions);
      setPrediction({ amount: result.predictedSpending, explanation: result.explanation });
    } catch (e) { console.error(e); }
    setLoading(p => ({ ...p, prediction: false }));
  };
  
  const runRecommendation = async () => {
    setLoading(p => ({ ...p, recommendation: true }));
    try {
      const result = await fetchFinancialRecommendation(transactions, user);
      setRecommendation(result.recommendation);
    } catch (e) { console.error(e); }
    setLoading(p => ({ ...p, recommendation: false }));
  };

  const runLocalOffers = async () => {
    setLoading(p => ({ ...p, offers: true }));
    try {
      const result = await fetchLocalOffers();
      setOffers(result.offers);
    } catch (e) { console.error(e); }
    setLoading(p => ({ ...p, offers: false }));
  };

  const runLifeEventCheck = async () => {
    setLoading(p => ({ ...p, lifeEvent: true }));
    try {
      const result = await checkForLifeEvents(transactions);
      setLifeEvent({ event: result.lifeEvent, loans: result.loanOffers });
    } catch (e) { console.error(e); }
    setLoading(p => ({ ...p, lifeEvent: false }));
  };
  
  React.useEffect(() => {
    runPrediction();
    runRecommendation();
    runLocalOffers();
    runLifeEventCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderModule = (icon: React.ReactNode, title: string, content: React.ReactNode, isLoading: boolean) => (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div className="flex-1 space-y-1">
        <p className="font-headline text-sm font-medium leading-none">{title}</p>
        {isLoading ? <Skeleton className="h-8 w-full" /> : <div className="text-sm text-muted-foreground">{content}</div>}
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardContent className="grid gap-8 p-6">
        {renderModule(
          <TrendingUp />, 'Harcama Tahmini',
          prediction ? (
            <p>Gelecek ayki tahmini harcamanız <strong className="text-foreground">{prediction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong>. {prediction.explanation}</p>
          ) : <p>Tahmin mevcut değil.</p>,
          loading.prediction
        )}

        {renderModule(
          <Sparkles />, 'Finansal Tavsiye',
          recommendation ? (
             <div className="flex items-center gap-2">
                <p className="flex-1">{recommendation}</p>
                 <Button variant={feedback['rec'] === 'liked' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-full" onClick={() => handleFeedback('rec', 'liked')}>
                    <ArrowUpCircle className={`h-4 w-4 ${feedback['rec'] === 'liked' ? 'text-green-500' : ''}`} />
                </Button>
            </div>
          ) : <p>Tavsiye mevcut değil.</p>,
          loading.recommendation
        )}

        {renderModule(
          <Gift />, 'Yakındaki Fırsatlar',
          offers.length > 0 ? (
            <div className="space-y-2">
              {offers.map((offer, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-md bg-background">
                  <Banknote className="h-4 w-4 text-primary" />
                  <p className="flex-1"><strong>{offer.bank}:</strong> {offer.description} (%{offer.discount} indirim)</p>
                   <Button variant={feedback[`offer_${i}`] === 'liked' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6 rounded-full" onClick={() => handleFeedback(`offer_${i}`, 'liked')}>
                        <ArrowUpCircle className={`h-3 w-3 ${feedback[`offer_${i}`] === 'liked' ? 'text-green-500' : ''}`} />
                    </Button>
                </div>
              ))}
            </div>
          ) : <p>Yakında fırsat bulunamadı.</p>,
          loading.offers
        )}

        {renderModule(
          <HeartHandshake />, 'Hayat Olayı Takibi',
          lifeEvent?.event ? (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm"><AlertCircle className="h-4 w-4 text-accent" />Şunu yaşıyor olabileceğinizi tespit ettik: <strong className="text-foreground">{lifeEvent.event}</strong></p>
              {lifeEvent.loans.length > 0 && (
                 <div className="space-y-2 pt-2">
                  <p className="font-medium text-xs">İşinize yarayabilecek bazı kredi teklifleri:</p>
                  {lifeEvent.loans.map((loan, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-md bg-background">
                       <p className="flex-1"><strong>{loan.bank}:</strong> {loan.offerDetails}</p>
                        <Button variant={feedback[`loan_${i}`] === 'liked' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6 rounded-full" onClick={() => handleFeedback(`loan_${i}`, 'liked')}>
                          <ArrowUpCircle className={`h-3 w-3 ${feedback[`loan_${i}`] === 'liked' ? 'text-green-500' : ''}`} />
                        </Button>
                    </div>
                  ))}
                 </div>
              )}
            </div>
          ) : <p>Son aktivitelerinizde önemli bir hayat olayı tespit edilmedi. Sizin için gözümüzü dört açtık!</p>,
          loading.lifeEvent
        )}
      </CardContent>
    </Card>
  );
}
