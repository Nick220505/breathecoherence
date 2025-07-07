-- AlterTable
-- First, update any NULL descriptions to empty string to avoid constraint violation
UPDATE "Category" SET "description" = '' WHERE "description" IS NULL;

-- Then make the column NOT NULL
ALTER TABLE "Category" ALTER COLUMN "description" SET NOT NULL;
