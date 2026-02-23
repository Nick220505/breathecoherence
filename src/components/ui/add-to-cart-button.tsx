import { Loader2, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  isAdding: boolean;
  isOutOfStock: boolean;
  canAddMore: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  isAdding,
  isOutOfStock,
  canAddMore,
  onClick,
  disabled = false,
  className,
}: Readonly<AddToCartButtonProps>) {
  const t = useTranslations('AddToCartButton');

  const isButtonDisabled = disabled || isAdding || isOutOfStock || !canAddMore;

  return (
    <Button
      onClick={onClick}
      disabled={isButtonDisabled}
      className={className}
      size="lg"
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('adding_to_cart')}
        </>
      ) : isOutOfStock ? (
        t('out_of_stock')
      ) : !canAddMore ? (
        t('max_quantity_reached')
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t('add_to_cart')}
        </>
      )}
    </Button>
  );
}
