'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CategoriesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError({
  error,
  reset,
}: Readonly<CategoriesErrorProps>) {
  const t = useTranslations('ErrorBoundary');

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <p className="text-muted-foreground">
        {t('message')}: {error.message}
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground rounded px-4 py-2"
      >
        {t('retry')}
      </button>
    </div>
  );
}
