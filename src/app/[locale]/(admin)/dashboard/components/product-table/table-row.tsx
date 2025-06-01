'use client';

import { Product, ProductType } from '@prisma/client';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { productSchema } from '@/features/product/schema';
import { useProductStore } from '@/lib/stores/use-product-store';
import { useTableStore } from '@/lib/stores/use-table-store';

interface ProductTableRowProps {
  product: Product;
}

export function ProductTableRow({ product }: Readonly<ProductTableRowProps>) {
  const t = useTranslations('ProductTableRow');
  const tableHeaderT = useTranslations('ProductTableHeader');
  const { setEditDialogOpen, setEditingProduct } = useProductStore();
  const { setIsDeleteDialogOpen, setProductToDelete } = useTableStore();

  let imageToDisplay: string;
  const actualImageValue: unknown = product.imageBase64;

  if (typeof actualImageValue === 'string' && actualImageValue.trim() !== '') {
    imageToDisplay = actualImageValue;
  } else if (product.type === ProductType.SACRED_GEOMETRY) {
    imageToDisplay = `/products/sacred-geometry.svg#${product.id}`;
  } else {
    imageToDisplay = '/products/flower-essence.svg';
  }

  const handleEdit = () => {
    const { success, data } = productSchema.safeParse(product);
    if (success) {
      setEditingProduct(data);
      setEditDialogOpen(true);
    } else {
      console.error('Product validation failed:', data);
    }
  };

  const handleDelete = () => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <TableRow>
      <TableCell>
        <Image
          src={imageToDisplay}
          alt={product.name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-lg object-cover"
          sizes="64px"
          priority={false}
        />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>
        {product.type === ProductType.SACRED_GEOMETRY
          ? tableHeaderT('sacred_geometry')
          : tableHeaderT('flower_essence')}
      </TableCell>
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
              <p>{t('edit_tooltip')}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('delete_tooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
