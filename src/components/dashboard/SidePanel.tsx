'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowUpCircle, ArrowDownCircle, Banknote, Gift, HeartHandshake, Sparkles, TrendingUp, Star } from 'lucide-react';
import {
  fetchFinancialRecommendation,
  saveRecommendationFeedback,
} from '@/app/actions';
import type { Transaction, User, Offer, LoanOffer } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

interface SidePanelProps {
  transactions: Transaction[];
  user: User;
  spendingPrediction: { predictedSpending: number; explanation: string; };
  financialRecommendation: { recommendation: string; };
  localOffers: { offers: Offer[]; };
  lifeEvent: { lifeEvent: string | null; loanOffers: LoanOffer[]; };
}

interface Feedback {
  [key: string]: 'liked' | 'disliked' | null;
}

export function SidePanel({ 
  transactions, 
  user,
  spendingPrediction,
  financialRecommendation,
  localOffers,
  lifeEvent
}: SidePanelProps) {
  
  const [recommendation, setRecommendation] = React.useState<string | null>(financialRecommendation.recommendation);
  const [loadingRecommendation, setLoadingRecommendation] = React.useState(false);
  
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

  const runRecommendation = async (isOptimizing = false) => {
    if(!isOptimizing) {
       setLoadingRecommendation(true);
    }
    try {
      const result = await fetchFinancialRecommendation(transactions, user);
      setRecommendation(result.recommendation);
    } catch (e) { console.error(e); }
     if(!isOptimizing) {
      setLoadingRecommendation(false);
    }
  };

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
          spendingPrediction ? (
            <p>Gelecek ayki tahmini harcamanız <strong className="text-foreground">{spendingPrediction.predictedSpending.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong>. {spendingPrediction.explanation}</p>
          ) : <p>Tahmin mevcut değil.</p>,
          !spendingPrediction
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
          loadingRecommendation || !financialRecommendation,
          true
        )}

        {renderModule(
          <Gift />, 'Yakındaki Fırsatlar',
          localOffers?.offers?.length > 0 ? (
            <div className="space-y-2">
              {localOffers.offers.map((offer, i) => (
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
          !localOffers,
          true
        )}

        {renderModule(
          <HeartHandshake />, 'Hayat Olayı Takibi',
          lifeEvent?.lifeEvent ? (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm"><AlertCircle className="h-4 w-4 text-accent" />Bir <strong className="text-foreground">{lifeEvent.lifeEvent}</strong> içinde olabileceğinizi tespit ettik.</p>
              {lifeEvent.loanOffers.length > 0 && (
                 <div className="space-y-2 pt-2">
                  <p className="font-medium text-xs">İşte işinize yarayabilecek bazı kredi teklifleri:</p>
                  {lifeEvent.loanOffers.map((loan, i) => (
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
          !lifeEvent,
          true
        )}
      </CardContent>
    </Card>
  );
}
