import { create } from 'zustand';

import type { UserFormData } from '@/features/user/schema';
import type { UserSummary } from '@/features/user/types';

interface UserManagementStore {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingUser: UserFormData | null;
  deletingUser: UserSummary | null;
  setAddDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditingUser: (user: UserFormData | null) => void;
  setDeletingUser: (user: UserSummary | null) => void;
  resetState: () => void;
}

export const useUserManagementStore = create<UserManagementStore>()((set) => ({
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  editingUser: null,
  deletingUser: null,
  setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
  setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
  setEditingUser: (user) => set({ editingUser: user }),
  setDeletingUser: (user) => set({ deletingUser: user }),
  resetState: () =>
    set({
      isAddDialogOpen: false,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      editingUser: null,
      deletingUser: null,
    }),
}));
