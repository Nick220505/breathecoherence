"use client";

import { deleteProduct } from "@/actions/product";
import { useTranslation } from "@/components/language-provider";
import { Table, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useTableStore } from "@/lib/stores/use-table-store";
import { Product } from "@prisma/client";
import { DeleteDialog } from "./delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { ProductTableHeader } from "./table/table-header";
import { TablePagination } from "./table/table-pagination";
import { ProductTableRow } from "./table/table-row";

interface ProductTableClientProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 10;

export function ProductTableClient({ products }: ProductTableClientProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    nameFilter,
    typeFilter,
    sortConfig,
    currentPage,
    isDeleteDialogOpen,
    productToDelete,
    isDeleting,
    setIsDeleting,
    resetDeleteState,
  } = useTableStore();

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const typeMatch =
      typeFilter === "all" ||
      product.type.toLowerCase().includes(typeFilter.toLowerCase());
    return nameMatch && typeMatch;
  });

  const sortedProducts = sortConfig.key
    ? [...filteredProducts].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Product];
        const bValue = b[sortConfig.key as keyof Product];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      })
    : filteredProducts;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const { success, message } = await deleteProduct(productToDelete.id);

      if (success) {
        toast({
          title: t("admin.success"),
          description: message,
          variant: "default",
        });
      } else {
        toast({
          title: t("admin.error"),
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.error.delete"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      resetDeleteState();
    }
  };

  return (
    <>
      <TooltipProvider>
        <div className="space-y-4">
          <Table>
            <ProductTableHeader />
            <TableBody>
              {paginatedProducts.map((product) => (
                <ProductTableRow key={product.id} product={product} />
              ))}
            </TableBody>
          </Table>

          <TablePagination
            totalPages={Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)}
          />
        </div>
      </TooltipProvider>

      <EditProductDialog />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={resetDeleteState}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
