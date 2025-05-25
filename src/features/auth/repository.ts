import prisma from '@/lib/prisma';
import { User } from '@/prisma/generated';

export const authRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: {
    name: string;
    email: string;
    password: string;
    verifyToken: string;
    verifyTokenExpiry: Date;
  }): Promise<Pick<User, 'id' | 'name' | 'email' | 'role'>> {
    return prisma.user.create({
      data: {
        ...data,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  findByVerification(email: string, code: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
        verifyToken: code,
        verifyTokenExpiry: { gt: new Date() },
      },
    });
  },

  updateVerification(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });
  },
};
