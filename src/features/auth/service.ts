import type { User } from '@/generated/prisma/client';
import { compare, hash } from 'bcryptjs';
import crypto from 'crypto';

import { VerificationEmail } from '@/components/email-templates/verification-email';
import resend, { COMPANY_NAME, FROM_EMAIL } from '@/lib/email';
import prisma from '@/lib/prisma';

import {
  INVALID_CREDENTIALS,
  INVALID_VERIFICATION,
  USER_EXISTS,
} from './errors';
import type { AuthUser, LoginData, RegisterData, VerifyData } from './schemas';

export const authService = {
  async register({ name, email, password }: RegisterData): Promise<AuthUser> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error(USER_EXISTS);
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

    const { error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email address',
      react: VerificationEmail({
        verificationCode: verifyToken,
        companyName: COMPANY_NAME,
      }),
    });

    if (error) {
      throw new Error('Failed to send verification email');
    }

    return user;
  },

  async verify({ email, code }: VerifyData): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email,
        verifyToken: code,
        verifyTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error(INVALID_VERIFICATION);
    }

    return prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null, verifyTokenExpiry: null },
    });
  },

  async login({ email, password }: LoginData): Promise<AuthUser> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error(INVALID_CREDENTIALS);
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new Error(INVALID_CREDENTIALS);
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
};
