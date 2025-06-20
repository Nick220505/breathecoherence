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

export function AddUserDialog() {
  const t = useTranslations('AddUserDialog');
  const { isAddDialogOpen, setAddDialogOpen } = useUserManagementStore();

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle>{t('add_user')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('form_description')}
          </DialogDescription>
        </DialogHeader>
        <UserForm />
      </DialogContent>
    </Dialog>
  );
}
