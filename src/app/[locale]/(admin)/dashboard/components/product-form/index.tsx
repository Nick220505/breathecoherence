'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType } from '@prisma/client';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import Form from 'next/form';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ZodIssueCode } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProduct, updateProduct } from '@/features/product/actions';
import { ProductFormData, productSchema } from '@/features/product/schema';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/lib/stores/use-product-store';

import { FormFields } from './form-fields';
import { ImageUpload } from './image-upload';

interface ProductFormProps {
  initialData?: ProductFormData;
}

export function ProductForm({
  initialData = {
    name: '',
    description: '',
    type: ProductType.FLOWER_ESSENCE,
    price: 0,
    stock: 0,
  },
}: Readonly<ProductFormProps>) {
  const t = useTranslations('ProductForm');
  const tProductSchema = useTranslations('ProductSchema');
  const { toast } = useToast();
  const { setAddDialogOpen, setEditDialogOpen, setEditingProduct } =
    useProductStore();

  const [{ success, data, message, errors }, formAction] = useActionState(
    initialData?.id ? updateProduct : createProduct,
    { errors: {}, message: '' },
  );
  const [isPending, startTransition] = useTransition();
  const successShown = useRef(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema, {
      errorMap: (issue, ctx) => {
        const path = issue.path.join('.');

        if (path === 'name' && issue.code === ZodIssueCode.too_small) {
          return { message: tProductSchema('nameMin') };
        }
        if (path === 'description' && issue.code === ZodIssueCode.too_small) {
          return { message: tProductSchema('descriptionMin') };
        }
        if (path === 'type' && issue.code === ZodIssueCode.invalid_enum_value) {
          return { message: tProductSchema('typeInvalid') };
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
    defaultValues: initialData,
  });

  useEffect(() => {
    if (success && !successShown.current) {
      successShown.current = true;

      toast({
        title: initialData?.id ? t('updated_title') : t('created_title'),
        description: initialData?.id
          ? t('updated_description', { name: data?.name ?? '' })
          : t('created_description', { name: data?.name ?? '' }),
        variant: 'default',
      });

      if (initialData?.id) {
        setEditDialogOpen(false);
        setEditingProduct(null);
      } else {
        setAddDialogOpen(false);
      }
    }
  }, [
    success,
    data,
    message,
    t,
    toast,
    initialData?.id,
    setAddDialogOpen,
    setEditDialogOpen,
    setEditingProduct,
    form,
  ]);

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => formAction(formData));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={formAction}
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        {initialData.id && <Input type="hidden" {...form.register('id')} />}

        <FormFields />

        <ImageUpload
          initialImage={form.getValues('imageBase64') ?? undefined}
          productType={form.getValues('type')}
          onImageChange={(base64) => form.setValue('imageBase64', base64)}
        />

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
                {initialData?.name ? t('editing') : t('adding')}
              </>
            ) : (
              <>{initialData?.name ? t('edit') : t('add')}</>
            )}
          </Button>
        </motion.div>
      </Form>
    </FormProvider>
  );
}
