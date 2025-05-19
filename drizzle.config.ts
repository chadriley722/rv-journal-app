import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://chad:Nomadic1@localhost:5432/rv_journal_dev',
  },
  dialect: 'postgresql',
} satisfies Config;
