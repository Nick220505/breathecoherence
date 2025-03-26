'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/controller';
import { LoginFormData, loginSchema } from '@/features/auth/schema';
import { Link } from '@/i18n/routing';
import { FormState } from '@/lib/types/form';

const initialState: FormState = {
  errors: {},
  message: '',
  success: false,
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const [state, formAction] = useActionState(login, initialState);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (state.success) {
      const formData = new FormData();
      formData.append('email', form.getValues('email'));
      formData.append('password', form.getValues('password'));

      const performSignIn = async () => {
        try {
          const result = await signIn('credentials', {
            email: form.getValues('email'),
            password: form.getValues('password'),
            redirect: false,
          });

          if (result?.error) {
            console.error('Error signing in:', result.error);
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Sign in failed:', error);
        }
      };

      void performSignIn();
    }
  }, [state.success, router, form]);

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => formAction(formData));
  };

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <div className="from-background via-background/80 to-background flex min-h-screen items-center justify-center bg-linear-to-b px-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="w-full max-w-[450px]"
      >
        <motion.div variants={fadeInUp}>
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
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="overflow-hidden rounded-2xl border border-purple-500/10 bg-white/10 shadow-xl backdrop-blur-lg dark:bg-gray-950/50"
        >
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-purple-400 dark:to-blue-400">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={formAction}
              onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t('email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('placeholder.email')}
                  {...form.register('email')}
                  disabled={isLoading}
                  className="border-purple-500/20 bg-white/5 transition-all focus:border-purple-500 focus:ring-purple-500/20 dark:bg-gray-950/50"
                />
                {state.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-sm text-red-500"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {state.errors.email[0]}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t('password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('placeholder.password')}
                  {...form.register('password')}
                  disabled={isLoading}
                  className="border-purple-500/20 bg-white/5 transition-all focus:border-purple-500 focus:ring-purple-500/20 dark:bg-gray-950/50"
                />
                {state.errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-sm text-red-500"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {state.errors.password[0]}
                  </motion.p>
                )}
              </motion.div>

              {state.message && !state.success && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-1 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500"
                >
                  <AlertCircle className="h-4 w-4" />
                  {state.message}
                </motion.p>
              )}

              <motion.div variants={fadeInUp}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('loading')}
                    </>
                  ) : (
                    t('submit')
                  )}
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
              >
                <span>{t('noAccount')}</span>{' '}
                <Link
                  href="/register"
                  className="font-medium text-purple-600 transition-colors hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  {t('register')}
                </Link>
              </motion.div>
            </form>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}
