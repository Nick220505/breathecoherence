'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, User as UserIcon, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  const tForm = useTranslations('UserForm');
  const tRoles = useTranslations('UserRoles');
  const [, startTransition] = useTransition();
  const { setAddDialogOpen, setEditDialogOpen, setEditingUser } =
    useUserManagementStore();

  const action = initialData?.id ? updateUser : createUser;
  const [{ success }, formAction, isPending] = useActionState(action, {
    errors: {},
    message: '',
  });
  const successShown = useRef(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ?? { name: '', email: '', role: 'USER' },
  });

  useEffect(() => {
    if (success && !successShown.current) {
      successShown.current = true;

      toast.success(
        initialData?.id ? tForm('updated_title') : tForm('created_title'),
        {
          description: initialData?.id
            ? tForm('updated_description', { name: form.getValues('name') })
            : tForm('created_description', { name: form.getValues('name') }),
        },
      );

      if (initialData?.id) {
        setEditDialogOpen(false);
        setEditingUser(null);
      } else {
        setAddDialogOpen(false);
      }
    }
  }, [
    success,
    initialData?.id,
    setAddDialogOpen,
    setEditDialogOpen,
    setEditingUser,
    tForm,
    form,
  ]);

  function onSubmit(data: UserFormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    startTransition(() => {
      formAction(formData);
    });
  }

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
                {tForm('name')}
              </FormLabel>
              <FormControl>
                <Input placeholder={tForm('placeholder.name')} {...field} />
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
                {tForm('email')}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={tForm('placeholder.email')}
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
                {tForm('role')}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={tForm('role')} />
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

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData?.id ? tForm('editing') : tForm('adding')}
            </>
          ) : (
            <>{initialData?.id ? tForm('edit') : tForm('add')}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
