'use server';

import { revalidateTag } from 'next/cache';
import { createServerAction } from 'zsa';

import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  userSchema,
  userCountSchema,
  userSummaryArraySchema,
} from './schemas';
import { userService } from './service';

export const getAllUsers = createServerAction()
  .output(userSummaryArraySchema)
  .handler(async () => {
    return userService.getAll();
  });

export const getUserCount = createServerAction()
  .output(userCountSchema)
  .handler(async () => {
    return userService.getCount();
  });

export const createUser = createServerAction()
  .input(createUserSchema)
  .output(userSchema)
  .handler(async ({ input: data }) => {
    const createdUser = await userService.create(data);
    revalidateTag('users');

    return createdUser;
  });

export const updateUser = createServerAction()
  .input(updateUserSchema)
  .output(userSchema)
  .handler(async ({ input: data }) => {
    const updatedUser = await userService.update(data.id, data);
    revalidateTag('users');

    return updatedUser;
  });

export const deleteUser = createServerAction()
  .input(deleteUserSchema)
  .output(userSchema)
  .handler(async ({ input: id }) => {
    const deletedUser = await userService.delete(id);
    revalidateTag('users');

    return deletedUser;
  });
