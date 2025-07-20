import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function JsonViewer({ data }: { data: any }) {
  return (
    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default async function DbPage() {
  const user = await db.getUser();
  const transactions = await db.getTransactions();
  const credits = await db.getCredits();
  const locations = await db.getLocations();
  const feedback = await db.getFeedback();

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Genel Bakış</CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="user">
                <AccordionTrigger>Kullanıcı Verileri</AccordionTrigger>
                <AccordionContent>
                    <JsonViewer data={user} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="transactions">
                <AccordionTrigger>İşlem Geçmişi ({transactions.length} adet)</AccordionTrigger>
                <AccordionContent>
                    <JsonViewer data={transactions} />
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="credits">
                <AccordionTrigger>Krediler ({credits.length} adet)</AccordionTrigger>
                <AccordionContent>
                    <JsonViewer data={credits} />
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="locations">
                <AccordionTrigger>Konum Bilgileri ({locations.length} adet)</AccordionTrigger>
                <AccordionContent>
                    <JsonViewer data={locations} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="feedback">
                <AccordionTrigger>AI Geri Bildirimleri ({feedback.length} adet)</AccordionTrigger>
                <AccordionContent>
                     <JsonViewer data={feedback} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
