'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';

function SkeletonCell({ width }: { width: string }) {
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
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
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
