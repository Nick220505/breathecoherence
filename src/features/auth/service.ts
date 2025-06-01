import crypto from 'crypto';

import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

import { sendVerificationEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

import {
  InvalidCredentialsError,
  InvalidVerificationError,
  UserExistsError,
} from './errors';
import { LoginFormData, RegisterFormData, VerifyFormData } from './schema';

export const authService = {
  async register({
    name,
    email,
    password,
  }: RegisterFormData): Promise<Pick<User, 'id' | 'name' | 'email' | 'role'>> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new UserExistsError();
    }

    const verifyToken = crypto.randomInt(100000, 999999).toString();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, 12),
        verifyToken,
        verifyTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
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

    return user;
  },

  async verify({ email, code }: VerifyFormData): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email,
        verifyToken: code,
        verifyTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new InvalidVerificationError();
    }

    return prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null, verifyTokenExpiry: null },
    });
  },

  async login({
    email,
    password,
  }: LoginFormData): Promise<Pick<User, 'id' | 'name' | 'email' | 'role'>> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
};
