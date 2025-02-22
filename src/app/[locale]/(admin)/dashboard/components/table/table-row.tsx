"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { productSchema } from "@/lib/schemas/product";
import { useProductStore } from "@/lib/stores/use-product-store";
import { useTableStore } from "@/lib/stores/use-table-store";
import { Product } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ProductTableRowProps {
  product: Product;
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  const t = useTranslations("ProductTableRow");
  const { setEditDialogOpen, setEditingProduct } = useProductStore();
  const { setIsDeleteDialogOpen, setProductToDelete } = useTableStore();

  const imageUrl =
    product.imageUrl ||
    (product.type === "Sacred Geometry"
      ? `/products/sacred-geometry.svg#${product.id}`
      : "/products/flower-essence.svg");

  const handleEdit = () => {
    setEditingProduct(productSchema.parse(product));
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <TableRow>
      <TableCell>
        <Image
          src={imageUrl}
          alt={product.name}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg"
          sizes="64px"
          priority={false}
        />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.type}</TableCell>
      <TableCell>${product.price.toFixed(2)}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("edit_tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("delete_tooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
