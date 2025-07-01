import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers } from '@/features/user/actions';

import { CreateUserButton } from './components/create-user-button';
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
          <CreateUserButton />
        </div>
      </CardHeader>
      <CardContent>
        <UserTable users={users} />
      </CardContent>
    </Card>
  );
}
