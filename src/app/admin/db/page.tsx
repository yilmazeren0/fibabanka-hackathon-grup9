import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function JsonViewer({ data }: { data: any }) {
  return (
    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default async function DbPage() {
  const user = await db.getUser();
  const transactions = await db.getTransactions();
  const feedback = await db.getFeedback();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Verileri</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={user} />
        </CardContent>
      </Card>
       <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Geri Bildirimler</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={feedback} />
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
