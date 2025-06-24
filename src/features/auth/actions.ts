'use server';

import { getTranslations } from 'next-intl/server';

import {
  AuthError,
  InvalidCredentialsError,
  InvalidVerificationError,
  UserExistsError,
} from './errors';
import { loginSchema, registerSchema, verifySchema } from './schema';
import { authService } from './service';

import type { LoginFormData, RegisterFormData, VerifyFormData } from './schema';
import type { AuthUser } from './types';
import type { ActionResult } from '@/lib/types';

export async function register(
  values: RegisterFormData,
): Promise<ActionResult<AuthUser>> {
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
  values: VerifyFormData,
): Promise<ActionResult<AuthUser>> {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const { success, data, error } = verifySchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: tServerActionsAuth('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    const user = await authService.verify(data);
    return {
      success: true,
      message: tServerActionsAuth('verificationSuccess'),
      data: user,
    };
  } catch (error) {
    const tAuthSchema = await getTranslations('AuthSchema');

    if (error instanceof InvalidVerificationError) {
      return {
        success: false,
        message: tAuthSchema('Verify.invalidVerificationCode'),
        errors: { code: [tAuthSchema('Verify.invalidVerificationCode')] },
      };
    }
    const errorMessage =
      error instanceof AuthError
        ? error.message
        : tServerActionsAuth('verificationError');
    return {
      success: false,
      message: errorMessage,
      errors: { root: [errorMessage] },
    };
  }
}

export async function login(
  values: LoginFormData,
): Promise<ActionResult<AuthUser>> {
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
