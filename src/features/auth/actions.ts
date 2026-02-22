'use server';

import { actionClient } from '@/lib/safe-action';

import { loginSchema, registerSchema, verifySchema } from './schemas';
import { authService } from './service';

export const register = actionClient
  .inputSchema(registerSchema)
  .action(({ parsedInput: data }) => authService.register(data));

export const verify = actionClient
  .inputSchema(verifySchema)
  .action(({ parsedInput: data }) => authService.verify(data));

export const login = actionClient
  .inputSchema(loginSchema)
  .action(({ parsedInput: data }) => authService.login(data));
