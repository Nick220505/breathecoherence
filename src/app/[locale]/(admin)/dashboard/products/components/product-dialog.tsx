'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
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

import type { ProductWithCategory } from '@/features/product/types';
import type { Category } from '@prisma/client';

interface ProductDialogProps {
  children: ReactNode;
  product?: ProductWithCategory;
}

export function ProductDialog({
  children,
  product,
}: Readonly<ProductDialogProps>) {
  const isEdit = !!product;
  const t = useTranslations('ProductDialog');
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      form.setValue('imageBase64', base64String);
      setUploadingImage(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const getImageToDisplay = () => {
    const imageValue = form.watch('imageBase64');
    const categoryId = form.watch('categoryId');

    if (imageValue && imageValue.trim() !== '') {
      return imageValue;
    }

    const isSacredGeometry = categoryId === 'clzot3x5w000014rorc81n5jp';
    return isSacredGeometry
      ? '/products/sacred-geometry.svg'
      : '/products/flower-essence.svg';
  };

  useEffect(() => {
    async function fetchCategories() {
      const [fetchedCategories, err] = await getAllCategories();
      if (!err) {
        setCategories(fetchedCategories);
      }
    }
    void fetchCategories();
  }, []);

  const initialData = product
    ? {
        ...product,
        categoryId: product.category.id,
      }
    : undefined;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema, {
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
        if (
          path === 'categoryId' &&
          (issue.code === ZodIssueCode.too_small ||
            issue.code === ZodIssueCode.invalid_type ||
            issue.code === ZodIssueCode.invalid_enum_value)
        ) {
          const key =
            issue.code === ZodIssueCode.invalid_enum_value
              ? 'validation.type_invalid'
              : 'validation.type_required';
          return { message: t(key) };
        }
        if (path === 'price' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.price_min') };
        }
        if (path === 'stock' && issue.code === ZodIssueCode.invalid_type) {
          return { message: t('validation.stock_int') };
        }
        if (path === 'stock' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.stock_min') };
        }
        if (
          path === 'imageBase64' &&
          issue.code === ZodIssueCode.invalid_string
        ) {
          return { message: t('validation.image_invalid') };
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

  const onSubmit = (values: ProductFormData): void => {
    startTransition(async () => {
      const action = isEdit ? updateProduct : createProduct;
      const { success, message, errors, data } = await action(values);

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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[48rem]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('edit_product') : t('add_product')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? t('edit_form_description') : t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
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
                              <SelectValue
                                placeholder={t('placeholder.category')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{t('categories_label')}</SelectLabel>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
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
                    control={form.control}
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
                    control={form.control}
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

              <FormField
                control={form.control}
                name="imageBase64"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {t('image')}
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
                          <Image
                            src={getImageToDisplay()}
                            alt={
                              field.value
                                ? t('image_alt')
                                : t('default_image_alt')
                            }
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
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
                                {t('uploading')}
                              </>
                            ) : (
                              t('choose_file')
                            )}
                          </Button>
                        </div>
                      </div>
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
