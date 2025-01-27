"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "./product-form";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  onProductAdded: () => void;
}

export function AddProductDialog({
  isOpen,
  onOpenChange,
  isLoading,
  onProductAdded,
}: AddProductDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSuccess = async (message: string) => {
    onOpenChange(false);
    onProductAdded();
    toast({
      title: t("admin.success"),
      description: message,
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.add_new_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to add a new product to the store
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          isLoading={isLoading}
          submitLabel={t("admin.add")}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
