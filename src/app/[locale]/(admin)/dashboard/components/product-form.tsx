"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productActions } from "@/features/products/actions";
import { ProductFormData, productSchema } from "@/features/products/schema";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/lib/stores/use-product-store";
import { FormState } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FormFields } from "./form/form-fields";
import { ImageUpload } from "./form/image-upload";

interface ProductFormProps {
  initialData?: ProductFormData;
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
}: ProductFormProps) {
  const t = useTranslations("ProductForm");
  const { toast } = useToast();
  const { setAddDialogOpen, setEditDialogOpen, setEditingProduct } =
    useProductStore();
  const [state, formAction] = useActionState(
    productActions.handleForm,
    initialState,
  );
  const [isPending, startTransition] = useTransition();
  const successShown = useRef(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (state.success && !successShown.current) {
      successShown.current = true;
      toast({
        title: t("success"),
        description: state.message,
        variant: "default",
      });
      if (initialData?.id) {
        setEditDialogOpen(false);
        setEditingProduct(null);
      } else {
        setAddDialogOpen(false);
      }
    }
  }, [
    state.success,
    state.message,
    t,
    toast,
    initialData?.id,
    setAddDialogOpen,
    setEditDialogOpen,
    setEditingProduct,
  ]);

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
            {initialData?.name ? t("editing") : t("adding")}
          </>
        ) : initialData?.name ? (
          t("edit")
        ) : (
          t("add")
        )}
      </Button>
    </form>
  );
}
