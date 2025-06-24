'use server';

import { revalidateTag } from 'next/cache';
import { getTranslations } from 'next-intl/server';

import { userSchema } from './schema';
import { userService } from './service';

import type { UserFormData } from './schema';
import type { UserSummary } from './types';
import type { ActionResult } from '@/lib/types';
import type { User } from '@prisma/client';

export async function getAllUsers(): Promise<UserSummary[]> {
  return userService.getAll();
}

export async function createUser(
  values: UserFormData,
): Promise<ActionResult<User>> {
  const t = await getTranslations('ServerActions.User');

  const { success, data, error } = userSchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    const createdUser = await userService.create(data);
    revalidateTag('users');

    return {
      success: true,
      message: t('createSuccess'),
      data: createdUser,
    };
  } catch {
    return { success: false, message: t('createError') };
  }
}

export async function updateUser(
  values: UserFormData,
): Promise<ActionResult<User>> {
  const t = await getTranslations('ServerActions.User');

  const { success, data, error } = userSchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  const { id } = data;
  if (!id) {
    return { success: false, message: t('missingId') };
  }

  try {
    const updatedUser = await userService.update(id, data);
    revalidateTag('users');

    return {
      success: true,
      message: t('updateSuccess'),
      data: updatedUser,
    };
  } catch {
    return { success: false, message: t('updateError') };
  }
}

export async function deleteUser(id: string): Promise<ActionResult<User>> {
  const t = await getTranslations('ServerActions.User');
  try {
    const user = await userService.delete(id);
    revalidateTag('users');
    return { success: true, message: t('deleteSuccess'), data: user };
  } catch {
    return { success: false, message: t('deleteError') };
  }
}
