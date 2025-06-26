'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Loader2,
  Mail,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useTransition, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodIssueCode } from 'zod';

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
  DialogTrigger,
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
import { createUser, updateUser } from '@/features/user/actions';
import { UserFormData, userSchema } from '@/features/user/schema';

import type { User } from '@prisma/client';

interface UserDialogProps {
  children: ReactNode;
  user?: User;
}

export function UserDialog({ children, user }: Readonly<UserDialogProps>) {
  const isEdit = !!user;
  const t = useTranslations('UserDialog');
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.name_min') };
        }
        if (
          path === 'email' &&
          issue.code === ZodIssueCode.invalid_string &&
          issue.validation === 'email'
        ) {
          return { message: t('validation.email_invalid') };
        }
        if (path === 'role' && issue.code === ZodIssueCode.invalid_enum_value) {
          return { message: t('validation.role_invalid') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: user?.id,
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'USER',
    },
  });

  const onSubmit = (values: UserFormData): void => {
    startTransition(async () => {
      const action = isEdit ? updateUser : createUser;
      const { success, data, message, errors } = await action(values);

      if (success) {
        form.clearErrors();
        toast.success(isEdit ? t('updated_title') : t('created_title'), {
          description: isEdit
            ? t('updated_description', { name: data?.name ?? '' })
            : t('created_description', { name: data?.name ?? '' }),
        });

        closeRef.current?.click();
      } else {
        form.setError('root.serverError', { message });

        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              form.setError(field as keyof UserFormData, {
                message: messages[0],
              });
            }
          });
        }
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
            <DialogHeader>
              <DialogTitle>
                {isEdit ? t('edit_user') : t('add_user')}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {isEdit ? t('edit_form_description') : t('form_description')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {isEdit && <Input type="hidden" {...form.register('id')} />}

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
                        <SelectItem value="ADMIN">
                          {t('roles.admin')}
                        </SelectItem>
                        <SelectItem value="USER">{t('roles.user')}</SelectItem>
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
                <Button ref={closeRef} variant="outline" type="button">
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? t('editing') : t('adding')}
                  </>
                ) : (
                  <>{isEdit ? t('edit') : t('add')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
