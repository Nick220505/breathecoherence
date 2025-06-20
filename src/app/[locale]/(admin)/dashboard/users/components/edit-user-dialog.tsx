'use client';

import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useUserManagementStore } from './store';
import { UserForm } from './user-form';

export function EditUserDialog() {
  const t = useTranslations('EditUserDialog');
  const { isEditDialogOpen, setEditDialogOpen, editingUser, setEditingUser } =
    useUserManagementStore();

  if (!editingUser) return null;

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setEditingUser(null);
      }}
    >
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle>{t('edit_user')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <UserForm initialData={editingUser} />
      </DialogContent>
    </Dialog>
  );
}
