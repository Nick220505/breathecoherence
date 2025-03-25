'use client';

import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTableStore } from '@/lib/stores/use-table-store';

export function ProductTableHeader() {
  const t = useTranslations('ProductTableHeader');
  const {
    nameFilter,
    typeFilter,
    setNameFilter,
    setTypeFilter,
    setSortConfig,
  } = useTableStore();

  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t('image')}</TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t('name')}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <div className="p-2">
                  <Input
                    placeholder={t('filter_by_name')}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortConfig('name')}>
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                  {t('sort_by_name')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t('type')}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <div className="p-2">
                  <Input
                    placeholder={t('filter_by_type')}
                    value={typeFilter === 'all' ? '' : typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value || 'all')}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  {t('all')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTypeFilter('Flower Essence')}
                >
                  {t('flower_essence')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTypeFilter('Sacred Geometry')}
                >
                  {t('sacred_geometry')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortConfig('type')}>
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                  {t('sort_by_type')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t('price')}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortConfig('price')}
              className="h-8 w-8 p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t('stock')}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortConfig('stock')}
              className="h-8 w-8 p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </TableHead>
        <TableHead>{t('actions')}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
