"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: (message: string) => void;
}

export function AddProductDialog({
  isOpen,
  onOpenChange,
  onProductAdded,
}: AddProductDialogProps) {
  const { t } = useTranslation();

  const handleSuccess = async (message: string) => {
    onOpenChange(false);
    onProductAdded(message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.add_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to add a new product
          </DialogDescription>
        </DialogHeader>
        <ProductForm submitLabel={t("admin.add")} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
