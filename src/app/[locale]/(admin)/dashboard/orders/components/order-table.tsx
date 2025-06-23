'use client';

import { useLocale, useTranslations } from 'next-intl';

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import type { OrderSummary } from '@/features/order/types';

interface OrderTableProps {
  orders: OrderSummary[];
}

export function OrderTable({ orders }: Readonly<OrderTableProps>) {
  const tHeader = useTranslations('OrderTableHeader');
  const locale = useLocale();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tHeader('id')}</TableHead>
            <TableHead>{tHeader('user')}</TableHead>
            <TableHead>{tHeader('total')}</TableHead>
            <TableHead>{tHeader('status')}</TableHead>
            <TableHead>{tHeader('createdAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.userEmail}</TableCell>
              <TableCell>{order.total.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(order.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
