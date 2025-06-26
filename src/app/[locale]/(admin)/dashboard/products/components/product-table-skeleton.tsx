import { getTranslations } from 'next-intl/server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export async function ProductTableSkeleton() {
  const t = await getTranslations('ProductTableSkeleton');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('image')}</TableHead>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('category')}</TableHead>
          <TableHead>{t('price')}</TableHead>
          <TableHead>{t('stock')}</TableHead>
          <TableHead>{t('created_at')}</TableHead>
          <TableHead>{t('updated_at')}</TableHead>
          <TableHead className="text-right">{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 })
          .map(() => ({ id: crypto.randomUUID() }))
          .map(({ id }) => (
            <TableRow key={id}>
              <TableCell>
                <div className="bg-muted h-16 w-16 animate-pulse rounded-lg" />
              </TableCell>
              <TableCell>
                <div className="bg-muted h-4 w-32 animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="bg-muted h-6 w-24 animate-pulse rounded-full" />
              </TableCell>
              <TableCell>
                <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
              </TableCell>
              <TableCell>
                <div className="bg-muted h-6 w-12 animate-pulse rounded-full" />
              </TableCell>
              <TableCell>
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
