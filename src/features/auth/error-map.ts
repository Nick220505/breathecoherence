import {
  ZodIssueCode,
  type ZodErrorMap,
  type ZodIssueOptionalMessage,
} from 'zod';

// Generic translator type that works with both client and server translators
export type Translator = (
  key: string,
  params?: Record<string, string | number>,
) => string;

/**
 * Creates a Zod error map for login form validation that works in both
 * client and server contexts.
 *
 * @param t - Translation function (from useTranslations or getTranslations)
 * @returns A Zod error map that provides localized validation messages
 */
export const createLoginErrorMap =
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
      return { message: t('Login.emailInvalid') };
    }
    if (
      path === 'password' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 1
    ) {
      return { message: t('Login.passwordRequired') };
    }

    return { message: ctx.defaultError };
  };

/**
 * Creates a Zod error map for registration form validation that works in both
 * client and server contexts.
 *
 * @param t - Translation function (from useTranslations or getTranslations)
 * @returns A Zod error map that provides localized validation messages
 */
export const createRegisterErrorMap =
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
      return { message: t('Register.emailInvalid') };
    }
    if (
      path === 'password' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 6
    ) {
      return { message: t('Register.passwordMinLength') };
    }
    if (
      path === 'name' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 1
    ) {
      return { message: t('Register.nameRequired') };
    }
    if (
      path === 'confirmPassword' &&
      issue.code === ZodIssueCode.too_small &&
      issue.minimum === 6
    ) {
      return { message: t('Register.confirmPasswordMinLength') };
    }
    if (path === 'confirmPassword' && issue.code === ZodIssueCode.custom) {
      return { message: t('Register.passwordsDontMatch') };
    }

    return { message: ctx.defaultError };
  };

/**
 * Creates a Zod error map for verification form validation that works in both
 * client and server contexts.
 *
 * @param t - Translation function (from useTranslations or getTranslations)
 * @returns A Zod error map that provides localized validation messages
 */
export const createVerifyErrorMap =
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
      return { message: t('Verify.emailInvalid') };
    }
    if (
      path === 'code' &&
      ((issue.code === ZodIssueCode.too_small && issue.minimum === 6) ||
        (issue.code === ZodIssueCode.too_big && issue.maximum === 6) ||
        issue.code === ZodIssueCode.invalid_string)
    ) {
      return { message: t('Verify.codeLength') };
    }

    return { message: ctx.defaultError };
  };
