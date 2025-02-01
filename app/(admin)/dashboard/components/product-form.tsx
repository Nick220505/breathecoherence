"use client";

import { productFormAction } from "@/actions/product";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFormData } from "@/lib/schemas/product";
import { FormState } from "@/lib/types/form";
import { AlertCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { FormFields } from "./form/form-fields";
import { ImageUpload } from "./form/image-upload";

interface ProductFormProps {
  initialData?: ProductFormData;
  isLoading: boolean;
  submitLabel: string;
  onSuccess?: (message: string) => void;
}

const initialState: FormState = {
  errors: {},
  message: "",
};

export function ProductForm({
  initialData = {
    name: "",
    description: "",
    type: "Flower Essence",
    price: 0,
    stock: 0,
    imageUrl: "",
  },
  isLoading,
  submitLabel,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const { t } = useTranslation();
  const [state, formAction] = useActionState(productFormAction, initialState);
  const successShown = useRef(false);

  useEffect(() => {
    if (state.success && onSuccess && !successShown.current) {
      successShown.current = true;
      onSuccess(state.message);
    }
  }, [state.success, state.message, onSuccess]);

  const handleFieldChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form action={formAction} className="space-y-6">
      {initialData.id && (
        <Input type="hidden" name="id" value={initialData.id} />
      )}

      <FormFields
        formData={formData}
        state={state}
        onChange={handleFieldChange}
      />

      <ImageUpload
        initialImageUrl={formData.imageUrl || undefined}
        productType={formData.type}
        onImageUrlChange={(url) => handleFieldChange("imageUrl", url)}
      />

      {!state.success &&
        state.message &&
        Object.keys(state.errors).length > 0 && (
          <p
            className="text-sm flex items-center gap-1 text-red-500"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {state.message}
          </p>
        )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading
          ? initialData?.name
            ? t("admin.editing")
            : t("admin.adding")
          : submitLabel}
      </Button>
    </form>
  );
}
