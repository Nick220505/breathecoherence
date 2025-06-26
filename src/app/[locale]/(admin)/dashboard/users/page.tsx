import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { UserDialog } from './components/user-dialog';
import { UserTable } from './components/user-table';
import { UserTableSkeleton } from './components/user-table-skeleton';

export default async function UsersPage() {
  const t = await getTranslations('UsersPage');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <UserDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_user')}
            </Button>
          </UserDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<UserTableSkeleton />}>
          <UserTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
