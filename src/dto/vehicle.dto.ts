import { z } from 'zod';

export const vehicleBrandSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'at least 1 character' })
    .max(50, { message: 'below 100 characters' }),
});

export const vehicleTypeSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'at least 1 character' })
    .max(50, { message: 'below 100 characters' }),
  brandId: z.number(),
});

export const vehicleModelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'at least 1 character' })
    .max(50, { message: 'below 100 characters' }),
  typeId: z.number(),
});

export const vehicleYearSchema = z.object({
  year: z.number().gte(1800).lte(new Date().getFullYear()),
});

export const pricelistSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'Code must at least 1 character' })
    .max(50, { message: 'Code must below 255 characters' }),
  yearId: z.number(),
  modelId: z.number(),
});
