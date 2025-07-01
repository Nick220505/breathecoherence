'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createServerAction } from 'zsa';

import { createUserSchema, updateUserSchema } from './schemas';
import { userService } from './service';

export const getAllUsers = createServerAction().handler(async () => {
  return userService.getAll();
});

export const getUserCount = createServerAction().handler(async () => {
  return userService.getCount();
});

export const createUser = createServerAction()
  .input(createUserSchema)
  .handler(async ({ input: data }) => {
    const createdUser = await userService.create(data);
    revalidateTag('users');

    return createdUser;
  });

export const updateUser = createServerAction()
  .input(updateUserSchema)
  .handler(async ({ input: data }) => {
    const updatedUser = await userService.update(data.id, data);
    revalidateTag('users');

    return updatedUser;
  });

export const deleteUser = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const deletedUser = await userService.delete(id);
    revalidateTag('users');

    return deletedUser;
  });
