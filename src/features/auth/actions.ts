'use server';

import { createServerAction } from 'zsa';

import { loginSchema, registerSchema, verifySchema } from './schemas';
import { authService } from './service';

export const register = createServerAction()
  .input(registerSchema)
  .handler(async ({ input: data }) => {
    const user = await authService.register(data);
    return user;
  });

export const verify = createServerAction()
  .input(verifySchema)
  .handler(async ({ input: data }) => {
    const user = await authService.verify(data);
    return user;
  });

export const login = createServerAction()
  .input(loginSchema)
  .handler(async ({ input: data }) => {
    const user = await authService.login(data);
    return user;
  });
