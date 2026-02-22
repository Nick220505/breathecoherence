'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Loader2,
  Mail,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodIssueCode } from 'zod';
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
import { updateUser } from '@/features/user/actions';
import {
  updateUserSchema,
  type UpdateUserData,
  type UserSummary,
} from '@/features/user/schemas';

interface EditUserDialogProps extends React.ComponentProps<typeof Dialog> {
  user: UserSummary;
}

export function EditUserDialog({
  user,
  onOpenChange,
  ...props
}: Readonly<EditUserDialogProps>) {
  const t = useTranslations('EditUserDialog');

  const { execute, isExecuting } = useAction(updateUser, {
    onSuccess: ({ data: { name } }) => {
      form.clearErrors();
      toast.success(t('updated_title'), {
        description: t('updated_description', { name }),
      });
      onOpenChange?.(false);
    },
    onError: ({ error: { serverError } }) => {
      form.setError('root.serverError', {
        message: serverError ?? 'An error occurred',
      });
    },
  });

  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.name_min') };
        }
        if (path === 'email' && issue.code === ZodIssueCode.invalid_string) {
          return { message: t('validation.email_invalid') };
        }
        if (path === 'role' && issue.code === ZodIssueCode.invalid_enum_value) {
          return { message: t('validation.role_invalid') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <DialogHeader>
              <DialogTitle>{t('edit_user')}</DialogTitle>
              <DialogDescription className="sr-only">
                {t('edit_form_description')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Hidden id field */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                )}
              />

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
                    {t('editing')}
                  </>
                ) : (
                  <>{t('edit')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
