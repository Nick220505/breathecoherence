import { ProductFormData } from "@/features/products/schema";
import { create } from "zustand";

interface ProductStore {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  editingProduct: ProductFormData | null;
  setAddDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setEditingProduct: (product: ProductFormData | null) => void;
  resetState: () => void;
}

export const useProductStore = create<ProductStore>()((set) => ({
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  editingProduct: null,
  setAddDialogOpen: (open) => set(() => ({ isAddDialogOpen: open })),
  setEditDialogOpen: (open) => set(() => ({ isEditDialogOpen: open })),
  setEditingProduct: (product) => set(() => ({ editingProduct: product })),
  resetState: () =>
    set(() => ({
      isAddDialogOpen: false,
      isEditDialogOpen: false,
      editingProduct: null,
    })),
}));
