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
import { useForm, useFormContext } from 'react-hook-form';
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
  const { control } = useFormContext<ProductFormData>();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              {t('product_name')}
            </FormLabel>
            <FormControl>
              <Input placeholder={t('placeholder.name')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t('description')}
            </FormLabel>
            <FormControl>
              <Textarea placeholder={t('placeholder.description')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <FormField
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  {t('category')}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholder.category')} />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:col-span-2">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('price')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t('placeholder.price')}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Package2 className="h-4 w-4" />
                  {t('stock')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('placeholder.stock')}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}

function ImageUpload() {
  const { control, getValues } = useFormContext<ProductFormData>();
  const t = useTranslations('ImageUpload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const productCategoryId = getValues('categoryId');
  const isSacredGeometry = productCategoryId === 'clzot3x5w000014rorc81n5jp';

  return (
    <FormField
      control={control}
      name="imageBase64"
      render={({ field }) => {
        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) {
            return;
          }

          setUploadingImage(true);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            field.onChange(base64String);
            setUploadingImage(false);
          };
          reader.onerror = () => {
            console.error('Error reading file');
            setUploadingImage(false);
          };
          reader.readAsDataURL(file);
        };

        return (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {t('label')}
            </FormLabel>
            <FormControl>
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
                  {field.value ? (
                    <Image
                      src={field.value}
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
                    onClick={() =>
                      document.getElementById('image-upload')?.click()
                    }
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
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
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
    <Form {...form}>
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
    </Form>
  );
}
