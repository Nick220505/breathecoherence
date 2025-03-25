'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function FlowerEssencesPage() {
  const t = useTranslations('FlowerEssencesPage');

  return (
    <div className="from-background to-background/80 min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Header Section */}
          <div className="space-y-4 text-center">
            <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl leading-normal font-bold text-transparent md:text-5xl lg:text-6xl dark:from-purple-400 dark:to-blue-400">
              {t('title')}
            </h1>
            <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-purple-600 to-blue-600" />
          </div>

          {/* Content Section */}
          <div className="prose dark:prose-invert max-w-none space-y-8">
            <div className="rounded-lg border border-purple-500/10 bg-white/5 p-6 shadow-lg backdrop-blur-xs">
              <p className="text-lg leading-relaxed">{t('introduction')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-purple-500/10 bg-white/5 p-6 shadow-lg backdrop-blur-xs">
                <h2 className="mb-4 text-xl font-semibold text-purple-500 dark:text-purple-400">
                  {t('energy.title')}
                </h2>
                <p className="text-base leading-relaxed">
                  {t('energy.description')}
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/10 bg-white/5 p-6 shadow-lg backdrop-blur-xs">
                <h2 className="mb-4 text-xl font-semibold text-blue-500 dark:text-blue-400">
                  {t('healing.title')}
                </h2>
                <p className="text-base leading-relaxed">
                  {t('healing.description')}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-purple-500/10 bg-white/5 p-6 shadow-lg backdrop-blur-xs">
              <p className="text-lg leading-relaxed">{t('benefits')}</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center space-y-6 pt-8">
            <div className="h-px w-full max-w-xs bg-linear-to-r from-transparent via-purple-500/20 to-transparent" />
            <Link
              href={{
                pathname: '/store',
                query: { category: 'Flower Essence' },
              }}
            >
              <Button
                size="lg"
                className="h-auto bg-linear-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg text-white shadow-lg hover:from-purple-700 hover:to-blue-700"
              >
                {t('cta')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
