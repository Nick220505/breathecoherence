"use client";

import { Table, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Product } from "@/types/product";
import { useMemo, useState } from "react";
import { ProductTableHeader } from "./table/table-header";
import { TablePagination } from "./table/table-pagination";
import { ProductTableRow } from "./table/table-row";
import { TableSkeleton } from "./table/table-skeleton";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

const ITEMS_PER_PAGE = 10;

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const typeMatch =
        !typeFilter ||
        product.type.toLowerCase().includes(typeFilter.toLowerCase());
      return nameMatch && typeMatch;
    });

    if (sortConfig.key) {
      return filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Product];
        const bValue = b[sortConfig.key as keyof Product];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return filtered;
  }, [products, sortConfig, nameFilter, typeFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [sortedAndFilteredProducts, currentPage]);

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Table>
          <ProductTableHeader
            nameFilter={nameFilter}
            typeFilter={typeFilter}
            onNameFilterChange={setNameFilter}
            onTypeFilterChange={setTypeFilter}
            onSort={handleSort}
          />
          <TableBody>
            {paginatedProducts.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            sortedAndFilteredProducts.length / ITEMS_PER_PAGE,
          )}
          onPageChange={setCurrentPage}
        />
      </div>
    </TooltipProvider>
  );
}
