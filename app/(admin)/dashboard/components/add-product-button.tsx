"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddProductDialog } from "./add-product-dialog";

export function AddProductButton() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        onClick={() => setIsAddProductOpen(true)}
        className="bg-primary hover:bg-primary/90"
        size="sm"
      >
        {t("admin.add_product")}
        <Plus className="ml-2 h-4 w-4" />
      </Button>

      <AddProductDialog
        isOpen={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        isLoading={false}
        onProductAdded={() => {
          // Product table will handle its own refresh
          setIsAddProductOpen(false);
        }}
      />
    </>
  );
}
