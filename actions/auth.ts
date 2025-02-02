"use server";

import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";
import { hash } from "bcryptjs";
import crypto from "crypto";

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

  try {
    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        errors: { email: ["User already exists"] },
        message: "User already exists",
        success: false,
      };
    }

    const verifyToken = crypto.randomInt(100000, 999999).toString();
    const verifyTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await sendVerificationEmail(email, verifyToken);

    return {
      errors: {},
      message: "Verification code sent to your email",
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      errors: {},
      message: "Something went wrong during registration.",
      success: false,
    };
  }
}
