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

export default async function CategoriesLoading() {
  const t = await getTranslations('CategoriesLoading');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <div className="bg-muted h-8 w-32 animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('description')}</TableHead>
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
      </CardContent>
    </Card>
  );
}
