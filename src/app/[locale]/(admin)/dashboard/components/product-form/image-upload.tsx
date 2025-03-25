'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface ImageUploadProps {
  initialImageUrl?: string;
  productType: string;
  onImageUrlChange: (url: string) => void;
}

export function ImageUpload({
  initialImageUrl,
  productType,
  onImageUrlChange,
}: ImageUploadProps) {
  const t = useTranslations('ImageUpload');
  const [imageUrl, setImageUrl] = useState(initialImageUrl || '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('type', productType);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageUrl(data.url);
      onImageUrlChange(data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(false);
    }
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
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={t('alt.product')}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <Image
              src={
                productType === 'Sacred Geometry'
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
          <p className="text-muted-foreground mt-1 text-sm">
            {imageUrl ? imageUrl.split('/').pop() : t('placeholder.no_file')}
          </p>
        </div>
      </div>
    </div>
  );
}
