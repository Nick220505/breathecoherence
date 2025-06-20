'use server';

import { revalidateTag } from 'next/cache';
import { getTranslations } from 'next-intl/server';

import { userSchema } from './schema';
import { userService } from './service';

import type { UserSummary } from './types';
import type { ActionState } from '@/lib/types/action';
import type { FormState } from '@/lib/types/form';
import type { User } from '@prisma/client';

export async function getAllUsers(): Promise<UserSummary[]> {
  return userService.getAll();
}

export async function createUser(
  _prev: FormState,
  formData: FormData,
): Promise<FormState<User>> {
  const t = await getTranslations('ServerActions.User');
  const raw = Object.fromEntries(formData.entries());
  const { success, data, error } = userSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }
  try {
    const user = await userService.create(data);
    revalidateTag('users');
    return {
      success: true,
      message: t('createSuccess'),
      data: user,
      errors: {},
    };
  } catch {
    return { success: false, message: t('createError'), errors: {} };
  }
}

export async function updateUser(
  _prev: FormState,
  formData: FormData,
): Promise<FormState<User>> {
  const t = await getTranslations('ServerActions.User');
  const raw = Object.fromEntries(formData.entries());
  const { success, data, error } = userSchema.safeParse(raw);
  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }
  if (!data.id) {
    return { success: false, message: t('missingId'), errors: {} };
  }
  try {
    const user = await userService.update(data.id, data);
    revalidateTag('users');
    return {
      success: true,
      message: t('updateSuccess'),
      data: user,
      errors: {},
    };
  } catch {
    return { success: false, message: t('updateError'), errors: {} };
  }
}

export async function deleteUser(id: string): Promise<ActionState<User>> {
  const t = await getTranslations('ServerActions.User');
  try {
    const user = await userService.delete(id);
    revalidateTag('users');
    return { success: true, message: t('deleteSuccess'), data: user };
  } catch {
    return { success: false, message: t('deleteError') };
  }
}
