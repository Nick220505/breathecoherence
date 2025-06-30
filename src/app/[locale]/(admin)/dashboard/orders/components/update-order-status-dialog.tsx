'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useServerAction } from 'zsa-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatus } from '@/features/order/actions';
import { orderStatusUpdateSchema } from '@/features/order/schemas';

import type {
  OrderSummary,
  OrderStatusUpdateData,
} from '@/features/order/types';

interface UpdateOrderStatusDialogProps {
  order: OrderSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateOrderStatusDialog({
  order,
  open,
  onOpenChange,
}: Readonly<UpdateOrderStatusDialogProps>) {
  const t = useTranslations('UpdateOrderStatusDialog');

  const form = useForm<OrderStatusUpdateData>({
    resolver: zodResolver(orderStatusUpdateSchema),
    defaultValues: {
      id: order.id,
      status: order.status,
    },
  });

  const { execute, isPending } = useServerAction(updateOrderStatus, {
    onSuccess: () => {
      toast.success(t('updated_title'), {
        description: t('updated_description', { id: order.id }),
      });
      onOpenChange(false);
    },
    onError: ({ err }) => {
      form.setError('root.serverError', { message: err.message });
    },
  });

  const statusOptions = [
    { value: 'PENDING', label: t('status.pending') },
    { value: 'PAID', label: t('status.paid') },
    { value: 'SHIPPED', label: t('status.shipped') },
    { value: 'DELIVERED', label: t('status.delivered') },
    { value: 'CANCELLED', label: t('status.cancelled') },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { id: order.id })}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {t('status_label')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('status_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('updating')}
                    </>
                  ) : (
                    t('update')
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
