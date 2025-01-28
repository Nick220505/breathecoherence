"use client";

import { deleteProduct, getProducts } from "@/actions/product";
import { useTranslation } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { DeleteDialog } from "./delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { ProductTable } from "./product-table";

export function ProductTableWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const refreshProducts = async () => {
    setIsLoading(true);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

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
        await refreshProducts();
        toast({
          title: t("admin.success"),
          description: result.message,
          variant: "default",
        });
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
    await refreshProducts();
    toast({
      title: t("admin.success"),
      description: message,
      variant: "default",
    });
  };

  return (
    <>
      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsEditProductOpen(true);
        }}
        onDelete={handleDelete}
      />

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
