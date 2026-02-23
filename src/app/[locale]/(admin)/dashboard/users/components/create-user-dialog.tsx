'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUser } from '@/features/user/actions';
import { createUserSchema, type CreateUser } from '@/features/user/schemas';

export function CreateUserDialog({
  onOpenChange,
  ...props
}: Readonly<React.ComponentProps<typeof Dialog>>) {
  const t = useTranslations('CreateUserDialog');

  const { execute, isExecuting } = useAction(createUser, {
    onSuccess: ({ data: { name } }) => {
      form.reset();
      form.clearErrors();
      toast.success(t('created_title'), {
        description: t('created_description', { name }),
      });
      onOpenChange?.(false);
    },
    onError: ({ error: { serverError } }) => {
      form.setError('root.serverError', {
        message: serverError ?? 'An error occurred',
      });
    },
  });

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema, {
      error: (issue) => {
        const path = issue.path?.join('.') ?? '';

        if (path === 'name' && issue.code === 'too_small') {
          return t('validation.name_min');
        }
        if (path === 'email' && issue.code === 'invalid_format') {
          return t('validation.email_invalid');
        }
        if (path === 'role' && issue.code === 'invalid_value') {
          return t('validation.role_invalid');
        }
        if (path === 'password' && issue.code === 'too_small') {
          return t('validation.password_min');
        }
      },
    }),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <DialogHeader>
              <DialogTitle>{t('add_user')}</DialogTitle>
              <DialogDescription className="sr-only">
                {t('form_description')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {t('name')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('placeholder.name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('email')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('placeholder.email')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('role')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('placeholder.role')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">{t('roles.user')}</SelectItem>
                        <SelectItem value="ADMIN">
                          {t('roles.admin')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root?.serverError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {form.formState.errors.root.serverError.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isExecuting}>
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('adding')}
                  </>
                ) : (
                  <>{t('add')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
