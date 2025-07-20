import { Component, Database, BrainCircuit, Users, Layers, Share2, Bot } from 'lucide-react';
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
            
            <Card className="mb-8 border-primary/40 bg-primary/5">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" />Model Context Protocol (MCP)</CardTitle>
                 </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Uygulamanın kalbinde, tüm AI yeteneklerini yöneten ve onlara doğru bağlamı sağlayan bir <strong>"Model Context Protocol" (MCP)</strong> bulunur. Bu, `model-context-protocol.ts` dosyasında yer alan bir orkestratör AI akışıdır.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                     <ArchCard title="1. Frontend (View Katmanı)" icon={<Component className="h-6 w-6 text-primary" />}>
                        <p><strong>Arayüz Bileşenleri:</strong> ShadCN UI ve Tailwind CSS ile oluşturulmuş, sadece veriyi göstermekle görevli "aptal" (dumb) bileşenler. Kendi başlarına veri çekme veya iş mantığı içermezler.</p>
                        <p><strong>Örnekler:</strong> `Header`, `SummaryCards`, `SpendingChart`, `SidePanel` gibi bileşenler.</p>
                    </ArchCard>
                </div>

                <div className="hidden md:flex justify-center items-center h-full">
                     <ArchArrow />
                </div>
                
                <div className="md:col-span-2 space-y-4">
                    <ArchCard title="2. Presenter & MCP" icon={<Users className="h-6 w-6 text-primary" />}>
                        <p><strong>`page.tsx` (Presenter):</strong> Kullanıcı ve işlem verilerini `db.ts`'den çeker. Ardından bu verileri, tek bir merkezî çağrı ile <strong>Model Context Protocol (MCP)</strong> akışına gönderir.</p>
                        <p><strong>MCP Akışı:</strong> Gerekli tüm alt AI akışlarını (harcama tahmini, tavsiye vb.) paralel olarak tetikler ve sonuçları birleştirerek Presenter'a geri döner.</p>
                    </ArchCard>
                </div>
            </div>

             <div className="flex justify-center my-4">
                <ArchArrow />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                 <ArchCard title="3. Uzman AI Akışları" icon={<BrainCircuit className="h-6 w-6 text-primary" />}>
                    <p>MCP tarafından tetiklenen, her biri kendi alanında uzmanlaşmış Genkit AI akışlarıdır. Örneğin:</p>
                     <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                        <li>`spending-prediction`</li>
                        <li>`financial-recommendations`</li>
                        <li>`life-event-detection`</li>
                        <li>`location-based-offers`</li>
                    </ul>
                </ArchCard>
                 <ArchCard title="4. Veri Kaynağı" icon={<Database className="h-6 w-6 text-primary" />}>
                    <p><strong>`db.ts`:</strong> Uygulamanın "veritabanı" görevi görür. Kullanıcı, işlem ve geri bildirim verilerini hafızada tutar ve yönetir.</p>
                </ArchCard>
                 <ArchCard title="5. Geri Bildirim Döngüsü" icon={<Layers className="h-6 w-6 text-primary" />}>
                    <p>Kullanıcı bir tavsiyeye geri bildirimde bulunduğunda, bu bilgi `db.ts`'e kaydedilir. MCP, bir sonraki çalışmasında bu geri bildirimi de bağlama ekleyerek `behavioral-optimization-agent`'ı tetikler ve daha kişisel sonuçlar üretir.</p>
                </ArchCard>
            </div>
        </div>
    );
}
