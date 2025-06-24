'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Info, Loader2, Tags } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { createCategory, updateCategory } from '@/features/category/actions';
import { CategoryFormData, categorySchema } from '@/features/category/schema';

import { useCategoryStore } from './store';

interface CategoryFormProps {
  initialData?: Omit<CategoryFormData, 'description'> & {
    description?: string | null;
  };
}

export function CategoryForm({ initialData }: Readonly<CategoryFormProps>) {
  const t = useTranslations('CategoryForm');
  const tCategorySchema = useTranslations('CategorySchema');
  const { setAddDialogOpen, setEditDialogOpen, setEditingCategory } =
    useCategoryStore();
  const [isPending, startTransition] = useTransition();
  const successShown = useRef(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema, {
      path: [],
      async: false,
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: tCategorySchema('nameMin') };
        }
        if (path === 'description' && issue.code === ZodIssueCode.too_small) {
          return { message: tCategorySchema('descriptionMin') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    },
  });

  const onSubmit = (values: CategoryFormData) => {
    if (successShown.current) return;

    startTransition(async () => {
      const action = initialData?.id ? updateCategory : createCategory;
      const { success, data, message, errors } = await action(values);

      if (success) {
        successShown.current = true;
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
          setEditingCategory(null);
        } else {
          setAddDialogOpen(false);
        }
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
