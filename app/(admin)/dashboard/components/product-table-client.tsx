"use client";

import { Table } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Product } from "@prisma/client";
import { DeleteDialog } from "./delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { ProductTableContent } from "./table/table-content";
import { ProductTableHeader } from "./table/table-header";
import { TablePagination } from "./table/table-pagination";

interface ProductTableClientProps {
  products: Product[];
}

export function ProductTableClient({ products }: ProductTableClientProps) {
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
      <DeleteDialog />
    </>
  );
}
