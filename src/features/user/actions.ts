'use server';

import { revalidateTag } from 'next/cache';

import { actionClient } from '@/lib/safe-action';

import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  userSummarySchema,
  userCountSchema,
  userSummaryArraySchema,
} from './schemas';
import { userService } from './service';

export const getAllUsers = actionClient
  .outputSchema(userSummaryArraySchema)
  .action(() => userService.getAll());

export const getUserCount = actionClient
  .outputSchema(userCountSchema)
  .action(() => userService.getCount());

export const createUser = actionClient
  .inputSchema(createUserSchema)
  .outputSchema(userSummarySchema)
  .action(async ({ parsedInput: data }) => {
    const createdUser = await userService.create(data);
    revalidateTag('users', 'max');
    return createdUser;
  });

export const updateUser = actionClient
  .inputSchema(updateUserSchema)
  .outputSchema(userSummarySchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    const updatedUser = await userService.update(id, data);
    revalidateTag('users', 'max');
    return updatedUser;
  });

export const deleteUser = actionClient
  .inputSchema(deleteUserSchema)
  .outputSchema(userSummarySchema)
  .action(async ({ parsedInput: id }) => {
    const deletedUser = await userService.delete(id);
    revalidateTag('users', 'max');
    return deletedUser;
  });
