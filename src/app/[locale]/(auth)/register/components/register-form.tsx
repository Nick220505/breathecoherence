'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { AlertCircle, AtSign, Loader2, Lock, Shield, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { register } from '@/features/auth/actions';
import { EMAIL_SEND_FAILED, USER_EXISTS } from '@/features/auth/errors';
import { registerSchema, type Register } from '@/features/auth/schemas';
import { Link, useRouter } from '@/i18n/routing';

export default function RegisterForm() {
  const t = useTranslations('RegisterForm');
  const router = useRouter();

  const { execute, isExecuting } = useAction(register, {
    onSuccess: () => {
      form.clearErrors();
      router.push({
        pathname: '/verify',
        query: { email: form.getValues('email') },
      });
    },
    onError: ({ error: { serverError } }) => {
      form.setError('root.serverError', {
        message:
          {
            [USER_EXISTS]: t('error.userExists'),
            [EMAIL_SEND_FAILED]: t('error.emailSendFailed'),
          }[serverError ?? ''] ?? t('error.generic'),
      });
    },
  });

  const form = useForm<Register>({
    resolver: zodResolver(registerSchema, {
      error: (issue) => {
        const path = issue.path?.join('.') ?? '';

        if (path === 'email' && issue.code === 'invalid_format') {
          return t('validation.emailInvalid');
        }
        if (path === 'password' && issue.code === 'too_small') {
          return t('validation.passwordMinLength');
        }
        if (path === 'name' && issue.code === 'too_small') {
          return t('validation.nameRequired');
        }
        if (path === 'confirmPassword' && issue.code === 'too_small') {
          return t('validation.confirmPasswordMinLength');
        }
        if (path === 'confirmPassword' && issue.code === 'custom') {
          return t('validation.passwordsDontMatch');
        }
      },
    }),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('name')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t('placeholder.name')}
                    disabled={isExecuting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AtSign className="h-4 w-4" />
                  {t('email')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('placeholder.email')}
                    disabled={isExecuting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t('password')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('placeholder.password')}
                    disabled={isExecuting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t('confirmPassword')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('placeholder.confirmPassword')}
                    disabled={isExecuting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {form.formState.errors.root?.serverError && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-1 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {form.formState.errors.root.serverError.message}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            type="submit"
            disabled={isExecuting}
            className="w-full transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('creating')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <span>{t('haveAccount')}</span>{' '}
          <Link
            href="/login"
            className="font-medium text-purple-600 transition-colors hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
          >
            {t('login')}
          </Link>
        </motion.div>
      </form>
    </Form>
  );
}
