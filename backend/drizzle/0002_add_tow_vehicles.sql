-- Create RV class enum type
CREATE TYPE "rv_class" AS ENUM (
  'Class A',
  'Class B',
  'Class C',
  'Travel Trailer',
  'Fifth Wheel',
  'Pop-up Camper',
  'Toy Hauler',
  'Teardrop',
  'Truck Bed Camper'
);

-- Create tow_vehicles table
CREATE TABLE IF NOT EXISTS "tow_vehicles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "name" TEXT NOT NULL,
  "make" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "description" TEXT,
  "is_current" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add RV class to rvs table
ALTER TABLE "rvs" ADD COLUMN "class" "rv_class" NOT NULL; 