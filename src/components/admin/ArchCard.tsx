'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ArchCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            {icon}
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
                {children}
            </div>
        </CardContent>
    </Card>
);

export const ArchArrow = () => {
    const ArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
    );

    return (
        <div className="flex justify-center items-center my-4">
            <ArrowIcon className="h-8 w-8 text-muted-foreground" />
        </div>
    )
};
