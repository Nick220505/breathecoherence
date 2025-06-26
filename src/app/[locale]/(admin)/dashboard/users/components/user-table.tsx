import { Edit, Trash2 } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllUsers } from '@/features/user/actions';

import { DeleteUserDialog } from './delete-user-dialog';
import { UserDialog } from './user-dialog';

export async function UserTable() {
  const t = await getTranslations('UserTable');
  const locale = await getLocale();
  const users = await getAllUsers();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('email')}</TableHead>
          <TableHead>{t('role')}</TableHead>
          <TableHead>{t('created_at')}</TableHead>
          <TableHead>{t('updated_at')}</TableHead>
          <TableHead className="text-right">{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {t(`roles.${user.role.toLowerCase()}`)}
              </Badge>
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(user.createdAt)}
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(user.updatedAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <UserDialog user={user}>
                  <Button size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </UserDialog>
                <DeleteUserDialog user={user}>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DeleteUserDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
