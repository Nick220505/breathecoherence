'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Info, Loader2, Tags } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { createCategory, updateCategory } from '@/features/category/actions';
import { CategoryFormData, categorySchema } from '@/features/category/schema';

import type { Category } from '@prisma/client';

interface CategoryDialogProps {
  children: ReactNode;
  category?: Category;
}

export function CategoryDialog({
  children,
  category,
}: Readonly<CategoryDialogProps>) {
  const isEdit = !!category;
  const t = useTranslations('CategoryDialog');
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.name_min') };
        }
        if (path === 'description' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.description_min') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: category?.id,
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  });

  const onSubmit = (values: CategoryFormData) => {
    startTransition(async () => {
      const action = isEdit ? updateCategory : createCategory;
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
              form.setError(field as keyof CategoryFormData, {
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
                {isEdit ? t('edit_category') : t('add_category')}
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
                      <Tags className="h-4 w-4" />
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {t('description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('placeholder.description')}
                        {...field}
                      />
                    </FormControl>
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
