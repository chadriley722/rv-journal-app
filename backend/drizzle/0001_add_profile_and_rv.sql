-- Add new columns to users table
ALTER TABLE users
ADD COLUMN display_name TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Create RVs table
CREATE TABLE rvs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    is_current BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add RV reference to journal entries
ALTER TABLE journal_entries
ADD COLUMN rv_id INTEGER REFERENCES rvs(id); 