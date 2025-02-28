"use server";

import { FormState } from "@/lib/types/form";
import { User } from "@prisma/client";
import { AuthError } from "./errors";
import { loginSchema, registerSchema, verifySchema } from "./schema";
import { authService } from "./service";

export async function registerAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Pick<User, "id" | "name" | "email" | "role">>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = registerSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  try {
    const user = await authService.register(data);
    return {
      errors: {},
      message: "Verification code sent to your email",
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
      message: "Something went wrong during registration",
      success: false,
    };
  }
}

export async function verifyAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<User>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = verifySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  try {
    const user = await authService.verify(data);
    return {
      errors: {},
      message: "Email verified successfully",
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
      message: "Something went wrong during verification",
      success: false,
    };
  }
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Pick<User, "id" | "name" | "email" | "role">>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = loginSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  try {
    const user = await authService.login(data);
    return {
      errors: {},
      message: "Logged in successfully",
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
      message: "Something went wrong during login",
      success: false,
    };
  }
}
