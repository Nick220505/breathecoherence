'use client';

import { ProductType } from '@prisma/client';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Box,
  DollarSign,
  Info,
  Package2,
  Tags,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

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
import { ProductFormData } from '@/features/product/schema';

export function FormFields() {
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
          className="focus-visible:ring-primary"
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
          className="focus-visible:ring-primary min-h-[100px]"
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
          defaultValue={getValues('type')}
        >
          <SelectTrigger className="focus-visible:ring-primary">
            <SelectValue placeholder={t('placeholder.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('product_types.label')}</SelectLabel>
              <SelectItem value={ProductType.FLOWER_ESSENCE}>
                {t('product_types.flower_essence')}
              </SelectItem>
              <SelectItem value={ProductType.SACRED_GEOMETRY}>
                {t('product_types.sacred_geometry')}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.type && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.type.message}
          </motion.p>
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
            className="focus-visible:ring-primary"
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
    </>
  );
}
