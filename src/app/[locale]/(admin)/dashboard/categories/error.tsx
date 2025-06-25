'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoriesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError({
  error,
  reset,
}: Readonly<CategoriesErrorProps>) {
  const t = useTranslations('CategoriesError');

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="text-destructive h-5 w-5" />
          <CardTitle className="text-destructive">{t('title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{t('message')}</p>
        {error.message && (
          <p className="text-muted-foreground border-muted border-l-2 pl-3 text-sm">
            {error.message}
          </p>
        )}
        <Button onClick={reset} variant="outline" className="w-full">
          {t('retry')}
        </Button>
      </CardContent>
    </Card>
  );
}
