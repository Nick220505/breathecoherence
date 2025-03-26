import { Suspense } from 'react';

import { Table } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getAllProducts } from '@/features/products/controller';

import { DeleteProductDialog } from '../delete-product-dialog';
import { EditProductDialog } from '../edit-product-dialog';

import { ProductTableContent } from './table-content';
import { ProductTableHeader } from './table-header';
import { TablePagination } from './table-pagination';
import { TableSkeleton } from './table-skeleton';

export async function ProductTable() {
  const products = await getAllProducts();

  return (
    <>
      <TooltipProvider>
        <div className="space-y-4">
          <Suspense fallback={<TableSkeleton />}>
            <Table>
              <ProductTableHeader />
              <ProductTableContent products={products} />
            </Table>

            <TablePagination totalItems={products.length} />
          </Suspense>
        </div>
      </TooltipProvider>

      <EditProductDialog />
      <DeleteProductDialog />
    </>
  );
}
