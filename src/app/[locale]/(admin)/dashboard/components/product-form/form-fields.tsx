'use client';

import {
  AlertCircle,
  Box,
  DollarSign,
  Info,
  Package2,
  Tags,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

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
import { ProductFormData } from '@/features/products/schema';

interface FormFieldsProps {
  form: UseFormReturn<ProductFormData>;
}

export function FormFields({ form }: FormFieldsProps) {
  const t = useTranslations('FormFields');
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

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
          className="focus-visible:ring-primary"
          placeholder={t('placeholder.name')}
        />
        {errors.name && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {errors.name.message}
          </p>
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
          className="focus-visible:ring-primary min-h-[100px]"
          placeholder={t('placeholder.description')}
        />
        {errors.description && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="type"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Box className="h-4 w-4" />
          {t('type')}
        </label>
        <Select
          onValueChange={(value) =>
            setValue('type', value as ProductFormData['type'])
          }
          defaultValue={form.getValues('type')}
        >
          <SelectTrigger className="focus-visible:ring-primary">
            <SelectValue placeholder={t('placeholder.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('product_types.label')}</SelectLabel>
              <SelectItem value="Flower Essence">
                {t('product_types.flower_essence')}
              </SelectItem>
              <SelectItem value="Sacred Geometry">
                {t('product_types.sacred_geometry')}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {errors.type.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            className="focus-visible:ring-primary"
            placeholder={t('placeholder.price')}
          />
          {errors.price && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {errors.price.message}
            </p>
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
            className="focus-visible:ring-primary"
            placeholder={t('placeholder.stock')}
          />
          {errors.stock && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
