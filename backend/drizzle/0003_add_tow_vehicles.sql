-- Create tow_vehicles table
CREATE TABLE IF NOT EXISTS tow_vehicles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS tow_vehicles_user_id_idx ON tow_vehicles(user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tow_vehicles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tow_vehicles_updated_at
    BEFORE UPDATE ON tow_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_tow_vehicles_updated_at(); 