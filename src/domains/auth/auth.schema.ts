import { z } from 'zod';

export const StartSessionInputSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
});

export const AuthSessionSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  displayName: z.string().optional(),
});

export const GetSessionResponseSchema = z.object({
  session: AuthSessionSchema.nullable(),
});

export const StartSessionResponseSchema = z.object({
  session: AuthSessionSchema,
});