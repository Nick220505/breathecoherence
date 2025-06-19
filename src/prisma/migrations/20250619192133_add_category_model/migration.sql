/*
  Warnings:

  - You are about to drop the column `type` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Populate Categories
INSERT INTO "Category" (id, name, description, "createdAt", "updatedAt") VALUES
    (gen_random_uuid(), 'SACRED_GEOMETRY', 'Sacred Geometry Products', now(), now()),
    (gen_random_uuid(), 'FLOWER_ESSENCE', 'Flower Essence Products', now(), now());

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "categoryId" STRING;

-- Update existing products with category IDs
UPDATE "Product"
SET "categoryId" = (SELECT id FROM "Category" WHERE name = "Product"."type"::STRING)
WHERE "Product"."type" IS NOT NULL;

-- Drop the old type column
ALTER TABLE "Product" DROP COLUMN "type";

-- Drop the old enum
DROP TYPE "ProductType";

-- Make categoryId non-nullable
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
