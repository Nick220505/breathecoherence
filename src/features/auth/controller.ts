'use server';

import { User } from '@prisma/client';

import { type FormState } from '@/lib/types/form';

import { AuthError } from './errors';
import { loginSchema, registerSchema, verifySchema } from './schema';
import { authService } from './service';

// Constants for error messages
const ERROR_VALIDATION_MESSAGE =
  'Please fill in all required fields and ensure they are valid';
const ERROR_GENERIC_MESSAGE = 'Something went wrong during ';
const REGISTRATION_ACTION = 'registration';
const VERIFICATION_ACTION = 'verification';
const LOGIN_ACTION = 'login';

export async function register(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Pick<User, 'id' | 'name' | 'email' | 'role'>>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = registerSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: ERROR_VALIDATION_MESSAGE,
      success: false,
    };
  }

  try {
    const user = await authService.register(data);
    return {
      errors: {},
      message: 'Verification code sent to your email',
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
      message: ERROR_GENERIC_MESSAGE + REGISTRATION_ACTION,
      success: false,
    };
  }
}

export async function verify(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<User>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = verifySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: ERROR_VALIDATION_MESSAGE,
      success: false,
    };
  }

  try {
    const user = await authService.verify(data);
    return {
      errors: {},
      message: 'Email verified successfully',
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
      message: ERROR_GENERIC_MESSAGE + VERIFICATION_ACTION,
      success: false,
    };
  }
}

export async function login(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Pick<User, 'id' | 'name' | 'email' | 'role'>>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = loginSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: ERROR_VALIDATION_MESSAGE,
      success: false,
    };
  }

  try {
    const user = await authService.login(data);
    return {
      errors: {},
      message: 'Logged in successfully',
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
      message: ERROR_GENERIC_MESSAGE + LOGIN_ACTION,
      success: false,
    };
  }
}
