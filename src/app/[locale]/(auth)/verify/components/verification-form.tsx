'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { ZodIssueCode } from 'zod';
import { useServerAction } from 'zsa-react';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verify } from '@/features/auth/actions';
import { verifySchema } from '@/features/auth/schemas';
import { Link, useRouter } from '@/i18n/routing';

import type { VerifyData } from '@/features/auth/types';

interface VerificationFormProps {
  email: string;
}

export function VerificationForm({ email }: Readonly<VerificationFormProps>) {
  const t = useTranslations('VerificationForm');
  const router = useRouter();

  const { execute, isPending } = useServerAction(verify, {
    onSuccess: () => {
      form.clearErrors();
      router.push('/login');
    },
    onError: ({ err: { message } }) => {
      form.setError('root.serverError', {
        message: message ?? t('error.generic'),
      });
    },
  });

  const form = useForm<VerifyData>({
    resolver: zodResolver(verifySchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (
          path === 'email' &&
          issue.code === ZodIssueCode.invalid_string &&
          issue.validation === 'email'
        ) {
          return { message: t('validation.emailInvalid') };
        }
        if (
          path === 'code' &&
          ((issue.code === ZodIssueCode.too_small && issue.minimum === 6) ||
            (issue.code === ZodIssueCode.too_big && issue.maximum === 6) ||
            issue.code === ZodIssueCode.invalid_string)
        ) {
          return { message: t('validation.codeLength') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: { email, code: '' },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        className="w-full max-w-[450px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <div className="relative h-16 w-48">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                fill
                sizes="(max-width: 192px) 100vw, 192px"
                className="object-contain transition-all duration-300 dark:invert"
                priority
              />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-purple-500/10 bg-white/10 py-6 shadow-xl backdrop-blur-lg dark:bg-gray-950/50"
        >
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-purple-400 dark:to-blue-400">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              {t('description')}{' '}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {email}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(execute)} className="space-y-6">
                <input type="hidden" {...form.register('email')} />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center">
                      <FormControl>
                        <InputOTP maxLength={6} {...field} disabled={isPending}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                      {form.formState.errors.root?.serverError && (
                        <p className="flex items-center gap-1 pt-2 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          {form.formState.errors.root.serverError.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('loading')}
                    </>
                  ) : (
                    t('submit')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}
