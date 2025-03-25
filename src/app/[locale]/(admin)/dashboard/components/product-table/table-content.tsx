'use client';

import { TableBody } from '@/components/ui/table';
import { useTableStore } from '@/lib/stores/use-table-store';
import { Product } from '@prisma/client';
import { ProductTableRow } from './table-row';

const ITEMS_PER_PAGE = 10;

interface ProductTableContentProps {
  products: Product[];
}

export function ProductTableContent({ products }: ProductTableContentProps) {
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
        const aValue = a[sortConfig.key as keyof Product];
        const bValue = b[sortConfig.key as keyof Product];

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
    <TableBody>
      {paginatedProducts.map((product) => (
        <ProductTableRow key={product.id} product={product} />
      ))}
    </TableBody>
  );
}
