'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Info, Loader2, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
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
import { updateCategory } from '@/features/category/actions';
import { updateCategorySchema } from '@/features/category/schemas';
import { useServerAction } from 'zsa-react';

import type { UpdateCategoryData } from '@/features/category/types';
import type { Category } from '@prisma/client';

interface EditCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: Readonly<EditCategoryDialogProps>) {
  const t = useTranslations('CategoryDialog');
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, isPending } = useServerAction(updateCategory, {
    onSuccess: ({ data: { name } }) => {
      form.clearErrors();
      toast.success(t('updated_title'), {
        description: t('updated_description', { name }),
      });
      onOpenChange(false);
    },
    onError: ({ err: { message } }) => {
      form.setError('root.serverError', {
        message: message ?? 'An error occurred',
      });
    },
  });

  const form = useForm<UpdateCategoryData>({
    resolver: zodResolver(updateCategorySchema, {
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
      id: category.id,
      name: category.name,
      description: category.description ?? '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <DialogHeader>
              <DialogTitle>{t('edit_category')}</DialogTitle>
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
