import { sendVerificationEmail } from "@/lib/email";
import { RegisterFormData, VerifyFormData } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { prisma } from "./prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: RegisterFormData): Promise<FormState> {
  try {
    const { name, email, password } = data;

    const existingUser = await findUserByEmail(email);

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
  } catch {
    return {
      errors: {},
      message: "Something went wrong during registration.",
      success: false,
    };
  }
}

export async function verifyUser(data: VerifyFormData): Promise<FormState> {
  try {
    const { email, code } = data;

    const user = await prisma.user.findUnique({
      where: {
        email,
        verifyToken: code,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        errors: { code: ["Invalid or expired verification code"] },
        message: "Invalid or expired verification code",
        success: false,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return {
      errors: {},
      message: "Email verified successfully",
      success: true,
    };
  } catch {
    return {
      errors: {},
      message: "Something went wrong during verification",
      success: false,
    };
  }
}
