"use server";

import { createUser, verifyUser } from "@/lib/db/auth";
import { registerSchema, verifySchema } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";

export async function registerAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = registerSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  return createUser(data);
}

export async function verifyAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = verifySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  return verifyUser(data);
}
