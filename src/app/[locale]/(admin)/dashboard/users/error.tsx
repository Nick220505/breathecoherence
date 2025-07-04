'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function UsersError({ error, reset }: ErrorProps) {
  const t = useTranslations('UsersError');

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
