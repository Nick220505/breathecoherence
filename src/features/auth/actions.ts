'use server';

import { User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { type FormState } from '@/lib/types';

import {
  AuthError,
  InvalidCredentialsError,
  InvalidVerificationError,
  UserExistsError,
} from './errors';
import { loginSchema, registerSchema, verifySchema } from './schema';
import { authService } from './service';
import { AuthUser } from './types';

export async function register(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<AuthUser>> {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const tAuthSchema = await getTranslations('AuthSchema');
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = registerSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: tServerActionsAuth('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const user = await authService.register(data);
    return {
      errors: {},
      message: tServerActionsAuth('verificationCodeSent'),
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof UserExistsError) {
      return {
        errors: { email: [tAuthSchema('Register.userExistsError')] },
        message: tAuthSchema('Register.userExistsError'),
        success: false,
      };
    }
    const errorMessage =
      error instanceof AuthError
        ? error.message
        : tServerActionsAuth('registrationError');
    return {
      errors: { root: [errorMessage] },
      message: errorMessage,
      success: false,
    };
  }
}

export async function verify(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<User>> {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const tAuthSchema = await getTranslations('AuthSchema');
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = verifySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: tServerActionsAuth('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const user = await authService.verify(data);
    return {
      errors: {},
      message: tServerActionsAuth('verificationSuccess'),
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof InvalidVerificationError) {
      return {
        errors: { code: [tAuthSchema('Verify.invalidVerificationCode')] },
        message: tAuthSchema('Verify.invalidVerificationCode'),
        success: false,
      };
    }
    const errorMessage =
      error instanceof AuthError
        ? error.message
        : tServerActionsAuth('verificationError');
    return {
      errors: { root: [errorMessage] },
      message: errorMessage,
      success: false,
    };
  }
}

export async function login(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<AuthUser>> {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const tAuthSchema = await getTranslations('AuthSchema');
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = loginSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: tServerActionsAuth('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const user = await authService.login(data);
    return {
      errors: {},
      message: tServerActionsAuth('loginSuccess'),
      success: true,
      data: user,
    };
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return {
        errors: { root: [tAuthSchema('Login.invalidCredentials')] },
        message: tAuthSchema('Login.invalidCredentials'),
        success: false,
      };
    }
    const errorMessage =
      error instanceof AuthError
        ? error.message
        : tServerActionsAuth('loginError');
    return {
      errors: { root: [errorMessage] },
      message: errorMessage,
      success: false,
    };
  }
}
