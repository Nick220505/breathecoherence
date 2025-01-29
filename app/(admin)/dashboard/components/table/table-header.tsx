"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import { ArrowUpDown, ChevronDown } from "lucide-react";

interface TableHeaderProps {
  nameFilter: string;
  typeFilter: string;
  onNameFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onSort: (key: keyof Product) => void;
}

function FilterDropdown({
  label,
  filter,
  filterPlaceholder,
  onFilterChange,
  onSort,
  sortKey,
  sortLabel,
}: {
  label: string;
  filter: string;
  filterPlaceholder: string;
  onFilterChange: (value: string) => void;
  onSort: (key: keyof Product) => void;
  sortKey: keyof Product;
  sortLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="p-2">
            <Input
              placeholder={filterPlaceholder}
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="h-8"
            />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSort(sortKey)}>
            <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            {sortLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SortableHeader({
  label,
  onSort,
  sortKey,
}: {
  label: string;
  onSort: (key: keyof Product) => void;
  sortKey: keyof Product;
}) {
  return (
    <div className="flex items-center gap-2">
      {label}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSort(sortKey)}
        className="h-8 w-8 p-0"
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ProductTableHeader({
  nameFilter,
  typeFilter,
  onNameFilterChange,
  onTypeFilterChange,
  onSort,
}: TableHeaderProps) {
  const { t } = useTranslation();

  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t("admin.image")}</TableHead>
        <TableHead>
          <FilterDropdown
            label={t("admin.name")}
            filter={nameFilter}
            filterPlaceholder={t("admin.search_by_name")}
            onFilterChange={onNameFilterChange}
            onSort={onSort}
            sortKey="name"
            sortLabel={t("admin.sort_by_name")}
          />
        </TableHead>
        <TableHead>
          <FilterDropdown
            label={t("admin.type")}
            filter={typeFilter}
            filterPlaceholder={t("admin.filter_by_type")}
            onFilterChange={onTypeFilterChange}
            onSort={onSort}
            sortKey="type"
            sortLabel={t("admin.sort_by_type")}
          />
        </TableHead>
        <TableHead>
          <SortableHeader
            label={t("admin.price")}
            onSort={onSort}
            sortKey="price"
          />
        </TableHead>
        <TableHead>
          <SortableHeader
            label={t("admin.stock")}
            onSort={onSort}
            sortKey="stock"
          />
        </TableHead>
        <TableHead>{t("admin.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
