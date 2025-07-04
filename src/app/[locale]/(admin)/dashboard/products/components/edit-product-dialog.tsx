'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '@prisma/client';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodIssueCode } from 'zod';
import { useServerAction } from 'zsa-react';

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
import { updateProduct } from '@/features/product/actions';
import { updateProductSchema } from '@/features/product/schemas';
import type {
  ProductWithCategory,
  UpdateProductData,
} from '@/features/product/types';

interface EditProductDialogProps extends React.ComponentProps<typeof Dialog> {
  product: ProductWithCategory;
}

export function EditProductDialog({
  product,
  onOpenChange,
  ...props
}: Readonly<EditProductDialogProps>) {
  const t = useTranslations('EditProductDialog');
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { execute, isPending } = useServerAction(updateProduct, {
    onSuccess: ({ data: { name } }) => {
      form.clearErrors();
      toast.success(t('updated_title'), {
        description: t('updated_description', { name }),
      });
      onOpenChange?.(false);
    },
    onError: ({ err: { message } }) => {
      form.setError('root.serverError', {
        message: message ?? 'An error occurred',
      });
    },
  });

  const form = useForm<UpdateProductData>({
    resolver: zodResolver(updateProductSchema, {
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
        if (path === 'categoryId' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.category_required') };
        }
        if (path === 'price' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.price_min') };
        }
        if (path === 'stock' && issue.code === ZodIssueCode.too_small) {
          return { message: t('validation.stock_min') };
        }

        return { message: ctx.defaultError };
      },
    }),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      imageBase64: product.imageBase64 ?? '',
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      const [categoriesData, err] = await getAllCategories();
      if (err) {
        toast.error(t('error.load_categories'));
        return;
      }
      setCategories(categoriesData);
    };

    void loadCategories();
  }, [t]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('error.image_too_large'));
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      form.setValue('imageBase64', result);
      setUploadingImage(false);
    };
    reader.onerror = () => {
      toast.error(t('error.image_upload'));
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const imageValue = form.watch('imageBase64');

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-[48rem]">
        <DialogHeader>
          <DialogTitle>{t('edit_product')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('edit_form_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <div className="space-y-6">
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

                <div className="sm:col-span-1">
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
                            min="0"
                            placeholder={t('placeholder.price')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-1">
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
                            min="0"
                            placeholder={t('placeholder.stock')}
                            {...field}
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
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {t('image')}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed">
                          {uploadingImage && (
                            <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
                              <Loader2 className="text-primary h-6 w-6 animate-spin" />
                            </div>
                          )}
                          {imageValue ? (
                            <Image
                              src={imageValue}
                              alt={t('preview')}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="text-muted-foreground/50 h-8 w-8" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                            id="image-upload-edit"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={uploadingImage}
                            onClick={() =>
                              document
                                .getElementById('image-upload-edit')
                                ?.click()
                            }
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('uploading_image')}
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
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending || uploadingImage}>
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
