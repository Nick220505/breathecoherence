import { compare } from 'bcryptjs';
import crypto from 'crypto';

import { VerificationEmail } from '@/components/email-templates/verification-email';
import resend, { COMPANY_NAME, FROM_EMAIL } from '@/lib/email';
import { userService } from '@/features/user/service';
import type { UserSummary } from '@/features/user/schemas';

import {
  EMAIL_SEND_FAILED,
  INVALID_CREDENTIALS,
  INVALID_VERIFICATION,
  USER_EXISTS,
} from './errors';
import type { AuthUser, LoginData, RegisterData, VerifyData } from './schemas';

export const authService = {
  async register({ name, email, password }: RegisterData): Promise<AuthUser> {
    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      throw new Error(USER_EXISTS);
    }

    const verifyToken = crypto.randomInt(100000, 999999).toString();

    const user = await userService.create({
      name,
      email,
      password,
      verifyToken,
      verifyTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
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
      throw new Error(EMAIL_SEND_FAILED);
    }

    return user;
  },

  async verify({ email, code }: VerifyData): Promise<UserSummary> {
    const user = await userService.findByEmailAndVerifyToken(email, code);

    if (!user) {
      throw new Error(INVALID_VERIFICATION);
    }

    return userService.update(user.id, {
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    });
  },

  async login({ email, password }: LoginData): Promise<AuthUser> {
    const user = await userService.findByEmail(email);

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
