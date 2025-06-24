'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodIssueCode } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { getAllCategories } from '@/features/category/actions';
import { createProduct, updateProduct } from '@/features/product/actions';
import { ProductFormData, productSchema } from '@/features/product/schema';

import { ProductFormFields } from './product-form-fields';
import { ProductImageUpload } from './product-image-upload';
import { useProductManagementStore } from './store';

import type { Category } from '@prisma/client';

interface ProductFormProps {
  initialData?: ProductFormData;
}

export function ProductForm({ initialData }: Readonly<ProductFormProps>) {
  const t = useTranslations('ProductForm');
  const tProductSchema = useTranslations('ProductSchema');
  const { setAddDialogOpen, setEditDialogOpen, setEditingProduct } =
    useProductManagementStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();

  const successShown = useRef(false);

  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    }
    void fetchCategories();
  }, []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema, {
      path: [],
      async: false,
      // eslint-disable-next-line sonarjs/cognitive-complexity
      errorMap(issue, ctx) {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: tProductSchema('nameMin') };
        }
        if (path === 'description' && issue.code === ZodIssueCode.too_small) {
          return { message: tProductSchema('descriptionMin') };
        }
        if (
          path === 'categoryId' &&
          (issue.code === ZodIssueCode.too_small ||
            issue.code === ZodIssueCode.invalid_type ||
            issue.code === ZodIssueCode.invalid_enum_value)
        ) {
          const key =
            issue.code === ZodIssueCode.invalid_enum_value
              ? 'typeInvalid'
              : 'typeRequired';
          return { message: tProductSchema(key) };
        }
        if (path === 'price' && issue.code === ZodIssueCode.too_small) {
          return { message: tProductSchema('priceMin') };
        }
        if (path === 'stock' && issue.code === ZodIssueCode.invalid_type) {
          return { message: tProductSchema('stockInt') };
        }
        if (path === 'stock' && issue.code === ZodIssueCode.too_small) {
          return { message: tProductSchema('stockMin') };
        }
        if (
          path === 'imageBase64' &&
          issue.code === ZodIssueCode.invalid_string
        ) {
          return { message: tProductSchema('imageInvalid') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      stock: initialData?.stock ?? 0,
      categoryId: initialData?.categoryId ?? '',
      imageBase64: initialData?.imageBase64 ?? '',
    },
  });

  const onSubmit = (values: ProductFormData) => {
    if (successShown.current) return;

    startTransition(async () => {
      const action = initialData?.id ? updateProduct : createProduct;
      const { success, message, errors, data } = await action(values);

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
          setEditingProduct(null);
        } else {
          setAddDialogOpen(false);
        }
      } else {
        form.setError('root.serverError', { message });

        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              form.setError(field as keyof ProductFormData, {
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
        <ProductFormFields categories={categories} />

        <ProductImageUpload />

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
                {initialData?.name ? t('editing') : t('adding')}
              </>
            ) : (
              <>{initialData?.name ? t('edit') : t('add')}</>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
