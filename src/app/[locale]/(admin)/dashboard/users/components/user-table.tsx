'use client';

import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useUserManagementStore } from './store';

import type { UserSummary } from '@/features/user/types';

interface UserTableProps {
  users: UserSummary[];
}

export function UserTable({ users }: Readonly<UserTableProps>) {
  const tHeader = useTranslations('UserTableHeader');
  const tRow = useTranslations('UserTableRow');

  const {
    setEditDialogOpen,
    setEditingUser,
    setDeleteDialogOpen,
    setUserToDelete,
  } = useUserManagementStore();

  const handleEdit = (user: UserSummary) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: UserSummary) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tHeader('name')}</TableHead>
              <TableHead>{tHeader('email')}</TableHead>
              <TableHead>{tHeader('role')}</TableHead>
              <TableHead>{tHeader('createdAt')}</TableHead>
              <TableHead className="text-right">{tHeader('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tRow('edit_tooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tRow('delete_tooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  );
}
