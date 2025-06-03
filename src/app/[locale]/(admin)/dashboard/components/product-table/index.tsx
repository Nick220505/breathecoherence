import { Table } from '@/components/ui/table';
import { getAllProducts } from '@/features/product/actions';

import { DeleteProductDialog } from '../delete-product-dialog';
import { EditProductDialog } from '../edit-product-dialog';

import { ProductTableContent } from './table-content';
import { ProductTableHeader } from './table-header';
import { TablePagination } from './table-pagination';

export async function ProductTable() {
  const products = await getAllProducts();

  return (
    <>
      <div className="space-y-4">
        <Table>
          <ProductTableHeader />
          <ProductTableContent products={products} />
        </Table>

        <TablePagination totalItems={products.length} />
      </div>

      <EditProductDialog />
      <DeleteProductDialog />
    </>
  );
}
