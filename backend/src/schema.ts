import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// RV Class enum
export const rvClassEnum = pgEnum('rv_class', [
  'Class A',
  'Class B',
  'Class C',
  'Travel Trailer',
  'Fifth Wheel',
  'Pop-up Camper',
  'Toy Hauler',
  'Teardrop',
  'Truck Bed Camper'
]);

// Users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  display_name: text('display_name'),
  bio: text('bio'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// RVs table schema
export const rvs = pgTable('rvs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  description: text('description'),
  is_current: boolean('is_current').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Tow Vehicles table schema
export const tow_vehicles = pgTable('tow_vehicles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  description: text('description'),
  is_current: boolean('is_current').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Journal entries table schema
export const journal_entries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rv_id: integer('rv_id').references(() => rvs.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  location: text('location'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  rvs: many(rvs),
  tow_vehicles: many(tow_vehicles),
  journal_entries: many(journal_entries)
}));

export const rvsRelations = relations(rvs, ({ one, many }) => ({
  user: one(users, {
    fields: [rvs.user_id],
    references: [users.id],
  }),
  journal_entries: many(journal_entries)
}));

export const towVehiclesRelations = relations(tow_vehicles, ({ one }) => ({
  user: one(users, {
    fields: [tow_vehicles.user_id],
    references: [users.id],
  })
}));

export const journalEntriesRelations = relations(journal_entries, ({ one }) => ({
  user: one(users, {
    fields: [journal_entries.user_id],
    references: [users.id],
  }),
  rv: one(rvs, {
    fields: [journal_entries.rv_id],
    references: [rvs.id],
  })
}));
  