'use server';

import { actionClient } from '@/lib/safe-action';

import { loginSchema, registerSchema, verifySchema } from './schemas';
import { authService } from './service';

export const register = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await authService.register(data);
    return user;
  });

export const verify = actionClient
  .inputSchema(verifySchema)
  .action(async ({ parsedInput: data }) => {
    const user = await authService.verify(data);
    return user;
  });

export const login = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await authService.login(data);
    return user;
  });
