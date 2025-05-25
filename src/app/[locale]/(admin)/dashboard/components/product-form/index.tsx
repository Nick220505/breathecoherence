'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProduct, updateProduct } from '@/features/products/controller';
import { ProductFormData, productSchema } from '@/features/products/schema';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/lib/stores/use-product-store';
import { FormState } from '@/lib/types/form';

import { FormFields } from './form-fields';
import { ImageUpload } from './image-upload';

interface ProductFormProps {
  initialData?: ProductFormData;
}

const initialState: FormState = {
  errors: {},
  message: '',
};

export function ProductForm({
  initialData = {
    name: '',
    description: '',
    type: 'Flower Essence',
    price: 0,
    stock: 0,
    imageUrl: '',
  },
}: Readonly<ProductFormProps>) {
  const t = useTranslations('ProductForm');
  const { toast } = useToast();
  const { setAddDialogOpen, setEditDialogOpen, setEditingProduct } =
    useProductStore();

  const [state, formAction] = useActionState(
    initialData?.id ? updateProduct : createProduct,
    initialState,
  );
  const [isPending, startTransition] = useTransition();
  const successShown = useRef(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (state.success && !successShown.current) {
      successShown.current = true;
      toast({
        title: t('success'),
        description: state.message,
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
    state.success,
    state.message,
    t,
    toast,
    initialData?.id,
    setAddDialogOpen,
    setEditDialogOpen,
    setEditingProduct,
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

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <form
      action={formAction}
      onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      className="space-y-6"
    >
      {initialData.id && <Input type="hidden" {...form.register('id')} />}

      <FormFields form={form} />

      <ImageUpload
        initialImageUrl={form.getValues('imageUrl') ?? undefined}
        productType={form.getValues('type')}
        onImageUrlChange={(url) => form.setValue('imageUrl', url)}
      />

      {!state.success &&
        state.message &&
        Object.keys(state.errors).length > 0 && (
          <p
            className="flex items-center gap-1 text-sm text-red-500"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {state.message}
          </p>
        )}

      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {initialData?.name ? t('editing') : t('adding')}
          </>
        ) : (
          <>{initialData?.name ? t('edit') : t('add')}</>
        )}
      </Button>
    </form>
  );
}
