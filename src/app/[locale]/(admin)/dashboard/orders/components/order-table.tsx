'use client';

import { Edit } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { OrderSummary } from '@/features/order/types';

import { UpdateOrderStatusDialog } from './update-order-status-dialog';

interface OrderTableProps {
  orders: OrderSummary[];
}

export function OrderTable({ orders }: Readonly<OrderTableProps>) {
  const t = useTranslations('OrderTable');
  const locale = useLocale();
  const [updatingOrder, setUpdatingOrder] = useState<OrderSummary | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'PAID':
        return 'default';
      case 'SHIPPED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('id')}</TableHead>
            <TableHead>{t('user')}</TableHead>
            <TableHead>{t('total')}</TableHead>
            <TableHead>{t('status_label')}</TableHead>
            <TableHead>{t('created_at')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.user.email}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {t(`status.${order.status.toLowerCase()}`)}
                </Badge>
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(order.createdAt))}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        onClick={() => setUpdatingOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('edit_tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {updatingOrder && (
        <UpdateOrderStatusDialog
          order={updatingOrder}
          open={!!updatingOrder}
          onOpenChange={(open) => !open && setUpdatingOrder(null)}
        />
      )}
    </>
  );
}
