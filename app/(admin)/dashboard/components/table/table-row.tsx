"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Product } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const { t } = useTranslation();

  const imageUrl =
    product.imageUrl ||
    (product.type === "Sacred Geometry"
      ? `/products/sacred-geometry.svg#${product.id}`
      : "/products/flower-essence.svg");

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
                onClick={() => onEdit(product)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("admin.edit_tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onDelete(product)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("admin.delete_tooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
