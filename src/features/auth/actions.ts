'use server';

import { actionClient } from '@/lib/safe-action';

import { loginSchema, registerSchema, verifySchema } from './schemas';
import { authService } from './service';

export const register = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: data }) => {
    return authService.register(data);
  });

export const verify = actionClient
  .inputSchema(verifySchema)
  .action(async ({ parsedInput: data }) => {
    return authService.verify(data);
  });

export const login = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: data }) => {
    return authService.login(data);
  });
