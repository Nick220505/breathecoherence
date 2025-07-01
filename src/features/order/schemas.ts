import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  userEmail: z.string().email(),
  total: z.number().positive(),
  status: z.nativeEnum(OrderStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createOrderSchema = orderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOrderSchema = orderSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .required({
    id: true,
  });

export const orderStatusUpdateSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus),
});

export const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  orderNotes: z.string().optional(),
});
