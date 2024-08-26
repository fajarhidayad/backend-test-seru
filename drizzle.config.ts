import { defineConfig } from 'drizzle-kit';
import env from '@/env';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    database: env.DB_NAME,
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
  },
  verbose: true,
  strict: true,
});
