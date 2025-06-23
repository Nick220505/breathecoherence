'use client';

import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { productSchema } from '@/features/product/schema';

import { useProductManagementStore } from './store';

import type { ProductWithCategory } from '@/features/product/types';

interface ProductTableProps {
  products: ProductWithCategory[];
}

export function ProductTable({ products }: Readonly<ProductTableProps>) {
  const t = useTranslations('ProductTableRow');
  const tHeader = useTranslations('ProductTableHeader');

  const {
    setEditDialogOpen,
    setEditingProduct,
    setDeleteDialogOpen,
    setDeletingProduct,
  } = useProductManagementStore();

  const handleEdit = (product: ProductWithCategory) => {
    const formData = {
      ...product,
      categoryId: product.category.id,
    };
    const { success, data } = productSchema.safeParse(formData);

    if (success) {
      setEditingProduct(data);
      setEditDialogOpen(true);
    } else {
      console.error('Product validation failed:', data);
    }
  };

  const handleDelete = (product: ProductWithCategory) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tHeader('image')}</TableHead>
              <TableHead>{tHeader('name')}</TableHead>
              <TableHead>{tHeader('category')}</TableHead>
              <TableHead>{tHeader('price')}</TableHead>
              <TableHead>{tHeader('stock')}</TableHead>
              <TableHead>{tHeader('createdAt')}</TableHead>
              <TableHead>{tHeader('updatedAt')}</TableHead>
              <TableHead>{tHeader('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              let imageToDisplay: string;
              const actualImageValue = product.imageBase64;
              if (actualImageValue && actualImageValue.trim() !== '') {
                imageToDisplay = actualImageValue;
              } else if (product.category.name === 'Sacred Geometry') {
                imageToDisplay = `/products/sacred-geometry.svg#${product.id}`;
              } else {
                imageToDisplay = '/products/flower-essence.svg';
              }

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-16 w-16">
                      <Image
                        src={imageToDisplay}
                        alt={product.name}
                        fill
                        className="rounded-lg object-cover"
                        sizes="64px"
                        placeholder={
                          imageToDisplay.startsWith('data:image')
                            ? 'blur'
                            : 'empty'
                        }
                        blurDataURL={
                          imageToDisplay.startsWith('data:image')
                            ? imageToDisplay
                            : ''
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleEdit(product)}
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
                            onClick={() => handleDelete(product)}
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
            })}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  );
}
