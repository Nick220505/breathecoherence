'use client';

import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { cn } from '@/lib/utils';

import { useProductManagementStore } from './store';

import type { Product } from '@prisma/client';

const ITEMS_PER_PAGE = 10;

interface ProductWithCategory extends Product {
  category: {
    id: string;
    name: string;
  };
}

interface ProductTableProps {
  readonly products: ProductWithCategory[];
}

export function ProductTable({ products }: ProductTableProps) {
  const t = useTranslations('ProductTableRow');
  const tPagination = useTranslations('TablePagination');
  const tHeader = useTranslations('ProductTableHeader');

  const {
    setEditDialogOpen,
    setEditingProduct,
    setDeleteDialogOpen,
    setProductToDelete,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
  } = useProductManagementStore();

  const onSort = (key: 'name' | 'category' | 'price' | 'stock') => {
    setSortConfig(key);
  };

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
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === 'category') {
      return (
        a.category.name.localeCompare(b.category.name) *
        (sortConfig.direction === 'asc' ? 1 : -1)
      );
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return (
        aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1)
      );
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
    }

    return 0;
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tHeader('image')}</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort('name')}>
                    {tHeader('name')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort('category')}>
                    {tHeader('category')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort('price')}>
                    {tHeader('price')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => onSort('stock')}>
                    {tHeader('stock')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>{tHeader('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => {
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
        </div>
      </TooltipProvider>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(currentPage - 1)}
                aria-disabled={currentPage <= 1}
                className={cn(
                  currentPage <= 1 && 'pointer-events-none opacity-50',
                )}
              >
                {tPagination('previous')}
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
                className={cn(
                  currentPage >= totalPages && 'pointer-events-none opacity-50',
                )}
              >
                {tPagination('next')}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
