"use client";

import { useTranslation } from "@/components/language-provider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "@/types/product";
import {
  AlertCircle,
  Box,
  DollarSign,
  Info,
  Package2,
  Tags,
} from "lucide-react";
import { FormState } from "./types";

interface FormFieldsProps {
  formData: ProductFormData;
  state: FormState;
  onChange: (
    field: "name" | "description" | "type" | "price" | "stock",
    value: string,
  ) => void;
}

export function FormFields({ formData, state, onChange }: FormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Tags className="h-4 w-4" />
          {t("admin.product_name")}
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="focus-visible:ring-primary"
          placeholder="Enter product name"
        />
        {state.errors?.name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Info className="h-4 w-4" />
          {t("admin.description")}
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="focus-visible:ring-primary min-h-[100px]"
          placeholder="Enter product description"
        />
        {state.errors?.description && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="type"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Box className="h-4 w-4" />
          {t("admin.type")}
        </label>
        <Select
          value={formData.type}
          name="type"
          onValueChange={(value) => onChange("type", value)}
        >
          <SelectTrigger className="focus-visible:ring-primary">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Flower Essence">Flower Essence</SelectItem>
            <SelectItem value="Sacred Geometry">Sacred Geometry</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.type && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {state.errors.type[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <DollarSign className="h-4 w-4" />
            {t("admin.price")}
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
            className="focus-visible:ring-primary"
            placeholder="0.00"
          />
          {state.errors?.price && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {state.errors.price[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="stock"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Package2 className="h-4 w-4" />
            {t("admin.stock")}
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            className="focus-visible:ring-primary"
            placeholder="0"
          />
          {state.errors?.stock && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {state.errors.stock[0]}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
