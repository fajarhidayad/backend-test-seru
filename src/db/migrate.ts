import { migrate } from 'drizzle-orm/node-postgres/migrator';
import env from '../env';
import { connection, db } from '.';
import config from '~/drizzle.config';

if (!env.DB_MIGRATE) {
  throw new Error("You must set DB_MIGRATE to 'true' when running migration");
}

try {
  await migrate(db, { migrationsFolder: config.out! });
  console.log('Migrate success');
} catch (error) {
  console.log(error);
}
await connection.end();
