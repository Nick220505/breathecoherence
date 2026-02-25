import { z } from 'zod';

export const orderStatusEnum = z.enum(['PENDING', 'PAID', 'SHIPPED']);

export const orderStatusUpdateSchema = z.object({
  id: z.string(),
  status: orderStatusEnum,
});

export const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  orderNotes: z.string().optional(),
});

export const orderSummarySchema = z.object({
  id: z.string(),
  total: z.number(),
  status: orderStatusEnum,
  createdAt: z.date(),
  user: z.object({
    email: z.string(),
  }),
});

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  price: z.number(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageBase64: z.string().nullable(),
    category: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    }),
  }),
});

export const orderDetailSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  total: z.number(),
  status: orderStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(orderItemSchema),
});

// Email related schemas
export const emailOrderItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export const shippingAddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
});

export const orderConfirmationEmailDataSchema = z.object({
  orderId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  items: z.array(emailOrderItemSchema),
  total: z.number(),
  shippingAddress: shippingAddressSchema.optional(),
});

export const orderDetailsSchema = z.object({
  orderId: z.string(),
  status: z.string(),
  amount: z.number(),
  paymentIntentId: z.string(),
});

export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;
export type Checkout = z.infer<typeof checkoutSchema>;
export type OrderSummary = z.infer<typeof orderSummarySchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type EmailOrderItem = z.infer<typeof emailOrderItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderConfirmationEmailData = z.infer<
  typeof orderConfirmationEmailDataSchema
>;
export type OrderDetails = z.infer<typeof orderDetailsSchema>;
