import { z } from 'zod';

export const registrationSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'must at least 3 characters' })
    .max(50, { message: 'must below 100 characters' }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'must at least 6 characters' })
    .max(32),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'must at least 6 characters' })
    .max(32),
});
