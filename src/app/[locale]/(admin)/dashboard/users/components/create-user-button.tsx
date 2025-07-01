'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreateUserDialog } from './create-user-dialog';

export function CreateUserButton() {
  const t = useTranslations('CreateUserButton');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {t('add_user')}
      </Button>

      <CreateUserDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
