import { getTableName, sql, type Table } from 'drizzle-orm';
import { connection, db, type DB } from '.';
import env from '../env';
import * as schema from './schema';

if (!env.DB_SEED) {
  throw new Error("You must set DB_SEED to 'true' when running migration");
}

async function resetTable(db: DB, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  );
}

for (const table of [
  schema.user,
  schema.pricelist,
  schema.vehicleBrand,
  schema.vehicleYear,
  schema.vehicleModel,
  schema.vehicleType,
]) {
  await resetTable(db, table);
}

async function seedAdmin(db: DB) {
  await db.insert(schema.user).values({
    email: 'admin@mail.com',
    name: 'Admin',
    password: 'admin123',
    isAdmin: true,
  });
}

try {
  await seedAdmin(db);
  console.log('Seeding success');
} catch (error) {
  console.log(error);
}

await connection.end();
