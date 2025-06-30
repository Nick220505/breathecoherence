import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function Loading() {
  const t = await getTranslations('OrdersLoading');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <div className="bg-muted h-8 w-32 animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('id')}</TableHead>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('total')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 })
                .map(() => ({ id: crypto.randomUUID() }))
                .map(({ id }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
