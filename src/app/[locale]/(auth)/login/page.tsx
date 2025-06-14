import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/i18n/routing';

import LoginForm from './components/login-form';

export default async function LoginPage() {
  const t = await getTranslations('LoginPage');

  return (
    <div className="from-background via-background/80 to-background flex min-h-screen items-center justify-center bg-linear-to-b px-4">
      <div className="w-full max-w-[450px]">
        <div>
          <Link
            href="/"
            className="mb-12 flex items-center justify-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <div className="relative h-24 w-72">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                fill
                sizes="(max-width: 288px) 100vw, 288px"
                className="object-contain transition-all duration-300 hover:scale-105 dark:invert"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-purple-500/10 bg-white/10 py-6 shadow-xl backdrop-blur-lg dark:bg-gray-950/50">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-purple-400 dark:to-blue-400">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              {t('description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </div>
      </div>
    </div>
  );
}
