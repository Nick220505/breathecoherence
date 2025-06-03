'use server';

import { User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import {
  ZodIssueCode,
  type ZodErrorMap,
  type ZodIssueOptionalMessage,
} from 'zod';

import { type FormState } from '@/lib/types/form';

import {
  AuthError,
  InvalidCredentialsError,
  InvalidVerificationError,
  UserExistsError,
} from './errors';
import { loginSchema, registerSchema, verifySchema } from './schema';
import { authService } from './service';
import { AuthUser } from './types';

// Helper function for Zod error mapping with translations
type Translator = (
  key: string,
  params?: Record<string, string | number>,
) => string;

const createAuthErrorMap =
  (t: Translator): ZodErrorMap =>
  (
    issue: ZodIssueOptionalMessage,
    ctx: { defaultError: string; data: unknown },
  ): { message: string } => {
    const path = issue.path.join('.');

    if (
      path === 'email' &&
      issue.code === ZodIssueCode.invalid_string &&
      issue.validation === 'email'
    ) {
      return { message: t('AuthSchema.emailInvalid') };
    }
    if (
      path === 'password' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 1
    ) {
      return { message: t('AuthSchema.passwordRequired') };
    }
    if (
      path === 'password' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 6
    ) {
      return { message: t('AuthSchema.passwordMinLength') };
    }
    if (
      path === 'name' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 1
    ) {
      // Assuming min(1) for name
      return { message: t('AuthSchema.nameRequired') };
    }
    if (
      path === 'confirmPassword' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 6
    ) {
      return { message: t('AuthSchema.confirmPasswordMinLength') };
    }
    if (path === 'confirmPassword' && issue.code === ZodIssueCode.custom) {
      // This handles the .refine for password mismatch from schema.ts
      // The refine in schema.ts has message: 'passwordsDontMatch' which is a key now.
      // Zod's refine message will be passed to ctx.defaultError if not overridden.
      // Alternatively, if the refine didn't have a message, or to be explicit:
      // if (ctx.data && (ctx.data as any).password !== (ctx.data as any).confirmPassword)
      return { message: t('AuthSchema.passwordsDontMatch') };
    }
    if (
      path === 'code' &&
      ((issue.code === ZodIssueCode.too_small && issue.minimum === 6) ||
        (issue.code === ZodIssueCode.too_big && issue.maximum === 6))
    ) {
      return { message: t('AuthSchema.verificationCodeLength') };
    }
    // Fallback for other Zod issues on specific fields if needed
    // e.g. if (path === 'email') return { message: t('AuthSchema.emailGenericError') };

    return { message: ctx.defaultError }; // Important: Fallback to Zod's default or refine message
  };

export async function register(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<AuthUser>> {
  const tServerActionsAuth = await getTranslations('ServerActions.Auth');
  const tAuthSchema = await getTranslations('AuthSchema');
  const rawData = Object.fromEntries(formData.entries());
  const errorMap = createAuthErrorMap(tAuthSchema);
  const { success, data, error } = registerSchema.safeParse(rawData, {
    errorMap,
  });

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
  } catch (err) {
    if (err instanceof UserExistsError) {
      return {
        errors: { email: [tAuthSchema('userExistsError')] },
        message: tAuthSchema('userExistsError'),
        success: false,
      };
    }
    const errorMessage =
      err instanceof AuthError
        ? err.message
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
  const errorMap = createAuthErrorMap(tAuthSchema);
  const { success, data, error } = verifySchema.safeParse(rawData, {
    errorMap,
  });

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
  } catch (err) {
    if (err instanceof InvalidVerificationError) {
      return {
        errors: { code: [tAuthSchema('invalidVerificationCode')] },
        message: tAuthSchema('invalidVerificationCode'),
        success: false,
      };
    }
    const errorMessage =
      err instanceof AuthError
        ? err.message
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
  const errorMap = createAuthErrorMap(tAuthSchema);
  const { success, data, error } = loginSchema.safeParse(rawData, { errorMap });

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
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return {
        errors: { root: [tAuthSchema('invalidCredentials')] },
        message: tAuthSchema('invalidCredentials'),
        success: false,
      };
    }
    const errorMessage =
      err instanceof AuthError ? err.message : tServerActionsAuth('loginError');
    return {
      errors: { root: [errorMessage] },
      message: errorMessage,
      success: false,
    };
  }
}
