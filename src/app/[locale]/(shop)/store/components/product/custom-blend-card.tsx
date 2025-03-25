'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/i18n/routing';

export function CustomBlendCard() {
  const t = useTranslations('CustomBlendCard');

  return (
    <Link href="/store/custom-blend">
      <Card className="group transform cursor-pointer overflow-hidden border-purple-500/20 bg-linear-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 shadow-lg backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="border-b border-purple-500/10 p-6">
          <CardTitle className="flex items-center gap-3 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-lg text-transparent md:text-xl dark:from-purple-400 dark:to-blue-400">
            <span className="inline-block text-2xl text-pink-500 transition-transform duration-300 group-hover:scale-110 md:text-3xl dark:text-pink-400">
              🌿
            </span>
            {t('title')}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="relative overflow-hidden rounded-lg transition-shadow duration-300 group-hover:shadow-2xl">
            <Image
              src="/images/custom-blend.jpg"
              alt="Custom Blend"
              width={400}
              height={400}
              className="aspect-square w-full transform rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {t('description')}
          </p>
        </CardContent>
        <CardFooter className="xs:flex-row flex flex-col items-center justify-between border-t border-purple-500/10 bg-white/5 p-6">
          <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-purple-400 dark:to-blue-400">
            {t('price')}
          </span>
          <Button
            size="lg"
            className="bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 group-hover:shadow-xl hover:from-purple-700 hover:to-blue-700"
          >
            {t('cta')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
