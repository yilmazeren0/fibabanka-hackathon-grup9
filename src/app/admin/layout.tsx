import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package2, Database, Share2, Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">FinSight AI</span>
          </Link>
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-1 inline-block" />
            Ana Sayfa
          </Link>
          <Link
            href="/admin/db"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Database className="h-4 w-4 mr-1 inline-block" />
            Veritabanı
          </Link>
           <Link
            href="/admin/architecture"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Share2 className="h-4 w-4 mr-1 inline-block" />
            Mimari
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          <Button asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
