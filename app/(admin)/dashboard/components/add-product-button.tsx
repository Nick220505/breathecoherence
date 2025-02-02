"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddProductDialog } from "./add-product-dialog";

export function AddProductButton() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleProductAdded = (message: string) => {
    setIsAddProductOpen(false);
    toast({
      title: t("admin.success"),
      description: message,
      variant: "default",
    });
  };

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
        onProductAdded={handleProductAdded}
      />
    </>
  );
}
