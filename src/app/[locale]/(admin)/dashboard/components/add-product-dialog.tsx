"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductStore } from "@/lib/stores/use-product-store";
import { useTranslations } from "next-intl";
import { ProductForm } from "./product-form";

export function AddProductDialog() {
  const t = useTranslations("AddProductDialog");
  const { isAddDialogOpen, setAddDialogOpen } = useProductStore();

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("form_description")}
          </DialogDescription>
        </DialogHeader>
        <ProductForm />
      </DialogContent>
    </Dialog>
  );
}
