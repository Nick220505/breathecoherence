'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  FileText,
  Home,
  Mail,
  Map,
  MapPin,
  MapPinIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CheckoutFormData } from '@/features/order/types';

interface ShippingFormFieldsProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function ShippingFormFields({
  form,
}: Readonly<ShippingFormFieldsProps>) {
  const t = useTranslations('ShippingFormFields');
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = form;

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <MapPin className="h-5 w-5" />
        {t('shipping_info')}
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            {t('name')}
          </Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
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
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Mail className="h-4 w-4" />
            {t('email')}
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            placeholder={t('placeholder.email')}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Home className="h-4 w-4" />
            {t('address')}
          </Label>
          <Input
            id="address"
            {...register('address')}
            className={errors.address ? 'border-red-500' : ''}
            placeholder={t('placeholder.address')}
          />
          {errors.address && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-sm text-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.address.message}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPinIcon className="h-4 w-4" />
              {t('city')}
            </Label>
            <Input
              id="city"
              {...register('city')}
              className={errors.city ? 'border-red-500' : ''}
              placeholder={t('placeholder.city')}
            />
            {errors.city && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.city.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="state"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Map className="h-4 w-4" />
              {t('state')}
            </Label>
            <Select
              onValueChange={(value) => {
                setValue('state', value);
                void trigger('state');
              }}
            >
              <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('placeholder.state')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AL">Alabama</SelectItem>
                <SelectItem value="AK">Alaska</SelectItem>
                <SelectItem value="AZ">Arizona</SelectItem>
                <SelectItem value="AR">Arkansas</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="CO">Colorado</SelectItem>
                <SelectItem value="CT">Connecticut</SelectItem>
                <SelectItem value="DE">Delaware</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
                <SelectItem value="HI">Hawaii</SelectItem>
                <SelectItem value="ID">Idaho</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                <SelectItem value="IN">Indiana</SelectItem>
                <SelectItem value="IA">Iowa</SelectItem>
                <SelectItem value="KS">Kansas</SelectItem>
                <SelectItem value="KY">Kentucky</SelectItem>
                <SelectItem value="LA">Louisiana</SelectItem>
                <SelectItem value="ME">Maine</SelectItem>
                <SelectItem value="MD">Maryland</SelectItem>
                <SelectItem value="MA">Massachusetts</SelectItem>
                <SelectItem value="MI">Michigan</SelectItem>
                <SelectItem value="MN">Minnesota</SelectItem>
                <SelectItem value="MS">Mississippi</SelectItem>
                <SelectItem value="MO">Missouri</SelectItem>
                <SelectItem value="MT">Montana</SelectItem>
                <SelectItem value="NE">Nebraska</SelectItem>
                <SelectItem value="NV">Nevada</SelectItem>
                <SelectItem value="NH">New Hampshire</SelectItem>
                <SelectItem value="NJ">New Jersey</SelectItem>
                <SelectItem value="NM">New Mexico</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="NC">North Carolina</SelectItem>
                <SelectItem value="ND">North Dakota</SelectItem>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="OK">Oklahoma</SelectItem>
                <SelectItem value="OR">Oregon</SelectItem>
                <SelectItem value="PA">Pennsylvania</SelectItem>
                <SelectItem value="RI">Rhode Island</SelectItem>
                <SelectItem value="SC">South Carolina</SelectItem>
                <SelectItem value="SD">South Dakota</SelectItem>
                <SelectItem value="TN">Tennessee</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="UT">Utah</SelectItem>
                <SelectItem value="VT">Vermont</SelectItem>
                <SelectItem value="VA">Virginia</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="WV">West Virginia</SelectItem>
                <SelectItem value="WI">Wisconsin</SelectItem>
                <SelectItem value="WY">Wyoming</SelectItem>
              </SelectContent>
            </Select>
            {errors.state && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.state.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="postalCode"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPinIcon className="h-4 w-4" />
              {t('zip_code')}
            </Label>
            <Input
              id="postalCode"
              {...register('postalCode')}
              className={errors.postalCode ? 'border-red-500' : ''}
              placeholder={t('placeholder.zip_code')}
            />
            {errors.postalCode && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.postalCode.message}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="orderNotes"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <FileText className="h-4 w-4" />
          {t('order_notes')}
        </Label>
        <Textarea
          id="orderNotes"
          {...register('orderNotes')}
          className="min-h-[100px]"
          placeholder={t('placeholder.order_notes')}
        />
      </div>
    </div>
  );
}
