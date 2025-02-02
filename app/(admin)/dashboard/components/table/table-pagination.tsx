"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/lib/stores/use-table-store";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  totalPages: number;
}

export function TablePagination({ totalPages }: TablePaginationProps) {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage } = useTableStore();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="text-muted-foreground hover:text-foreground gap-1 text-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("pagination.previous")}
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === currentPage ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage(pageNumber)}
          className={`text-sm ${
            pageNumber === currentPage
              ? "bg-muted"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="text-muted-foreground hover:text-foreground gap-1 text-sm"
      >
        {t("pagination.next")}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
