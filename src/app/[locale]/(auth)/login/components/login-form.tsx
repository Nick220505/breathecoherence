'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, AtSign, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ZodIssueCode } from 'zod';

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
import { login } from '@/features/auth/actions';
import { LoginFormData, loginSchema } from '@/features/auth/schema';
import { Link } from '@/i18n/routing';

export default function LoginForm() {
  const t = useTranslations('LoginPage');
  const tAuthSchema = useTranslations('AuthSchema.Login');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (
          path === 'email' &&
          issue.code === ZodIssueCode.invalid_string &&
          issue.validation === 'email'
        ) {
          return { message: tAuthSchema('emailInvalid') };
        }
        if (
          path === 'password' &&
          issue.code === ZodIssueCode.too_small &&
          issue.minimum === 1
        ) {
          return { message: tAuthSchema('passwordRequired') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormData) => {
    startTransition(async () => {
      const { success, message, errors } = await login(values);

      if (success) {
        form.clearErrors();

        const { error } = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (error) {
          form.setError('root.serverError', { message: t('error.generic') });
        } else {
          router.push('/');
        }
      } else {
        form.setError('root.serverError', { message });

        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              form.setError(field as keyof LoginFormData, {
                message: messages[0],
              });
            }
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
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
                    disabled={isPending}
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
                    disabled={isPending}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
    </Form>
  );
}
