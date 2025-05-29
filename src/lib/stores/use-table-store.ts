import { Product } from '@prisma/client';
import { create } from 'zustand';

export interface SortConfig {
  key: keyof Product | null;
  direction: 'asc' | 'desc';
}

interface TableStore {
  currentPage: number;
  setCurrentPage: (page: number) => void;

  sortConfig: SortConfig;
  setSortConfig: (key: keyof Product) => void;

  nameFilter: string;
  typeFilter: string;
  setNameFilter: (filter: string) => void;
  setTypeFilter: (filter: string) => void;

  isDeleteDialogOpen: boolean;
  productToDelete: Product | null;
  isDeleting: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setProductToDelete: (product: Product | null) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  resetDeleteState: () => void;
}

export const useTableStore = create<TableStore>()((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  sortConfig: {
    key: null,
    direction: 'asc',
  },
  setSortConfig: (key) =>
    set((state) => ({
      sortConfig: {
        key,
        direction:
          state.sortConfig.key === key && state.sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc',
      },
    })),

  nameFilter: '',
  typeFilter: 'all',
  setNameFilter: (filter) => set({ nameFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),

  isDeleteDialogOpen: false,
  productToDelete: null,
  isDeleting: false,
  setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
  setProductToDelete: (product) => set({ productToDelete: product }),
  setIsDeleting: (isDeleting) => set({ isDeleting }),
  resetDeleteState: () =>
    set({
      isDeleteDialogOpen: false,
      productToDelete: null,
      isDeleting: false,
    }),
}));
