import prisma from '@/lib/prisma';
import { User } from '@/prisma/generated';

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    verifyToken: string;
    verifyTokenExpiry: Date;
  }): Promise<Pick<User, 'id' | 'name' | 'email' | 'role'>> {
    return await prisma.user.create({
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

  async findByVerification(email: string, code: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
        verifyToken: code,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });
  },

  async updateVerification(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });
  },
};
