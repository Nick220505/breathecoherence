"use client";

import { useTranslation } from "@/components/language-provider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type ProductFormData } from "@/lib/schemas/product";
import {
  AlertCircle,
  Box,
  DollarSign,
  Info,
  Package2,
  Tags,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface FormFieldsProps {
  form: UseFormReturn<ProductFormData>;
}

export function FormFields({ form }: FormFieldsProps) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

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
          {...register("name")}
          className="focus-visible:ring-primary"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.name.message}
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
          {...register("description")}
          className="focus-visible:ring-primary min-h-[100px]"
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.description.message}
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
          onValueChange={(value) =>
            setValue("type", value as ProductFormData["type"])
          }
          defaultValue={form.getValues("type")}
        >
          <SelectTrigger className="focus-visible:ring-primary">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Product Types</SelectLabel>
              <SelectItem value="Flower Essence">Flower Essence</SelectItem>
              <SelectItem value="Sacred Geometry">Sacred Geometry</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.type.message}
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
            type="number"
            step="0.01"
            {...register("price")}
            className="focus-visible:ring-primary"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.price.message}
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
            type="number"
            {...register("stock")}
            className="focus-visible:ring-primary"
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
