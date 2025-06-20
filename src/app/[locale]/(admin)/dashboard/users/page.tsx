import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers } from '@/features/user/actions';

import { AddUserButton } from './components/add-user-button';
import { AddUserDialog } from './components/add-user-dialog';
import { DeleteUserDialog } from './components/delete-user-dialog';
import { EditUserDialog } from './components/edit-user-dialog';
import { UserTable } from './components/user-table';

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usuarios</CardTitle>
            <AddUserButton />
          </div>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
      </Card>
      <AddUserDialog />
      <EditUserDialog />
      <DeleteUserDialog />
    </>
  );
}
