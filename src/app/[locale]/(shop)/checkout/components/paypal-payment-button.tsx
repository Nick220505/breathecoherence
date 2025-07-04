'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useTranslations } from 'next-intl';

import type { CheckoutFormData } from '@/features/order/types';

interface PayPalPaymentButtonProps {
  finalTotal: number;
  watch: () => CheckoutFormData;
  isFormValid: boolean;
}

export function PayPalPaymentButton({
  finalTotal,
  watch,
  isFormValid,
}: Readonly<PayPalPaymentButtonProps>) {
  const [{ isPending }] = usePayPalScriptReducer();
  const t = useTranslations('PaypalPaymentButton');

  if (!isFormValid) {
    return (
      <div className="text-muted-foreground flex min-h-[100px] items-center justify-center">
        {t('complete_form')}
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="text-muted-foreground flex min-h-[100px] items-center justify-center">
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <PayPalButtons
        style={{
          layout: 'vertical',
          shape: 'rect',
        }}
        createOrder={(_, actions) => {
          const formData = watch();
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: finalTotal.toFixed(2),
                },
              },
            ],
            payer: formData.email
              ? {
                  email_address: formData.email,
                  name: {
                    given_name: formData.name,
                  },
                  address: {
                    address_line_1: formData.address,
                    admin_area_2: formData.city,
                    postal_code: formData.postalCode,
                    country_code: 'US',
                  },
                }
              : undefined,
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            return actions.order.capture().then(() => {});
          }
        }}
      />
    </div>
  );
}
