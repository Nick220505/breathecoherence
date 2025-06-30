'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Info, Loader2, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, type ReactNode } from 'react';
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
import { createCategory } from '@/features/category/actions';
import { createCategorySchema } from '@/features/category/schemas';
import { useServerAction } from 'zsa-react';

import type { CreateCategoryData } from '@/features/category/types';

interface CreateCategoryDialogProps {
  children: ReactNode;
}

export function CreateCategoryDialog({
  children,
}: Readonly<CreateCategoryDialogProps>) {
  const t = useTranslations('CategoryDialog');
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, isPending } = useServerAction(createCategory, {
    onSuccess: ({ data: { name } }) => {
      form.reset();
      form.clearErrors();
      toast.success(t('created_title'), {
        description: t('created_description', { name }),
      });
      closeRef.current?.click();
    },
    onError: ({ err: { message } }) => {
      form.setError('root.serverError', {
        message: message ?? 'An error occurred',
      });
    },
  });

  const form = useForm<CreateCategoryData>({
    resolver: zodResolver(createCategorySchema, {
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
    defaultValues: { name: '', description: '' },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <DialogHeader>
              <DialogTitle>{t('add_category')}</DialogTitle>
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
