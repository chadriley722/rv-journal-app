import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// Users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
  password_hash: text('password_hash').notNull(),
  display_name: text('display_name'),
  bio: text('bio'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// RVs table schema
export const rvs = pgTable('rvs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
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
  user_id: integer('user_id').notNull().references(() => users.id),
  rv_id: integer('rv_id').references(() => rvs.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  location: text('location'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
  