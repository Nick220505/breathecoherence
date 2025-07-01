'use client';

import { Edit, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { UserSummary } from '@/features/user/types';

import { DeleteUserDialog } from './delete-user-dialog';
import { EditUserDialog } from './edit-user-dialog';

interface UserTableProps {
  users: UserSummary[];
}

export function UserTable({ users }: Readonly<UserTableProps>) {
  const t = useTranslations('UserTable');
  const locale = useLocale();
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserSummary | null>(null);

  return (
    <>
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
                <Badge
                  variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                >
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" onClick={() => setEditingUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('edit_tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('delete_tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
        />
      )}
    </>
  );
}
