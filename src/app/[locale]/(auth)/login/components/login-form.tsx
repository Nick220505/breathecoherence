'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
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

export default function LoginForm() {
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
  );
}
