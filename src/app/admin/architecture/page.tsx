import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Share2, Component, Database, BrainCircuit, User } from 'lucide-react';

const ArchCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
                {children}
            </div>
        </CardContent>
    </Card>
);

const ArchArrow = () => (
    <div className="flex justify-center items-center my-4">
        <ArrowRight className="h-8 w-8 text-muted-foreground" />
    </div>
)

export default function ArchitecturePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Share2 className="h-8 w-8" />
                Proje Mimarisi
            </h1>
            <p className="text-muted-foreground mb-8">
                Bu sayfa, FinSight AI uygulamasının yapısını ve veri akışını görselleştirmektedir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                {/* Column 1: Frontend */}
                <div className="md:col-span-2 space-y-4">
                    <ArchCard title="Frontend (Next.js & React)" icon={<Component className="h-6 w-6 text-primary" />}>
                        <p><strong>Kullanıcı Arayüzü:</strong> ShadCN UI ve Tailwind CSS ile oluşturulmuş, kullanıcıların etkileşimde bulunduğu arayüz.</p>
                        <p><strong>Bileşenler:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>page.tsx:</strong> Ana sayfa düzenini oluşturur.</li>
                            <li><strong>Header.tsx:</strong> Üst menü ve kullanıcı bilgileri.</li>
                            <li><strong>SummaryCards.tsx:</strong> Bakiye, harcama gibi özet kartları.</li>
                            <li><strong>SpendingChart.tsx:</strong> Harcama grafiği.</li>
                            <li><strong>SidePanel.tsx:</strong> AI tabanlı önerilerin ve analizlerin gösterildiği yan panel.</li>
                        </ul>
                    </ArchCard>
                </div>

                {/* Column 2: Arrow */}
                <div className="hidden md:flex justify-center items-center h-full">
                     <ArrowRight className="h-12 w-12 text-muted-foreground" />
                </div>
                
                {/* Column 3: Backend & AI */}
                <div className="md:col-span-2 space-y-4">
                    <ArchCard title="Server Actions & Genkit AI" icon={<BrainCircuit className="h-6 w-6 text-primary" />}>
                        <p><strong>Server Actions (`actions.ts`):</strong> Arayüzden gelen istekleri alır ve ilgili AI akışlarını (flows) tetikler.</p>
                        <p><strong>Genkit AI Flows (`/ai/flows`):</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>transaction-categorization:</strong> İşlemleri kategorize eder.</li>
                            <li><strong>spending-prediction:</strong> Gelecek harcamaları tahmin eder.</li>
                             <li><strong>financial-recommendations:</strong> Finansal tavsiyeler üretir.</li>
                            <li><strong>behavioral-optimization-agent:</strong> Geri bildirimlere göre tavsiyeleri iyileştirir.</li>
                             <li><strong>life-event-detection:</strong> Hayat olaylarını tespit eder.</li>
                            <li><strong>location-based-offers:</strong> Konuma özel kampanyalar sunar.</li>
                        </ul>
                    </ArchCard>
                    
                    <ArchArrow />

                    <ArchCard title="Veri Kaynağı (Simüle Edilmiş)" icon={<Database className="h-6 w-6 text-primary" />}>
                        <p><strong>`db.ts`:</strong> Uygulamanın "veritabanı" görevi görür. Kullanıcı, işlem ve geri bildirim verilerini hafızada tutar ve yönetir.</p>
                    </ArchCard>
                </div>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="h-6 w-6" />Kullanıcı Etkileşim Akışı</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-6">
                        <li className="ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <p>Kullanıcı uygulamayı açar, `page.tsx` `db.ts`'den verileri çeker.</p>
                        </li>
                        <li className="ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <p>`SidePanel` ve `SpendingChart` bileşenleri `actions.ts` üzerinden AI akışlarını tetikler.</p>
                        </li>
                         <li className="ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <p>Genkit AI, verileri işler ve sonuçları (tahmin, tavsiye vb.) arayüze geri gönderir.</p>
                        </li>
                        <li className="ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <p>Kullanıcı bir tavsiyeyi beğenir/beğenmez, bu geri bildirim `db.ts`'e kaydedilir.</p>
                        </li>
                         <li className="ml-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <p>Bir sonraki tavsiye isteğinde, `behavioral-optimization-agent` bu geri bildirimi kullanarak daha iyi bir öneri sunar.</p>
                        </li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
