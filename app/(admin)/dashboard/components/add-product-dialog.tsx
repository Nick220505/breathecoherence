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

export function AddProductDialog() {
  const { t } = useTranslation();
  const { isAddDialogOpen, setAddDialogOpen } = useProductStore();

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.add_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to add a new product
          </DialogDescription>
        </DialogHeader>
        <ProductForm />
      </DialogContent>
    </Dialog>
  );
}
