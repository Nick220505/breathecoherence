import { sendVerificationEmail } from "@/lib/email";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { InvalidVerificationError, UserExistsError } from "./errors";
import { authRepository } from "./repository";
import { RegisterFormData, VerifyFormData } from "./schema";

export const authService = {
  async register(
    data: RegisterFormData,
  ): Promise<Pick<User, "id" | "name" | "email" | "role">> {
    const { name, email, password } = data;
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      throw new UserExistsError();
    }

    const verifyToken = crypto.randomInt(100000, 999999).toString();
    const user = await authRepository.create({
      name,
      email,
      password: await hash(password, 12),
      verifyToken,
      verifyTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
    });

    await sendVerificationEmail(email, verifyToken);

    return user;
  },

  async verify(data: VerifyFormData): Promise<User> {
    const { email, code } = data;

    const user = await authRepository.findByVerification(email, code);

    if (!user) {
      throw new InvalidVerificationError();
    }

    await authRepository.updateVerification(user.id);

    return user;
  },
};
