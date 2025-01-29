"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationButton({
  onClick,
  disabled,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <PaginationItem>
      <PaginationLink
        href="#"
        onClick={onClick}
        aria-disabled={disabled}
        className={disabled ? "pointer-events-none opacity-50" : ""}
      >
        {children}
      </PaginationLink>
    </PaginationItem>
  );
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const handlePageChange = (pageNumber: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(pageNumber);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
            onClick={handlePageChange(Math.max(1, currentPage - 1))}
          >
            {t("pagination.previous")}
          </PaginationPrevious>
        </PaginationItem>

        {pageNumbers.map((pageNumber) => (
          <PaginationButton
            key={pageNumber}
            onClick={handlePageChange(pageNumber)}
            disabled={currentPage === pageNumber}
          >
            {pageNumber}
          </PaginationButton>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
            onClick={handlePageChange(Math.min(totalPages, currentPage + 1))}
          >
            {t("pagination.next")}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
