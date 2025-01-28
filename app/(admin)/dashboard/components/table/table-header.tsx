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
          <div className="flex items-center gap-2">
            {t("admin.name")}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <div className="p-2">
                  <Input
                    placeholder={t("admin.search_by_name")}
                    value={nameFilter}
                    onChange={(e) => onNameFilterChange(e.target.value)}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSort("name")}>
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                  {t("admin.sort_by_name")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t("admin.type")}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <div className="p-2">
                  <Input
                    placeholder={t("admin.filter_by_type")}
                    value={typeFilter}
                    onChange={(e) => onTypeFilterChange(e.target.value)}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSort("type")}>
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                  {t("admin.sort_by_type")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t("admin.price")}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort("price")}
              className="h-8 w-8 p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            {t("admin.stock")}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort("stock")}
              className="h-8 w-8 p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </TableHead>
        <TableHead>{t("admin.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
