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
  const tDashboard = await getTranslations('dashboard');
  const tSkeleton = await getTranslations('TableSkeleton');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tDashboard('productTable.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tSkeleton('image')}</TableHead>
                <TableHead>{tSkeleton('name')}</TableHead>
                <TableHead>{tSkeleton('type')}</TableHead>
                <TableHead>{tSkeleton('price')}</TableHead>
                <TableHead>{tSkeleton('stock')}</TableHead>
                <TableHead>{tSkeleton('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="bg-muted h-16 w-16 animate-pulse rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-12 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                      <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                    </div>
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
