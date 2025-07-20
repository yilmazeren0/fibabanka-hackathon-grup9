'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowUpCircle, ArrowDownCircle, Banknote, Gift, HeartHandshake, Sparkles, TrendingUp, Star } from 'lucide-react';
import {
  getSpendingPrediction,
  fetchFinancialRecommendation,
  fetchLocalOffers,
  checkForLifeEvents,
  saveRecommendationFeedback,
} from '@/app/actions';
import type { Transaction, User, Offer, LoanOffer } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

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
    prediction: true,
    recommendation: true,
    offers: true,
    lifeEvent: true,
  });

  const [feedback, setFeedback] = React.useState<Feedback>({});
  const { toast } = useToast()

  const handleFeedback = async (id: string, newFeedback: 'liked' | 'disliked', recommendationText?: string) => {
    const currentFeedback = feedback[id];
    const newFeedbackState = currentFeedback === newFeedback ? null : newFeedback;
    
    setFeedback(prev => ({ ...prev, [id]: newFeedbackState }));

    if (recommendationText) {
      if (newFeedbackState !== null) {
        await saveRecommendationFeedback({ recommendation: recommendationText, feedback: newFeedbackState });
        toast({
          title: "Geri Bildiriminiz Alındı!",
          description: "Gelecekteki önerileri sizin için iyileştireceğiz.",
        })
        runRecommendation(true); // Re-fetch recommendation after feedback
      }
    }
  };
  
  const runPrediction = async () => {
    setLoading(p => ({ ...p, prediction: true }));
    try {
      const result = await getSpendingPrediction(transactions);
      setPrediction({ amount: result.predictedSpending, explanation: result.explanation });
    } catch (e) { console.error(e); }
    setLoading(p => ({ ...p, prediction: false }));
  };
  
  const runRecommendation = async (isOptimizing = false) => {
    if(!isOptimizing) {
       setLoading(p => ({ ...p, recommendation: true }));
    }
    try {
      const result = await fetchFinancialRecommendation(transactions, user);
      setRecommendation(result.recommendation);
    } catch (e) { console.error(e); }
    if(!isOptimizing) {
      setLoading(p => ({ ...p, recommendation: false }));
    }
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

  const renderModule = (icon: React.ReactNode, title: string, content: React.ReactNode, isLoading: boolean, fullWidthContent = false) => (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">{icon}</div>
      <div className={`flex-1 space-y-1 ${fullWidthContent ? 'min-w-0' : ''}`}>
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
            <p>Gelecek ayki tahmini harcamanız <strong className="text-foreground">{prediction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong>. Bu tahmin, geçmişteki harcama alışkanlıklarınız analiz edilerek oluşturulmuştur.</p>
          ) : <p>Tahmin mevcut değil.</p>,
          loading.prediction
        )}

        {renderModule(
          <Sparkles />, 'Finansal Tavsiye',
          recommendation ? (
             <div className="flex items-center gap-2">
                <p className="flex-1">{recommendation}</p>
                 <Button variant={feedback['rec'] === 'liked' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-full flex-shrink-0" onClick={() => handleFeedback('rec', 'liked', recommendation)}>
                    <ArrowUpCircle className={`h-4 w-4 ${feedback['rec'] === 'liked' ? 'text-green-500' : ''}`} />
                </Button>
                 <Button variant={feedback['rec'] === 'disliked' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-full flex-shrink-0" onClick={() => handleFeedback('rec', 'disliked', recommendation)}>
                    <ArrowDownCircle className={`h-4 w-4 ${feedback['rec'] === 'disliked' ? 'text-red-500' : ''}`} />
                </Button>
            </div>
          ) : <p>Tavsiye mevcut değil.</p>,
          loading.recommendation,
          true
        )}

        {renderModule(
          <Gift />, 'Yakındaki Fırsatlar',
          offers.length > 0 ? (
            <div className="space-y-2">
              {offers.map((offer, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-md bg-background">
                  <Banknote className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="flex-1"><strong>{offer.bank}:</strong> {offer.description} (%{offer.discount} indirim)</p>
                   <Button variant={feedback[`offer_${i}`] === 'liked' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6 rounded-full flex-shrink-0" onClick={() => handleFeedback(`offer_${i}`, 'liked')}>
                        <ArrowUpCircle className={`h-3 w-3 ${feedback[`offer_${i}`] === 'liked' ? 'text-green-500' : ''}`} />
                    </Button>
                </div>
              ))}
            </div>
          ) : <p>Yakında fırsat bulunamadı.</p>,
          loading.offers,
          true
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
                    <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-md bg-background">
                       {loan.isRecommended && <Star className="h-4 w-4 text-yellow-500 fill-yellow-400 flex-shrink-0 mt-0.5" />}
                       <p className={`flex-1 ${!loan.isRecommended && 'ml-6'}`}><strong>{loan.bank}:</strong> {loan.offerDetails}</p>
                        <Button variant={feedback[`loan_${i}`] === 'liked' ? 'secondary' : 'ghost'} size="icon" className="h-6 w-6 rounded-full flex-shrink-0" onClick={() => handleFeedback(`loan_${i}`, 'liked')}>
                          <ArrowUpCircle className={`h-3 w-3 ${feedback[`loan_${i}`] === 'liked' ? 'text-green-500' : ''}`} />
                        </Button>
                    </div>
                  ))}
                 </div>
              )}
            </div>
          ) : <p>Son aktivitelerinizde önemli bir hayat olayı tespit edilmedi. Sizin için gözümüzü dört açtık!</p>,
          loading.lifeEvent,
          true
        )}
      </CardContent>
    </Card>
  );
}
