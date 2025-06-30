import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers } from '@/features/user/actions';

import { CreateUserDialog } from './components/create-user-dialog';
import { UserTable } from './components/user-table';

export default async function UsersPage() {
  const t = await getTranslations('UsersPage');
  const [users, err] = await getAllUsers();

  if (err) {
    throw new Error(t('error.loadUsers'));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <CreateUserDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_user')}
            </Button>
          </CreateUserDialog>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable users={users} />
      </CardContent>
    </Card>
  );
}
