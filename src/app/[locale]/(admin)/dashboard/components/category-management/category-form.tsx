'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Info, Loader2, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodIssueCode } from 'zod';

import { Button } from '@/components/ui/button';
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
  const [, startTransition] = useTransition();

  const action = initialData?.id ? updateCategory : createCategory;
  const [{ success, data, message, errors }, formAction, isPending] =
    useActionState(action, {
      errors: {},
      message: '',
    });
  const successShown = useRef(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema, {
      path: [],
      async: false,
      errorMap: (issue, ctx) => {
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

  useEffect(() => {
    if (success && !successShown.current) {
      successShown.current = true;

      toast.success(initialData?.id ? t('updated_title') : t('created_title'), {
        description: initialData?.id
          ? t('updated_description', { name: data?.name ?? '' })
          : t('created_description', { name: data?.name ?? '' }),
      });

      if (initialData?.id) {
        setEditDialogOpen(false);
        setEditingCategory(null);
      } else {
        setAddDialogOpen(false);
      }
    }
  }, [
    success,
    data,
    message,
    t,
    initialData?.id,
    setAddDialogOpen,
    setEditDialogOpen,
    setEditingCategory,
    form,
  ]);

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        {initialData?.id && <Input type="hidden" {...form.register('id')} />}

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Tags className="h-4 w-4" />
            {t('name')}
          </label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder={t('placeholder.name')}
          />
          {form.formState.errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {form.formState.errors.name.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Info className="h-4 w-4" />
            {t('description')}
          </label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder={t('placeholder.description')}
          />
          {form.formState.errors.description && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {form.formState.errors.description.message}
            </motion.p>
          )}
        </div>

        {!success && message && Object.keys(errors).length > 0 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {message}
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
    </FormProvider>
  );
}
