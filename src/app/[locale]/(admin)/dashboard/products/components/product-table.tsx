import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';

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
import { getAllProducts } from '@/features/product/actions';

import { DeleteProductDialog } from './delete-product-dialog';
import { ProductDialog } from './product-dialog';

export async function ProductTable() {
  const t = await getTranslations('ProductTable');
  const locale = await getLocale();
  const products = await getAllProducts();

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
                      imageToDisplay.startsWith('data:image') ? 'blur' : 'empty'
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
                    stockBadgeVariant as 'default' | 'secondary' | 'destructive'
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
                  <ProductDialog product={product}>
                    <Button size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </ProductDialog>
                  <DeleteProductDialog product={product}>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteProductDialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
