import { Table } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Product } from '@prisma/client';
import { DeleteProductDialog } from '../delete-product-dialog';
import { EditProductDialog } from '../edit-product-dialog';
import { ProductTableContent } from './table-content';
import { ProductTableHeader } from './table-header';
import { TablePagination } from './table-pagination';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
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
