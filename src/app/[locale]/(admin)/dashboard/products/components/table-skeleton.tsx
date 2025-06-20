'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
} from '@/components/ui/table';

function SkeletonCell({ width }: Readonly<{ width: string }>) {
  return (
    <TableCell>
      <div className={`h-4 ${width} bg-muted animate-pulse rounded`} />
    </TableCell>
  );
}

function ActionsSkeleton() {
  return (
    <TableCell>
      <div className="flex items-center gap-2">
        <div className="bg-muted h-8 w-8 animate-pulse rounded" />
        <div className="bg-muted h-8 w-8 animate-pulse rounded" />
      </div>
    </TableCell>
  );
}

function ImageSkeleton() {
  return (
    <TableCell>
      <div className="bg-muted h-16 w-16 animate-pulse rounded-lg" />
    </TableCell>
  );
}

export function TableSkeleton() {
  const t = useTranslations('TableSkeleton');

  const skeletonItems = useMemo(
    () => Array.from({ length: 5 }).map(() => ({ id: crypto.randomUUID() })),
    [],
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('image')}</TableHead>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('type')}</TableHead>
            <TableHead>{t('price')}</TableHead>
            <TableHead>{t('stock')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonItems.map((item) => (
            <TableRow key={item.id}>
              <ImageSkeleton />
              <SkeletonCell width="w-32" />
              <SkeletonCell width="w-24" />
              <SkeletonCell width="w-16" />
              <SkeletonCell width="w-12" />
              <ActionsSkeleton />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
