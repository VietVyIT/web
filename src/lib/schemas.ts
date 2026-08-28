import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().min(8).max(20).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const cartItemSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10)
});

export const checkoutSchema = z.object({
  addressId: z.string().cuid(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "VNPAY", "MOMO", "VIETQR", "CREDIT_CARD"]),
  voucherCode: z.string().min(3).max(50).optional()
});

export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  imageUrls: z.array(z.string().url()).optional()
});

