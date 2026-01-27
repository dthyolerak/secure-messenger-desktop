import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  passwordHash: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const AuthSessionSchema = z.object({
  user: UserSchema,
  token: z.string(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

export const StartSessionInputSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
});

export const GetSessionResponseSchema = z.object({
  session: AuthSessionSchema.nullable(),
});

export const StartSessionResponseSchema = z.object({
  session: AuthSessionSchema,
});