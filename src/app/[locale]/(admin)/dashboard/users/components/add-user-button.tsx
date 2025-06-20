'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { useUserManagementStore } from './store';

export function AddUserButton() {
  const t = useTranslations('AddUserButton');
  const { setAddDialogOpen } = useUserManagementStore();
  return (
    <Button
      size="sm"
      className="bg-primary hover:bg-primary/90"
      onClick={() => setAddDialogOpen(true)}
    >
      {t('add_user')}
      <Plus className="ml-2 h-4 w-4" />
    </Button>
  );
}
