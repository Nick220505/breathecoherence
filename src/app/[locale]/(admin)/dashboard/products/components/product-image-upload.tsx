'use client';

import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProductFormData } from '@/features/product/schema';
import { cn } from '@/lib/utils';

export function ProductImageUpload() {
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
