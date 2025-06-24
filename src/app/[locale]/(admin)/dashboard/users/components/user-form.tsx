'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Loader2,
  Mail,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUser, updateUser } from '@/features/user/actions';
import { userSchema, UserFormData } from '@/features/user/schema';

import { useUserManagementStore } from './store';

interface UserFormProps {
  initialData?: UserFormData;
}

export function UserForm({ initialData }: Readonly<UserFormProps>) {
  const t = useTranslations('UserForm');
  const tUserSchema = useTranslations('UserSchema');
  const tRoles = useTranslations('UserRoles');
  const { setAddDialogOpen, setEditDialogOpen, setEditingUser } =
    useUserManagementStore();
  const [isPending, startTransition] = useTransition();
  const successShown = useRef(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: tUserSchema('nameMin') };
        }
        if (
          path === 'email' &&
          issue.code === ZodIssueCode.invalid_string &&
          issue.validation === 'email'
        ) {
          return { message: tUserSchema('emailInvalid') };
        }
        if (path === 'role' && issue.code === ZodIssueCode.invalid_enum_value) {
          return { message: tUserSchema('roleInvalid') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      role: initialData?.role ?? 'USER',
    },
  });

  const onSubmit = (values: UserFormData) => {
    if (successShown.current) return;

    startTransition(async () => {
      const action = initialData?.id ? updateUser : createUser;
      const { success, data, message, errors } = await action(values);

      if (success) {
        successShown.current = true;
        form.clearErrors();
        toast.success(
          initialData?.id ? t('updated_title') : t('created_title'),
          {
            description: initialData?.id
              ? t('updated_description', { name: data?.name ?? '' })
              : t('created_description', { name: data?.name ?? '' }),
          },
        );

        if (initialData?.id) {
          setEditDialogOpen(false);
          setEditingUser(null);
        } else {
          setAddDialogOpen(false);
        }
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
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        {initialData?.id && <Input type="hidden" {...form.register('id')} />}

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('role')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">{tRoles('ADMIN')}</SelectItem>
                  <SelectItem value="USER">{tRoles('USER')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500"
            role="alert"
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
            className="bg-primary hover:bg-primary/90 w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData?.id ? t('editing') : t('adding')}
              </>
            ) : (
              <>{initialData?.id ? t('edit') : t('add')}</>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
