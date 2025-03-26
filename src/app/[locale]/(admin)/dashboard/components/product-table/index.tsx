import { Table } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getAllProducts } from '@/features/products/controller';

import { DeleteProductDialog } from '../delete-product-dialog';
import { EditProductDialog } from '../edit-product-dialog';

import { ProductTableContent } from './table-content';
import { ProductTableHeader } from './table-header';
import { TablePagination } from './table-pagination';

export async function ProductTable() {
  const products = await getAllProducts();

  return (
    <>
      <TooltipProvider>
        <div className="space-y-4">
          <Table>
            <ProductTableHeader />
            <ProductTableContent products={products} />
          </Table>

          <TablePagination totalItems={products.length} />
        </div>
      </TooltipProvider>

      <EditProductDialog />
      <DeleteProductDialog />
    </>
  );
}
