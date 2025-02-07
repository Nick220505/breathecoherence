"use client";

import { deleteProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTableStore } from "@/lib/stores/use-table-store";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function DeleteProductDialog() {
  const t = useTranslations("DeleteProductDialog");
  const { toast } = useToast();
  const {
    isDeleteDialogOpen,
    productToDelete,
    isDeleting,
    setIsDeleting,
    resetDeleteState,
  } = useTableStore();

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const { success, message } = await deleteProduct(productToDelete.id);

      if (success) {
        toast({
          title: t("success"),
          description: message,
          variant: "default",
        });
      } else {
        toast({
          title: t("error"),
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: t("error"),
        description: t("error_delete"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      resetDeleteState();
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={resetDeleteState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete_confirm_title")}</DialogTitle>
          <DialogDescription>
            {t("delete_confirm_description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={resetDeleteState}
            disabled={isDeleting}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("confirm_delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
