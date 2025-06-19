'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { getAllProducts } from '@/features/product/actions';

import { AddProductButton } from './add-product-button';
import { AddProductDialog } from './add-product-dialog';
import { DeleteProductDialog } from './delete-product-dialog';
import { EditProductDialog } from './edit-product-dialog';
import { ProductTable } from './product-table';
import { TableSkeleton } from './table-skeleton';

import type { Product } from '@prisma/client';

interface ProductWithCategory extends Product {
  category: {
    id: string;
    name: string;
  };
}

export function ProductManagement() {
  const t = useTranslations('dashboard');
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts as ProductWithCategory[]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <Dialog>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('productTable.title')}</CardTitle>
              <CardDescription>{t('productTable.description')}</CardDescription>
            </div>
            <AddProductButton />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : <ProductTable products={products} />}
        </CardContent>
      </Card>
      <AddProductDialog />
      <EditProductDialog />
      <DeleteProductDialog />
    </Dialog>
  );
}
