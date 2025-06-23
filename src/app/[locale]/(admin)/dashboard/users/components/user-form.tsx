'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import { Loader2, Mail, User as UserIcon, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
    <FormProvider {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        {initialData?.id && <Input type="hidden" {...form.register('id')} />}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            htmlFor="name"
          >
            <UserIcon className="h-4 w-4" /> {tForm('name')}
          </label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder={tForm('placeholder.name')}
          />
        </div>
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            htmlFor="email"
          >
            <Mail className="h-4 w-4" /> {tForm('email')}
          </label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder={tForm('placeholder.email')}
          />
        </div>
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            htmlFor="role"
          >
            <Shield className="h-4 w-4" /> {tForm('role')}
          </label>
          <Select
            defaultValue={initialData?.role ?? 'USER'}
            onValueChange={(v) => form.setValue('role', v as Role)}
          >
            <SelectTrigger>
              <SelectValue placeholder={tForm('role')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">{tRoles('ADMIN')}</SelectItem>
              <SelectItem value="USER">{tRoles('USER')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
    </FormProvider>
  );
}
