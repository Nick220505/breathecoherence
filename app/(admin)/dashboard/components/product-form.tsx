"use client";

import { productFormAction } from "@/actions/product";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFormData, productSchema } from "@/lib/schemas/product";
import { FormState } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FormFields } from "./form/form-fields";
import { ImageUpload } from "./form/image-upload";

interface ProductFormProps {
  initialData?: ProductFormData;
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
  onSuccess,
}: ProductFormProps) {
  const { t } = useTranslation();
  const [state, formAction] = useActionState(productFormAction, initialState);
  const [isPending, startTransition] = useTransition();
  const successShown = useRef(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (state.success && onSuccess && !successShown.current) {
      successShown.current = true;
      onSuccess(state.message);
    }
  }, [state.success, state.message, onSuccess]);

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => formAction(formData));
  };

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <form
      action={formAction}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {initialData.id && <Input type="hidden" {...form.register("id")} />}

      <FormFields form={form} />

      <ImageUpload
        initialImageUrl={form.getValues("imageUrl") || undefined}
        productType={form.getValues("type")}
        onImageUrlChange={(url) => form.setValue("imageUrl", url)}
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
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {initialData?.name ? t("admin.editing") : t("admin.adding")}
          </>
        ) : initialData?.name ? (
          t("admin.edit")
        ) : (
          t("admin.add")
        )}
      </Button>
    </form>
  );
}
