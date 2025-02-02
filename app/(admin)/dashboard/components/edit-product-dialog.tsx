"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductStore } from "@/lib/stores/use-product-store";
import { ProductForm } from "./product-form";

export function EditProductDialog() {
  const { t } = useTranslation();
  const {
    isEditDialogOpen,
    setEditDialogOpen,
    editingProduct,
    setEditingProduct,
  } = useProductStore();

  if (!editingProduct) return null;

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setEditingProduct(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.edit_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to edit an existing product
          </DialogDescription>
        </DialogHeader>
        <ProductForm initialData={editingProduct} />
      </DialogContent>
    </Dialog>
  );
}
