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
import { useTableStore } from "@/lib/stores/use-table-store";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export function ProductTableHeader() {
  const { t } = useTranslation();
  const {
    nameFilter,
    typeFilter,
    setNameFilter,
    setTypeFilter,
    setSortConfig,
  } = useTableStore();

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
                    placeholder={t("admin.filter_by_name")}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortConfig("name")}>
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
                    value={typeFilter === "all" ? "" : typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value || "all")}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  {t("admin.all")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTypeFilter("Flower Essence")}
                >
                  {t("admin.flower_essence")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTypeFilter("Sacred Geometry")}
                >
                  {t("admin.sacred_geometry")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortConfig("type")}>
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
              onClick={() => setSortConfig("price")}
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
              onClick={() => setSortConfig("stock")}
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
