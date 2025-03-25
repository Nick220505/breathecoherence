import { Product } from '@prisma/client';
import { create } from 'zustand';

export interface SortConfig {
  key: keyof Product | null;
  direction: 'asc' | 'desc';
}

interface TableStore {
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;

  // Sorting
  sortConfig: SortConfig;
  setSortConfig: (key: keyof Product) => void;

  // Filtering
  nameFilter: string;
  typeFilter: string;
  setNameFilter: (filter: string) => void;
  setTypeFilter: (filter: string) => void;

  // Delete Dialog
  isDeleteDialogOpen: boolean;
  productToDelete: Product | null;
  isDeleting: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setProductToDelete: (product: Product | null) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  resetDeleteState: () => void;
}

export const useTableStore = create<TableStore>()((set) => ({
  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  // Sorting
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

  // Filtering
  nameFilter: '',
  typeFilter: 'all',
  setNameFilter: (filter) => set({ nameFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),

  // Delete Dialog
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
