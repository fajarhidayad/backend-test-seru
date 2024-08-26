import { relations } from 'drizzle-orm';
import {
  serial,
  varchar,
  timestamp,
  pgTable,
  boolean,
  integer,
  numeric,
  smallint,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('id').primaryKey().notNull(),
  email: varchar('email').notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() =>
    new Date().toDateString()
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() =>
    new Date().toDateString()
  ),
});

export const vehicleBrand = pgTable('vehicle_brand', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() =>
    new Date().toDateString()
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() =>
    new Date().toDateString()
  ),
});

export const vehicleBrandRelations = relations(vehicleBrand, ({ many }) => ({
  types: many(vehicleType),
}));

export const vehicleType = pgTable('vehicle_type', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  brandId: integer('brand_id')
    .references(() => vehicleBrand.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() =>
    new Date().toDateString()
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() =>
    new Date().toDateString()
  ),
});

export const vehicleTypeRelations = relations(vehicleType, ({ one, many }) => ({
  brand: one(vehicleBrand, {
    fields: [vehicleType.brandId],
    references: [vehicleBrand.id],
  }),
  models: many(vehicleModel),
}));

export const vehicleModel = pgTable('vehicle_model', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  typeId: integer('type_id')
    .references(() => vehicleType.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() =>
    new Date().toDateString()
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() =>
    new Date().toDateString()
  ),
});

export const vehicleModelRelations = relations(
  vehicleModel,
  ({ one, many }) => ({
    type: one(vehicleType, {
      fields: [vehicleModel.typeId],
      references: [vehicleType.id],
    }),
    prices: many(pricelist),
  })
);

export const pricelist = pgTable('pricelist', {
  id: serial('id').primaryKey().notNull(),
  code: varchar('code', { length: 255 }).notNull(),
  price: numeric('price').notNull(),
  yearId: integer('year_id')
    .references(() => vehicleType.id)
    .notNull(),
  modelId: integer('model_id')
    .references(() => vehicleModel.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() =>
    new Date().toDateString()
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() =>
    new Date().toDateString()
  ),
});

export const pricelistRelations = relations(pricelist, ({ one }) => ({
  year: one(vehicleYear, {
    fields: [pricelist.yearId],
    references: [vehicleYear.id],
  }),
  model: one(vehicleModel, {
    fields: [pricelist.modelId],
    references: [vehicleModel.id],
  }),
}));

export const vehicleYear = pgTable('vehicle_year', {
  id: serial('id').primaryKey().notNull(),
  year: smallint('year').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() =>
    new Date().toDateString()
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() =>
    new Date().toDateString()
  ),
});

export const vehicleYearRelations = relations(vehicleYear, ({ many }) => ({
  prices: many(pricelist),
}));
