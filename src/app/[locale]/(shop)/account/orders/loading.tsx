import { getTranslations } from 'next-intl/server';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function Loading() {
  const t = await getTranslations('OrderHistory');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="bg-muted h-8 w-64 animate-pulse rounded" />
          <div className="bg-muted mt-2 h-4 w-48 animate-pulse rounded" />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('order_id')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('total')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 })
                .map(() => ({ id: crypto.randomUUID() }))
                .map(({ id }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted ml-auto h-4 w-20 animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted ml-auto h-8 w-24 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
