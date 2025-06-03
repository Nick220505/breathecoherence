'use server';

import { User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { type FormState } from '@/lib/types/form';

import { AuthError } from './errors';
import { loginSchema, registerSchema, verifySchema } from './schema';
import { authService } from './service';
import { AuthUser } from './types';

export async function register(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<AuthUser>> {
  const t = await getTranslations('ServerActions.Auth');
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = registerSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: t('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const user = await authService.register(data);
    return {
      errors: {},
      message: t('verificationCodeSent'),
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { email: [error.message] },
        message: error.message,
        success: false,
      };
    }
    return {
      errors: {},
      message: t('registrationError'),
      success: false,
    };
  }
}

export async function verify(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<User>> {
  const t = await getTranslations('ServerActions.Auth');
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = verifySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: t('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const user = await authService.verify(data);
    return {
      errors: {},
      message: t('verificationSuccess'),
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { code: [error.message] },
        message: error.message,
        success: false,
      };
    }
    return {
      errors: {},
      message: t('verificationError'),
      success: false,
    };
  }
}

export async function login(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<AuthUser>> {
  const t = await getTranslations('ServerActions.Auth');
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = loginSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: t('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const user = await authService.login(data);
    return {
      errors: {},
      message: t('loginSuccess'),
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { root: [error.message] },
        message: error.message,
        success: false,
      };
    }
    return {
      errors: {},
      message: t('loginError'),
      success: false,
    };
  }
}
