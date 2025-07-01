'use client';

import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

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

import { DeleteProductDialog } from './delete-product-dialog';
import { EditProductDialog } from './edit-product-dialog';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import type { ProductWithCategory } from '@/features/product/types';

interface ProductTableProps {
  products: ProductWithCategory[];
}

export function ProductTable({ products }: Readonly<ProductTableProps>) {
  const t = useTranslations('ProductTable');
  const locale = useLocale();
  const [editingProduct, setEditingProduct] =
    useState<ProductWithCategory | null>(null);
  const [deletingProduct, setDeletingProduct] =
    useState<ProductWithCategory | null>(null);

  return (
    <>
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
          {products.map((product) => {
            let imageToDisplay: string;
            const actualImageValue = product.imageBase64;
            if (actualImageValue && actualImageValue.trim() !== '') {
              imageToDisplay = actualImageValue;
            } else if (product.category.name === 'Sacred Geometry') {
              imageToDisplay = `/products/sacred-geometry.svg#${product.id}`;
            } else {
              imageToDisplay = '/products/flower-essence.svg';
            }

            let stockBadgeVariant = 'destructive';
            if (product.stock > 10) {
              stockBadgeVariant = 'default';
            } else if (product.stock > 0) {
              stockBadgeVariant = 'secondary';
            }

            const stockDisplay =
              product.stock > 0 ? product.stock : t('out_of_stock');

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-16 w-16">
                    <Image
                      src={imageToDisplay}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover"
                      sizes="64px"
                      placeholder={
                        imageToDisplay.startsWith('data:image')
                          ? 'blur'
                          : 'empty'
                      }
                      blurDataURL={
                        imageToDisplay.startsWith('data:image')
                          ? imageToDisplay
                          : ''
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-semibold">
                    ${product.price.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      stockBadgeVariant as
                        | 'default'
                        | 'secondary'
                        | 'destructive'
                    }
                  >
                    {stockDisplay}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(product.createdAt)}
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(product.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('edit_tooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeletingProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('delete_tooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          product={deletingProduct}
          open={!!deletingProduct}
          onOpenChange={(open) => !open && setDeletingProduct(null)}
        />
      )}
    </>
  );
}
