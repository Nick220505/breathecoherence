"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/lib/stores/use-product-store";
import { Plus } from "lucide-react";
import { AddProductDialog } from "./add-product-dialog";

export function AddProductButton() {
  const { t } = useTranslation();
  const { setAddDialogOpen } = useProductStore();

  return (
    <>
      <Button
        onClick={() => setAddDialogOpen(true)}
        className="bg-primary hover:bg-primary/90"
        size="sm"
      >
        {t("admin.add_product")}
        <Plus className="ml-2 h-4 w-4" />
      </Button>

      <AddProductDialog />
    </>
  );
}
