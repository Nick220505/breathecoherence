"use client";

import { deleteProduct } from "@/actions/product";
import { useTranslation } from "@/components/language-provider";
import { Table, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useMemo, useState } from "react";
import { DeleteDialog } from "./delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { ProductTableHeader } from "./table/table-header";
import { TablePagination } from "./table/table-pagination";
import { ProductTableRow } from "./table/table-row";

interface ProductTableClientProps {
  products: Product[];
}

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

const ITEMS_PER_PAGE = 10;

export function ProductTableClient({ products }: ProductTableClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const typeMatch =
        !typeFilter ||
        product.type.toLowerCase().includes(typeFilter.toLowerCase());
      return nameMatch && typeMatch;
    });

    if (sortConfig.key) {
      return filtered.sort((a, b) => {
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
      });
    }

    return filtered;
  }, [products, sortConfig, nameFilter, typeFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [sortedAndFilteredProducts, currentPage]);

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteProduct(productToDelete.id);

      if (result.success) {
        toast({
          title: t("admin.success"),
          description: result.message,
          variant: "default",
        });
        window.location.reload();
      } else {
        toast({
          title: t("admin.error"),
          description: result.message,
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
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleProductUpdated = async (message: string) => {
    toast({
      title: t("admin.success"),
      description: message,
      variant: "default",
    });
    window.location.reload();
  };

  return (
    <>
      <TooltipProvider>
        <div className="space-y-4">
          <Table>
            <ProductTableHeader
              nameFilter={nameFilter}
              typeFilter={typeFilter}
              onNameFilterChange={setNameFilter}
              onTypeFilterChange={setTypeFilter}
              onSort={handleSort}
            />
            <TableBody>
              {paginatedProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={(product) => {
                    setEditingProduct(product);
                    setIsEditProductOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>

          <TablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              sortedAndFilteredProducts.length / ITEMS_PER_PAGE,
            )}
            onPageChange={setCurrentPage}
          />
        </div>
      </TooltipProvider>

      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={(open) => {
          setIsEditProductOpen(open);
          if (!open) setEditingProduct(null);
        }}
        isLoading={false}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
