'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Box,
  DollarSign,
  Image as ImageIcon,
  Info,
  Loader2,
  Package2,
  Tags,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodIssueCode } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAllCategories } from '@/features/category/actions';
import { createProduct, updateProduct } from '@/features/product/actions';
import { ProductFormData, productSchema } from '@/features/product/schema';
import { cn } from '@/lib/utils';

import { useProductManagementStore } from './store';

import type { Category } from '@prisma/client';

function FormFields({ categories }: Readonly<{ categories: Category[] }>) {
  const t = useTranslations('FormFields');
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<ProductFormData>();

  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Tags className="h-4 w-4" />
          {t('product_name')}
        </label>
        <Input
          id="name"
          {...register('name')}
          placeholder={t('placeholder.name')}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.name.message}
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
          {...register('description')}
          placeholder={t('placeholder.description')}
        />
        {errors.description && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.description.message}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <label
            htmlFor="categoryId"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Box className="h-4 w-4" />
            {t('category')}
          </label>
          <Select
            onValueChange={(value) => setValue('categoryId', value)}
            defaultValue={getValues('categoryId')}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('placeholder.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('categories.label')}</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.categoryId.message}
            </motion.p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:col-span-2">
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <DollarSign className="h-4 w-4" />
              {t('price')}
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price')}
              placeholder={t('placeholder.price')}
            />
            {errors.price && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.price.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stock"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Package2 className="h-4 w-4" />
              {t('stock')}
            </label>
            <Input
              id="stock"
              type="number"
              {...register('stock')}
              placeholder={t('placeholder.stock')}
            />
            {errors.stock && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.stock.message}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ImageUpload() {
  const { getValues, setValue } = useFormContext<ProductFormData>();
  const t = useTranslations('ImageUpload');
  const [imageData, setImageData] = useState(getValues('imageBase64') ?? '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const productCategoryId = getValues('categoryId');
  const isSacredGeometry = productCategoryId === 'clzot3x5w000014rorc81n5jp';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageData(base64String);
      setValue('imageBase64', base64String);
      setUploadingImage(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <ImageIcon className="h-4 w-4" />
        {t('label')}
      </label>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            'relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed',
            uploadingImage && 'opacity-50',
          )}
        >
          {uploadingImage && (
            <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          )}
          {imageData ? (
            <Image
              src={imageData}
              alt={t('alt.product')}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <Image
              src={
                isSacredGeometry
                  ? '/products/sacred-geometry.svg'
                  : '/products/flower-essence.svg'
              }
              alt={t('alt.default')}
              fill
              className="object-cover"
              sizes="96px"
            />
          )}
        </div>

        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploadingImage}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {uploadingImage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('placeholder.choose_file')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProductFormProps {
  initialData?: ProductFormData;
}

export function ProductForm({ initialData }: Readonly<ProductFormProps>) {
  const t = useTranslations('ProductForm');
  const tProductSchema = useTranslations('ProductSchema');
  const { setAddDialogOpen, setEditDialogOpen, setEditingProduct } =
    useProductManagementStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [, startTransition] = useTransition();

  const action = initialData?.id ? updateProduct : createProduct;
  const [{ success, data, message, errors }, formAction, isPending] =
    useActionState(action, {
      errors: {},
      message: '',
    });

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
    defaultValues: initialData ?? {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      imageBase64: '',
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
    initialData?.id,
    setAddDialogOpen,
    setEditDialogOpen,
    setEditingProduct,
    form,
  ]);

  const onSubmit = (formData: ProductFormData) => {
    const payload = {
      ...formData,
      id: initialData?.id,
    };
    const payloadAsFormData = new FormData();
    for (const key in payload) {
      const value = payload[key as keyof typeof payload];
      if (value !== null && value !== undefined) {
        payloadAsFormData.append(key, String(value));
      }
    }

    startTransition(() => {
      formAction(payloadAsFormData);
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        <FormFields categories={categories} />

        <ImageUpload />

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
      </form>
    </FormProvider>
  );
}
