import 'dotenv/config';
import { z, ZodError } from 'zod';

const EnvSchema = z.object({
  NODE_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  DB_MIGRATE: z.coerce.boolean(),
  DB_SEED: z.coerce.boolean(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env files:\n';
    error.issues.forEach((issue) => {
      message += issue.path[0] + '\n';
    });
    const err = new Error(message);
    err.stack = '';
    throw err;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
