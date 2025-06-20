import { create } from 'zustand';

import type { UserFormData } from '@/features/user/schema';
import type { UserSummary } from '@/features/user/types';

interface UserManagementStore {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingUser: UserFormData | null;
  userToDelete: UserSummary | null;
  isDeleting: boolean;
  setAddDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditingUser: (user: UserFormData | null) => void;
  setUserToDelete: (user: UserSummary | null) => void;
  resetDeleteState: () => void;
  setIsDeleting?: (loading: boolean) => void;
}

export const useUserManagementStore = create<UserManagementStore>()((set) => ({
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  editingUser: null,
  userToDelete: null,
  isDeleting: false,
  setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
  setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
  setEditingUser: (user) => set({ editingUser: user }),
  setUserToDelete: (user) => set({ userToDelete: user }),
  resetDeleteState: () =>
    set({ isDeleteDialogOpen: false, userToDelete: null, isDeleting: false }),
  setIsDeleting: (loading) => set({ isDeleting: loading }),
}));
