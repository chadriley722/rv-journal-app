import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';

// Users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Journal entries table schema
export const journal_entries = pgTable('journal_entries', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id),
    entry_text: text('entry_text').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  });
  