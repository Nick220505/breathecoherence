'use server';

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

import type { LoginFormData, RegisterFormData } from './schema';
import type { User } from '@prisma/client';

export async function register(values: RegisterFormData) {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const { success, data, error } = registerSchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: tServerActionsAuth('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    const user = await authService.register(data);
    return {
      success: true,
      message: tServerActionsAuth('verificationCodeSent'),
      data: user,
    };
  } catch (error) {
    const tAuthSchema = await getTranslations('AuthSchema');

    if (error instanceof UserExistsError) {
      return {
        success: false,
        message: tAuthSchema('Register.userExistsError'),
        errors: { email: [tAuthSchema('Register.userExistsError')] },
      };
    }
    const errorMessage =
      error instanceof AuthError
        ? error.message
        : tServerActionsAuth('registrationError');
    return {
      success: false,
      message: errorMessage,
      errors: { root: [errorMessage] },
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

export async function login(values: LoginFormData) {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const { success, data, error } = loginSchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: tServerActionsAuth('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    const user = await authService.login(data);
    return {
      success: true,
      message: tServerActionsAuth('loginSuccess'),
      data: user,
    };
  } catch (error) {
    const tAuthSchema = await getTranslations('AuthSchema');

    if (error instanceof InvalidCredentialsError) {
      return {
        success: false,
        message: tAuthSchema('Login.invalidCredentials'),
        errors: { root: [tAuthSchema('Login.invalidCredentials')] },
      };
    }
    const errorMessage =
      error instanceof AuthError
        ? error.message
        : tServerActionsAuth('loginError');
    return {
      success: false,
      message: errorMessage,
      errors: { root: [errorMessage] },
    };
  }
}
