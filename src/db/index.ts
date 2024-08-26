import env from '@/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

export const connection = new pg.Pool({
  connectionString: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  max: env.DB_MIGRATE ? 1 : undefined,
});

export const db = drizzle(connection);
