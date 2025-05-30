'use client';

import { Product } from '@prisma/client';

import { TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTableStore } from '@/lib/stores/use-table-store';

import { ProductTableRow } from './table-row';

const ITEMS_PER_PAGE = 10;

interface ProductTableContentProps {
  products: Product[];
}

export function ProductTableContent({
  products,
}: Readonly<ProductTableContentProps>) {
  const { nameFilter, typeFilter, sortConfig, currentPage } = useTableStore();

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const typeMatch =
      typeFilter === 'all' ||
      product.type.toLowerCase().includes(typeFilter.toLowerCase());
    return nameMatch && typeMatch;
  });

  const sortedProducts = sortConfig.key
    ? [...filteredProducts].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      })
    : filteredProducts;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <TooltipProvider>
      <TableBody>
        {paginatedProducts.map((product) => (
          <ProductTableRow key={product.id} product={product} />
        ))}
      </TableBody>
    </TooltipProvider>
  );
}
