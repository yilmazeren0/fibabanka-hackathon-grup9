import { Component, Database, BrainCircuit, Users, Layers, Share2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ArchCard, ArchArrow } from '@/components/admin/ArchCard';

export default function ArchitecturePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Share2 className="h-8 w-8" />
                Proje Mimarisi
            </h1>
            <p className="text-muted-foreground mb-8">
                Bu sayfa, FinSight AI uygulamasının yapısını, veri akışını ve kullanılan tasarım desenlerini açıklamaktadır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                     <ArchCard title="Frontend (View Katmanı)" icon={<Component className="h-6 w-6 text-primary" />}>
                        <p><strong>Arayüz Bileşenleri:</strong> ShadCN UI ve Tailwind CSS ile oluşturulmuş, sadece veriyi göstermekle görevli "aptal" (dumb) bileşenler. Kendi başlarına veri çekme veya iş mantığı içermezler.</p>
                        <p><strong>Örnekler:</strong> `Header`, `SummaryCards`, `SpendingChart`, `SidePanel` gibi bileşenler.</p>
                    </ArchCard>
                </div>

                <div className="hidden md:flex justify-center items-center h-full">
                     <ArchArrow />
                </div>
                
                <div className="md:col-span-2 space-y-4">
                    <ArchCard title="Server Actions & Genkit AI" icon={<BrainCircuit className="h-6 w-6 text-primary" />}>
                        <p><strong>Server Actions (`actions.ts`):</strong> Arayüzden gelen istekleri alır ve ilgili AI akışlarını (flows) tetikler.</p>
                        <p><strong>Genkit AI Flows (`/ai/flows`):</strong> İşlemleri kategorize etme, harcama tahmini, finansal tavsiye gibi AI yeteneklerini barındıran modüller.</p>
                    </ArchCard>
                    
                    <ArchArrow />

                    <ArchCard title="Veri Kaynağı (Simüle Edilmiş)" icon={<Database className="h-6 w-6 text-primary" />}>
                        <p><strong>`db.ts`:</strong> Uygulamanın "veritabanı" görevi görür. Kullanıcı ve işlem verilerini hafızada tutar ve yönetir.</p>
                    </ArchCard>
                </div>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers className="h-6 w-6" />Veri Akışı & Presenter Deseni</CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">
                        Uygulama, veri akışını yönetmek için <strong>Presenter Pattern</strong> (Sunucu Deseni) kullanır. Bu desen, veri getirme ve işleme mantığını (Presenter) arayüzden (View) ayırır.
                    </p>
                </CardHeader>
                <CardContent>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-6">
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full -left-3 ring-8 ring-background">
                                <Users className="w-3 h-3 text-primary" />
                            </span>
                            <h3 className="font-semibold">1. Presenter (Sunucu) - `page.tsx`</h3>
                            <p className="text-sm text-muted-foreground">
                                `page.tsx` ana sayfa bileşeni bir "Presenter" olarak çalışır. Görevi, sayfa için gerekli tüm verileri hazırlamaktır.
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>`db.ts` üzerinden kullanıcı ve işlem verilerini çeker.</li>
                                    <li>`actions.ts` üzerinden tüm AI akışlarını (harcama tahmini, tavsiye vb.) tetikler.</li>
                                    <li>Topladığı bu verileri, alt bileşenlere (View'lar) `props` olarak geçirir.</li>
                                </ul>
                           </p>
                        </li>
                         <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full -left-3 ring-8 ring-background">
                                <Component className="w-3 h-3 text-primary" />
                            </span>
                            <h3 className="font-semibold">2. View (Görünüm) - Diğer Bileşenler</h3>
                            <p className="text-sm text-muted-foreground">
                               `SidePanel`, `SpendingChart` gibi bileşenler "View" katmanını oluşturur. Sadece kendilerine `props` ile verilen veriyi ekranda gösterirler. Verinin nereden veya nasıl geldiğiyle ilgilenmezler. Bu sayede yeniden kullanılabilir ve test edilebilir olurlar.
                            </p>
                        </li>
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full -left-3 ring-8 ring-background">
                                <BrainCircuit className="w-3 h-3 text-primary" />
                            </span>
                            <h3 className="font-semibold">3. Geri Bildirim ve Optimizasyon</h3>
                           <p className="text-sm text-muted-foreground">
                               Kullanıcı `SidePanel`'deki bir tavsiyeye geri bildirimde bulunduğunda (`beğen`/`beğenme`), bu etkileşim `actions.ts` üzerinden `db.ts`'e kaydedilir. Bir sonraki sefer `page.tsx` (Presenter) tavsiye istediğinde, `behavioral-optimization-agent` bu geri bildirimi kullanarak daha kişiselleştirilmiş bir sonuç üretir.
                            </p>
                        </li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
