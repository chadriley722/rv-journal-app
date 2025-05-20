-- Drop tow_vehicles table
DROP TABLE IF EXISTS "tow_vehicles";

-- Remove RV class from rvs table
ALTER TABLE "rvs" DROP COLUMN IF EXISTS "class";

-- Drop RV class enum type
DROP TYPE IF EXISTS "rv_class"; 