import crypto from 'crypto';

import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

import { sendVerificationEmail } from '@/lib/email';

import {
  InvalidCredentialsError,
  InvalidVerificationError,
  UserExistsError,
} from './errors';
import { authRepository } from './repository';
import { LoginFormData, RegisterFormData, VerifyFormData } from './schema';

export const authService = {
  async register(
    data: RegisterFormData,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'role'>> {
    const existingUser = await authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserExistsError();
    }

    const verifyToken = crypto.randomInt(100000, 999999).toString();
    const user = await authRepository.create({
      name: data.name,
      email: data.email,
      password: await hash(data.password, 12),
      verifyToken,
      verifyTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
    });

    await sendVerificationEmail(data.email, verifyToken);

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

  async login(
    data: LoginFormData,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'role'>> {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await compare(data.password, user.password);

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};
